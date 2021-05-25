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
using CargoFlash.Cargo.Model.Shipment;
using System.Globalization;
using System.Net;




namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BookingService : SignatureAuthenticate, IBookingService
    {
        public BookingService()
            : base()
        {
        }


        public DataSourceResult GetWMSWaybillGridData(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {

            // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
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

                ProcName = "GetListWMSBookingParam";

                string filters = GridFilter.ProcessFilters<WMSBookingGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("FlightDate", "FlightDateSearch").Replace("AWBDate", "AWBDateSearch")), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@LoggedInCity", LoggedInCity), new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsSLI", "1") };

                //SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSBookingGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    SLIStatus = e["SLIStatus"].ToString(),
                    AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    //ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FWBPCSWT = e["FWBPCSWT"].ToString(),
                    SLIPCSWT = e["SLIPCSWT"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    Status = e["Status"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                    ProductName = e["ProductName"].ToString(),
                    NoOfHouse = e["NoOfHouse"].ToString(),
                    AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    Shipper = "",
                    Consignee = "",
                    HandlingInfo = "",
                    XRay = "",
                    Location = "",
                    Payment = "",
                    Dimension = "",
                    Weight = "",
                    Reservation = "",
                    HAWB = "",
                    ShippingBill = "",
                    Document = "",
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),// Added by RH 12-08-15
                    FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),// Added by RH 12-08-15
                    RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString()),// Added by RH 12-08-15
                    SPHC = e["SPHC"].ToString(),
                    IsDirectAcceptance = e["IsDirectAcceptance"].ToString(),
                    AdviceCode = e["AdviceCode"].ToString(),
                    TerminalName = e["TerminalName"].ToString(),
                    TransactionType = e["TransactionType"].ToString(),
                    InternationalORDomestic = e["InternationalORDomestic"].ToString(),
                    AccountTypeSNo = e["AccountTypeSNo"].ToString(),
                    OriginAirportCode = e["OriginAirportCode"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                    LateAWBHoldSNo = e["LateAWBHoldSNo"].ToString(),
                    IsApprovedLateAWBHold = e["IsApprovedLateAWBHold"].ToString(),
					SLISNo= Convert.ToInt32(e["SLISNo"].ToString() == "" ? "0" : e["SLISNo"].ToString()),
					ETD = e["ETD"].ToString(),
                    ETA = e["ETA"].ToString(),

                    RECEIPTSNO = e["RECEIPTSNO"].ToString(),
                    WOSNO= e["WOSNO"].ToString(),
                    INVOICESNO = e["INVOICESNO"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    AcceptanceTime = e["AcceptanceTime"].ToString(),
                    AcceptanceDate = e["AcceptanceDate"].ToString(),
                    Userid = ((Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UserName = ((Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName.ToString()
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

        public DataSourceResult FWBGetWMSWaybillGridData(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string PageName, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {

            // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
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
                //if (PageName == "TRANSITFWB")
                //{
                //    ProcName = "GetListTransitFWB";
                //}
                //else
                //{
                ProcName = "GetListWMSBookingParam";
                ////}


                string filters = GridFilter.ProcessFilters<WMSBookingGridData>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters.Replace("FlightDate", "FlightDateSearch").Replace("AWBDate", "AWBDateSearch")), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@OriginCity", OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity), 
                                            new SqlParameter("@FlightNo", FlightNo), 
                                            new SqlParameter("@FlightDate", FlightDate), 
                                            new SqlParameter("@AWBPrefix", AWBPrefix), 
                                            new SqlParameter("@AWBNo", AWBNo), 
                                            new SqlParameter("@LoggedInCity", LoggedInCity), 
                                            new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), 
                                            new SqlParameter("@IsSLI", "0")   ,
                                            new SqlParameter("@MovementType", "0")
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSBookingGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    Status = e["Status"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                    ProductName = e["ProductName"].ToString(),
                    NoOfHouse = e["NoOfHouse"].ToString(),
                    AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    Shipper = "",
                    Consignee = "",
                    HandlingInfo = "",
                    XRay = "",
                    Location = "",
                    Payment = "",
                    Dimension = "",
                    Weight = "",
                    Reservation = "",
                    HAWB = "",
                    ShippingBill = "",
                    Document = "",
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),// Added by RH 12-08-15
                    FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),// Added by RH 12-08-15
                    RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString()),// Added by RH 12-08-15
                    SPHC = e["SPHC"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
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

        public DataSourceResult GetTransitFWBGridData(BookingGetTranistFWBGrid model, string PageName, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetListTransitFWB";
                string filters = GridFilter.ProcessFilters<WMSBookingGridData>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters.Replace("FlightDate", "FlightDateSearch").Replace("AWBDate", "AWBDateSearch")), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@OriginCity", model.OriginCity),
                                            new SqlParameter("@DestinationCity", model.DestinationCity), 
                                            new SqlParameter("@FlightNo", model.FlightNo), 
                                            new SqlParameter("@FlightDate", model.FlightDate), 
                                            new SqlParameter("@AWBPrefix", model.AWBPrefix), 
                                            new SqlParameter("@AWBNo", model.AWBNo), 
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity), 
                                            new SqlParameter("@LoggedInAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), 
                                          /*For MultCity */  new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),  /*For MultCity */ 
                                            new SqlParameter("@IsSLI", "0")   ,
                                            new SqlParameter("@MovementType", "0")
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSBookingGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    Status = e["Status"].ToString(),
                    CommodityCode = e["CommodityCode"].ToString(),
                    ProductName = e["ProductName"].ToString(),
                    NoOfHouse = e["NoOfHouse"].ToString(),
                    AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    Shipper = "",
                    Consignee = "",
                    HandlingInfo = "",
                    XRay = "",
                    Location = "",
                    Payment = "",
                    Dimension = "",
                    Weight = "",
                    Reservation = "",
                    HAWB = "",
                    ShippingBill = "",
                    Document = "",
                    IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    WarningRemarks = e["WarningRemarks"].ToString(),
                    FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),
                    FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),
                    RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString()),
                    SPHC = e["SPHC"].ToString()
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

        public DataSourceResult GetWMSHAWBGridData(string AWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetListWMSHAWB";

                string filters = GridFilter.ProcessFilters<WMSHAWBGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBSNo", AWBSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSHAWBGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    HAWBNo = e["HAWBNo"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString() == "" ? "0" : e["GrossWeight"].ToString()),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString() == "" ? "0" : e["VolumeWeight"].ToString()),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString())
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
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


        public DataSourceResult GetWMSShipppingBillGridData(string AWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetListWMSShippingBill";

                string filters = GridFilter.ProcessFilters<WMSShippingBillGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBSNo", AWBSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSShippingBillGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ShippingBillNo = Convert.ToInt32(e["ShippingBillNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    MessageType = e["MessageType"].ToString(),
                    AWBType = e["AWBType"].ToString(),
                    LEONo = e["LEONo"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
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


        public DataSourceResult GetWMSCheckListGridData(string AWBSNo, string CheckListTypeSNo, string SPHCSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetListWMSCheckList";

                string filters = GridFilter.ProcessFilters<WMSCheckListGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@CheckListTypeSNo", CheckListTypeSNo), new SqlParameter("@SPHCSNo", SPHCSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSCheckListGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CheckListTypeSNo = Convert.ToInt32(e["CheckListTypeSNo"]),
                    SrNo = e["SrNo"].ToString(),
                    Description = e["Description"].ToString(),
                    Y = e["Y"].ToString(),
                    N = e["N"].ToString(),
                    NA = e["NA"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    Column1 = e["Column1"].ToString(),
                    Column2 = e["Column2"].ToString(),
                    Column3 = e["Column3"].ToString(),
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()):0,
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
        //-- RH 030815 starts
        public DataSourceResult GetEDIGridData(string AWBNo, string FlightNo, string FlightDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetEDIIMessageForAWB";

                string filters = GridFilter.ProcessFilters<WMSShippingBillGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSEDIGridData
                {
                    CarrierCode = e["CarrierCode"].ToString(),
                    MessageType = e["MessageType"].ToString(),
                    GeneratedXml = e["GeneratedXml"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightOrigin = e["FlightOrigin"].ToString(),
                    FlightDestination = e["FlightDestination"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    SentAddress = e["SentAddress"].ToString(),
                    UpdatedOn = e["UpdatedOn"].ToString()
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
        //-- RH 030815 ends
    }
}