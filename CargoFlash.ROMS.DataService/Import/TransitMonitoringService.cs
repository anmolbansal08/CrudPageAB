using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using KLAS.Business.EDI;
using System.Net;

namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TransitMonitoringService : BaseWebUISecureObject, ITransitMonitoringService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetFlightArrivalShipmentGrid(string processName, string moduleName, string appName, string currentFFMFlightMasterSNo, string SearchAirlineCarrierCode, string SearchBoardingPoint, string SearchFlightNo, string searchFromDate, string searchToDate)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FFMFlightMasterSNo: currentFFMFlightMasterSNo, SearchAirlineCarrierCode: SearchAirlineCarrierCode, SearchBoardingPoint: SearchBoardingPoint, SearchFlightNo: SearchFlightNo, searchFromDate: searchFromDate, searchToDate: searchToDate);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchAirlineCarrierCode = "", string SearchBoardingPoint = "", string SearchFlightNo = "", string FlightDate = "", string searchFromDate = "", string searchToDate = "", string StartTime = "", string EndTime = "", string DailyFlightSNo = "0", string FFMFlightMasterSNo = "0", string ULDNo = "0", string SearchFFMRcvd = "0", string SearchQRT = "0", string SearchSHCDGR = "0", string SearchTransitFlight = "0", string SearchConnectingFlights = "0", string SearchFilterULDCounts = "0", string SearchFilterMCT = "0")
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
                        case "TransitMonitoringFlightArrival":
                            {
                                switch (appName)
                                {
                                    case "TransitMonitoringFlightArrivalShipment":
                                        CreateNestedFligthArrivalalLDGrid(myCurrentForm, FFMFlightMasterSNo, SearchAirlineCarrierCode, SearchBoardingPoint, SearchFlightNo, searchFromDate, searchToDate);
                                        break;
                                }
                                break;
                            }
                        default:
                            break;
                    }
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

        private void CreateNestedFligthArrivalalLDGrid(StringBuilder Container, string FFMFlightMasterSNo = "", string SearchAirlineCarrierCode = "", string SearchBoardingPoint = "", string SearchFlightNo = "", string searchFromDate = "", string searchToDate = "")
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DefaultPageSize = 1000;
                g.DataSoruceUrl = "Services/Import/TransitMonitoringService.svc/GetTransitMonitoringULDGridData";
                g.PrimaryID = "TransGridSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                g.FormCaptionText = "";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsAllowedSorting = false;
                g.IsAllowedScrolling = true;
                g.IsShowEdit = false;
                g.IsSaveChanges = false;
                g.IsColumnMenu = false;
                g.IsDisplayOnly = false;             
                //   g.IsActionRequired = false;

                g.IsAllowedFiltering = true;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "TransGridSNo", Title = "TransGridSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsULD", Title = "IsULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD/BULK", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 42 });
                g.Column.Add(new GridColumn { Field = "BUP", Title = "BUP", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 22 });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No.", DataType = GridDataType.String.ToString(), Width = 37 });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Origin", Title = "Org.", DataType = GridDataType.String.ToString(), Width = 23 });
                g.Column.Add(new GridColumn { Field = "Destination", Title = "Dest.", DataType = GridDataType.String.ToString(), Width = 24 });
                g.Column.Add(new GridColumn { Field = "FinalDestination", Title = "Final Dest.", DataType = GridDataType.String.ToString(), Width = 38 });
                g.Column.Add(new GridColumn { Field = "QRT", Title = "QRT", DataType = GridDataType.String.ToString(), Width = 23 });
                g.Column.Add(new GridColumn { Field = "MCT", Title = "MCT", DataType = GridDataType.String.ToString(), Width = 24 });
                //g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC/DGR", DataType = GridDataType.String.ToString(), Width = 37 });
                //g.Column.Add(new GridColumn { Field = "NatureOfGoods", Title = "Nature Of Goods", DataType = GridDataType.String.ToString(), Width = 55 });
                g.Column.Add(new GridColumn { Field = "ConFlightType", Title = "Con Flight Type", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 53 });
                g.Column.Add(new GridColumn { Field = "ConFlightEqu", Title = "Equip", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 26 });


                g.Column.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 34, Filterable = "false", Template = "#if(IsULD==0){#<input type=\"button\"  style=\"display: none\" />#}else if(IsULDLocation==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"HighLightGridButton(this,event);GetFAULDLocation(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"HighLightGridButton(this,event);GetFAULDLocation(#=FFMShipmentTransSNo#)\" />#}#" });

                //  g.Column.Add(new GridColumn { Field = "SNo", Title = "X-Ray", DataType = GridDataType.String.ToString(), Width = 26, Template = "#if(IsULD==0){#<input type=\"button\" style=\"display: none\"  />#}else if(IsULDDamage==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"HighLightGridButton(this,event);GetULDXray(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"HighLightGridButton(this,event);GetULDXray(#=FFMShipmentTransSNo#)\" />#}#" });

                g.Column.Add(new GridColumn { Field = "SNo", Title = "Re-build", DataType = GridDataType.String.ToString(), Width = 34, Filterable = "false", Template = "#if(IsULD==0){#<input type=\"button\" style=\"display: none\"  />#}else if(IsULDDamage==0 && IsRebuild==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"R\" onclick=\"HighLightGridButton(this,event);GetReBuild(#=FFMShipmentTransSNo#,#=FFMFlightMasterSNo#,this)\" />#}else if(IsRebuild==1){#<input type=\"button\" class=\"partialprocess\" style=\"cursor:pointer\" value=\"R\" onclick=\"HighLightGridButton(this,event);GetBindReBuild(#=FFMShipmentTransSNo#,#=FFMFlightMasterSNo#,this)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"R\" onclick=\"HighLightGridButton(this,event);GetReBuild(#=FFMShipmentTransSNo#,#=FFMFlightMasterSNo#,this)\" />#}#" });

                g.Column.Add(new GridColumn { Field = "IsULDLocation", Title = "IsULDLocation", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsULDDamage", Title = "IsULDDamage", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsULDConsumable", Title = "IsULDConsumable", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsRebuild", Title = "IsRebuild", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });

                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "SearchAirlineCarrierCode", Value = SearchAirlineCarrierCode });
                g.ExtraParam.Add(new GridExtraParams { Field = "SearchBoardingPoint", Value = SearchBoardingPoint });
                g.ExtraParam.Add(new GridExtraParams { Field = "SearchFlightNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParams { Field = "searchFromDate", Value = searchFromDate });
                g.ExtraParam.Add(new GridExtraParams { Field = "searchToDate", Value = searchToDate });

                //#region Nested Grid Section
                g.NestedPrimaryID = "AWBSNo";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "TransGridSNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedIsPageable = false;
                g.IsNestedAllowedSorting = false;

                g.NestedDataSoruceUrl = "Services/Import/TransitMonitoringService.svc/GetTransitMonitoringShipmentGridData";
                g.NestedColumn = new List<GridColumn>();
                g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "IsULD", Title = "IsULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.NestedColumn.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ULDNo", Title = "ULDNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "TransGridSNo", Title = "TransGridSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalFFMPieces", Title = "TotalFFMPieces", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.NestedColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No.", DataType = GridDataType.String.ToString(), Width = 25 });
                g.NestedColumn.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.Number.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.Number.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Number.ToString(), Width = 25 });
                g.NestedColumn.Add(new GridColumn { Field = "Build", Title = "Build", DataType = GridDataType.String.ToString(), Width = 16 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentOriginAirportCode", IsLocked = false, Title = "AWB Origin", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "AWB Dest", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 18, Filterable = "false", Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\"  />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else if(LocationStatus==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==1){#<input type=\"button\" class=\"partialprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==2){#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}#" });

                //      g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "X-Ray", DataType = GridDataType.String.ToString(), Width = 15, Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\" />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"GetAWBXray(#=AWBSNo#,this)\" />#}#" });
                g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Terminate", DataType = GridDataType.String.ToString(), Width = 18, Filterable = "false", Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\" />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"T\" onclick=\"GetTerminate(#=AWBSNo#,this)\" />#}#" });
                //g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Planning", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"GetPlaning(#=AWBSNo#,this)\" />#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "IsDocument", Title = "IsDocument", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "LocationStatus", Title = "LocationStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetTransitMonitoringULDGridData(string SearchAirlineCarrierCode, string SearchBoardingPoint, string SearchFlightNo, string searchFromDate, string searchToDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "FA_GetTransitMonitoringFlightArrivalULDGridData";
                string filters = GridFilter.ProcessFilters<WMSTransitMonitoringArrivalULDGridData>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@SearchAirlineCarrierCode", SearchAirlineCarrierCode),
                                            new SqlParameter("@SearchBoardingPoint", SearchBoardingPoint),
                                            new SqlParameter("@SearchFlightNo", SearchFlightNo),
                                            new SqlParameter("@searchFromDate", searchFromDate),
                                            new SqlParameter("@searchToDate", searchToDate),
                                            new SqlParameter("@LoginCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                             new SqlParameter("@LoggedinAirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()),
                                          /* for MultiCity */  new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString())
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSTransitMonitoringArrivalULDGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    TransGridSNo = e["TransGridSNo"].ToString(),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    IsULD = Convert.ToInt32(e["IsULD"]),
                    ULDNo = e["ULDNo"].ToString().ToUpper(),
                    BUP = e["BUP"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    FinalDestination = e["FinalDestination"].ToString(),
                    QRT = e["QRT"].ToString(),
                    MCT = e["MCT"].ToString(),
                    SHC = e["SHC"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString().ToUpper(),
                    ConFlightType = e["ConFlightType"].ToString(),
                    ConFlightEqu = e["ConFlightEqu"].ToString(),
                    IsULDLocation = Convert.ToInt32(e["IsULDLocation"]),
                    IsULDDamage = Convert.ToInt32(e["IsULDDamage"]),
                    IsULDConsumable = Convert.ToInt32(e["IsULDConsumable"]),
                    IsRebuild = Convert.ToInt32(e["isRebuild"])
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
        public DataSourceResult GetTransitMonitoringShipmentGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "TM_GetTransitMonitoringShipmentGridData";
                string filters = GridFilter.ProcessFilters<WMSTransitMonitoringShipmentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("'", "")), new SqlParameter("@OrderBy", sorts) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSTransitMonitoringShipmentGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    CheckIn = e["CheckIn"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    ShipmentOriginAirportCode = e["ShipmentOriginAirportCode"].ToString(),
                    ShipmentDestinationAirportCode = e["ShipmentDestinationAirportCode"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                    Build = e["Build"].ToString(),
                    IsBUP = Convert.ToInt32(e["IsBUP"].ToString()),
                    LocationStatus = Convert.ToInt32(e["LocationStatus"]),
                    TransGridSNo = e["TransGridSNo"].ToString(),
                    IsULD = Convert.ToInt32(e["IsULD"])
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

        public List<string> createUpdateAwbULDLocation(string strData)
        {
            try
            {


                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtAwbULDLocationTemp = JsonConvert.DeserializeObject<DataTable>(strData);
                DataRow[] dr = dtAwbULDLocationTemp.Select("sno<>'undefined'");
                var dtAwbULDLocation = dtAwbULDLocationTemp.Clone();
                if (dr.Length > 0)
                {
                    foreach (DataRow dr1 in dr)
                    {
                        dtAwbULDLocation.ImportRow(dr1);
                    }
                }
                else
                    dtAwbULDLocation = dtAwbULDLocationTemp.Copy();

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtAwbULDLocation.Rows.Count > 0)
                {
                    param.Value = dtAwbULDLocation;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtLocationTM", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteAwbULDLocation(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_DeleteAwbULDLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<AwbULDLocationTransitMonitoring>> GetAwbULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AwbULDLocationTransitMonitoring AwbULDLocation = new AwbULDLocationTransitMonitoring();
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTransitMonitoringAwbULDLocation", Parameters);
                var AwbULDLocationList = ds.Tables[0].AsEnumerable().Select(e => new AwbULDLocationTransitMonitoring
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"].ToString()),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"].ToString()),
                    HdnAWBNo = e["AWBNo"].ToString(),
                    //HdnHAWB = e["HdnHAWB"].ToString(),
                    //HAWB = e["HAWB"].ToString(),
                    HdnRcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    HdnRcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    AWBNo = e["AWBNo"].ToString(),
                    RcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    RcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    StartPieces = Convert.ToInt32(e["StartPieces"].ToString()),
                    EndPieces = Convert.ToInt32(e["EndPieces"].ToString()),
                    HdnAssignLocation = Convert.ToInt32(e["LocationSNo"]),
                    AssignLocation = e["AssignLocation"].ToString(),
                    TempControlled = Convert.ToInt32(e["TempControlled"]),
                    StartTemperature = e["StartTemperature"].ToString(),
                    EndTemperature = e["EndTemperature"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    HdnMovableLocation = Convert.ToInt32(e["HdnMovableLocation"].ToString()),
                    MovableLocation = e["MovableLocation"].ToString()

                });
                return new KeyValuePair<string, List<AwbULDLocationTransitMonitoring>>(ds.Tables[1].Rows[0][0].ToString(), AwbULDLocationList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<FAULDLocationTransitMonitoring>> GetFAULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FAULDLocationTransitMonitoring FAULDLocation = new FAULDLocationTransitMonitoring();
                SqlParameter[] Parameters = { new SqlParameter("@FFMShipmentTransSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_TransitMonitoringGetRecordFAULDLocation", Parameters);
                var FAULDLocationList = ds.Tables[0].AsEnumerable().Select(e => new FAULDLocationTransitMonitoring
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    BUP = e["BUP"].ToString(),
                    HdnMovableLocation = Convert.ToInt32(e["HdnMovableLocation"].ToString()),
                    MovableLocation = e["MovableLocation"].ToString(),
                    HdnLocation = Convert.ToInt32(e["HdnLocation"]),
                    Location = e["Location"].ToString()
                });
                return new KeyValuePair<string, List<FAULDLocationTransitMonitoring>>(ds.Tables[1].Rows[0][0].ToString(), FAULDLocationList.AsQueryable().ToList());

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateFAULDLocation(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtFAULDLocation = JsonConvert.DeserializeObject<DataTable>(strData);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtFAULDLocation.Rows.Count > 0)
                {
                    param.Value = dtFAULDLocation;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtULDLocation", Parameters);
                }


                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteFAULDLocation(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteFAULDLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<AWBXray>> GetAWBXrayRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AWBXray AWBXray = new AWBXray();
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTransitAwbLocation", Parameters);
                var AWBXrayList = ds.Tables[0].AsEnumerable().Select(e => new AWBXray
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Pieces = Convert.ToInt32(e["RcvdPieces"]),
                    GrossWT = Convert.ToDecimal(e["RcvdGrossWeight"]),
                    VolumeWT = Convert.ToDecimal(0),
                    StartPieces = Convert.ToDecimal(e["StartPieces"]),
                    EndPieces = Convert.ToDecimal(e["EndPieces"])
                });
                return new KeyValuePair<string, List<AWBXray>>(ds.Tables[1].Rows[0][0].ToString(), AWBXrayList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateAWBXray(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtAWBXray = JsonConvert.DeserializeObject<DataTable>(strData);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtAWBXray.Rows.Count > 0)
                {
                    param.Value = dtAWBXray;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportTransitSaveAtLocation", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AWBXray");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteAWBXray(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAWBXray", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AWBXray");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDXray>> GetULDXrayRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDXray ULDXray = new ULDXray();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_TransitMonitoringGetRecordULDXray", Parameters);
                var ULDXrayList = ds.Tables[0].AsEnumerable().Select(e => new ULDXray
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWT = Convert.ToDecimal(e["GrossWT"]),
                    VolumeWT = Convert.ToDecimal(e["VolumeWT"]),
                });
                return new KeyValuePair<string, List<ULDXray>>(ds.Tables[1].Rows[0][0].ToString(), ULDXrayList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateULDXray(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtULDXray = JsonConvert.DeserializeObject<DataTable>(strData);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDXray";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtULDXray.Rows.Count > 0)
                {
                    param.Value = dtULDXray;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_TransitMonitoringSaveULDXray", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDXray");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteULDXray(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDXray", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDXray");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ReBuild>> GetReBuildRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ReBuild ReBuild = new ReBuild();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_TransitMonitoringGetRecordReBuild", Parameters);
                var ReBuildList = ds.Tables[0].AsEnumerable().Select(e => new ReBuild
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ServiceName = e["ServiceName"].ToString(),
                    PrimaryValue = e["PrimaryValue"].ToString(),
                    SecondaryValue = e["SecondaryValue"].ToString(),
                });
                return new KeyValuePair<string, List<ReBuild>>(ds.Tables[1].Rows[0][0].ToString(), ReBuildList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateReBuild(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtReBuild = JsonConvert.DeserializeObject<DataTable>(strData);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ReBuild";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtReBuild.Rows.Count > 0)
                {
                    param.Value = dtReBuild;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_TransitMonitoringSaveReBuild", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReBuild");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteReBuild(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteReBuild", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReBuild");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<Terminate>> GetTerminateRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {


                Terminate ReBuild = new Terminate();
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_TransitMonitoringGetRecordTerminate", Parameters);
                var TerminateList = ds.Tables[0].AsEnumerable().Select(e => new Terminate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWT = Convert.ToDecimal(e["GrossWT"]),
                    VolumeWT = Convert.ToDecimal(e["VolumeWT"]),
                });
                return new KeyValuePair<string, List<Terminate>>(ds.Tables[1].Rows[0][0].ToString(), TerminateList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateTerminate(string strData)
        {
            try
            {


                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtTerminate = JsonConvert.DeserializeObject<DataTable>(strData);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Terminate";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtTerminate.Rows.Count > 0)
                {
                    param.Value = dtTerminate;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_TransitMonitoringSaveTerminate", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Terminate");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> deleteTerminate(string recordID)
        {
            try
            {


                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTerminate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Terminate");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRebuildCharges(int ffmShipmentTransSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@FFMShipmentTransSNo", ffmShipmentTransSNo),
                                           new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetRebuildCharges", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        public string GetGetAmandmentChargesForTerminate(int AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWBSNO", AWBSNO),
                                           new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetAmandmentChargesForTerminate", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveRebuildProcess(string FFMFlightMasterSNo, string ULDNo, string AWBSNo, string DestCity, string ChargeType, List<DOHandlingCharges> lstHandlingCharges)
        {
          

            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                        new SqlParameter("@AWBSNo",AWBSNo),
                                        new SqlParameter("@DestinationCity",DestCity),
                                         new SqlParameter("@FFMFlightMasterSNo",FFMFlightMasterSNo),
                                          new SqlParameter("@ULDNo",ULDNo), 
                                          new SqlParameter("@ChargeType",ChargeType),
                                        new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRebuildProcess", param).Tables[1].Rows[0][0];
                return ret;
            }
            catch(Exception ex)// 
            {
                throw ex;
            }
        }

        public string GetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, int PValue, int SValue, int HAWBSNo)
        {
            try
            {

                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", DestinationCity),
                                            new SqlParameter("@MovementType", 1),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", "0"),
                                            new SqlParameter("@SubProcessSNo", 0),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", 0),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PValue),
                                            new SqlParameter("@SecondaryValue", SValue),
                                            new SqlParameter("@TaxReturn", 1)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        public string saveTerminate(string AWBSno, string destSno, string ChargeType, List<DOHandlingCharges> lstHandlingCharges)
        {
          
            DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                        new SqlParameter("@AWBSNo",AWBSno),
                                        new SqlParameter("@DestinationCity",destSno),
                                    
                                          new SqlParameter("@ChargeType",ChargeType),
                                        new SqlParameter("@HandlingChargesTable",dtHandlingCharges),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                string ret = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "TerminateAWB", param).Tables[1].Rows[0][0];
                return ret;
            }
            catch(Exception ex)// 
            {
                throw ex;
            }
        }

        public string GetBindRebuildCharge(string ULDNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                             new SqlParameter("@ULDNo", ULDNo)
                                         
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBindRebuildCharges", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}