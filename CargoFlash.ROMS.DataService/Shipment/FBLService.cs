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
using CargoFlash.Cargo.Model.Shipment;
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

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FBLService : BaseWebUISecureObject, IFBLService
    {
        public DataSourceResult GetWMSWaybillGridDataFBL(string OriginCity, string DestinationCity, string FlightNo, string FlightDateSearch, string AWBPrefix, string AWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {

            // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
            //FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString)
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

                ProcName = "GetListWMSBookingParamFBL";

                string filters = GridFilter.ProcessFilters<WMSBookingGridDataFBL>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDateSearch", FlightDateSearch), new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@LoggedInCity", LoggedInCity)/*For Multicity*/ , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSBookingGridDataFBL
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString() == "" ? 0 : e["Gross"]),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDateSearch = e["FlightDateSearch"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDateSearch"]), DateTimeKind.Utc),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetProcessSequence(string ProcessName)
        {
            try
            {
            SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
             }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity);
        }
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "")
        {

            try
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
                            case "FBL":
                                if (appName.ToUpper().Trim() == "FBLGRID")
                                    CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                                break;

                            case "DIMSFBLInformation":
                                if (appName.Trim() == "DIMSFBLInformation")
                                    CreateGridForDIMS(myCurrentForm, processName, AWBSNo);
                                break;
                            default:
                                break;
                        }
                        break;
                    case DisplayModeReadView:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    default:
                        break;
                }
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDateSearch = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "")
        {

            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsActionRequired = false;

                    g.DataSoruceUrl = "Services/Shipment/FBLService.svc/GetWMSWaybillGridDataFBL";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "FBL";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsShowGridHeader = false;
                    g.ProcessName = ProcessName;


                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( AWBDate==null) {# # } else {# #= kendo.toString(new Date(data.AWBDate.getTime() + data.AWBDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                    g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "FlightDateSearch", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( FlightDateSearch==null) {# # } else {# #= kendo.toString(new Date(data.FlightDateSearch.getTime() + data.FlightDateSearch.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDateSearch", Value = FlightDateSearch });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetFBLInformation(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFBLInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetDIMSFBLInformationGrid(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }

        private void CreateGridForDIMS(StringBuilder Container, string ProcessName, string AWBSNo)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Shipment/FBLService.svc/GetDIMSGridDataFBL";//GetDIMSGridDataFBL
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "FBL";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.ProcessName = ProcessName;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Weight", Title = "Gross Weight", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "Length", Title = "Length", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "Width", Title = "Width", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "Height", Title = "Height", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "cms", Title = "cm/inch", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBSNo", Value = AWBSNo });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetDIMSGridDataFBL(string AWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetDIMSGridData";
                string filters = GridFilter.ProcessFilters<DIMSGridDataFBL>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBSNo", AWBSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var DIMSGridDataFBLList = ds.Tables[0].AsEnumerable().Select(e => new DIMSGridDataFBL
                {
                    Pieces = e["NOP"].ToString() == "" ? 0 : Convert.ToInt32(e["NOP"]),
                    Weight = e["Weight"].ToString() == "" ? 0 : Convert.ToDecimal(e["Weight"]),
                    Length = e["Length"].ToString() == "" ? 0 : Convert.ToDecimal(e["Length"]),
                    Width = e["Width"].ToString() == "" ? 0 : Convert.ToDecimal(e["Width"]),
                    Height = e["Height"].ToString() == "" ? 0 : Convert.ToDecimal(e["Height"]),
                    cms = e["Meas_Unit"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DIMSGridDataFBLList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string InitiateFBR(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                        new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "InitiateFBR", Parameters);
                ds.Dispose();
                string FBR = "Done";
                return FBR;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}
