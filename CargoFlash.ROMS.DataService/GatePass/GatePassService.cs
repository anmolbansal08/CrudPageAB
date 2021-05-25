using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;

using KLAS.Business.EDI;
using CargoFlash.Cargo.Model.FlightControl;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.DataService.Common;
using System.Net;

namespace CargoFlash.Cargo.DataService.GatePass
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class GatePassService : BaseWebUISecureObject, IGatePassService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, string LoggedInCity, string CurrentFlightSno)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity, CarrierCode: CarrierCode, FlightRoute: FlightRoute, OffloadType: OffloadType, CurrentFlightSno: CurrentFlightSno);
        }

        public Stream GetFlightArrivalAWBGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string SearchAirlineCarrierCode1 = "", string FromFlightDate = "", string ToFlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string ULDStockSNo = "", string ProcessStatus = "", string CarrierCode = "", string FlightRoute = "", string OffloadType = "", string CurrentFlightSno = "", string GatePassSNo = "")
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
                        case "GATEPASS":
                            if (appName.ToUpper().Trim() == "GATEPASS")
                                // used in gatepass
                                CreateFlightControlGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, SearchAirlineCarrierCode1, FromFlightDate, ToFlightDate, FlightStatus, LoggedInCity);
                            else if (appName.ToUpper().Trim() == "FLIGHTAWB")
                                CreateFlightAWBGrid(myCurrentForm, FlightSNo);

                            else if (appName.ToUpper().Trim() == "ULDSTACK")
                                CreateULDStackGrid(myCurrentForm, FlightSNo);
                            else if (appName.ToUpper().Trim() == "STOPOVERFLIGHT")
                                CreateStopOverFlightULDGrid(myCurrentForm, FlightSNo);
                            else if (appName.ToUpper().Trim() == "FLIGHTLYING")
                            {
                                // CreateFlightLyingListSearch(myCurrentForm);
                                //  CreateFlightLyingGrid(myCurrentForm, FlightSNo);
                                CreateFlightLyingGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, AWBNo, CarrierCode, FlightRoute, OffloadType: OffloadType, CurrentFlightSno: CurrentFlightSno);

                            }
                            else if (appName.ToUpper().Trim() == "OSCLYING")
                            {
                                // CreateFlightLyingListSearch(myCurrentForm);
                                //  CreateFlightLyingGrid(myCurrentForm, FlightSNo);
                                CreateOSCFlightLyingGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, AWBNo, CarrierCode, FlightRoute, OffloadType: OffloadType);

                            }
                            else if (appName.ToUpper().Trim() == "MANIFESTFLIGHTLYING")
                            {
                                //  CreateManifestFlightLyingSearch(myCurrentForm);
                                CreateManifestLyingULDGrid(myCurrentForm, OriginCity, DestinationCity, ULDStockSNo, CarrierCode, FlightRoute, OffloadType: OffloadType, AWBNo: AWBNo);

                            }
                            else if (appName.ToUpper().Trim() == "OSCFLIGHTLYING")
                            {
                                //  CreateManifestFlightLyingSearch(myCurrentForm);
                                CreateOSCFlightLyingULDGrid(myCurrentForm, OriginCity, DestinationCity, ULDStockSNo, CarrierCode, FlightRoute, OffloadType: OffloadType, AWBNo: AWBNo);

                            }
                            else if (appName.ToUpper().Trim() == "MANIFESTULD")
                            {
                                CreateManifestULDGrid(myCurrentForm, ProcessStatus, FlightSNo, OriginCity, DestinationCity, FlightDate, GatePassSNo);

                            }
                            else if (appName.ToUpper().Trim() == "EDIMSG")
                            {
                                CreateFlightEDIMSGGrid(myCurrentForm, FlightSNo);
                            }
                            break;
                        case "FlIGHTARRIVAL":
                            CreateFlightArrivalGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, FlightDate, FlightStatus, LoggedInCity);
                            break;
                        case "FlIGHTARRIVALAWB":
                            CreateFlightArrivalAWBGrid(myCurrentForm, FlightSNo);
                            break;
                        default:
                            break;
                    }

                    if (processName == "HOUSE" && appName.ToUpper().Trim() == "BOOKING")
                    {

                    }


                    //else if (appName.ToUpper().Trim() == "FLIGHTCONTROL")
                    //    CreateFlightControlGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, FlightDate,FlightStatus, LoggedInCity);
                    //else if (appName.ToUpper().Trim() == "FLIGHTAWB")
                    //    CreateFlightAWBGrid(myCurrentForm,FlightSNo);
                    break;
                case DisplayModeReadView:

                    break;
                default:
                    break;
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
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

        public Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string LoggedInCity, string FlightStatus)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: BoardingPoint, DestinationCity: EndPoint, FlightNo: FlightNo, SearchAirlineCarrierCode1: SearchAirlineCarrierCode1, FromFlightDate: FromFlightDate, ToFlightDate: ToFlightDate, LoggedInCity: LoggedInCity, FlightStatus: FlightStatus);
        }

        public Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo, string ProcessStatus = "", string OriginCity = "", string DestinationCity = "", string FlightDate = "", string GatePassSNo = "")
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightSNo: FlightSNo, ProcessStatus: ProcessStatus, OriginCity: OriginCity, DestinationCity: DestinationCity, FlightDate: FlightDate, GatePassSNo: GatePassSNo);
        }
        public Stream GetFlightManifestTransGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, ULDStockSNo: ULDStockSNo, CarrierCode: CarrierCode, FlightRoute: FlightRoute, OffloadType: OffloadType, AWBNo: AWBNo);
        }

        // used in gatepass
        private void CreateFlightControlGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string SearchAirlineCarrierCode1 = "", string FromFlightDate = "", string ToFlightDate = "", string FlightStatus = "", string LoggedInCity = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    //g.PageName = this.MyPageName;
                    //g.PrimaryID = this.MyPrimaryID;
                    //g.ModuleName = this.MyModuleID;
                    //g.AppsName = this.MyAppID;

                    //g.ActionTitle = "Action";
                    //g.DataSoruceUrl = "Services/Shipment/SLInfoService.svc/GetSLInfoGridData";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    //g.ServiceModuleName = this.MyModuleID;
                    //g.UserID = this.MyUserID;
                    //g.FormCaptionText = "SLI List";
                    //g.DefaultPageSize = 5;
                    //g.IsDisplayOnly = true;
                    //g.IsProcessPart = true;
                    //g.IsVirtualScroll = false;
                    //g.IsDisplayOnly = false;
                    //g.ProcessName = ProcessName;
                    //g.SuccessGrid = "OnSuccessGrid";
                    // g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    // g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsActionRequired = false;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/GatePass/GatePassService.svc/GetFlightControlGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Gate Pass";
                    //  g.IsPageable = true;
                    //  g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    //g.IsRowChange = true;
                    g.IsRowDataBound = false;
                    // g.IsAllowedSorting = false;
                    //  g.IsPageSizeChange = false;
                    //  g.IsPager = false;
                    //  g.IsOnlyTotalDisplay = true;
                    g.IsShowGridHeader = false;
                    g.ProcessName = "GatePass";
                    g.IsVirtualScroll = false;
                    g.SuccessGrid = "fn_OnFlightSuccessGrid";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "GatePassSNo", Title = "GatePassSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "GatePassNo", IsLocked = false, Title = "Gate Pass No", Template = "<sapn title=\"#= GatePassNo #\">#= GatePassNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", Template = "<sapn title=\"#= FlightNo #\">#= FlightNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 60, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Filterable = "false" });
                    g.Column.Add(new GridColumn { Field = "BoardingPoint", IsHidden = false, IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "EndPoint", IsHidden = false, IsLocked = false, Title = "End Point", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", IsHidden = false, IsLocked = false, Title = "Flight Status", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AirlineName", IsLocked = false, Title = "Airline", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "ULD", IsLocked = false, Title = "ULD", DataType = GridDataType.String.ToString(), Width = 70, Template = "#= ULD#" });
                    g.Column.Add(new GridColumn { Field = "BulkShipment", IsLocked = false, Title = "BULK Shipment", DataType = GridDataType.String.ToString(), Width = 70, Template = "#= BulkShipment#" });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    // g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = false });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FromFlightDate", Value = FromFlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "ToFlightDate", Value = ToFlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        // used in gatepass
        public DataSourceResult GetFlightControlGridData(string OriginCity, String DestinationCity, string FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string FlightStatus, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                FromFlightDate = FromFlightDate == "From Date" ? null : FromFlightDate;
                DataSet ds = new DataSet();

                ProcName = "spGetListGatePass";       //for testing GetListWMSFlightControlTest_n

                string filters = GridFilter.ProcessFilters<WMSFlightControlGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@SearchAirlineCarrierCode1", SearchAirlineCarrierCode1), new SqlParameter("@FromFlightDate", FromFlightDate), new SqlParameter("@ToFlightDate", ToFlightDate), new SqlParameter("@FlightStatus", FlightStatus), new SqlParameter("@LoggedInCity", LoggedInCity), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightControlList = ds.Tables[0].AsEnumerable().Select(e => new GatePassGridData
                {
                    GatePassSNo = Convert.ToInt32(e["GatePassSNo"]),
                    GatePassNo = e["GatePassNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    BoardingPoint = e["BoardingPoint"].ToString(),
                    EndPoint = e["EndPoint"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    ULD = Convert.ToInt32(e["ULD"]),
                    BulkShipment = Convert.ToInt32(e["BulkShipment"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    ProcessStatus = e["ProcessStatus"].ToString(),
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightControlList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    //Data = wmsFlightControlList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    //FilterCondition = filters,
                    //SortCondition = sorts,
                    //StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateFlightLyingListSearch(StringBuilder container)
        {
            container.Append(@"<div class='mfs_rel_wrapper make_relative append_bottom5 clearfix'>
                <div class='modify_search noneAll'>
                    <div class='modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope'>
                        <div class='row'>
                            <div class='col-xs-12 col-sm-12'>
                                <!-- city and country -->
                                <a class='col-xs-12 col-sm-12 has_fade' style='padding-left:2px;padding-right:2px;'>
                                    <table id='tblSearch'>
                                        <tr>
                                            <td><input id='txtFlightNo' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 100px; height:25px; position: relative; vertical-align: top; background-color: transparent; ' placeholder='Flight No' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtAWBNo' type='text' maxlength='15' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 120px; height:25px; position: relative; vertical-align: top; background-color: transparent;' placeholder='AWB No'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtOriginCity' type='text' class='input-md form-control tt-input' maxlength='10' style='font-family: Verdana; font-size: 12px;  height: 25px; width: 100px; position: relative; vertical-align: top; background-color: transparent;' placeholder='Origin City' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtDestinationCity' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 120px; height:25px; position: relative; vertical-align: top; background-color: transparent;' placeholder='Destination City' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><button class='btn btn-block btn-primary' style='margin-top:0px;' id='btnLyingListSearch' onclick='SearchLyingLst();' >Search</button></td>
                                            
                                        </tr>
                                    </table>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>");
        }
        private void CreateManifestFlightLyingSearch(StringBuilder container)
        {
            container.Append(@"<div class='mfs_rel_wrapper make_relative append_bottom5 clearfix'>
                <div class='modify_search noneAll'>
                    <div class='modify_top col-md-12 col-sm-12 hidden-xs visible-stb ng-scope'>
                        <div class='row'>
                            <div class='col-xs-12 col-sm-12'>
                                <!-- city and country -->
                                <a class='col-xs-12 col-sm-12 has_fade' style='padding-left:2px;padding-right:2px;'>
                                    <table id='tblSearch'>
                                        <tr>
                                           <td><input id='txtFlightSNo' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 100px; height:25px; position: relative; vertical-align: top; background-color: transparent; ' placeholder='Flight No' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><input id='txtULDNo' type='text' maxlength='10' class='input-md form-control  tt-input' style='font-family: Verdana; font-size: 12px;  width: 100px; height:25px; position: relative; vertical-align: top; background-color: transparent; ' placeholder='ULD NO' autocorrect='off'></td>
                                            <td>&nbsp;</td>
                                            <td><button class='btn btn-block btn-primary' style='margin-top:0px;' id='btnManifestLyingSearch' onclick='SearchManifestLyingLst();' >Search</button></td>
                                        </tr>
                                    </table>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>");
        }
        private void CreateULDStackGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 100;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DefaultPageSize = 1000;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetStackULDGridData";
                    g.PrimaryID = "ULDStackSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "Stack Details";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsAllowedSorting = false;
                    g.IsShowEdit = false;
                    // g.ParentSuccessGrid = "DisableFlight";
                    g.IsSaveChanges = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ULDStackSNo", Title = "ULDStackSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "BaseUldNo", Title = "Base ULD", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CountAsStock", Title = "Count Of Stack", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ScaleWeight", Title = "Scale Weight (Kgs)", DataType = GridDataType.Decimal.ToString() });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OffPoint", Title = "Off Point", DataType = GridDataType.String.ToString() });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightSNo", Value = FlightSNo });

                    g.NestedPrimaryID = "UldStackSNo";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDStackSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    //  g.IsNestedAllowedFiltering = true;
                    g.IsNestedAllowedSorting = false;
                    // g.SuccessGrid = "DisableFlight";
                    //g.IsNestedAllowedFiltering = false;

                    g.NestedDataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetStackChildGridData";
                    g.NestedColumn = new List<GridColumn>();
                    g.NestedColumn.Add(new GridColumn { Field = "ULDStackSNo", Title = "ULDStackSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "OwnerCode", Title = "Owner Code", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "ULDCity", Title = "ULD City", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULDStockSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    // g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightSNo", Value = FlightSNo });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetStackULDGridData(String FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetFlightUldStack";

                string filters = GridFilter.ProcessFilters<FlightULDStackGrid>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightSNo", FlightSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightULDStackGridList = ds.Tables[0].AsEnumerable().Select(e => new FlightULDStackGrid
                {



                    ULDStackSNo = Convert.ToInt32(e["ULDStackSNo"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    BaseUldNo = Convert.ToString(e["BaseUldNo"]),
                    CountAsStock = Convert.ToInt32(e["CountAsStock"]),
                    ScaleWeight = Convert.ToDecimal(e["ScaleWeight"]),
                    Status = e["Status"].ToString(),
                    OffPoint = e["offpoint"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightULDStackGridList.AsQueryable().ToList(),
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
        public DataSourceResult GetStackChildGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetFlightUldStackChild";

                string filters = GridFilter.ProcessFilters<FlightULDStackChildGrid>(filter);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@DailyFlightSNo", FlightSNo) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightSNo", FlightSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightULDStackChildGridList = ds.Tables[0].AsEnumerable().Select(e => new FlightULDStackChildGrid
                {


                    ULDStackSNo = Convert.ToInt32(e["ULDStackSNo"]),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    ULDNo = Convert.ToString(e["ULDNo"]),
                    OwnerCode = Convert.ToString(e["OwnerCode"]),
                    ULDCity = e["ULDCity"].ToString(),

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightULDStackChildGridList.AsQueryable().ToList(),
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
        private void CreateFlightEDIMSGGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetFlightEDIMSGGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "EDI Message <span style=\"float:right;\">Send FFM : <input type=\"checkbox\" id=\"chkIsFFM\" value=\"5\" /></span>";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsPageable = false;
                    g.IsVirtualScroll = false;
                    g.IsOnlyTotalDisplay = true;
                    g.SuccessGrid = "onMSGSuccess";
                    g.IsRowDataBound = true;
                    g.IsAllowedSorting = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Org/Dest", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "SHCCode", Title = "SHC Code", Template = "<sapn title=\"#= SHCCode #\">#= SHCCode #</span>", DataType = GridDataType.String.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "IsFWB", Title = "FWB", Template = "# if(IsFWB==true) {# <input type=\"checkbox\" id=\"chkIsFWB\" checked=\"1\" value=\"#= FWBMessageType #\" onclick=\"fn_CheckEDIMsg(this)\" disabled /><input type=\"hidden\"  value=\"#= IsFWB #\" />#}else{# <input type=\"checkbox\" id=\"chkIsFWB\" value=\"#= FWBMessageType #\"  onclick=\"fn_CheckEDIMsg(this)\"   /><input type=\"hidden\"   value=\"#= IsFWB #\" />#} #", DataType = GridDataType.Boolean.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "IsFHL", Title = "FHL", Template = "# if(IsFHL==true) {# <input type=\"checkbox\" id=\"chkIsFHL\" checked=\"1\" value=\"#= FHLMessageType #\"  onclick=\"fn_CheckEDIMsg(this)\"   disabled /><input type=\"hidden\"   value=\"#= IsFHL #\" />#}else{if(IsNoOfHouse==0){ #<input type=\"checkbox\" id=\"chkIsFHL\" value=\"#= FHLMessageType #\" onclick=\"fn_CheckEDIMsg(this)\"    disabled   /><input type=\"hidden\"  value=\"#= IsFHL #\"  />#} else{#<input type=\"checkbox\" id=\"chkIsFHL\" value=\"#= FHLMessageType #\" onclick=\"fn_CheckEDIMsg(this)\"    /><input type=\"hidden\"  value=\"#= IsFHL #\"  />#}} #", DataType = GridDataType.Boolean.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "IsDEP", Title = "DEP", Template = "# if(IsDEP==true) {# <input type=\"checkbox\" id=\"chkIsDEP\" checked=\"1\" value=\"#= DEPMessageType #\" onclick=\"fn_CheckEDIMsg(this)\"   disabled /><input type=\"hidden\"  value=\"#= IsDEP #\"  />#}else{# <input type=\"checkbox\" id=\"chkIsDEP\" value=\"#= DEPMessageType #\"  onclick=\"fn_CheckEDIMsg(this)\"    /><input type=\"hidden\" value=\"#= IsDEP #\" />#} #", DataType = GridDataType.Boolean.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "IsFFM", Title = "IsFFM", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightSNo", Value = FlightSNo });
                    //StringBuilder str = new StringBuilder();

                    //str.Append("<table><tr><td colspan=\"8\">Send FFM : <input type=\"checkbox\" id=\"chkbtnSelect\" checked=\"1\" /> </td></tr><tr><td></td></tr></table>");

                    g.InstantiateIn(Container);//.Append("<table><tr><td colspan=\"8\">Send FFM : <input type=\"checkbox\" id=\"chkbtnSelect\" checked=\"1\" /> </td></tr><tr><td></td></tr></table>"));
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetFlightEDIMSGGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetFlightEDIMSGList";

                string filters = GridFilter.ProcessFilters<WMSFlightAWBGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsFlightAWBList = ds.Tables[0].AsEnumerable().Select(e => new FlightEDIMSGGridData
                {
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"]),
                    SNo = Convert.ToInt64(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    SHCCode = e["SHCCode"].ToString(),
                    IsFWB = Convert.ToBoolean(e["IsFWB"]),
                    IsFHL = Convert.ToBoolean(e["IsFHL"]),
                    IsDEP = Convert.ToBoolean(e["IsDEP"]),
                    IsNoOfHouse = Convert.ToInt32(e["IsNoOfHouse"]),
                    FFMMessageType = Convert.ToInt16(e["FFMMessageType"]),
                    FWBMessageType = Convert.ToInt16(e["FWBMessageType"]),
                    FHLMessageType = Convert.ToInt16(e["FHLMessageType"]),
                    DEPMessageType = Convert.ToInt16(e["DEPMessageType"]),
                    IsFFM = Convert.ToBoolean(e["IsFFM"])

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightAWBList.AsQueryable().ToList(),
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
        private void CreateFlightAWBGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetWMSFlightAWBGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "AWB Details";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsPageable = false;
                    g.IsVirtualScroll = false;
                    g.IsOnlyTotalDisplay = true;
                    g.SuccessGrid = "BindULDType";
                    g.IsRowDataBound = true;
                    g.IsAllowedSorting = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==true) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" /># } else {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/> <input type=\"hidden\" value=\"#=isHold#\" /># } #", DataType = GridDataType.Boolean.ToString(), Width = 40 });


                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Org/Dest", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.Decimal.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", Template = "<sapn title=\"#= ActG_V_CBM #\">#= ActG_V_CBM #</span>", DataType = GridDataType.String.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pcs", Template = "<input type=\"text\"  id=\"txt_PlannedPieces\" onkeypress=\"return ISNumeric(this)\"  value=\"#=PlannedPieces#\" style=\"width:50%;\" MaxLength=\"5\" onkeyup=\"fn_CalGVCBMForLI(this);\" onblur=\"fn_CalGVCBMForLI(this);fn_ResetPiece(this);fn_AddNewRow(this);\" />", DataType = GridDataType.Number.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", Template = "<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:27%;\"MaxLength=\"7\"  onkeyup=\"fn_Cal_GVCBM1(this);\"   onblur=\"fn_ResetPiece(this);fn_Cal_GVCBM1(this);\"  />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" MaxLength=\"9\" style=\"width:27%;\"  onkeyup=\"fn_Cal_GVCBM1(this);\"  onblur=\"fn_ResetPiece(this);fn_Cal_GVCBM1(this);\"  />/<input type=\"text\" MaxLength=\"9\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:27%;\"  onblur=\"fn_ResetPiece(this);fn_Cal_GVCBM1(this);\"  onkeyup=\"fn_Cal_GVCBM1(this);\"  />", DataType = GridDataType.String.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", Template = "#= Status #", DataType = GridDataType.String.ToString(), Width = 50 });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "Build Details", Template = "<sapn title=\"#= ULDNo #\">#= ULDNo #</span>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULDStockSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "IsManifested", Title = "IsManifested", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", Template = "<sapn title=\"#= Agent #\">#= Agent #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "WHLocation", Title = "Location", Template = "<sapn title=\"#= WHLocation #\">#= WHLocation #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "hdnTotalPieces", Title = "TotalPieces", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "PGW", Title = "PGW", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "PVW", Title = "PVW", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "PCBMW", Title = "PCBMW", DataType = GridDataType.Number.ToString(), IsHidden = true });

                    g.Column.Add(new GridColumn { Field = "FBLAWBSNo", Title = "FBLAWBSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "RowNum", Title = "RowNum", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Block", Title = "Block", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD/BULK", Template = " <select id=\"SULDType\" onchange=\"fn_DisableCount(this);\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "ULDCount", Title = "ULD Count", Template = "<input type=\"text\"  id=\"txt_ULDCount\" onkeypress=\"return fn_ValidateULDCount(this);\" onkeyup=\"fn_ValidateULDCount(this);\"  value=\"#=ULDCount#\" style=\"width:50%;\" MaxLength=\"3\"   />", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:20px;\"  onkeyup=\"return fn_CheckNum(this);\"  />", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Remarks", Title = "Remarks", Template = "# if(Remarks!=\"Add\"){#<input type=\"hidden\" value=\"#=Remarks#\" ><a onclick=\"fun_Remarks(this);\"  style=\"cursor:pointer;\" >#=Remarks#</a> #} else{#<input type=\"hidden\" value=\"\" ><a onclick=\"fun_Remarks(this);\" style=\"cursor:pointer;\" >#=Remarks#</a> #}  #  ", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Remarks", Title = "Action", Template = "<label></label>", DataType = GridDataType.String.ToString(), Width = 30 });


                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightSNo", Value = FlightSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateOSCFlightLyingGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string AWBNo = "", string CarrierCode = "", string FlightRoute = "", string OffloadType = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetOSCLyingListGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Other Station Cargo Details";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsPageable = false;
                    g.IsVirtualScroll = false;
                    g.IsOnlyTotalDisplay = true;
                    g.SuccessGrid = "BindOSCLyingULDType";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==true) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" /># } else {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" /># } #", DataType = GridDataType.Boolean.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    // g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pieces", DataType = GridDataType.Decimal.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "OLCPieces", Title = "OFLD Pieces", DataType = GridDataType.Decimal.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", Template = "<sapn title=\"#= ActG_V_CBM #\">#= ActG_V_CBM #</span>", DataType = GridDataType.String.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "PlannedPieces", Title = "Plan Pieces", Template = "<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:50%;\"  onkeyup=\"fn_CalculateOLCGVCBM(this);\" onblur=\"fn_CalculateOLCGVCBM(this);fn_ResetOLCPcs(this);\" />", DataType = GridDataType.Number.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Plan G/V/CBM", Template = "<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:30%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\"  />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" style=\"width:30%;\"   onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\"  />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:30%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\"  />", DataType = GridDataType.String.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });

                    g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD/BULK", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:30px;\"  onkeyup=\"return fn_CheckNum(this);\" />", DataType = GridDataType.String.ToString(), Width = 60 });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CarrierCode", Value = CarrierCode });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightRoute", Value = FlightRoute });
                    g.ExtraParam.Add(new GridExtraParam { Field = "OffloadType", Value = OffloadType });

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateFlightLyingGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string AWBNo = "", string CarrierCode = "", string FlightRoute = "", string OffloadType = "", string CurrentFlightSno = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetLyingListGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Lying List";
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsPageable = false;
                    g.IsVirtualScroll = false;
                    g.IsOnlyTotalDisplay = true;
                    g.SuccessGrid = "BindLyingULDType";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==true) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" /># } else {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" /># } #", DataType = GridDataType.Boolean.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    // g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pieces", DataType = GridDataType.Decimal.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "OLCPieces", Title = "OFLD Pieces", Template = "# if(Status!=\"RCS\"){#<sapn title=\"#= OLCPieces #\">#= OLCPieces #</span>#}else{#<sapn title=\"#= OLCPieces #\" style=\"display:none;\">#= OLCPieces #</span>#} #", DataType = GridDataType.Decimal.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", Template = "<sapn title=\"#= ActG_V_CBM #\">#= ActG_V_CBM #</span>", DataType = GridDataType.String.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "PlannedPieces", Title = "Plan Pieces", Template = "<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:50%;\"  MaxLength=\"5\" onkeyup=\"fn_CalculateOLCGVCBM(this);\" onblur=\"fn_CalculateOLCGVCBM(this);fn_ResetOLCPcs(this);\" />", DataType = GridDataType.Number.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Plan G/V/CBM", Template = "<input type=\"text\" id=\"txtPG\" MaxLength=\"7\" value=\"#=PG#\" style=\"width:30%;\" onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />/<input type=\"text\" id=\"txtPV\" MaxLength=\"9\" value=\"#=PV#\" style=\"width:30%;\"   onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\"  />/<input type=\"text\" MaxLength=\"9\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:30%;\"   onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\"  />", DataType = GridDataType.String.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 60 });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD/BULK", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:30px;\"  onkeyup=\"return fn_CheckNum(this);\" />", DataType = GridDataType.String.ToString(), Width = 60 });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CarrierCode", Value = CarrierCode });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightRoute", Value = FlightRoute });
                    g.ExtraParam.Add(new GridExtraParam { Field = "OffloadType", Value = OffloadType });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CurrentFlightSno", Value = CurrentFlightSno });

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        // used in gatepass
        private void CreateManifestULDGrid(StringBuilder Container, string ProcessStatus, string FlightNo = "", string OriginCity = "", string DestinationCity = "", string FlightDate = "", string GatePassSNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 100;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DefaultPageSize = 1000;
                    g.DataSoruceUrl = "Services/GatePass/GatePassService.svc/GetManifestULDGridData";
                    g.PrimaryID = "ULDStockSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "ULD Details";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsAllowedSorting = false;
                    g.IsAllowedScrolling = true;
                    g.IsShowEdit = false;
                    g.ParentSuccessGrid = "DisableFlight";
                    g.IsSaveChanges = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" />#} else if(isSelect==1) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"  onclick=\"checkOnHold(this);\" disabled /><input type=\"hidden\" value=\"#=HoldShip#\" /># } else{##} #", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsDisabledULD", Title = "IsDisabledULD", IsHidden = true, DataType = GridDataType.Boolean.ToString() });
                    g.Column.Add(new GridColumn { Field = "LastPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\"  value=\"#=LastPoint#\" placeholder=\"City\" readonly/>#}else{#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" style=\"height:25px;font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent; display:none;\" value=\"#=LastPoint#\" placeholder=\"City\" readonly />#}#", DataType = GridDataType.String.ToString(), Width = 75 });
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "isSelect", IsHidden = true, DataType = GridDataType.Boolean.ToString() });
                    //g.Column.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", DataType = GridDataType.String.ToString(), Width = 70 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParams { Field = "ProcessStatus", Value = ProcessStatus });
                    g.ExtraParam.Add(new GridExtraParams { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParams { Field = "GatePassSNo", Value = GatePassSNo });
                    //#region Nested Grid Section

                    g.NestedPrimaryID = "AWBSno";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDStockSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    //  g.IsNestedAllowedFiltering = false;
                    //  g.IsNestedAllowedFiltering = true;
                    g.IsNestedAllowedSorting = false;
                    g.SuccessGrid = "fn_HideBulkChild";
                    //g.IsNestedAllowedFiltering = false;

                    g.NestedDataSoruceUrl = "Services/GatePass/GatePassService.svc/GetMULDShipmentGridData";
                    g.NestedColumn = new List<GridColumn>();

                    g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==0){#<input type=\"checkbox\" id=\"chkBulk\"  onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==1){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\" disabled/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label></label>#}#", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });

                    g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "McBookingSNo", Title = "McBookingSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString(), Width = 110, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", DataType = GridDataType.Number.ToString(), Width = 70, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", DataType = GridDataType.String.ToString(), Width = 150, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });

                    g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                    //  g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                    //g.NestedColumn.Add(new GridColumn { Field = "CTMSNo", Title = "CTMSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    //g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBOffPoint", Title = "Off Point", FixTooltip = "Off Point", DataType = GridDataType.String.ToString(), Width = 75, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "IsCTM", Title = "Charges", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" onclick=\"fn_GetCTMChargeDetails(#=AWBSNo#,#=CTMSNo#,this,1);\" title=\"#=ChargesRemarks#\">#}#", Width = 35, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo==0){ if(RFSRemarks!=\"\"){ #<input type=\"button\" value=\"R\" class=\"completeprocess\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #}else{ #<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #} }else{##}#", DataType = GridDataType.String.ToString(), Width = 35, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "TotalPPcs", Title = "TotalPPcs", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "PGW", Title = "PGW", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "PVW", Title = "PVW", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "PCCBM", Title = "PCCBM", DataType = GridDataType.String.ToString(), IsHidden = true });
                    //g.NestedColumn.Add(new GridColumn { Field = "IsPreManifested", Title = "IsPreManifested", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });


                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "ProcessStatus", Value = ProcessStatus });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "GatePassSNo", Value = GatePassSNo });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private void CreateOSCFlightLyingULDGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string ULDStockSNo = "", string CarrierCode = "", string FlightRoute = "", string OffloadType = "", string AWBNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 100;

                    //  g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DefaultPageSize = 1000;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetOSCULDLyingGridData";
                    g.PrimaryID = "ULDStockSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "Other Station Cargo Details";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsShowEdit = false;
                    g.IsSaveChanges = false;
                    g.IsAllowedSorting = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;
                    g.IsAllowedScrolling = true;
                    g.ParentSuccessGrid = "OSCSuccessGrid";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" />#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"   onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" /># } else{##} #", DataType = GridDataType.String.ToString(), Width = 50 });
                    //g.Column.Add(new GridColumn { Field = "IsCTM", Title = "CH", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" title=\"#=ChargesRemarks#\">#}#", Width = 35, Filterable = "false" });
                    //g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/>#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"   onclick=\"MarkSelected(this);\"/># } else{##} #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Origin City", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Destination City", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "LastPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\"  value=\"#=LastPoint#\" placeholder=\"City\" readonly />#}else{#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" style=\"height:25px;font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent; display:none;\" value=\"#=LastPoint#\" placeholder=\"City\" readonly />#}#", DataType = GridDataType.String.ToString(), Width = 75 });
                    // g.Column.Add(new GridColumn { Field = "Status", Title = "Status", IsHidden = false, DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo>0){#<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"U\",#=ULDStockSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" >#}else{##}#", DataType = GridDataType.String.ToString(), Width = 70 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "ULDStockSNo", Value = ULDStockSNo });
                    g.ExtraParam.Add(new GridExtraParams { Field = "CarrierCode", Value = CarrierCode });
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightRoute", Value = FlightRoute });
                    g.ExtraParam.Add(new GridExtraParams { Field = "OffloadType", Value = OffloadType });
                    g.ExtraParam.Add(new GridExtraParams { Field = "AWBNo", Value = AWBNo });


                    //#region Nested Grid Section

                    g.NestedPrimaryID = "AWBSno";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDStockSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    // g.IsNestedAllowedFiltering = false;
                    //  g.IsNestedAllowedFiltering = false;
                    g.SuccessGrid = "fnOSCHideBulk";
                    g.IsNestedAllowedSorting = false;
                    g.NestedDataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetOSCULDLyingShipGridData";
                    g.NestedColumn = new List<GridColumn>();

                    g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==1){#<input type=\"checkbox\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==2){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label>X</label>#}#", DataType = GridDataType.String.ToString(), Filterable = "false" });

                    g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pieces", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "OLCPieces", Title = "OFLD Pieces", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", Template = "<sapn title=\"#= ActG_V_CBM #\">#= ActG_V_CBM #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Plan Pieces", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" MaxLength=\"5\" style=\"width:50%;\" onkeyup=\"fn_CalculateOLCGVCBM(this);\"  onblur=\"fn_CalculateOLCGVCBM(this);fn_ResetOLCPcs(this);\" />#}else{##=PlannedPieces##}#", DataType = GridDataType.Number.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Plan G/V/CBM", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" MaxLength=\"7\" style=\"width:28%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />/<input type=\"text\" id=\"txtPV\" MaxLength=\"9\" value=\"#=PV#\" style=\"width:28%;\" onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:28%;\" MaxLength=\"9\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />#}else{##=PlanG_V_CBM##}#", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "CTMSNo", Title = "CTMSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBOffPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo==0){#<input type=\"hidden\" name=\"AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" readonly/>#}else{#<input type=\"hidden\" name=\"AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_OSC_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" style=\"display:none;\" readonly />#}#", DataType = GridDataType.String.ToString(), Width = 75, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "IsCTM", Title = "Charges", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" onclick=\"fn_GetCTMChargeDetails(#=AWBSNo#,#=CTMSNo#,this,3);\" title=\"#=ChargesRemarks#\">#}#", Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo==0){#<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #}else{##}#", DataType = GridDataType.String.ToString(), Width = 35, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "ULDType", Title = "ULD Type", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    // g.NestedColumn.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "CarrierCode", Value = CarrierCode });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightRoute", Value = FlightRoute });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OffloadType", Value = OffloadType });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "AWBNo", Value = AWBNo });

                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private void CreateManifestLyingULDGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string ULDStockSNo = "", string CarrierCode = "", string FlightRoute = "", string OffloadType = "", string AWBNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 100;

                    //  g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DefaultPageSize = 1000;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetMULDLyingGridData";
                    g.PrimaryID = "ULDStockSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "Lying List ULD Details";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsShowEdit = false;
                    g.IsSaveChanges = false;
                    g.IsAllowedSorting = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;
                    g.IsAllowedScrolling = true;
                    g.ParentSuccessGrid = "AddScroll";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" />#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"   onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" /># } else{##} #", DataType = GridDataType.String.ToString(), Width = 50 });
                    //g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"   onclick=\"MarkSelected(this);\"/>#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"   onclick=\"MarkSelected(this);\"/># } else{##} #", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "IsCTM", Title = "CH", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" title=\"#=ChargesRemarks#\">#}#", Width = 35, Filterable = "false" });
                    g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Origin City", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Destination City", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "LastPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=LastPoint#\" placeholder=\"City\" readonly />#}else{#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" style=\"height:25px;font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent; display:none;\" value=\"#=LastPoint#\" placeholder=\"City\" readonly />#}#", DataType = GridDataType.String.ToString(), Width = 75 });
                    // g.Column.Add(new GridColumn { Field = "Status", Title = "Status", IsHidden = false, DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo>0){#<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"U\",#=ULDStockSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" >#}else{##}#", DataType = GridDataType.String.ToString(), Width = 70 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParams { Field = "ULDStockSNo", Value = ULDStockSNo });
                    g.ExtraParam.Add(new GridExtraParams { Field = "CarrierCode", Value = CarrierCode });
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightRoute", Value = FlightRoute });
                    g.ExtraParam.Add(new GridExtraParams { Field = "OffloadType", Value = OffloadType });
                    g.ExtraParam.Add(new GridExtraParams { Field = "AWBNo", Value = AWBNo });


                    //#region Nested Grid Section

                    g.NestedPrimaryID = "AWBSno";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDStockSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    //  g.IsNestedAllowedFiltering = false;
                    //  g.IsNestedAllowedFiltering = false;
                    g.SuccessGrid = "fnHideBulk";
                    g.IsNestedAllowedSorting = false;
                    g.NestedDataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetMULDLyingShipGridData";
                    g.NestedColumn = new List<GridColumn>();

                    g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==1){#<input type=\"checkbox\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==2){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label>X</label>#}#", DataType = GridDataType.String.ToString(), Filterable = "false" });

                    g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pieces", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "OLCPieces", Title = "OFLD Pieces", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", Template = "<sapn title=\"#= ActG_V_CBM #\">#= ActG_V_CBM #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Plan Pieces", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:50%;\" MaxLength=\"5\" onkeyup=\"fn_CalculateOLCGVCBM(this);\"  onblur=\"fn_CalculateOLCGVCBM(this);fn_ResetOLCPcs(this);\" />#}else{##=PlannedPieces##}#", DataType = GridDataType.Number.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Plan G/V/CBM", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txtPG\" MaxLength=\"7\" value=\"#=PG#\" style=\"width:28%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />/<input type=\"text\" id=\"txtPV\" MaxLength=\"9\" value=\"#=PV#\" style=\"width:28%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />/<input type=\"text\" id=\"txtPCBM\" MaxLength=\"9\" value=\"#=PCBM#\" style=\"width:28%;\"  onkeyup=\"fn_CheckNum(this);fn_Cal_GVCBMOnOLC(this);\" onblur=\"fn_Cal_GVCBMOnOLC(this);fn_ResetOLCPcs(this);\" />#}else{##=PlanG_V_CBM##}#", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.NestedColumn.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "CTMSNo", Title = "CTMSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBOffPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo==0){#<input type=\"hidden\" name=\"AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" readonly />#}else{#<input type=\"hidden\" name=\"AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_ML_#=CarrierCode#_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" style=\"display:none;\" readonly />#}#", DataType = GridDataType.String.ToString(), Width = 75, Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "IsCTM", Title = "Charges", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" onclick=\"fn_GetCTMChargeDetails(#=AWBSNo#,#=CTMSNo#,this,2);\" title=\"#=ChargesRemarks#\">#}#", Filterable = "false" });
                    g.NestedColumn.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo==0){#<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #}else{##}#", DataType = GridDataType.String.ToString(), Width = 35, Filterable = "false" });
                    //g.NestedColumn.Add(new GridColumn { Field = "ULDType", Title = "ULD Type", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    // g.NestedColumn.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "CarrierCode", Value = CarrierCode });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightRoute", Value = FlightRoute });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OffloadType", Value = OffloadType });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "AWBNo", Value = AWBNo });
                    //g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OriginCity", Value = OriginCity });
                    //g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    // g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "ULDStockSNo", Value =ULDStockSNo });

                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateStopOverFlightULDGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 100;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DefaultPageSize = 1000;
                    g.DataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetSOFlightULDGridData";
                    g.PrimaryID = "ULDStockSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "Stop Over Cargo";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsShowEdit = false;
                    g.IsSaveChanges = false;
                    g.IsAllowedSorting = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;
                    g.IsAllowedScrolling = true;
                    // g.ParentSuccessGrid = "AddScroll";
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" />#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"   onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" /># } else{##} #", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginCity", Title = "Origin City", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Destination City", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "FlightSNo", Value = FlightSNo });

                    //#region Nested Grid Section

                    g.NestedPrimaryID = "AWBSno";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDStockSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    //  g.IsNestedAllowedFiltering = false;
                    g.SuccessGrid = "fnHideBulk";
                    g.IsNestedAllowedSorting = false;
                    g.NestedDataSoruceUrl = "Services/FlightControl/FlightControlService.svc/GetSOFlightULDShipGridData";
                    g.NestedColumn = new List<GridColumn>();

                    //g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==1){#<input type=\"checkbox\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==2){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label>X</label>#}#", DataType = GridDataType.String.ToString()});
                    g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString() });
                    //g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:50%;\" onkeyup=\"fn_CalculateGVCBM(this);\" />#}else{##=PlannedPieces##}#", DataType = GridDataType.Number.ToString()});
                    //g.NestedColumn.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:28%;\"  onkeyup=\"return fn_CheckNum(this);\" />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" style=\"width:28%;\"  onkeyup=\"return fn_CheckNum(this);\" />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:28%;\"  onkeyup=\"return fn_CheckNum(this);\" />#}else{##=PlanG_V_CBM##}#", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString() });
                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightSNo", Value = FlightSNo });
                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateFlightArrivalGrid(StringBuilder Container, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string FlightStatus = "", string LoggedInCity = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/getFlightArrivalGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Flight Arrival";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = true;
                    g.IsRowDataBound = false;
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = "FlightArrival";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString(), Width = 90 });

                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "FlightRoute", IsLocked = false, Title = "Flight Route ", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "BoardingPoint", IsLocked = false, Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ETD", IsLocked = false, Title = "ETD", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "EndPoint", Title = "End Point", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "DAY", Title = "Day", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "ACType", Title = "A/C Type", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "CAO", Title = "CAO", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "FlightStatus", Title = "Flight Status", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "ReceivedMessage", Title = "RCD Message", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "BookedGrossWeight", Title = "BookedGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "BookedVolumeWeight", Title = "BookedVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "BookedCBMWeight", Title = "BookedCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AvilableVolumeWeight", Title = "AvilableVolumeWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AvilableGrossWeight", Title = "AvilableGrossWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AvilableCBMWeight", Title = "AvilableCBMWeight", DataType = GridDataType.Decimal.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightStatus", Value = FlightStatus });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateFlightArrivalAWBGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalAWBGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Flight Arrival";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = true;
                    g.IsRowDataBound = false;
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = "FlightArrivalAWBDetails";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.Decimal.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 60 });
                    // g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Template = " <select id=\"txtPriority\" ></select><input type=\"hidden\" value=\"#=Priority#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD Type", Template = " <select id=\"SULDType\" ></select><input type=\"hidden\" value=\"#=ULDType#\"/>", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDGroupNo", Title = "Group No", Template = "<input type=\"text\" id=\"txt_ULDGroupNo\" value=\"#=ULDGroupNo#\" style=\"width:30px;\"  onkeyup=\"return fn_CheckNum(this);\"  />", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightSNo", Value = FlightSNo });

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveNILMenifest(string GroupFlightSNo, string FlightOrigin, string FlightDestination, string FlightStatus, string RegistrationNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@GroupFlightSNo", GroupFlightSNo), new SqlParameter("@FlightOrigin", FlightOrigin), new SqlParameter("@FlightDestination", FlightDestination), new SqlParameter("@FlightStatus", FlightStatus), new SqlParameter("@RegistrationNo", RegistrationNo), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateNILManifest", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateTransferFlight(string OLDGroupFlightSNo, string NewDailyFlightSno, string OFLD_AWBSNo,
        string TR_AWBSNo, string TR_UldStockSNo, string OFLD_UldStockSNo, int ProcessType)//1- for transfer offload and create Nill,2-Only Transfer 
        {
            SqlParameter[] Parameters = { new SqlParameter("@OLDGroupFlightSNo", OLDGroupFlightSNo), new SqlParameter("@NewDailyFlightSno", NewDailyFlightSno), new SqlParameter("@OFLD_AWBSNo", OFLD_AWBSNo), new SqlParameter("@TR_AWBSNo", TR_AWBSNo), new SqlParameter("@TR_UldStockSNo", TR_UldStockSNo), new SqlParameter("@OFLD_UldStockSNo", OFLD_UldStockSNo), new SqlParameter("@ProcessType", ProcessType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateFCTransferFlight", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetWMSFlightAWBGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetListWMSFlightAWB";

                string filters = GridFilter.ProcessFilters<WMSFlightAWBGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightAWBList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightAWBGridData
                {
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"]),
                    ULDNo = Convert.ToString(e["ULDNo"]),
                    SNo = Convert.ToInt64(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),
                    Priority = e["Priority"].ToString(),
                    Status = e["Status"].ToString(),
                    isSelect = Convert.ToBoolean(e["isSelect"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    PCBMW = Convert.ToDecimal(e["PCBMW"]),
                    PGW = Convert.ToDecimal(e["PGW"]),
                    PVW = Convert.ToDecimal(e["PVW"]),
                    ULDGroupNo = e["ULDGroupNo"].ToString(),
                    ULDType = e["ULDType"].ToString(),
                    isPayment = Convert.ToBoolean(e["isPayment"]),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    Remarks = Convert.ToString(e["Remarks"]),
                    IsManifested = Convert.ToInt32(e["IsManifested"]),
                    IsBUP = Convert.ToBoolean(e["IsBUP"]),
                    ULDStockSNo = Convert.ToInt64(e["ULDStockSNo"]),
                    hdnTotalPieces = Convert.ToInt64(e["hdnTotalPieces"]),
                    WHLocation = e["WHLocation"].ToString(),
                    ULDCount = e["ULDCount"].ToString(),
                    RowNum = Convert.ToInt64(e["RowNum"]),
                    Block = Convert.ToInt16(e["Block"]),
                    FBLAWBSNo = Convert.ToInt32(e["FBLAWBSNo"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString()
                    // ProcessStatus = Convert.ToString(1)

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightAWBList.AsQueryable().ToList(),
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
        public DataSourceResult GetULDType(string DailyFlightSNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter objParam = new SqlParameter("@DailyFlightSNo", DailyFlightSNo);
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightULDType", objParam);
                var wmsULDTypeList = ds.Tables[0].AsEnumerable().Select(e => new ULDTypeData
                {
                    // SNo = Convert.ToInt64(e["SNo"]),
                    ULDName = Convert.ToString(e["ULDName"])

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsULDTypeList.AsQueryable().ToList(),

                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetOSCLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetOSCFlightLying";

                string filters = GridFilter.ProcessFilters<WMSLyingListGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsLyingList = ds.Tables[0].AsEnumerable().Select(e => new WMSLyingListGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    OLCPieces = Convert.ToDecimal(e["OLCPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),
                    Status = e["Status"].ToString(),
                    isSelect = Convert.ToBoolean(e["isSelect"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    DestinationCity = e["DestinationCity"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    OffloadStatus = e["OffloadStatus"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    ULDGroupNo = e["ULDGroupNo"].ToString(),
                    ULDType = e["ULDType"].ToString(),
                    Priority = e["Priority"].ToString(),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsLyingList.AsQueryable().ToList(),
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

        public DataSourceResult GetLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter, string CurrentFlightSno)
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

                ProcName = "GetListWMSFlightLying";

                string filters = GridFilter.ProcessFilters<WMSLyingListGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@CurrentFlightSno", Convert.ToInt32(CurrentFlightSno)), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsLyingList = ds.Tables[0].AsEnumerable().Select(e => new WMSLyingListGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    OLCPieces = Convert.ToDecimal(e["OLCPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),

                    Status = e["Status"].ToString(),
                    isSelect = Convert.ToBoolean(e["isSelect"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    DestinationCity = e["DestinationCity"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    OffloadStatus = e["OffloadStatus"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    ULDGroupNo = e["ULDGroupNo"].ToString(),
                    ULDType = e["ULDType"].ToString(),
                    Priority = e["Priority"].ToString(),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsLyingList.AsQueryable().ToList(),
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
        public DataSourceResult GetPriorityType()
        {
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "select *from vGetPriorityType");

                var wmsPriorityTypeList = ds.Tables[0].AsEnumerable().Select(e => new PriorityTypeData
                {
                    SNo = Convert.ToInt64(e["SNo"]),
                    PriorityCode = Convert.ToString(e["PriorityCode"])

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsPriorityTypeList.AsQueryable().ToList(),
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveLyingInformation(List<LyingInformation> LyingListInfo)
        {
            DataTable dtLyingListInfo = CollectionHelper.ConvertTo(LyingListInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramLyingListInfo = new SqlParameter();
            paramLyingListInfo.ParameterName = "@LyingListInfo";
            paramLyingListInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingListInfo.Value = dtLyingListInfo;
            DataSet ds = new DataSet();
            DataSet ds1 = new DataSet();
            SqlParameter[] Parameters = { paramLyingListInfo, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveLyingListInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string MoveToLyingList(List<MoveToLying> LIInfo, Int64 FlightSNo)
        {
            DataTable dtLIInfo = CollectionHelper.ConvertTo(LIInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramLIInfo = new SqlParameter();
            paramLIInfo.ParameterName = "@PreManifestInfo";
            paramLIInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLIInfo.Value = dtLIInfo;
            DataSet ds = new DataSet();
            DataSet ds1 = new DataSet();
            SqlParameter[] Parameters = { paramLIInfo, new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spMoveToLyingList", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SavePreMenifestInformation(List<LIInfo> LIInfo, List<LyingInformation> LyingInfo, List<LyingInformation> OSCLyingInfo, Int64 FlightSNo, string RegistrationNo)
        {

            DataTable dtLIInfo = CollectionHelper.ConvertTo(LIInfo, "");
            DataTable dtLyingInfo = CollectionHelper.ConvertTo(LyingInfo, "");
            DataTable dtOSCLyingInfo = CollectionHelper.ConvertTo(OSCLyingInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramLIInfo = new SqlParameter();
            paramLIInfo.ParameterName = "@PreManifestInfo";
            paramLIInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLIInfo.Value = dtLIInfo;
            SqlParameter paramLyingInfo = new SqlParameter();
            paramLyingInfo.ParameterName = "@LyingInfo";
            paramLyingInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingInfo.Value = dtLyingInfo;
            SqlParameter paramOSCLyingInfo = new SqlParameter();
            paramOSCLyingInfo.ParameterName = "@OSCLyingInfo";
            paramOSCLyingInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSCLyingInfo.Value = dtOSCLyingInfo;
            DataSet ds = new DataSet();
            DataSet ds1 = new DataSet();
            SqlParameter[] Parameters = { paramLIInfo, paramLyingInfo, paramOSCLyingInfo, new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@RegistrationNo", RegistrationNo), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "savePreManifestInfo", Parameters);

                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (msg == "0")
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 35, true, null);  //update subprocess for Loading Instruction
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 35, false, null);
                }

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode, string ATDDate, string ATDTime, bool IsExcludeFromFFM)
        {
            DataTable dtBulkShipmentInfo = CollectionHelper.ConvertTo(BulkShipmentInfo, "");
            DataTable dtIntectShipmentInfo = CollectionHelper.ConvertTo(IntectShipmentInfo, "");
            DataTable dtLyingBulkShipmentInfo = CollectionHelper.ConvertTo(LyingBulkShipmentInfo, "");
            DataTable dtLyingIntectShipmentInfo = CollectionHelper.ConvertTo(LyingIntectShipmentInfo, "");
            DataTable dtOSCLyingBulkShipmentInfo = CollectionHelper.ConvertTo(OSCLyingBulkShipmentInfo, "");
            DataTable dtOSCLyingIntectShipmentInfo = CollectionHelper.ConvertTo(OSCLyingIntectShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramBulkShipmentInfo = new SqlParameter();
            paramBulkShipmentInfo.ParameterName = "@BulkShipmentInfo";
            paramBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramBulkShipmentInfo.Value = dtBulkShipmentInfo;

            SqlParameter paramIntectShipmentInfo = new SqlParameter();
            paramIntectShipmentInfo.ParameterName = "@IntectShipmentInfo";
            paramIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramIntectShipmentInfo.Value = dtIntectShipmentInfo;

            SqlParameter paramLyingBulkShipmentInfo = new SqlParameter();
            paramLyingBulkShipmentInfo.ParameterName = "@LyingBulkShipmentInfo";
            paramLyingBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingBulkShipmentInfo.Value = dtLyingBulkShipmentInfo;

            SqlParameter paramLyingIntectShipmentInfo = new SqlParameter();
            paramLyingIntectShipmentInfo.ParameterName = "@LyingIntectShipmentInfo";
            paramLyingIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingIntectShipmentInfo.Value = dtLyingIntectShipmentInfo;

            SqlParameter paramOSCLyingBulkShipmentInfo = new SqlParameter();
            paramOSCLyingBulkShipmentInfo.ParameterName = "@OSCLyingBulkShipmentInfo";
            paramOSCLyingBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSCLyingBulkShipmentInfo.Value = dtOSCLyingBulkShipmentInfo;

            SqlParameter paramOSCLyingIntectShipmentInfo = new SqlParameter();
            paramOSCLyingIntectShipmentInfo.ParameterName = "@OSCLyingIntectShipmentInfo";
            paramOSCLyingIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSCLyingIntectShipmentInfo.Value = dtOSCLyingIntectShipmentInfo;

            SqlParameter[] Parameters = { paramBulkShipmentInfo, paramIntectShipmentInfo, paramLyingBulkShipmentInfo, paramLyingIntectShipmentInfo, paramOSCLyingBulkShipmentInfo, paramOSCLyingIntectShipmentInfo, new SqlParameter("@FlightType", FlightType), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@RegistrationNo", RegistrationNo), new SqlParameter("@mode", mode), new SqlParameter("@ATDDate", ATDDate), new SqlParameter("@ATDTime", ATDTime), new SqlParameter("@IsExcludeFromFFM", IsExcludeFromFFM), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

            DataSet ds = new DataSet();
            DataSet ds1 = new DataSet();
            try
            {

                // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestInfo_new", paramBulkShipmentInfo, paramIntectShipmentInfo, paramMode);
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestInfo", Parameters);
                //try
                //{
                //    if (mode.ToUpper() == "SAVEANDCLOSE")
                //    {
                //      //  SendFSU(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString(), Convert.ToDateTime(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightDate"].ToString()), ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString().Split('-')[0], ds.Tables[ds.Tables.Count - 2].Rows[0]["DestinationCity"].ToString(), "", ds.Tables[ds.Tables.Count - 2].Rows[0]["OriginCity"].ToString());
                //    }
                //}
                //catch(Exception ex)//
                //{

                //}
                ///////////////////////////////Update FlightSubProcessTrans////////////// Created By:: Parvez Khan              
                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (msg == "0?0")
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 34, true, null);
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 34, false, null);
                }
                ////////////////////////////////////////////////////////////////////////
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveGatePass(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, int FlightSNo, int GatePassSNo)
        {
            DataTable dtBulkShipmentInfo = CollectionHelper.ConvertTo(BulkShipmentInfo.Where(x => x.isBulk == true).ToList(), "");
            DataTable dtIntectShipmentInfo = CollectionHelper.ConvertTo(IntectShipmentInfo.Where(x => x.isSelect == true).ToList(), "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramBulkShipmentInfo = new SqlParameter();
            paramBulkShipmentInfo.ParameterName = "@BulkShipmentInfo";
            paramBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramBulkShipmentInfo.Value = dtBulkShipmentInfo;

            var ULDSNo = String.Join(",", IntectShipmentInfo.Where(x => x.isSelect == true).Select(x => x.ULDStockSNo));
            try
            {
                SqlParameter[] Parameters = { paramBulkShipmentInfo, new SqlParameter("@PassGatePassSNo", GatePassSNo), new SqlParameter("@DailyFlightSNo", FlightSNo), new SqlParameter("@ULDSNo", ULDSNo), new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                //int result = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "spSaveGatePass", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSaveGatePass", Parameters);
                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                //return result.ToString();

                //DataSet ds = new DataSet();
                //DataSet ds1 = new DataSet();
                //try
                //{

                //    // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestInfo_new", paramBulkShipmentInfo, paramIntectShipmentInfo, paramMode);
                //    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveGatePass", Parameters);
                //    //try
                //    //{
                //    //    if (mode.ToUpper() == "SAVEANDCLOSE")
                //    //    {
                //    //      //  SendFSU(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString(), Convert.ToDateTime(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightDate"].ToString()), ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString().Split('-')[0], ds.Tables[ds.Tables.Count - 2].Rows[0]["DestinationCity"].ToString(), "", ds.Tables[ds.Tables.Count - 2].Rows[0]["OriginCity"].ToString());
                //    //    }
                //    //}
                //    //catch(Exception ex)//
                //    //{

                //    //}
                //    ///////////////////////////////Update FlightSubProcessTrans////////////// Created By:: Parvez Khan              
                //    var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                //    if (msg == "0?0")
                //    {
                //        CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 34, true, null);
                //    }
                //    else
                //    {
                //        CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 34, false, null);
                //    }
                //    ////////////////////////////////////////////////////////////////////////
                //    return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SavePMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode)
        {
            DataTable dtBulkShipmentInfo = CollectionHelper.ConvertTo(BulkShipmentInfo, "");
            DataTable dtIntectShipmentInfo = CollectionHelper.ConvertTo(IntectShipmentInfo, "");
            DataTable dtLyingBulkShipmentInfo = CollectionHelper.ConvertTo(LyingBulkShipmentInfo, "");
            DataTable dtLyingIntectShipmentInfo = CollectionHelper.ConvertTo(LyingIntectShipmentInfo, "");
            DataTable dtOSCLyingBulkShipmentInfo = CollectionHelper.ConvertTo(OSCLyingBulkShipmentInfo, "");
            DataTable dtOSCLyingIntectShipmentInfo = CollectionHelper.ConvertTo(OSCLyingIntectShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramBulkShipmentInfo = new SqlParameter();
            paramBulkShipmentInfo.ParameterName = "@BulkShipmentInfo";
            paramBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramBulkShipmentInfo.Value = dtBulkShipmentInfo;

            SqlParameter paramIntectShipmentInfo = new SqlParameter();
            paramIntectShipmentInfo.ParameterName = "@IntectShipmentInfo";
            paramIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramIntectShipmentInfo.Value = dtIntectShipmentInfo;

            SqlParameter paramLyingBulkShipmentInfo = new SqlParameter();
            paramLyingBulkShipmentInfo.ParameterName = "@LyingBulkShipmentInfo";
            paramLyingBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingBulkShipmentInfo.Value = dtLyingBulkShipmentInfo;

            SqlParameter paramLyingIntectShipmentInfo = new SqlParameter();
            paramLyingIntectShipmentInfo.ParameterName = "@LyingIntectShipmentInfo";
            paramLyingIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramLyingIntectShipmentInfo.Value = dtLyingIntectShipmentInfo;

            SqlParameter paramOSCLyingBulkShipmentInfo = new SqlParameter();
            paramOSCLyingBulkShipmentInfo.ParameterName = "@OSCLyingBulkShipmentInfo";
            paramOSCLyingBulkShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSCLyingBulkShipmentInfo.Value = dtOSCLyingBulkShipmentInfo;

            SqlParameter paramOSCLyingIntectShipmentInfo = new SqlParameter();
            paramOSCLyingIntectShipmentInfo.ParameterName = "@OSCLyingIntectShipmentInfo";
            paramOSCLyingIntectShipmentInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramOSCLyingIntectShipmentInfo.Value = dtOSCLyingIntectShipmentInfo;

            SqlParameter[] Parameters = { paramBulkShipmentInfo, paramIntectShipmentInfo, paramLyingBulkShipmentInfo, paramLyingIntectShipmentInfo, paramOSCLyingBulkShipmentInfo, paramOSCLyingIntectShipmentInfo, new SqlParameter("@FlightType", FlightType), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@RegistrationNo", RegistrationNo), new SqlParameter("@mode", mode), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

            DataSet ds = new DataSet();
            DataSet ds1 = new DataSet();
            try
            {

                // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestInfo_new", paramBulkShipmentInfo, paramIntectShipmentInfo, paramMode);
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "savePManifestInfo", Parameters);
                //try
                //{
                //    if (mode.ToUpper() == "SAVEANDCLOSE")
                //    {
                //      //  SendFSU(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString(), Convert.ToDateTime(ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightDate"].ToString()), ds.Tables[ds.Tables.Count - 2].Rows[0]["FlightNo"].ToString().Split('-')[0], ds.Tables[ds.Tables.Count - 2].Rows[0]["DestinationCity"].ToString(), "", ds.Tables[ds.Tables.Count - 2].Rows[0]["OriginCity"].ToString());
                //    }
                //}
                //catch(Exception ex)//
                //{

                //}
                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (msg == "0?0")
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 33, true, null);
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(FlightSNo, 6, 33, false, null);
                }
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //////
        public void SendFSU(string FlightNo, DateTime FlightDate, string CarrierCode = "", string Destination = "", string MessageName = "", string origin = "")
        {
            try
            {
                // DataTable dtedi = GetMessageList(CarrierCode, Destination, MessageName);
                EDICommon edicom = new EDICommon();

                FFMManagement ffm = new FFMManagement();
                DataTable dtedimessage = new DataTable();
                DataTable dtediffm = GetMessageList(CarrierCode, Destination, "FFM");
                ffm.GenerateFlightManifest(FlightDate, FlightNo, "5");

                var ediFile = new EDIFileTransmitter();
                if (ffm.FFMTable != null && ffm.FFMTable.Rows.Count > 0)
                {
                    for (int i = 0; i < ffm.FFMTable.Rows.Count; i++)
                    {
                        ediFile.EmailFrom = "admin";
                        ediFile.ManuallyRead(ffm.FFMTable.Rows[i]["XMLFile"].ToString());

                        //edicom.UploadFileOnFtp(ffm.FFMTable.Rows[i]["XMLFile"].ToString());
                        edicom.SendMailonSitaAndEmailAddress("", ffm.FFMTable.Rows[i]["XMLFile"].ToString(), "nGen - System Generated Message", Convert.ToString(dtediffm.Rows[0]["EmailAddress"]) == "" ? "rvig@cargoflash.com,hmishra@cargoflash.com" : Convert.ToString(dtediffm.Rows[0]["EmailAddress"]), "");
                        var dtupload = edicom.MakeEdiMessageCountTable();

                        string strSitaAddress = dtediffm.Rows[0]["SitaAddress"].ToString();
                        string strEmailAddress = dtediffm.Rows[0]["EmailAddress"].ToString();
                        var messageformat = edicom.MakeMailMessageFormat(strSitaAddress, string.Empty, string.Empty);
                        var strfmessageText = messageformat + ffm.FFMTable.Rows[i]["XMLFile"].ToString().Replace("<br/>", "\r\n").Replace(

                                                "\r\n", Environment.NewLine);
                        DataRow dataRow = dtupload.NewRow();

                        //  SNo,FlightNo,FlightDate,OriginCity,DestinationCity
                        dataRow["FlightNo"] = FlightNo;
                        dataRow["UpdatedOn"] = DateTime.Now;
                        dataRow["CarrierCode"] = CarrierCode;
                        dataRow["FlightDate"] = FlightDate;
                        dataRow["FlightOrigin"] = origin;
                        dataRow["FlightDestination"] = Destination;
                        dataRow["CityCode"] = origin;
                        dataRow["MovementType"] = 2;
                        dataRow["IsUploaded"] = 1;
                        dataRow["SentAddress"] = strSitaAddress;
                        dataRow["MessageType"] = "FFM";
                        dataRow["GeneratedXml"] = strfmessageText;
                        dataRow["SentAddress"] = strSitaAddress;
                        dataRow["UpdateBy"] = 2;
                        //
                        dtupload.Rows.Add(dataRow);
                        edicom.InsertRecordMessagecount(dtupload);
                        //
                    }
                }

                FWBManagement fwb = new FWBManagement();
                fwb.MakeFwbFile("7", string.Empty, FlightNo, FlightDate, string.Empty);

                if (fwb.FwbMessageTable != null)
                {
                    dtedimessage.Merge(fwb.FwbMessageTable);
                }

                FSUManagement fsu = new FSUManagement();

                fsu.GenerateFsuMessage(string.Empty, string.Empty, FlightNo, String.Empty, FlightDate, "6", origin);
                if (fsu.FsuMessageTable != null)
                    dtedimessage.Merge(fsu.FsuMessageTable);
                FHLManagement fhl = new FHLManagement();
                fhl.EmailFrom = "Admin";

                fhl.GenerateHouseAwb(string.Empty, FlightNo, FlightDate, origin, "2", "2", origin);

                if (fhl.FhlTable != null)
                    dtedimessage.Merge(fhl.FhlTable);
                if (dtedimessage.Rows.Count > 0)
                {

                    for (int j = 0; j < dtedimessage.Rows.Count; j++)
                    {
                        DataTable dtedifsu = GetMessageList(CarrierCode, Destination, dtedimessage.Rows[j]["EDIMessage"].ToString());
                        var ediFilefsu = new EDIFileTransmitter();
                        if (dtedifsu != null && dtedifsu.Rows.Count > 0)
                        {
                            ediFilefsu.ManuallyRead(dtedimessage.Rows[j]["XMLFile"].ToString());

                            edicom.UploadFileOnFtp(dtedimessage.Rows[j]["XMLFile"].ToString());
                            edicom.SendMailonSitaAndEmailAddress("", dtedimessage.Rows[j]["XMLFile"].ToString(), "nGen - System Generated Message", Convert.ToString(dtedifsu.Rows[0]["EmailAddress"]) == "" ? "rvig@cargoflash.com" : Convert.ToString(dtedifsu.Rows[0]["EmailAddress"]), "");

                            var dtupload = edicom.MakeEdiMessageCountTable();

                            string strSitaAddress = dtedifsu.Rows[0]["SitaAddress"].ToString();
                            string strEmailAddress = dtedifsu.Rows[0]["EmailAddress"].ToString();
                            var messageformat = edicom.MakeMailMessageFormat(strSitaAddress, string.Empty, string.Empty);
                            var strfmessageText = messageformat + dtedimessage.Rows[j]["XMLFile"].ToString().Replace("<br/>", "\r\n").Replace(

                                                    "\r\n", Environment.NewLine);
                            DataRow dataRow = dtupload.NewRow();
                            dataRow["FlightNo"] = FlightNo;
                            dataRow["UpdatedOn"] = DateTime.Now;
                            dataRow["AWBNo"] = dtedimessage.Rows[j]["AWBNo"];
                            dataRow["CarrierCode"] = CarrierCode;
                            dataRow["FlightDate"] = FlightDate;
                            dataRow["FlightOrigin"] = origin;
                            dataRow["FlightDestination"] = Destination;
                            dataRow["CityCode"] = origin;
                            dataRow["MovementType"] = 2;
                            dataRow["IsUploaded"] = 1;
                            dataRow["SentAddress"] = strSitaAddress;
                            dataRow["MessageType"] = dtedimessage.Rows[j]["EDIMessage"].ToString();
                            dataRow["GeneratedXml"] = strfmessageText;
                            dataRow["SentAddress"] = strSitaAddress;
                            dataRow["UpdateBy"] = 2;
                            dtupload.Rows.Add(dataRow);
                            //
                            edicom.InsertRecordMessagecount(dtupload);
                        } //
                    }
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        ///////////
        public DataTable GetMessageList(string CarrierCode, string Destination, string MessageName)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@Destination", Destination), new SqlParameter("@MessageName", MessageName) };
                dt = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "EdiAutomaticConfig", Parameters).Tables[0];
                return dt;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public Stream GetPreReport(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "PreManifestReport", Parameters);
                byte[] resultBytes = Encoding.UTF8.GetBytes(GetReportHTML(ds));
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultBytes);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public Stream GetLIReport(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "LIReport", Parameters);
                byte[] resultBytes = Encoding.UTF8.GetBytes(GetLIReportHTML(ds));
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultBytes);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

            //returnCargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public string GetReportHTML(DataSet ds)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                    tbl.Append("<tr align=\"center\"><td colspan=\"9\" ><h6>PRE MANIFEST</h6></td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td><td colspan=\"5\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Flight Date</td><td align=\"left\" colspan=\"2\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"3\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td colspan=\"3\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"5\" style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">Priority</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");

                    DataTable dtDistinctULD = null;
                    dtDistinctULD = ds.Tables[0].DefaultView.ToTable(true, "ULDType");
                    foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                    {
                        int pieces = 0;
                        decimal Weight = 0.00M;

                        DataRow[] drRpt = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "'");
                        DataRow[] drLocal = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='LOCAL'");
                        DataRow[] drTrans = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='TRANSIT'");

                        if (drRpt.Length > 0)
                        {
                            foreach (DataRow dr in drRpt)
                            {
                                pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                                Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));

                            }
                            tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"9\" >" + drDistinctULD["ULDType"] + "</td></tr>");
                            if (drLocal.Length > 0)
                            {
                                int j = 1;
                                foreach (DataRow dr in drLocal)
                                {
                                    if (j == 1)
                                    {

                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/LOCAL CARGO</td></tr>");
                                    }
                                    tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\"></td></tr>");
                                    j++;
                                }
                            }
                            if (drTrans.Length > 0)
                            {
                                int k = 1;
                                foreach (DataRow dr in drTrans)
                                {
                                    if (k == 1)
                                    {
                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                                    }
                                    tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\"></td></tr>");
                                    k++;
                                }
                            }
                            tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


                        }

                    }
                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"11\"><b>No of AWB : " + ds.Tables[1].Rows[0]["AWBCount"].ToString() + "</b></td></tr>");
                    tbl.Append("<tr align=\"right\"  class=\"grdTableRow\"  id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
                    tbl.Append("</table>");
                }

                return tbl.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetLIReportHTML(DataSet ds)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                    tbl.Append("<tr align=\"center\"><td colspan=\"11\" ><h6>LOADING INSTRUCTION</h6></td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td><td colspan=\"7\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\" >Flight Date</td><td align=\"left\" colspan=\"2\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"4\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td colspan=\"4\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"7\"  style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\">Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">SHC</td><td colspan=\"1\" class=\"grdTableHeader\">Priority</td><td colspan=\"1\" class=\"grdTableHeader\">Location</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");

                    DataTable dtDistinctULD = null;
                    dtDistinctULD = ds.Tables[0].DefaultView.ToTable(true, "ULDType");
                    foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                    {
                        int pieces = 0;
                        decimal Weight = 0.00M;

                        DataRow[] drRpt = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "'");
                        DataRow[] drLocal = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='LOCAL'");
                        DataRow[] drTrans = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='TRANSIT'");

                        if (drRpt.Length > 0)
                        {
                            foreach (DataRow dr in drRpt)
                            {
                                pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                                Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));

                            }
                            tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"11\" >" + drDistinctULD["ULDType"] + "</td></tr>");
                            if (drLocal.Length > 0)
                            {
                                int j = 1;
                                foreach (DataRow dr in drLocal)
                                {
                                    if (j == 1)
                                    {

                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"11\" >COMMERCIAL CARGO/LOCAL CARGO</td></tr>");
                                    }
                                    tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["WHLocation"] + "</td><td colspan=\"1\" >" + dr["Remarks"] + "</td><td colspan=\"1\"></td></tr>");
                                    j++;
                                }
                            }
                            if (drTrans.Length > 0)
                            {
                                int k = 1;
                                foreach (DataRow dr in drTrans)
                                {
                                    if (k == 1)
                                    {
                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"10\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                                    }
                                    tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["WHLocation"] + "</td><td colspan=\"1\" >" + dr["Remarks"] + "</td><td colspan=\"1\"></td></tr>");
                                    k++;
                                }
                            }
                            tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


                        }

                    }
                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"11\"><b>No of AWB : " + ds.Tables[1].Rows[0]["AWBCount"].ToString() + "</b></td></tr>");
                    tbl.Append("<tr align=\"right\"  class=\"grdTableRow\"  id=\"PrintTr\"><td colspan=\"11\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
                    tbl.Append("</table>");
                }

                return tbl.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        // used in gatepass
        public string GetManifestReport(string DailyFlightSNo, string Type = "N", int GatePassSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@Type", Type), new SqlParameter("@GatePassSNo", GatePassSNo), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ManifestReportForGatePass", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //byte[] resultBytes = Encoding.UTF8.GetBytes(GetManifestReportHTML(ds, Type, GatePassSNo));
            //WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            //return new MemoryStream(resultBytes);

        }
        public string GetFlightData(string DailyFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /*
        public string GetManifestReportHTML(DataSet ds, string Type)
        {
            if (ds.Tables.Count == 1)
            {
                return ds.Tables[0].Rows[0][0].ToString();
            }
            else
            {
                int IsPharrma = 0;
                StringBuilder tbl = new StringBuilder();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                    //tbl.Append("<tr align=\"center\"><td colspan=\"11\" ><h6>CARGO MANIFEST I.C.A.O ANNEX 9 APPENDIX 3</h6></td></tr> ");
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
                        {
                            IsPharrma = (Convert.ToInt32(dr["IsPharma"]));
                            break;
                        }
                    }
                    if (IsPharrma == 1)
                    {
                        tbl.Append("<tr align='left'><td colspan='2' rowspan='3' align='left' style=\"padding: 2px 0px 0px 2px;\"><img src='Logo/CEIV_stamp.jpg' width='120px' height='75px' style='background-color: rgba(0,0,0,.5)'/></td><td colspan='3' align='center' style='font: bold;'><h2>CARGO MANIFEST</h2></td><td colspan='5'>&nbsp;</td></tr>");
                        tbl.Append("<tr><td align='center' colspan='3'>ICAO ANNEX 9 APPENDIX 3</td><td colspan='5'>&nbsp;</td></tr>");
                    }
                    else
                    {
                        tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>CARGO MANIFEST</h2> </td></tr> ");
                        tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
                    }


                    //tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>CARGO MANIFEST</h2> </td></tr> ");
                    //tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td><td colspan=\"2\" align=\"left\" >Marks of Nationality/Regn No:</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["RegistrationNo"].ToString() + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"left\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Flight Date</td><td align=\"left\" colspan=\"2\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"5\"></td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
                    tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"7\"  style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">SHC</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");

                    DataTable dtDistinctULD = null;
                    DataTable dtDistinctDestinationCity = null;
                    dtDistinctULD = ds.Tables[0].DefaultView.ToTable(true, "ULDNo");
                    dtDistinctDestinationCity = ds.Tables[0].DefaultView.ToTable(true, "DestinationCity");
                    foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                    {
                        int pieces = 0;
                        decimal Weight = 0.00M;

                        DataRow[] drRpt = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "'");
                        DataRow[] drLocal = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
                        DataRow[] drTrans = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

                        if (drRpt.Length > 0)
                        {
                            foreach (DataRow dr in drRpt)
                            {
                                pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                                Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
                            }

                            tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"9\" >" + drDistinctULD["ULDNo"] + "</td></tr>");
                            if (drLocal.Length > 0)
                            {
                                int j = 1;
                                foreach (DataRow dr in drLocal)
                                {
                                    if (j == 1)
                                    {
                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/LOCAL CARGO</td></tr>");
                                    }
                                    if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
                                    {
                                        tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" ><img src='Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/>" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                                        j++;
                                    }
                                    else
                                    {
                                        tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                                        j++;
                                    }
                                }
                            }
                            if (drTrans.Length > 0)
                            {
                                int k = 1;
                                foreach (DataRow dr in drTrans)
                                {
                                    if (k == 1)
                                    {
                                        tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                                    }
                                    if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
                                    {
                                        tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" ><img src='../../Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/> " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                                        k++;
                                    }
                                    else
                                    {
                                        tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" > " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                                        k++;
                                    }
                                }
                            }
                            tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


                        }

                    }

                    //foreach (DataRow drDistinctULD1 in dtDistinctDestinationCity.Rows)
                    //{
                    //    //foreach (DataRow drDistinctULD1 in dtDistinctULD.Rows)
                    //    //{
                    //        int Totalpieces = 0;
                    //        decimal TotalWeight = 0.00M;

                    //        DataRow[] drRpt = ds.Tables[0].Select("DestinationCity='" + drDistinctULD1["DestinationCity"] + "'");
                    //        //DataRow[] drLocal = ds.Tables[0].Select("ULDNo='" + drDistinctULD1["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
                    //        //DataRow[] drTrans = ds.Tables[0].Select("ULDNo='" + drDistinctULD1["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

                    //        if (drRpt.Length > 0)
                    //        {
                    //            foreach (DataRow dr in drRpt)
                    //            {
                    //                Totalpieces = (Totalpieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : Totalpieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                    //                TotalWeight = (TotalWeight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(TotalWeight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
                    //            }

                    //            tbl.Append("<tr class=\"grdTableRow\"><td colspan=\"2\" align=\"left\"><b>Dest.Totals:</b></td><td align=\"center\">" + +Totalpieces + "</td><td></td><td td colspan=\"1\" align=\"center\">" + TotalWeight + "</td><td></td><td></td><td></td><td></td></tr>");
                    //        }
                    //    }

                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td  colspan=\"2\" style=\"border-right: none;\"><b>No of AWB : " + ds.Tables[1].Rows[0]["AWBCount"].ToString() + "</b></td><td colspan=\"2\" style=\"border-left: none;border-right: none\"><b>Total Pieces : " + ds.Tables[1].Rows[0]["TotalPlannedPieces"].ToString() + "</b></td><td colspan=\"7\" style=\"border-left: none;\" ><b>Total Gross Weight  : " + ds.Tables[1].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</b></td></tr>");
                    foreach (DataRow dr1 in dtDistinctDestinationCity.Rows)
                    {

                        /// if (ds.Tables[0].Rows[0]["airlinename"].ToString() == "AIR ARABIA" && ds.Tables[0].Rows[0]["DestinationCity"].ToString() == "DEL")

                        if (ds.Tables[0].Rows[0]["airlinename"].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AirlineName"].ToString().ToLower().Trim() && dr1[0].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AllowedCity"].ToString().ToLower().Trim())
                        {
                            //tbl.Append("<tr align=\"left\"><td colspan=\"11\" >Notes: NOTE:DME <br/> There are no goods on board of the aircraft the import of which to the Customs Union zone is prohibited or restricted such as pharmaceuticals consisting of narcotic <br/>drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");/

                            //tbl.Append("<tr align=\"right\"><td align=\"top\" width=\"10px\">Note:</td><td colspan=\"10\">NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");
                            tbl.Append("<tr style=\"font-weight: bold;\" ><td valign=\"top\" >Note:</td><td colspan=\"8\" align=\"left\" >NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition</td></tr>");


                        }
                    }

                    tbl.Append("<tr align=\"right\"  class=\"grdTableRow\" id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
                    tbl.Append("</table>");
                }
                return tbl.ToString();
            }
           
        }
         */
        // used in gatepass
        public string GetManifestReportHTML(DataSet ds, string Type, int GatePassSNo)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();
                if (ds.Tables.Count == 1)
                {
                    return ds.Tables[0].Rows[0][0].ToString();
                }
                //else if (Type == "N")
                //{
                //    if (ds != null && ds.Tables[0].Rows.Count > 0)
                //    {
                //        tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                //        tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>DELEVERY CARGO/BAGGAGE</h2> </td></tr> ");
                //        tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
                //        tbl.Append("<tr align=\"center\"><td align=\"left\">&nbsp;</td><td align=\"left\">From:</td><td align=\"left\" >" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td align=\"left\" >Time:</td><td align=\"left\" > 10:10:10</td><td align=\"left\">TO</td><td align=\"left\" >" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td align=\"left\">ARR</td><td align=\"left\" >----LT</td></tr>");
                //        tbl.Append("<tr align=\"center\"><td align=\"left\">&nbsp;</td><td align=\"left\">PK-G:</td><td align=\"left\" >HA</td><td align=\"left\" >Airline</td><td align=\"left\" > " + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td><td align=\"left\">ETD</td><td align=\"left\" >" + ds.Tables[0].Rows[0]["ETD"].ToString() + "</td><td align=\"left\">ATA</td><td align=\"left\" >" + ds.Tables[0].Rows[0]["ATA"].ToString() + "</td></tr>");
                //        tbl.Append("<tr align=\"center\"><td class=\"grdTableHeader\">No</td><td colspan=\"2\" class=\"grdTableHeader\"> ULD SERIAL NO</td><td colspan=\"2\" class=\"grdTableHeader\">DESTINATION</td><td colspan=\"2\" class=\"grdTableHeader\">CATEGORY</td><td colspan=\"2\" class=\"grdTableHeader\">WEIGHT</td></tr>");
                //        if (ds != null && ds.Tables[1].Rows.Count > 0)
                //        {
                //            DataTable dtDistinctULD = null;
                //            DataTable dtDistinctDestinationCity = null;
                //            dtDistinctULD = ds.Tables[1].DefaultView.ToTable(true, "ULDNo");
                //            dtDistinctDestinationCity = ds.Tables[1].DefaultView.ToTable(true, "DestinationCity");

                //            int j = 1;
                //            foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                //            {
                //                int pieces = 0;
                //                decimal Weight = 0.00M;

                //                DataRow[] drRpt = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "'");
                //                DataRow[] drLocal = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
                //                DataRow[] drTrans = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

                //                if (drRpt.Length > 0)
                //                {
                //                    foreach (DataRow dr in drRpt)
                //                    {
                //                        pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                //                        Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
                //                    }

                //                    //tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"10\" >" + drDistinctULD["ULDNo"] + "</td></tr>");
                //                    if (drLocal.Length > 0)
                //                    {

                //                        foreach (DataRow dr in drLocal)
                //                        {
                //                            {
                //                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"2\" >" + dr["ULDNo"] + "</td><td colspan=\"2\" >" + dr["DestinationCity"] + "</td><td colspan=\"2\">" + dr["SPHC"] + "</td>" + "</td><td colspan=\"2\" >" + dr["PlannedGrossWeight"] + "</td></tr>");
                //                                j++;
                //                            }
                //                        }
                //                    }
                //                    //if (drTrans.Length > 0)
                //                    //{
                //                    //    int k = 1;
                //                    //    foreach (DataRow dr in drTrans)
                //                    //    {
                //                    //        if (k == 1)
                //                    //        {
                //                    //            //tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                //                    //        }
                //                    //        if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
                //                    //        {
                //                    //            tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" ><img src='../../Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/> " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td>" + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"1\" >" + ds.Tables[0].Rows[0]["AdviceStatusCode"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\"></td><td colspan=\"1\"></td></tr>");
                //                    //            k++;
                //                    //        }
                //                    //        else
                //                    //        {
                //                    //            tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" > " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td>" + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"1\" >" + ds.Tables[0].Rows[0]["AdviceStatusCode"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                //                    //            k++;
                //                    //        }
                //                    //    }
                //                    //}
                //                    //tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"></td>&nbsp;<td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


                //                }

                //            }

                //        }

                //        tbl.Append("</table>");
                //    }
                //    return tbl.ToString();
                //}
                else
                {
                    int IsPharrma = 0;

                    if (ds != null && ds.Tables[0].Rows.Count > 0)
                    {
                        tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"50%\" cellpadding=\"0\" cellspacing=\"0\">");
                        if (ds != null && ds.Tables[1].Rows.Count > 0)
                        {
                            {
                                tbl.Append("<tr align=\"center\"><td style=\"font: bold;\" colspan=\"1\"></td><td colspan=\"8\" style=\"font: bold;'\" ><h2>DELIVERY CARGO/BAGGAGE</h2> </td><td style=\"font: bold;'\" colspan=\"1\" ><h2>" + ds.Tables[0].Rows[0]["GatePassNo"].ToString() + "</h2> </td></tr> ");
                                //tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
                            }
                        }
                        else
                        {
                            tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>DELIVERY CARGO/BAGGAGE</h2> </td></tr> ");
                            //tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
                        }
                        tbl.Append("<tr align=\"right\" style=\"height: 10px;\"><td colspan=\"10\" >&nbsp;</td></tr>");
                        tbl.Append("<tr align=\"center\"><td colspan=\"10\" style=\"font: bold;'\" >");
                        tbl.Append("<table style=\"width: 100%;\"><tbody>");
                        tbl.Append("<tr><td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">FROM: " + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">TIME: " + DateTime.UtcNow.ToString("HH:mm:ss tt") + "</td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">TO: " + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">ARR: </td></tr>");

                        tbl.Append("<tr><td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">PK-G: </td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">AIRLINE: " + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">ETD: " + (ds.Tables[0].Rows[0]["ETD"]) + "</td>");
                        tbl.Append("<td align=\"left\" style=\"font: bold;padding-left: 5px;width: 25%;\">DATE: " + DateTime.UtcNow.ToString("dd/MM/yyyy") + "</td></tr>");

                        tbl.Append("</tr></tbody></table></td>");

                        tbl.Append("<tr align=\"center\"><td colspan=\"2\" class=\"grdTableHeader\">No</td><td colspan=\"2\" class=\"grdTableHeader\"> ULD Serial No</td><td colspan=\"2\" class=\"grdTableHeader\">Category</td><td colspan=\"2\" class=\"grdTableHeader\">Destination</td><td colspan=\"2\" class=\"grdTableHeader\">Weight</td></tr>");


                        if (ds != null && ds.Tables[1].Rows.Count > 0)
                        {

                            DataTable dtDistinctULD = null;
                            DataTable dtDistinctDestinationCity = null;
                            dtDistinctULD = ds.Tables[1].DefaultView.ToTable(true, "ULDNo");
                            dtDistinctDestinationCity = ds.Tables[1].DefaultView.ToTable(true, "DestinationCity");
                            int j = 1;
                            foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                            {
                                int pieces = 0;
                                decimal Weight = 0.00M;

                                DataRow[] drRpt = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "'");
                                DataRow[] drLocal = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
                                DataRow[] drTrans = ds.Tables[1].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

                                if (drRpt.Length > 0)
                                {
                                    foreach (DataRow dr in drRpt)
                                    {
                                        pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                                        Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
                                    }
                                    var AWBULD = "";
                                    if (drDistinctULD["ULDNo"].ToString() == "BULK")
                                        tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"10\" >" + drDistinctULD["ULDNo"] + "</td></tr>");

                                    if (drLocal.Length > 0)
                                    {

                                        foreach (DataRow dr in drLocal)
                                        {
                                            {
                                                if (drDistinctULD["ULDNo"].ToString() == "BULK") { AWBULD = dr["AWBNo"].ToString(); } else { AWBULD = dr["ULDNo"].ToString(); }
                                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"2\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"2\" >" + AWBULD + "</td><td colspan=\"2\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"2\">" + dr["DestinationCity"].ToString() + "</td><td colspan=\"2\">" + dr["PlannedGrossWeight"].ToString() + "</td></tr>");

                                            }
                                        }
                                        j++;
                                    }
                                    if (drTrans.Length > 0)
                                    {
                                        int k = 1;
                                        foreach (DataRow dr in drTrans)
                                        {
                                            if (k == 1)
                                            {
                                                //tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                                            }
                                            if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
                                            {
                                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" ><img src='../../Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/> " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td>" + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"1\" >" + ds.Tables[0].Rows[0]["AdviceStatusCode"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\"></td><td colspan=\"1\"></td></tr>");
                                                k++;
                                            }
                                            else
                                            {
                                                // tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" > " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td>" + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"1\" >" + ds.Tables[0].Rows[0]["AdviceStatusCode"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
                                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"2\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"2\" >" + drDistinctULD["ULDNo"] + "</td><td colspan=\"2\" >" + dr["SPHC"] + "</td>" + "</td><td colspan=\"2\">" + dr["DestinationCity"].ToString() + "</td><td colspan=\"2\">" + dr["PlannedGrossWeight"].ToString() + "</td></tr>");
                                                k++;
                                            }
                                        }
                                    }
                                    //tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"></td>&nbsp;<td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


                                }

                            }
                            //tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td  colspan=\"2\" style=\"border-right: none;\"><b>No of AWB : " + ds.Tables[2].Rows[0]["AWBCount"].ToString() + "</b></td><td colspan=\"4\" style=\"border-left: none;border-right: none\"><b>Total Pieces : " + ds.Tables[2].Rows[0]["TotalPlannedPieces"].ToString() + "</b></td><td colspan=\"7\" style=\"border-left: none;\" ><b>Total Gross Weight  : " + ds.Tables[2].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</b></td></tr>");

                            foreach (DataRow dr1 in dtDistinctDestinationCity.Rows)
                            {

                                /// if (ds.Tables[0].Rows[0]["airlinename"].ToString() == "AIR ARABIA" && ds.Tables[0].Rows[0]["DestinationCity"].ToString() == "DEL")

                                if (ds.Tables[1].Rows[0]["airlinename"].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AirlineName"].ToString().ToLower().Trim() && dr1[0].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AllowedCity"].ToString().ToLower().Trim())
                                {
                                    //tbl.Append("<tr align=\"left\"><td colspan=\"11\" >Notes: NOTE:DME <br/> There are no goods on board of the aircraft the import of which to the Customs Union zone is prohibited or restricted such as pharmaceuticals consisting of narcotic <br/>drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");/

                                    //tbl.Append("<tr align=\"right\"><td align=\"top\" width=\"10px\">Note:</td><td colspan=\"10\">NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");
                                    tbl.Append("<tr style=\"font-weight: bold;\" ><td valign=\"top\" >Note:</td><td colspan=\"8\" align=\"left\" >NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition</td></tr>");


                                }
                            }
                        }
                        else
                        {
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            if (ds != null && ds.Tables[0].Rows.Count > 0) { }
                            else { tbl.Append("<tr><td align=\"center\" colspan=\"9\" style=\"font-size:30px;color:red\">NIL MANIFEST&nbsp;</td></tr>"); }
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");
                            tbl.Append("<tr><td align=\"center\" colspan=\"9\" >&nbsp;</td></tr>");

                        }

                        tbl.Append("<tr align=\"right\" align=\"center\" style=\"height: 50px;\"><td colspan=\"11\" >&nbsp;</td></tr>");
                        tbl.Append("<tr  style=\"height: 50px;\" align=\"center\"><td colspan=\"3\">WAREHOUSE TERMINAL</td><td colspan=\"3\" >OPERATER</td><td colspan=\"4\" >LOAD MASTER</td></tr>");
                        tbl.Append("<tr style=\"height: 50px;\" align=\"center\"><td colspan=\"3\"> ------------</td><td colspan=\"3\" >------------</td><td colspan=\"4\" >------------</td></tr>");
                        tbl.Append("<tr align=\"right\" style=\"height: 50px;\"><td colspan=\"11\" >&nbsp;</td></tr>");

                        tbl.Append("<tr style=\"font-weight: bold;\" ><td valign=\"top\" style=\"padding-left: 20px;\">Note:</td><td colspan=\"8\" align=\"left\" >DOLUES PLT ON AIR SIDE TIME:</td></tr>");
                        tbl.Append("<tr style=\"font-weight: bold;\" ><td valign=\"top\" style=\"padding-left: 20px;\"></td><td colspan=\"8\" align=\"left\" >LD3 ON AIR SIDE TIME:</td></tr>");
                        tbl.Append("<tr align=\"right\" style=\"height: 20px;\"><td colspan=\"11\" >&nbsp;</td></tr>");
                        tbl.Append("<tr style=\"font-weight: bold;\"><td valign=\"top\" style=\"padding-left: 20px;\"></td><td colspan=\"8\" align=\"left\" >CARTS      ON AIR SIDE TIME:</td></tr>");
                        tbl.Append("<tr align=\"right\" style=\"height: 20px;\"><td colspan=\"11\" >&nbsp;</td></tr>");

                        tbl.Append("<tr align=\"right\"  class=\"grdTableRow\" id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
                        tbl.Append("</table>");
                    }
                    return tbl.ToString();
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //// For Manifest

        // used in gatepass
        public DataSourceResult GetManifestULDGridData(String FlightNo, String ProcessStatus, String OriginCity, String DestinationCity, String FlightDate, int GatePassSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetManifestFlightULDForGatePass";

                string filters = GridFilter.ProcessFilters<ManifestULD>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@WhereCondition", filters),
                new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@FlightNo", FlightNo),
                new SqlParameter("@OriginCity", OriginCity),
                new SqlParameter("@DestinationCity", DestinationCity),
                new SqlParameter("@FlightDate", FlightDate),
                new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()),
                new SqlParameter("@GatePassSNo", GatePassSNo),
            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
                {
                    RFSRemarks = e["RFSRemarks"].ToString(),
                    LastPoint = e["LastPoint"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                    MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                    EmptyWeight = Convert.ToString(e["EmptyWeight"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToString(e["GrossWeight"]),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    Status = e["Status"].ToString(),
                    Shipments = Convert.ToInt32(e["Shipments"]),
                    isSelect = Convert.ToInt16(e["isSelect"]),
                    HoldShip = e["HoldShip"].ToString(),
                    IsDisabledULD = Convert.ToBoolean(e["IsDisabledULD"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"])
                });
                
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestULDList.AsQueryable().ToList(),
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

        public DataSourceResult GetSOFlightULDGridData(String FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetSOFlightULD";

                string filters = GridFilter.ProcessFilters<ManifestULD>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsSOFlightULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
                {
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                    MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                    EmptyWeight = Convert.ToString(e["EmptyWeight"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToString(e["GrossWeight"]),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                    OriginCity = e["OriginCity"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString(),
                    // DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),            // Daily Flight Sno
                    Status = e["Status"].ToString(),
                    Shipments = Convert.ToInt32(e["Shipments"]),
                    isSelect = Convert.ToInt16(e["isSelect"]),
                    HoldShip = e["HoldShip"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsSOFlightULDList.AsQueryable().ToList(),
                    // Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
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

        public DataSourceResult GetOSCULDLyingGridData(String OriginCity, String DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string AWBNo, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetOSCLyingULD";

                string filters = GridFilter.ProcessFilters<ManifestULD>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
                {
                    //ChargeCSS = Convert.ToString(e["ChargeCSS"]),
                    //IsCTM = Convert.ToBoolean(e["IsCTM"]),
                    // ChargesRemarks = Convert.ToString(e["ChargesRemarks"]),
                    //  LastPoint = e["LastPoint"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                    MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                    EmptyWeight = Convert.ToString(e["EmptyWeight"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToString(e["GrossWeight"]),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                    // FlightNo = e["FlightNo"].ToString(),
                    // FlightDate = e["FlightDate"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString(),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),            // Daily Flight Sno
                    Status = e["Status"].ToString(),
                    Shipments = Convert.ToInt32(e["Shipments"]),
                    isSelect = Convert.ToInt16(e["isSelect"]),
                    HoldShip = e["HoldShip"].ToString(),
                    RFSRemarks = e["RFSRemarks"].ToString()



                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestULDList.AsQueryable().ToList(),
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
        public DataSourceResult GetMULDLyingGridData(String OriginCity, String DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string AWBNo, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetMLyingULD";

                string filters = GridFilter.ProcessFilters<ManifestULD>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
                {
                    //ChargeCSS = Convert.ToString(e["ChargeCSS"]),
                    //IsCTM = Convert.ToBoolean(e["IsCTM"]),
                    // ChargesRemarks = Convert.ToString(e["ChargesRemarks"]),
                    // LastPoint = e["LastPoint"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                    MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                    EmptyWeight = Convert.ToString(e["EmptyWeight"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToString(e["GrossWeight"]),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                    // FlightNo = e["FlightNo"].ToString(),
                    // FlightDate = e["FlightDate"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString(),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),            // Daily Flight Sno
                    Status = e["Status"].ToString(),
                    Shipments = Convert.ToInt32(e["Shipments"]),
                    isSelect = Convert.ToInt16(e["isSelect"]),
                    HoldShip = e["HoldShip"].ToString(),
                    RFSRemarks = e["RFSRemarks"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestULDList.AsQueryable().ToList(),
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
        // used in gatepass
        public DataSourceResult GetMULDShipmentGridData(string FlightNo, string ProcessStatus, String OriginCity, String DestinationCity, String FlightDate, int GatePassSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetMULDShipmentChildForGatePass";

                string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@DailyFlightSNo", FlightSNo) };
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@FlightNo", FlightNo),
                                            new SqlParameter("@OriginCity", OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity),
                                            new SqlParameter("@FlightDate", FlightDate),
                                            new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) ,                                            
                                            new SqlParameter("@GatePassSNo", GatePassSNo),
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
                {
                    AWBOffPoint = e["AWBOffPoint"].ToString(),
                    RFSRemarks = e["RFSRemarks"].ToString(),
                    ChargeCSS = Convert.ToString(e["ChargeCSS"]),
                    IsCTM = Convert.ToBoolean(e["IsCTM"]),
                    CTMSNo = Convert.ToInt32(e["CTMSNo"]),
                    ChargesRemarks = Convert.ToString(e["ChargesRemarks"]),
                    AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    //Agent = e["Agent"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),
                    Priority = e["Priority"].ToString(),
                    Status = e["Status"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    //  isSelect = Convert.ToBoolean(e["isSelect"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    PGW = Convert.ToDecimal(e["PGW"]),
                    PVW = Convert.ToDecimal(e["PVW"]),
                    PCCBM = Convert.ToDecimal(e["PCCBM"]),
                    IsBulk = Convert.ToInt16(e["IsBulk"]),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    IsPreManifested = Convert.ToBoolean(e["IsPreManifested"]),
                    TotalPPcs = Convert.ToInt64(e["PlannedPieces"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString(),
                    McBookingSNo = Convert.ToInt32(e["McBookingSNo"].ToString())
                    // ULDType = e["ULDType"].ToString()
                    // isPayment = Convert.ToBoolean(e["isPayment"])
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestShipList.AsQueryable().ToList(),
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
        // g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "OriginCity", Value = OriginCity });
        //      g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DestinationCity", Value = DestinationCity });
        public DataSourceResult GetOSCULDLyingShipGridData(string DestinationCity, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetOSCLyingShipmentChild";

                string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
                {
                    //  AWBOffPoint = e["AWBOffPoint"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    ChargeCSS = Convert.ToString(e["ChargeCSS"]),
                    CTMSNo = Convert.ToInt32(e["CTMSNo"]),
                    IsCTM = Convert.ToBoolean(e["IsCTM"]),
                    ChargesRemarks = Convert.ToString(e["ChargesRemarks"]),
                    AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    OLCPieces = Convert.ToDecimal(e["OLCPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),
                    Priority = e["Priority"].ToString(),
                    Status = e["Status"].ToString(),
                    //  isSelect = Convert.ToBoolean(e["isSelect"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    IsBulk = Convert.ToInt16(e["IsBulk"]),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString(),
                    RFSRemarks = e["RFSRemarks"].ToString(),
                    CarrierCode = e["CarrierCode"].ToString()
                    // ULDType = e["ULDType"].ToString()
                    // isPayment = Convert.ToBoolean(e["isPayment"])
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestShipList.AsQueryable().ToList(),
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

        //LoggedInCity = LoggedIn Airport
        public DataSourceResult GetMULDLyingShipGridData(string DestinationCity, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetMLyingShipmentChild";

                string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@FlightRoute", FlightRoute), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@OffloadType", OffloadType), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsManifestShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
                {
                    // AWBOffPoint = e["AWBOffPoint"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    ChargeCSS = Convert.ToString(e["ChargeCSS"]),
                    IsCTM = Convert.ToBoolean(e["IsCTM"]),
                    CTMSNo = Convert.ToInt32(e["CTMSNo"]),
                    ChargesRemarks = Convert.ToString(e["ChargesRemarks"]),
                    AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    OLCPieces = Convert.ToDecimal(e["OLCPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),
                    Priority = e["Priority"].ToString(),
                    Status = e["Status"].ToString(),
                    //  isSelect = Convert.ToBoolean(e["isSelect"]),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    IsBulk = Convert.ToInt16(e["IsBulk"]),
                    isHold = Convert.ToBoolean(e["IsHold"]),
                    HOLDRemarks = e["HOLDRemarks"].ToString(),
                    RFSRemarks = e["RFSRemarks"].ToString(),
                    CarrierCode = e["CarrierCode"].ToString()
                    // ULDType = e["ULDType"].ToString()
                    // isPayment = Convert.ToBoolean(e["isPayment"])
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsManifestShipList.AsQueryable().ToList(),
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
        public DataSourceResult GetSOFlightULDShipGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetSOFlightShipmentChild";

                string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsSOFlightShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
                {

                    AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBSector = Convert.ToString(e["AWBSector"]),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                    ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                    PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                    Agent = e["Agent"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHC = e["SHC"].ToString(),
                    SHCCodeName = e["SHCCodeName"].ToString(),

                    Priority = e["Priority"].ToString(),
                    Status = e["Status"].ToString(),
                    PCBM = Convert.ToDecimal(e["PCBM"]),
                    PG = Convert.ToDecimal(e["PG"]),
                    PV = Convert.ToDecimal(e["PV"]),
                    IsBulk = Convert.ToInt16(e["IsBulk"]),
                    isHold = Convert.ToBoolean(e["IsHold"])

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsSOFlightShipList.AsQueryable().ToList(),
                    //  Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
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
        //public DataSourceResult GetLyingULDManifestGridData(string ULDSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        //{
        //    string sorts = GridSort.ProcessSorting(sort);
        //    string ProcName = "";
        //    if (filter == null)
        //    {
        //        filter = new GridFilter();
        //        filter.Logic = "AND";
        //        filter.Filters = new List<GridFilter>();
        //    }
        //    DataSet ds = new DataSet();

        //    ProcName = "GetListWMSFlightLying";

        //    string filters = GridFilter.ProcessFilters<WMSLyingListGridData>(filter);

        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@AWBNo", AWBNo) };

        //    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

        //    var wmsLyingList = ds.Tables[0].AsEnumerable().Select(e => new WMSLyingListGridData
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        AWBNo = Convert.ToString(e["AWBNo"]),
        //        AWBSector = Convert.ToString(e["AWBSector"]),
        //        TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
        //        PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
        //        ActG_V_CBM = e["ActG_V_CBM"].ToString(),
        //        PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
        //        Agent = e["Agent"].ToString(),
        //        SHC = e["SHC"].ToString(),
        //        Status = e["Status"].ToString(),
        //        isSelect = Convert.ToBoolean(e["isSelect"]),
        //        PCBM = Convert.ToDecimal(e["PCBM"]),
        //        PG = Convert.ToDecimal(e["PG"]),
        //        PV = Convert.ToDecimal(e["PV"]),
        //        DestinationCity = e["DestinationCity"].ToString(),
        //        FlightNo = e["FlightNo"].ToString(),
        //        OffloadStatus = e["OffloadStatus"].ToString(),
        //        OriginCity = e["OriginCity"].ToString(),
        //        ULDGroupNo = e["ULDGroupNo"].ToString(),
        //        ULDType = e["ULDType"].ToString(),
        //        Priority = e["Priority"].ToString()
        //    });

        //    ds.Dispose();
        //    return new DataSourceResult
        //    {
        //        Data = wmsLyingList.AsQueryable().ToList(),
        //        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
        //        FilterCondition = filters,
        //        SortCondition = sorts,
        //        StoredProcedure = ProcName
        //    };
        //}

        ///////////////////
        //---
        public string GetAWBDetails(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReturnAWBInfoMessage", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SetFinalizedPreManifest(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SetFinalizedPreManifest", Parameters);
                return Convert.ToString(ds.Tables[0].Rows[0][0]);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string GetNotocRecord(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetNotocRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetUWSDetails(string GroupFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@GroupFlightSno", GroupFlightSno), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_GetFC_UWSRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public void SendNTM(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyflightSNo", Sno), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@SubProcessSNo", 2171) };
                SqlHelper.ExecuteScalar(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sendNTMMsg", Parameters);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

            //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveAWBDetails(string AWBSNo, string Remarks, int UpdatedBy)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBSNo), new SqlParameter("@CancelRemarks", Remarks), new SqlParameter("@UpdatedBy", UpdatedBy) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateReturnAWB", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetManifestOSIDetails(string DFGroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DFGroupSNo", DFGroupSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetManifestOSIDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string saveOSIDetails(string DFGroupSNo, string OSI1, string OSI2)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DFGroupSNo", DFGroupSNo), new SqlParameter("@OSI1", OSI1), new SqlParameter("@OSI2", OSI2), new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestOSI", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateFlightStatus(int DailyFlightSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateFlightStatus", Parameters);

                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (msg == "0")
                {
                    CommonService.SaveFlightSubProcessTrans(DailyFlightSNo, 6, 2336, true, null);
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(DailyFlightSNo, 6, 2336, false, null);
                }

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string fn_CheckOnHoldPcs(int AWBSNo, int ProcessedPcs, string ChkType)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ProcessedPcs", ProcessedPcs), new SqlParameter("@ChkType", ChkType) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_CheckOnHoldPcs", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetAirMailPrintData(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", Convert.ToString(DailyFlightSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirMailPrintData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetManifestRemarks(string DFGroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DFGroupSNo", DFGroupSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetManifestRemarks", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string saveManifestRemarksDetails(string DFGroupSNo, string Remarks)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DFGroupSNo", DFGroupSNo), new SqlParameter("@Remarks", Remarks) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveManifestRemarks", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateAirmailStatus(string GroupFlightSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@GroupFlightSNo", GroupFlightSNo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAirmailStatus", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveNotocRecord(string Sno, string PreparedBy, List<SupplentaryInformation> SupplentaryInfo, string OtherInfo)
        {
            try
            {
                DataTable dtSupplentaryInfo = CollectionHelper.ConvertTo(SupplentaryInfo, "");

                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramSupplentaryInfo = new SqlParameter();
                paramSupplentaryInfo.ParameterName = "@SupplentaryInfo";
                paramSupplentaryInfo.SqlDbType = System.Data.SqlDbType.Structured;
                paramSupplentaryInfo.Value = dtSupplentaryInfo;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno), new SqlParameter("@PreparedBy", PreparedBy), paramSupplentaryInfo, new SqlParameter("@OtherInfo", OtherInfo) };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveNotocData", Parameters);
                // DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveNotocData", Parameters);
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);          
                if (ret == "0")
                {
                    CommonService.SaveFlightSubProcessTrans(Convert.ToInt32(Sno), 6, 2102, true, null);
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(Convert.ToInt32(Sno), 6, 2102, false, null);
                }
                return ret.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //---
        public string GetCBVPrintRecord(string DFGroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DFGroupSNo", DFGroupSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCBVPrintRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveFlightEDIMessageInformation(List<EDIMessageInfo> EDIMessageInfo, Int64 FlightSNo, bool IsFFM)
        {
            DataTable dtEDIMessageInfo = CollectionHelper.ConvertTo(EDIMessageInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramEDIMessageInfo = new SqlParameter();
            paramEDIMessageInfo.ParameterName = "@FlightEDIMessageInfo";
            paramEDIMessageInfo.SqlDbType = System.Data.SqlDbType.Structured;
            paramEDIMessageInfo.Value = dtEDIMessageInfo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramEDIMessageInfo, new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@IsFFM", IsFFM), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveFlightEDIMessageInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string CancelLI(Int64 FlightSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spCancelLoadingInstruction", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}