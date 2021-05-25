using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ExportFlightMonitoringService : BaseWebUISecureObject, IExportFlightMonitoringService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Page- Export Flight Monitoring  on Build Web Form"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public Stream GetGrid(string processName, string moduleName, string appName, string SearchFlightNo, string FromDate, string ToDate, string SearchDestination, string SearchAirline)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SearchFlightNo: SearchFlightNo, FromDate: FromDate, ToDate: ToDate, SearchDestination: SearchDestination, SearchAirline: SearchAirline);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchFlightNo = "", string FromDate = "", string ToDate = "", string SearchDestination = "", string SearchAirline = "", string ProcessStatus = "")
        {
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeNew:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                case DisplayModeSearch:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        //CreateGrid(myCurrentForm, SearchFlightNo, SearchFlightDate, SearchDestination, SearchAirline);
                    }
                    break;
                case DisplayModeDuplicate:

                    break;
                case DisplayModeEdit:

                    break;
                case DisplayModeDelete:

                    break;
                case DisplayModeIndexView:
                    switch (processName)
                    {
                        case "ExportFlightMonitoringSearch":
                            if (appName.ToUpper().Trim() == "SEARCHRECORD")
                                CreateGrid(myCurrentForm, SearchFlightNo, FromDate, ToDate, SearchDestination, SearchAirline);
                            break;
                        default:
                            break;
                    }
                    break;

            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public DataSourceResult GetGridData(string SearchFlightNo, string FromDate, string ToDate, string SearchDestination, string SearchAirline, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();

                ProcName = "GetExportFlightMonitor";

                string filters = GridFilter.ProcessFilters<ExportFlightMonitoringModel>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@pAirlineCode", (SearchAirline=="A~A"?"":SearchAirline)), 
                                            new SqlParameter("@FromDate", Convert.ToDateTime(FromDate.Replace('_', ':'))), 
                                            new SqlParameter("@ToDate", Convert.ToDateTime(ToDate.Replace('_', ':'))), 
                                            new SqlParameter("@pFlightNo", (SearchFlightNo=="A~A"?"":SearchFlightNo)), 
                                            new SqlParameter("@pAirportCode", (SearchDestination=="A~A"?"":SearchDestination)),
                                            new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new ExportFlightMonitoringModelGrid
                {
                    SNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    ETD = "",//e["ETD"].ToString(),
                    LPWeight = e["LPWeight"].ToString() + " / " + e["LPPieces"].ToString(),
                    ActualBuildUpWeight = e["ActualBuildUpWeight"].ToString(),
                    BuildCount = e["BuildCount"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                    FWB = e["FWBSuccess"].ToString(),
                    FOH = e["FOHSuccess"].ToString(),
                    RCS = e["RCSSuccess"].ToString(),
                    UWSCutOffMinutes = e["UWSCutOffMins"].ToString(),
                    UWSSlaMet = e["UWSSlaMet"].ToString(),
                    UWSTimeDifference = e["UWSTimeDifference"].ToString(),
                    TimeRemainingToDep = e["TimeRemainingToDep"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    FWBSLATime = e["FWBSLATime"].ToString(),
                    FOHSLATime = e["FOHSLATime"].ToString(),
                    RCSSLATime = e["RCSSLATime"].ToString(),
                    UWSSLATime = e["UWSSLATime"].ToString(),
                    FlightStatus = e["FlightStatus"].ToString(),
                    FBLSLAMet = e["FBLSLAMet"].ToString(),
                    FBLAwbCount = e["FBLAwbCount"].ToString(),
                    FBLGross = e["FBLGross"].ToString(),
                    FBLPcs = e["FBLPcs"].ToString(),
                    LateCount = e["LateCount"].ToString(),
                    LateWeightPct = e["LateWeightPct"].ToString(),
                    FWBRecdCount = e["FWBRecdCount"].ToString(),
                    FWBRecdPct = e["FWBRecdPct"].ToString(),
                    FWBSentCount = e["FWBSentCount"].ToString(),
                    FFMSLATime = e["FFMSLATime"].ToString(),
                    FFMSLAMet = e["FFMSLAMet"].ToString()
                });


                ds.Dispose();
                return new DataSourceResult
                {
                    Data = lst.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportFlightMonitor"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        private void CreateGrid(StringBuilder Container, string SearchFlightNo = "", string FromDate = "", string ToDate = "", string SearchDestination = "", string SearchAirline = "")
        {
            using (Grid g = new Grid())
            {


                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Report/ExportFlightMonitoringService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Export Flight Monitoring";
                g.DefaultPageSize = 15;
                g.IsDisplayOnly = true;
                g.IsAllExport = false;
                g.IsCurrentExport = false;
                g.IsSortable = false;
                g.IsShowGridHeader = false;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "GrossWeight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineName", Title = "AirlineName", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                //g.Column.Add(new GridColumn { Field = "View", Title = "Action", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  onclick=\"GetFlightData(#=SNo#,this)\" title=\"Counter view\" value=\"C\" class=\"completeprocess\" >&nbsp;<input type=\"button\" onclick=\"GetFlightData(#=SNo#,this,\\'W\\')\"  title=\"Warehouse view\" value=\"W\" class=\"incompleteprocess\" >", Width = 60 });

                g.Column.Add(new GridColumn { Field = "View", Title = "Action", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  onclick=\"GetFlightData(#=SNo#,this)\" title=\"Flight details\" value=\"A\" class=\"completeprocess\" >", Width = 60 });

                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString(), Width = 95, Template = "<div rel=\"progressbar\" ><div class=\"progresslabel\"  data-rel=\"#=FlightStatus#\">#=FlightNo# / #=FlightStatus#%</div></div>" });

                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight D/T", DataType = GridDataType.String.ToString(), Width = 80 });

                g.Column.Add(new GridColumn { Field = "DestinationAirportCode", Title = "Dest", DataType = GridDataType.String.ToString(), Width = 38 });

                g.Column.Add(new GridColumn { Field = "FBLAwbCount", Title = "FBL Wt/Pcs/#", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;background-color:#=FBLSLAMet#;color:white\"><span>#=FBLGross#/#=FBLPcs#/#=FBLAwbCount#</span></div>", Width = 100 });

                g.Column.Add(new GridColumn { Field = "FWBRecdCount", Title = "FWB Rcd#", DataType = GridDataType.String.ToString(), Width = 65 });



                g.Column.Add(new GridColumn { Field = "LateCount", Title = "Late", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;\"><span>#=LateCount# </span></div>", Width = 50 });

                g.Column.Add(new GridColumn { Field = "FOHSLATime", Title = "FOH SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;\"><span>#=FOHSLATime#</span></div>", Width = 70 });

                g.Column.Add(new GridColumn { Field = "RCS", Title = "RCS%", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=RCS#%</div></div>", Filterable = "False" });

                g.Column.Add(new GridColumn { Field = "RCSSLATime", Title = "RCS SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;\"><span>#=RCSSLATime#</span></div>", Width = 70 });

                g.Column.Add(new GridColumn { Field = "FOH", Title = "FOH%", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=FOH#%</div></div>", Filterable = "False" });



                g.Column.Add(new GridColumn { Field = "UWSSLATime", Title = "UWS SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;background-color:#=UWSSlaMet#;color:white\"><span>#=UWSSLATime#</span></div>", Width = 70 });

                g.Column.Add(new GridColumn { Field = "LPWeight", Title = "LP Wt / Pcs", DataType = GridDataType.String.ToString(), Filterable = "False", Sortable = "False", Width = 80 });

                g.Column.Add(new GridColumn { Field = "BuildCount", Title = "ULD", DataType = GridDataType.String.ToString(), Width = 45 });

                g.Column.Add(new GridColumn { Field = "ActualBuildUpWeight", Title = "Act Bup Wt", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=ActualBuildUpWeight#</div></div>", Filterable = "False" });

                g.Column.Add(new GridColumn { Field = "FWB", Title = "FWB%", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=FWB#%</div></div>", Filterable = "False" });

                g.Column.Add(new GridColumn { Field = "FWBSLATime", Title = "FWB SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;\"><span>#=FWBSLATime#</span></div>", Width = 70 });

                g.Column.Add(new GridColumn { Field = "FWBSentCount", Title = "FWB Sent", DataType = GridDataType.String.ToString(), Width = 60 });

                g.Column.Add(new GridColumn { Field = "FFMSLATime", Title = "FFM SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;background-color:#=FFMSLAMet#;color:white\"><span>#=FFMSLATime#</span></div>", Width = 70 });


                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FromDate", Value = FromDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "ToDate", Value = ToDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchDestination", Value = SearchDestination });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchAirline", Value = SearchAirline });


                g.InstantiateIn(Container);
            }
        }
        public Stream GetNestedGrid(string SNo)
        {

            StringBuilder myCurrentForm = new StringBuilder();
            CreateNestedGrid(myCurrentForm, SNo);
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);

        }

        public DataSourceResult GetNestedGridData(string SNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();

                ProcName = "ImportFlightMonitor";

                string filters = GridFilter.ProcessFilters<ImportFlightMonitoringModel>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@DailyFlightSNo",SNo),
                                             new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetExportFlightMonitoringTrans", Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new ExportFlightMonitoringModelNestedGrid
                {
                    DailyFlightSno = Convert.ToInt32(e["DailyFlightSno"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Weight = e["Weight"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    RCSTime = e["RCSTime"].ToString(),
                    FOHTime = e["FOHTime"].ToString(),
                    FWBTime = e["FWBTime"].ToString(),
                    BuildUPWeight = e["BuildUPWeight"].ToString(),
                    RemaingWeight = e["RemaingWeight"].ToString(),
                    SHC = e["SHC"].ToString(),
                    Late = e["Late"].ToString()
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = lst.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }

            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetExportFlightMonitoringTrans"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        private void CreateNestedGrid(StringBuilder Container, string SNo = "")
        {
            using (Grid g = new Grid())
            {
                //g.Height = 300;
                g.IsAutoHeight = true;
                g.PageName = this.MyPageName;
                g.PrimaryID = "DailyFlightSno";
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;

                g.DataSoruceUrl = "Services/Report/ExportFlightMonitoringService.svc/GetNestedGridData";
                //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Export Flight Monitoring";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsAllExport = false;
                g.IsCurrentExport = false;
                g.IsSortable = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSno", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWBNo", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Weight", Title = "Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "RCSTime", Title = "RCS Time", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;\"><span>#=RCSTime#</span></div>" });
                g.Column.Add(new GridColumn { Field = "FOHTime", Title = "FOH Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FWBTime", Title = "FWB Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Late", Title = "Late", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "BuildUPWeight", Title = "BuildUp Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "RemaingWeight", Title = "Remaining Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString() });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SNo", Value = SNo });

                g.InstantiateIn(Container);
            }
        }


        public List<ExportFlightMonitoringChart> GetChartData(string StartDate, string EndDate, string DailyFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@StartDate",  Convert.ToDateTime(StartDate.Replace('_', ':'))), 
                                            new SqlParameter("@EndDate",  Convert.ToDateTime(EndDate.Replace('_', ':'))), 
                                            new SqlParameter("@DailyFlightSno", DailyFlightSno),
                                            new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };


                var ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spgetExportMonitorChart", Parameters);
                var lst = new List<ExportFlightMonitoringChart>();
                lst = ds.Tables[0].AsEnumerable().Select(e => new ExportFlightMonitoringChart
                {
                    GrossWeight = e["GrossWeight"].ToString(),
                    UpdatedOn = e["UpdatedOn"].ToString()

                }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spgetExportMonitorChart"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}