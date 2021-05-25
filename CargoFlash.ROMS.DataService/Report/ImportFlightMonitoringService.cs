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
    public class ImportFlightMonitoringService : BaseWebUISecureObject, IImportFlightMonitoringService
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Page ImportFlightMonitoringService "),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public Stream GetGrid(string processName, string moduleName, string appName, string SearchFlightNo, string FromDate, string ToDate, string SearchOrigin, string SearchAirline)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SearchFlightNo: SearchFlightNo, FromDate: FromDate, ToDate: ToDate, SearchOrigin: SearchOrigin, SearchAirline: SearchAirline);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchFlightNo = "", string FromDate = "", string ToDate = "", string SearchOrigin = "", string SearchAirline = "", string ProcessStatus = "")
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
                        case "ImportFlightMonitoringSearch":
                            if (appName.ToUpper().Trim() == "SEARCHRECORD")
                                CreateGrid(myCurrentForm, SearchFlightNo, FromDate, ToDate, SearchOrigin, SearchAirline);
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

        public DataSourceResult GetGridData(string SearchFlightNo, string FromDate, string ToDate, string SearchOriginCity, string SearchAirline, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetimportFlightMonitor";

                string filters = GridFilter.ProcessFilters<ImportFlightMonitoringModelGrid>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@pAirlineCode", (SearchAirline=="A~A"?"":SearchAirline)), 
                                            new SqlParameter("@FromDate", Convert.ToDateTime(FromDate.Replace('_', ':'))), 
                                            new SqlParameter("@ToDate", Convert.ToDateTime(ToDate.Replace('_', ':'))), 
                                            new SqlParameter("@pFlightNo", (SearchFlightNo=="A~A"?"":SearchFlightNo)), 
                                            new SqlParameter("@pAirportCode", (SearchOriginCity=="A~A"?"":SearchOriginCity)),
                                            new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new ImportFlightMonitoringModelGrid
                {
                    SNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FlightNo = e["FlightNo"].ToString(),
                    OriginAirportCode = e["OriginAirportCode"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    FlightETADate = e["FlightETADate"].ToString(),
                    FFMSLATime = e["FFMSLATime"].ToString(),
                    ULDBreak = e["ULDBreak"].ToString(),
                    FFMArrLocPcCount = e["FFMArrLocPcCount"].ToString(),
                    LocationPercent = e["LocationPercent"].ToString(),
                    SHCQRTDGR = e["SHCQRTDGR"].ToString(),
                    RCFSLATime = e["RCFSLATime"].ToString(),
                    NFDSLATime = e["NFDSLATime"].ToString(),
                    ARRSLATime = e["ARRSLATime"].ToString(),
                    FFMSLAMet = e["FFMSLAMet"].ToString(),
                    DLVSLATime = e["DLVSLATime"].ToString(),
                    DLVSuccess = e["DLVSuccess"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    FFMPc = e["FFMPc"].ToString(),
                    FlightCapacity = e["FlightCapacity"].ToString(),
                    FFMWT = e["FFMWT"].ToString(),
                    NFDSuccess = e["NFDSuccess"].ToString(),
                    ARRSuccess = e["ARRSuccess"].ToString(),
                    RCFSuccess = e["RCFSuccess"].ToString()

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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetimportFlightMonitor "),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        private void CreateGrid(StringBuilder Container, string SearchFlightNo = "", string FromDate = "", string ToDate = "", string SearchOrigin = "", string SearchAirline = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Report/ImportFlightMonitoringService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Import Flight Monitoring";
                g.DefaultPageSize = 15;
                g.IsDisplayOnly = true;
                g.IsAllExport = false;
                g.IsCurrentExport = false;
                g.IsSortable = false;
                g.IsShowGridHeader = false;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineName", Title = "AirlineName", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FFMPc", Title = "FFMPc", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FlightCapacity", Title = "FlightCapacity", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FFMWT", Title = "FFMWT", DataType = GridDataType.String.ToString(), IsHidden = true });

                //g.Column.Add(new GridColumn { Field = "View", Title = "Action", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  onclick=\"GetFlightData(#=SNo#,this)\" title=\"Counter view\" value=\"C\" class=\"completeprocess\" >&nbsp;<input type=\"button\" onclick=\"GetFlightData(#=SNo#,this,\\'W\\')\"  title=\"Warehouse view\" value=\"W\" class=\"incompleteprocess\" >", Width = 60 });

                g.Column.Add(new GridColumn { Field = "View", Title = "Action", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  onclick=\"GetFlightData(#=SNo#,this)\" title=\"Flight details\" value=\"A\" class=\"completeprocess\" >", Width = 60 });

                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date/Time", DataType = GridDataType.String.ToString() });

              //  g.Column.Add(new GridColumn { Field = "FlightETADate", Title = "ATA", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "OriginAirportCode", Title = "Origin", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "FFMSLATime", Title = "FFM SLA", DataType = GridDataType.String.ToString(), Template = "<div style=\"height:20px;text-align:center;background-color:#=FFMSLAMet#;color:white\"><span>#=FFMSLATime#</span></div>", Width = 70 });

                g.Column.Add(new GridColumn { Field = "ULDBreak", Title = "ULD Break", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "FFMArrLocPcCount", Title = "FFM/Arr/Loc PcCount", DataType = GridDataType.String.ToString(), Width = 150 });

                g.Column.Add(new GridColumn { Field = "LocationPercent", Title = "Location%", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=LocationPercent#%</div></div>", Filterable = "False" });

                g.Column.Add(new GridColumn { Field = "SHCQRTDGR", Title = "SHC/QRT/DGR", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "RCFSLATime", Title = "RCF SLA", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "NFDSLATime", Title = "NFD SLA", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "ARRSLATime", Title = "ARR SLA", DataType = GridDataType.String.ToString() });

              //  g.Column.Add(new GridColumn { Field = "DLVSLATime", Title = "DLV SLA", DataType = GridDataType.String.ToString() });

               // g.Column.Add(new GridColumn { Field = "DLVSuccess", Title = "DLV Success", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=DLVSuccess#%</div></div>", Filterable = "False" });

                g.Column.Add(new GridColumn { Field = "NFDSuccess", Title = "NFD Success", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=NFDSuccess#%</div></div>", Filterable = "False" });
                g.Column.Add(new GridColumn { Field = "ARRSuccess", Title = "ARR Success", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=ARRSuccess#%</div></div>", Filterable = "False" });
                g.Column.Add(new GridColumn { Field = "RCFSuccess", Title = "RCF Success", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=RCFSuccess#%</div></div>", Filterable = "False" });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FromDate", Value = FromDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "ToDate", Value = ToDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchOrigin", Value = SearchOrigin });
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


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetImportFlightMonitoringTrans", Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new ImportFlightMonitoringModelNestedGrid
                {
                    DailyFlightSno = Convert.ToInt32(e["DailyFlightSno"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Weight = e["Weight"].ToString(),
                    ARRTime = e["ARRTime"].ToString(),
                    RCFTime = e["RCFTime"].ToString(),
                    NFDTime = e["NFDTime"].ToString(),
                    SHC = e["SHC"].ToString(),
                    FFMArrLocPcsCount = e["FFMArrLocPcCount"].ToString(),
                    LocationPercent = e["LocationPercent"].ToString()
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetImportFlightMonitoringTrans"),
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

                g.DataSoruceUrl = "Services/Report/ImportFlightMonitoringService.svc/GetNestedGridData";
                //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Import Flight Monitoring";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsAllExport = false;
                g.IsCurrentExport = false;
                g.IsSortable = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSno", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWBNo", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Weight", Title = "Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ARRTime", Title = "ARR Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "RCFTime", Title = "RCF Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "NFDTime", Title = "NFD Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "FFMArrLocPcsCount", Title = "FFM/ArrLoc/PcsCount", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "LocationPercent", Title = "Location%", DataType = GridDataType.String.ToString(), Template = "<div rel=\"progressbar\"><div class=\"progresslabel\">#=LocationPercent#%</div></div>", Filterable = "False" });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SNo", Value = SNo });

                g.InstantiateIn(Container);
            }
        }

        public List<ImportFlightMonitoringChart> GetChartData(string StartDate, string EndDate, string DailyFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = {                                           
                                            new SqlParameter("@DailyFlightSno", DailyFlightSno),
                                              new SqlParameter("@Usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };


                var ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetImportMonitorChart", Parameters);
                var lst = new List<ImportFlightMonitoringChart>();
                lst = ds.Tables[0].AsEnumerable().Select(e => new ImportFlightMonitoringChart
                {
                    GrossWeight = e["GrossWeight"].ToString(),
                    UpdatedOn = e["deliveryorderdate"].ToString()

                }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetImportMonitorChart"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}
