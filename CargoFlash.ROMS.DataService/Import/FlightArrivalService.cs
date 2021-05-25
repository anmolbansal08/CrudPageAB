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
    public class FlightArrivalService : BaseWebUISecureObject, IFlightArrivalService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public string GetFlightArrivalFlightInformation(Int32 DailyFlightSno)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSno", DailyFlightSno) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetFlightArrivalFlightInformation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string SearchAirlineSNo, string SearchFlightNo, string SearchBoardingPoint, string searchFromDate, string searchToDate, string StartTime, string EndTime, string FetchAWBList)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SearchAirlineSNo: SearchAirlineSNo, SearchFlightNo: SearchFlightNo, SearchBoardingPoint: SearchBoardingPoint, searchFromDate: searchFromDate, searchToDate: searchToDate, StartTime: StartTime, EndTime: EndTime, FetchAWBList: FetchAWBList);
        }
        public Stream GetFlightArrivalShipmentGrid(string processName, string moduleName, string appName, string DailyFlightSno)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", DailyFlightSno: DailyFlightSno);
        }
        public string GetULDLocation(Int32 DailyFlightSNo, Int32 ULDSNo)
        {
            return "";
        }
        public DataSourceResult GetFlightArrivalULDGridData(string DailyFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "FA_GetFlightArrivalULDGridData";

                string filters = GridFilter.ProcessFilters<WMSFlightArrivalULDGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSno", DailyFlightSno) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightArrivalULDGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    BUP = e["BUP"].ToString(),
                    TotalPieces = e["TotalPieces"].ToString(),
                    TotalGrossWeight = e["TotalGrossWeight"].ToString(),// Convert.ToDecimal(e["TotalGrossWeight"].ToString() == "" ? "0" : e["TotalGrossWeight"].ToString()),
                    Transit = e["Transit"].ToString(),
                    CleanLoad = e["CleanLoad"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    BreakDownStart = e["BreakDownStart"].ToString(),
                    BreakDownEnd = e["BreakDownEnd"].ToString()

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
        public DataSourceResult GetFlightArrivalShipmentGridData(string DailyFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");

                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();

                ProcName = "FA_GetFlightArrivalShipmentGridData";

                string filters = GridFilter.ProcessFilters<WMSFlightArrivalShipmentGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSno", DailyFlightSno) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightArrivalShipmentGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    CheckIn = e["CheckIn"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    //ULDType = e["ULDType"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    ShipmentDestinationAirportCode = e["ShipmentDestinationAirportCode"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                    UldArrived = e["UldArrived"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    SPHCPriority = e["SPHCPriority"].ToString(),
                    Status = e["Status"].ToString(),
                    ReceivedPcs = e["ReceivedPcs"].ToString()

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
        private void CreateNestedFligthArrivalalLDGrid(StringBuilder Container, string FlightSNo = "")
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    //g.Height = 100;
                    //g.PrimaryID = this.MyPrimaryID;
                    //g.ModuleName = this.MyModuleID;
                    //g.AppsName = this.MyAppID;
                    //g.DefaultPageSize = 5;
                    //g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalULDGridData";
                    //g.PrimaryID = "ULDNo";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    //g.ModuleName = this.MyModuleID;
                    //g.FormCaptionText = "ULD Details";
                    //g.IsFormHeader = false;
                    //g.IsModule = true;
                    //g.IsShowEdit = false;
                    //g.IsAllowedFiltering = false;
                    //g.IsAllowedSorting = true;
                    //g.IsProcessPart = true;
                    //g.ProcessName = "FAULDInfo";
                    //g.IsSaveChanges = false;

                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalULDGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.FormCaptionText = "ULD Details";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsAllowedFiltering = false;
                    g.IsProcessPart = true;
                    g.IsDisplayOnly = false;
                    g.ProcessName = "FAULDInfo";


                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "BUP", Title = "BUP", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "TotalGrossWeight", Title = "Gross Wt", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Transit", Title = "Transit", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "CleanLoad", Title = "Clean Load", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "BreakDownStart", Title = "Breakdown Start", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "BreakDownEnd", Title = "Breakdown End", DataType = GridDataType.String.ToString(), Width = 60 });

                    g.Column.Add(new GridColumn { Field = "ULDCheckedIn", Title = "ULD/BULK Checked In", DataType = GridDataType.String.ToString(), Width = 60 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "DailyFlightSno", Value = FlightSNo });
                    //#region Nested Grid Section
                    g.NestedPrimaryID = "AWBNo";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "ULDNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    g.IsNestedAllowedFiltering = false;
                    g.IsNestedAllowedSorting = true;
                    g.IsNestedChild = true;
                    g.IsNestedProcessPart = true;
                    g.NestedProcessName = "FAShipmentInfo";
                    //g.SuccessGrid = "DisableFlight";
                    g.NestedDataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalShipmentGridData";
                    g.NestedColumn = new List<GridColumn>();
                    g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSno", Title = "DailyFlightSno", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "MAWB", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.NestedColumn.Add(new GridColumn { Field = "Commodity", IsLocked = false, Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.NestedColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 35 });
                    g.NestedColumn.Add(new GridColumn { Field = "Document", Title = "Document", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.NestedColumn.Add(new GridColumn { Field = "Pieces", Title = "AWB Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "FFMPcs", Title = "FFM Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "ReceivedPcs", Title = "Rcd Pcs", DataType = GridDataType.Number.ToString(), Width = 40, Template = "<input title=\"U\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" width=\"35px\" >" });
                    g.NestedColumn.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50 });
                    g.NestedColumn.Add(new GridColumn { Field = "Remarks", Title = "Remarks", Template = "<input title=\"U\" id=\"txtFAMAWBRemarks\" type=\"text\"  process=\"FA Shp Remarks\">", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DailyFlightSno", Value = FlightSNo });

                    // Nested Child Grid

                    //g.NestedChildPrimaryID = "AWBNo";
                    //g.NestedChildModuleName = this.MyModuleID;
                    //g.NestedChildAppsName = this.MyAppID;
                    //g.NestedChildParentID = "ULDNo";
                    //g.NestedChildIsShowEdit = false;
                    //g.NestedChildDefaultPageSize = 1000;
                    //g.NestedChildIsPageable = false;
                    //g.IsNestedChildAllowedFiltering = false;
                    //g.IsNestedChildAllowedSorting = true;
                    //g.IsNestedChildChild = true;
                    //g.IsNestedChildProcessPart = true;
                    //g.NestedChildProcessName = "FAShipmentInfo";
                    ////g.SuccessGrid = "DisableFlight";
                    //g.NestedChildDataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalShipmentGridData";
                    //g.NestedChildColumn = new List<GridColumn>();
                    //g.NestedChildColumn.Add(new GridColumn { Field = "DailyFlightSno", Title = "DailyFlightSno", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "MAWB", DataType = GridDataType.String.ToString(), Width = 90 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 35 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "Commodity", IsLocked = false, Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 70 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 35 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "Document", Title = "Document", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "Pieces", Title = "AWB Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "FFMPcs", Title = "FFM Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "ReceivedPcs", Title = "Rcd Pcs", DataType = GridDataType.Number.ToString(), Width = 40, Template = "<input title=\"U\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" width=\"35px\" >" });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    //g.NestedChildColumn.Add(new GridColumn { Field = "Remarks", Title = "Remarks", Template = "<input title=\"U\" id=\"txtFAMAWBRemarks\" type=\"text\"  process=\"FA Shp Remarks\">", DataType = GridDataType.String.ToString(), Width = 55 });
                    //g.NestedChildExtraParam = new List<NestedChildGridExtraParam>();
                    //g.NestedChildExtraParam.Add(new NestedChildGridExtraParam { Field = "DailyFlightSno", Value = FlightSNo });

                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        public DataSourceResult GetArrivalGridData(string SearchAirlineSNo, string SearchFlightNo, string SearchBoardingPoint, string searchFromDate, string searchToDate, string StartTime, string EndTime, string FetchAWBList, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");

                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();

                ProcName = "FA_GetListWMSFlightArrivalParam";

                string filters = GridFilter.ProcessFilters<FlightArrivalGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@SearchAirlineSNo", SearchAirlineSNo), new SqlParameter("@SearchFlightNo", SearchFlightNo), new SqlParameter("@SearchBoardingPoint", SearchBoardingPoint), new SqlParameter("@searchFromDate", searchFromDate), new SqlParameter("@searchToDate", searchToDate), new SqlParameter("@StartTime", StartTime), new SqlParameter("@EndTime", EndTime), new SqlParameter("@FetchAWBList", FetchAWBList), new SqlParameter("@LoggedInCity", LoggedInCity) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightArrivalList = ds.Tables[0].AsEnumerable().Select(e => new FlightArrivalGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("yyyy/MM/dd"),
                    OriginCityCode = e["OriginCityCode"].ToString(),
                    DestinationCityCode = e["DestinationCityCode"].ToString(),
                    TotalPieces = e["TotalPieces"].ToString(),
                    TotalGrossWt = e["TotalGrossWt"].ToString(),
                    TotalVolumeWt = e["TotalVolumeWt"].ToString(),
                    Status = e["Status"].ToString(),
                    FFM = e["FFM"].ToString(),
                    CPM = e["CPM"].ToString(),
                    FWB = e["FWB"].ToString(),
                    FHL = e["FHL"].ToString(),
                    MVT = e["MVT"].ToString()

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsFlightArrivalList.AsQueryable().ToList(),
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

        private void CreateGrid(StringBuilder Container, string ProcessName, string SearchAirlineSNo = "", string SearchFlightNo = "", string SearchBoardingPoint = "", string searchFromDate = "", string searchToDate = "", string StartTime = "", string EndTime = "", string FetchAWBList = "", string LoggedInCity = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    //g.Height = 100;
                    //g.PageName = this.MyPageName;
                    //g.PrimaryID = this.MyPrimaryID;
                    //g.ModuleName = this.MyModuleID;
                    //g.AppsName = this.MyAppID;
                    //g.IsDisplayOnly = true;
                    //g.DefaultPageSize = 5;
                    //g.IsAllowCopy = false;
                    //g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetArrivalGridData";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    //g.ServiceModuleName = this.MyModuleID;
                    //g.UserID = this.MyUserID;
                    //g.FormCaptionText = "Flight Arrival";
                    //g.IsPageable = true;
                    //g.IsAllowedPaging = true;
                    //g.IsProcessPart = true;
                    //g.IsRowChange = true;//added by Manoj Kumar
                    //g.IsRowDataBound = true;//added by Manoj Kumar
                    //g.IsPageSizeChange = false;
                    //g.IsPager = false;
                    //g.IsOnlyTotalDisplay = true;
                    //g.ProcessName = "FlightArrivalFlightDetails";

                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetArrivalGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Flight Arrival";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsAllowedFiltering = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsActionRequired = false;
                    g.IsDisplayOnly = false;
                    //g.IsRowChange = true;//added by Manoj Kumar
                    //g.IsRowDataBound = true;//added by Manoj Kumar
                    g.ProcessName = "FlightArrivalFlightDetails";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70, Template = "<span class=\"actionView\" style=\"cursor:pointer\" onclick=\"GetFlightShipment(this,#=DailyFlightSNo#);\">#=FlightNo#</span>" });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "OriginCityCode", Title = "Origin City", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "DestinationCityCode", Title = "Destination City", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "TotalPiece", Title = "Total Piece", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "TotalGrossWt", Title = "Total Gross Wt.", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "TotalVolumeWt", Title = "Total Volume Wt.", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "FFM", Title = "FFM", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "CPM", Title = "CPM", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "FWB", Title = "FWB", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "FHL", Title = "FHL", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "MVT", Title = "MVT", DataType = GridDataType.String.ToString(), Width = 20 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "SearchAirlineSNo", Value = SearchAirlineSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightNo", Value = SearchFlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SearchBoardingPoint", Value = SearchBoardingPoint });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "StartTime", Value = StartTime });
                    g.ExtraParam.Add(new GridExtraParam { Field = "EndTime", Value = EndTime });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FetchAWBList", Value = FetchAWBList });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private void CreateFlightArrivalShipmentGrid(StringBuilder Container, string ProcessName, string SNo)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    //g.Height = 100;
                    //g.PageName = this.MyPageName;
                    //g.PrimaryID = this.MyPrimaryID;
                    //g.ModuleName = this.MyModuleID;
                    //g.AppsName = this.MyAppID;
                    //g.IsDisplayOnly = true;
                    //g.DefaultPageSize = 5;
                    //g.IsAllowCopy = false;
                    //g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalShipmentGridData";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    //g.ServiceModuleName = this.MyModuleID;
                    //g.UserID = this.MyUserID;
                    //g.FormCaptionText = "Flight Arrival Shipment";
                    //g.IsPageable = true;
                    //g.IsAllowedPaging = true;
                    //g.IsProcessPart = true;
                    //g.IsRowChange = true;//added by Manoj Kumar
                    //g.IsRowDataBound = true;//added by Manoj Kumar
                    //g.IsPageSizeChange = false;
                    //g.IsPager = false;
                    //g.IsOnlyTotalDisplay = true;
                    //g.ProcessName = ProcessName;


                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Import/FlightArrivalService.svc/GetFlightArrivalShipmentGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Flight Arrival Shipment";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsAllowedFiltering = false;
                    g.IsProcessPart = true;
                    g.IsRowChange = true;//added by Manoj Kumar
                    g.IsRowDataBound = true;//added by Manoj Kumar
                    g.IsVirtualScroll = false;
                    g.IsActionRequired = false;
                    g.IsDisplayOnly = false;
                    g.ProcessName = ProcessName;


                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "CheckIn", IsLocked = false, Title = "Check In", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ULDNo", IsLocked = false, Title = "ULD No/Bulk", DataType = GridDataType.String.ToString(), Width = 90 });
                    //g.Column.Add(new GridColumn { Field = "ULDType", IsLocked = false, Title = "ULD Type", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.Number.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                    g.Column.Add(new GridColumn { Field = "UldArrived", Title = "Uld Arrived", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "NatureOfGoods", Title = "NatureOfGoods", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "SPHCPriority", Title = "SHC Priority", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 80 });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ReceivedPcs", Title = "Received Pcs(Part/ Total)", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "SNo", Value = SNo });
                    g.InstantiateIn(Container);

                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public object GetRecordFlightInformation(string DailyFlightSno)
        {
            try
            {
                object FlightInformation = null;
                try
                {
                    if (!string.IsNullOrEmpty(DailyFlightSno))
                    {
                        FlightInformation FlightInformationList = new FlightInformation();
                        object obj = (object)FlightInformationList;
                        FlightInformation = DataGetRecordService(DailyFlightSno, obj, this.MyModuleID);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }
                catch(Exception ex)// (Exception ex)
                {


                } return FlightInformation;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchAirlineSNo = "", string SearchFlightNo = "", string SearchBoardingPoint = "", string searchFromDate = "", string searchToDate = "", string StartTime = "", string EndTime = "", string FetchAWBList = "0", string LoggedInCity = "", string DailyFlightSno = "")
        {
           
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            //htmlFormAdapter.objFormData = GetRecordFlightInformation(DailyFlightSno);
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
                        switch (processName.ToUpper())
                        {
                            case "FLIGHTARRIVAL":
                                if (appName.ToUpper().Trim() == "FLIGHTARRIVAL")
                                    CreateGrid(myCurrentForm, processName, SearchAirlineSNo, SearchFlightNo, SearchBoardingPoint, searchFromDate, searchToDate, StartTime, EndTime, FetchAWBList, LoggedInCity);
                                else if (appName.ToUpper().Trim() == "FlightArrivalShipment".ToUpper())
                                    CreateNestedFligthArrivalalLDGrid(myCurrentForm, DailyFlightSno);
                                //CreateFlightArrivalShipmentGrid(myCurrentForm, "FAShipmentInfo", DailyFlightSno);
                                break;

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
     }
    }


