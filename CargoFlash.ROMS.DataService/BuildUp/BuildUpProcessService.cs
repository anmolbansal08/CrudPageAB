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
using CargoFlash.Cargo.Model.BuildUp;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.DataService.Common;
using System.Net;
using System.IO;




namespace CargoFlash.Cargo.DataService.BuildUp
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BuildUpProcessService : SignatureAuthenticate, IBuildUpProcessService
    {

        public DataSourceResult GetGridData(GetGridDataModel model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetBuildupGrid";

                string filters = GridFilter.ProcessFilters<Buildup>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSNo", model.DailyFlightSNo) };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new Buildup
                {
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    MCBookingSNo = Convert.ToInt32(e["MCBookingSNo"]),
                    FPSNo = Convert.ToInt32(e["FPSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"].ToString()),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString),
                    OriginCity = e["OriginCity"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    LoadPieces = Convert.ToInt32(e["LoadPieces"]),
                    LoadGrossWeight = Convert.ToDecimal(e["LoadGrossWeight"]),
                    LoadVol = Convert.ToDecimal(e["LoadVol"]),
                    SPHC = e["SPHC"].ToString(),
                    Plan = e["Plan"].ToString(),
                    LIPieces = Convert.ToInt32(e["LIPieces"]),
                    FromTable = Convert.ToInt32(e["FromTable"]),
                    FromTableSNo = Convert.ToInt32(e["FromTableSNo"]),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    ShipmentDetail = e["ShipmentOrigin"].ToString() + "-" + e["ShipmentDestination"].ToString(),
                    WeightDetail = e["TotalGrWt"].ToString() + "/" + e["TotalVolWt"].ToString() + "/" + e["CBM"],
                    LoadDetail = "",
                    AWBPieces = e["TotalPieces"].ToString(),
                    AWBGrossWeight = e["TotalGrWt"].ToString(),
                    AWBVolumeWeight = e["TotalVolWt"].ToString(),
                    OffloadStage = e["OffloadStage"].ToString(),
                    ShipmentType = e["ShipmentType"].ToString(),
                    Status = e["Status"].ToString(),
                    CBM = Convert.ToDecimal(e["CBM"]),
                    AWBCBM = Convert.ToDecimal(e["AWBCBM"]),
                    LoadCBM = Convert.ToDecimal(e["LoadCBM"]),
                    ShipmentId = Convert.ToString(e["ShipmentId"]),
                    Action = Convert.ToString(e["Action"]),
                    IsPlanned = Convert.ToString(e["IsPlanned"]),
                    Priority = Convert.ToString(e["Priority"]),
                    //IsChanged =Convert.ToInt16(e["IsChanged"])
                    // MCBookingSNo = Convert.ToInt32(e["MCBookingSNo"]),

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetOffloadedULDGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                //ProcName = "GetULDRecord";
                ProcName = "GetOffloadedULDsForBuildup";

                string filters = GridFilter.ProcessFilters<Buildup>(filter);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new BuildupOffLoadedULD
                {
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),                 
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    OriginAirportCode=e["OriginAirportCode"].ToString(),
                    DestinationAirportCode=e["DestinationAirportCode"].ToString()
                   
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public DataSourceResult GetULDGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                //ProcName = "GetULDRecord";
                ProcName = "GetBuildFlightULD";

                string filters = GridFilter.ProcessFilters<Buildup>(filter);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new BuildupULD
                {
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                    MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                    EmptyWeight = Convert.ToDecimal(e["EmptyWeight"]),
                    ULDNo = e["ULDNo"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    //DailyFlightSNo = e["DailyFlightSNo"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    SNo = Convert.ToInt32(e["SNo"]),            // Daily Flight Sno
                    Status = e["Status"].ToString(),
                    Shipments = Convert.ToInt32(e["Shipments"]),
                    Total = "",
                    Used = e["Used"].ToString(),
                    LastPoint = e["LastPoint"].ToString(),
                    Remove = "",
                    ULDWeight = e["ULDWeight"].ToString(),
                    IsBUP = e["IsBUP"].ToString(),
                    ULDStatus = e["ULDStatus"].ToString(),
                    IsUWS = e["IsUWS"].ToString(), //added for AssignEquipmentBulk 
                    SHC = e["SHC"].ToString(),
                    ShipmentId = Convert.ToString(e["ShipmentId"]).Trim(),
                    IsCart = Convert.ToBoolean(e["IsCart"]),
                    EquipmentSNo = Convert.ToString(e["EquipmentSNo"]),
                    FlightStatus=e["FlightStatus"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

      


        public DataSourceResult GetULDChildGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);


                string ProcName = "";

                GridFilter filters = new GridFilter();
                filters.Logic = "AND";
                filters.Filters = new List<GridFilter>();
                filters.Filters.Add(filter);

                DataSet ds = new DataSet();

                ProcName = "GetBuildFlightULDChild";

                string filterValue = GridFilter.ProcessFilters<BuildupULDChild>(filters);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filterValue), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Dailyflightsno", DailyFlightSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new BuildupULDChild
                {
                    AWBSno = Convert.ToInt32(e["AWBSno"]),
                    AwbNo = e["AwbNo"].ToString(),
                    MCBookingSNo = Convert.ToInt32(e["MCBookingSNo"]),
                    DailyFlightSno = Convert.ToInt32(e["DailyFlightSno"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    OriginCity = e["OriginCity"].ToString(),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    SPHC = e["SPHC"].ToString(),
                    FromTable = 3,
                    FromTableSNo = Convert.ToInt32(e["SNo"]),
                    FromTableTotalPieces = Convert.ToInt32(e["Pieces"]),
                    ShipmentDetail = e["ShipmentOrigin"].ToString() + "-" + e["ShipmentDestination"].ToString(),
                    AWBPieces = e["TotalPieces"].ToString(),
                    AWBGrossWeight = e["TotalGrWt"].ToString(),
                    AWBVolumeWeight = e["TotalVolWt"].ToString(),
                    OffloadStage = "",
                    AWBOffPoint = e["AWBOffPoint"].ToString(),
                    ConnectingFlight = e["ConnectingFlight"].ToString(),
                    ConnectingFlightSNo = e["ConnectingFlightSNo"].ToString(),
                    ShipmentType = e["ShipmentType"].ToString(),
                    Status = e["Status"].ToString(),
                    CBM = Convert.ToDecimal(e["CBM"]),
                    AWBCBM = Convert.ToDecimal(e["AWBCBM"]),
                    LoadCBM = Convert.ToDecimal(e["LoadCBM"]),
                    ShipmentId = Convert.ToString(e["ShipmentId"]).Trim(),
                    Action = Convert.ToString(e["Action"]).Trim(),
                    Priority = Convert.ToString(e["Priority"]),
                    HDQ=Convert.ToString(e["HDQ"])
                    //IsChanged = Convert.ToInt16(e["IsChanged"])
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filterValue,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public DataSourceResult GetOffloadedULDChildGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);


                string ProcName = "";

                GridFilter filters = new GridFilter();
                filters.Logic = "AND";
                filters.Filters = new List<GridFilter>();
                filters.Filters.Add(filter);

                DataSet ds = new DataSet();

                ProcName = "GetBuildFlightOffloadedULDChild";

                string filterValue = GridFilter.ProcessFilters<BuildupULDChild>(filters);

                //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Type", FlightNo), new SqlParameter("@ULDName", FlightStatus) };
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filterValue), new SqlParameter("@OrderBy", sorts), new SqlParameter("@Dailyflightsno", DailyFlightSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new BuildupOffloadedULDChild
                {
                    AWBSno = Convert.ToInt32(e["AWBSno"]),
                    AwbNo = e["AwbNo"].ToString(),
                
                    DailyFlightSno = Convert.ToInt32(e["DailyFlightSno"]),
                  
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    SPHC = e["SPHC"].ToString(),
                    AWBSector=e["AWBSector"].ToString(),
                    ULDNo=e["ULDNo"].ToString()

                    //IsChanged = Convert.ToInt16(e["IsChanged"])
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filterValue,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string GetFlightDetails(string FlighDate, string City)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FlightDate", FlighDate), new SqlParameter("@City", City) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightByDate", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetULDDetails(string ULDStockSNo, string GroupFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo) ,
                                        new SqlParameter("@GroupFlightSNo", GroupFlightSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetBuildUpFlightDetails(BuildUpFlightDetails Model)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Dailyflightsno", Model.DailyFlightSNo),
                                               new SqlParameter("@LoggedInCity", Model.City),
                                                new SqlParameter("@AirlineSNo", Model.AirlineSNo),
                                                 new SqlParameter("@UserSNo", Model.UserSNo),
                                                 new SqlParameter("@FlightDate", Model.FlightDate),
                                                 new SqlParameter("@AirportSNo", Model.AirportSNo)



                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightRouteDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public DataSourceResult GetLyingListGridData(GetLyingListGridDataModel model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetLyingListBuildUpGridData";

                string filters = GridFilter.ProcessFilters<LyingBuildup>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightNo", model.FlightNo), new SqlParameter("@FlightDate", model.FlightDate), new SqlParameter("@Origin", model.Origin), new SqlParameter("@Destination", model.Destination), new SqlParameter("@AWBNo", model.AWBNo), new SqlParameter("@LoggedInCity", model.LoggedInCity), new SqlParameter("@DailyFlightSNo", model.DailyFlightSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new LyingBuildup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    MCBookingSNo = Convert.ToInt32(e["MCBookingSNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    FPSNo = Convert.ToInt32(e["FPSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString),
                    OriginCity = e["OriginCity"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    LoadPieces = Convert.ToInt32(e["LoadPieces"]),
                    LoadGrossWeight = Convert.ToDecimal(e["LoadGrossWeight"]),
                    LoadVol = Convert.ToDecimal(e["LoadVol"]),
                    SPHC = e["SPHC"].ToString(),
                    Plan = e["Plan"].ToString(),
                    LIPieces = Convert.ToInt32(e["LIPieces"]),
                    FromTable = Convert.ToInt32(e["FromTable"]),
                    FromTableSNo = Convert.ToInt32(e["FromTableSNo"]),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    //ShipmentDetail = e["ShipmentOrigin"].ToString() + "-" + e["ShipmentDestination"].ToString() + "/" + e["FlightNo"].ToString() + "/" + (e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MM")),
                    ShipmentDetail = e["ShipmentInfo"].ToString(),
                    WeightDetail = e["TotalGrWt"].ToString() + "/" + e["TotalVolWt"].ToString() + "/" + e["CBM"],
                    LoadDetail = "",
                    AWBPieces = e["TotalPieces"].ToString(),
                    AWBGrossWeight = e["TotalGrWt"].ToString(),
                    AWBVolumeWeight = e["TotalVolWt"].ToString(),
                    OffloadStage = e["OffloadStage"].ToString(),
                    ShipmentType = e["ShipmentType"].ToString(),
                    Status = e["Status"].ToString(),
                    CBM = Convert.ToDecimal(e["CBM"]),
                    AWBCBM = Convert.ToDecimal(e["AWBCBM"]),
                    LoadCBM = Convert.ToDecimal(e["LoadCBM"]),
                    Priority = e["Priority"].ToString()
                    // IsChanged =Convert.ToBoolean(e["IsChanged"])
                    // MCBookingSNo = Convert.ToInt32(e["MCBookingSNo"])

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetOffloadListFromProcessGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetOffloadListFromProcessGridData";

                string filters = GridFilter.ProcessFilters<Buildup>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new Buildup
                {
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString),
                    OriginCity = e["OriginCity"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    LoadPieces = Convert.ToInt32(e["LoadPieces"]),
                    LoadGrossWeight = Convert.ToDecimal(e["LoadGrossWeight"]),
                    LoadVol = Convert.ToDecimal(e["LoadVol"]),
                    SPHC = e["SPHC"].ToString(),
                    Plan = e["Plan"].ToString(),
                    LIPieces = Convert.ToInt32(e["LIPieces"]),
                    FromTable = Convert.ToInt32(e["FromTable"]),
                    FromTableSNo = Convert.ToInt32(e["FromTableSNo"]),

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string SaveBuildOffloadedULD(List<ProcessedOffLoadedULD> ProcessedULDInfo)
        {
            try
            {
               
                DataTable dtProcessedULDInfo = CollectionHelper.ConvertTo(ProcessedULDInfo, "");
             
                //if(dtShipmentInformation!=null)
                //{
                //    dtShipmentInformation.Columns.Add("DailyFlightSNo", typeof(int));
                //}

                BaseBusiness baseBusiness = new BaseBusiness();

                SqlParameter paramProcessedULDInfo = new SqlParameter();
                paramProcessedULDInfo.ParameterName = "@ULDInfo";
                paramProcessedULDInfo.SqlDbType = System.Data.SqlDbType.Structured;
                paramProcessedULDInfo.Value = dtProcessedULDInfo;

               
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            paramProcessedULDInfo,
                                           new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                           new SqlParameter("@AirportSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveBuildUpOffloadshipmentShipment", Parameters);//SaveBuildUpShipmentDetails
                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

            



                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                //return null;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string SaveBuildUpPlan(List<ProcessedULDInfo> ProcessedULDInfo, List<ProcessedULDShipment> ProcessedULDShipment, List<ProcessedAWB> ProcessedAWB, List<POMailDNDetails> POMailDNDetails, ProcessedFlightInfo ProcessedFlightInfo, Int32 UpdatedBy, string RemovedULD, string GroupFlightSNo, int AirportSNo)
        {
            try
            {
                List<ProcessedFlightInfo> lstProcessedFlightInfo = new List<ProcessedFlightInfo>();
                lstProcessedFlightInfo.Add(ProcessedFlightInfo);

                DataTable dtProcessedULDInfo = CollectionHelper.ConvertTo(ProcessedULDInfo, "");
                DataTable dtProcessedULDShipment = CollectionHelper.ConvertTo(ProcessedULDShipment, "");
                DataTable dtFlightInformation = CollectionHelper.ConvertTo(lstProcessedFlightInfo, "");
                DataTable dtShipmentInformation = CollectionHelper.ConvertTo(ProcessedAWB, "ConnectingFlightSNo");
                DataTable dtPOMailDNDetails = CollectionHelper.ConvertTo(POMailDNDetails, "OriginCity,DestinationCity,MailCategory,SubCategory,ReceptacleNumber,ReceptacleWeight,DNNo");

                //if(dtShipmentInformation!=null)
                //{
                //    dtShipmentInformation.Columns.Add("DailyFlightSNo", typeof(int));
                //}

                BaseBusiness baseBusiness = new BaseBusiness();

                SqlParameter paramProcessedULDInfo = new SqlParameter();
                paramProcessedULDInfo.ParameterName = "@ProcessedULDInfo";
                paramProcessedULDInfo.SqlDbType = System.Data.SqlDbType.Structured;
                paramProcessedULDInfo.Value = dtProcessedULDInfo;

                SqlParameter paramProcessedULDShipment = new SqlParameter();
                paramProcessedULDShipment.ParameterName = "@ProcessedULDShipment";
                paramProcessedULDShipment.SqlDbType = System.Data.SqlDbType.Structured;
                paramProcessedULDShipment.Value = dtProcessedULDShipment;

                SqlParameter paramShipmentInformation = new SqlParameter();
                paramShipmentInformation.ParameterName = "@ProcessedAWBLst";
                paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramShipmentInformation.Value = dtShipmentInformation;

                SqlParameter paramFlight = new SqlParameter();
                paramFlight.ParameterName = "@ProcessedFlightInfo";
                paramFlight.SqlDbType = System.Data.SqlDbType.Structured;
                paramFlight.Value = dtFlightInformation;

                SqlParameter POMailDNDetailsInfo = new SqlParameter();
                POMailDNDetailsInfo.ParameterName = "@POMailDNDetailsInfo";
                POMailDNDetailsInfo.SqlDbType = System.Data.SqlDbType.Structured;
                POMailDNDetailsInfo.Value = dtPOMailDNDetails;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            paramProcessedULDInfo,
                                            paramProcessedULDShipment,
                                            paramShipmentInformation,
                                            paramFlight,
                                            POMailDNDetailsInfo,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@RemovedULD",RemovedULD),
                                            new SqlParameter("@GroupFlightSNoList",GroupFlightSNo),
                                            new SqlParameter("@AirportSNo",AirportSNo)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveBuildUpShipmentDetails_New", Parameters);//SaveBuildUpShipmentDetails
                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

                string strGroupFlightSNo = GroupFlightSNo;

                var query = from val in strGroupFlightSNo.Split(',')
                            select int.Parse(val);
                foreach (int num in query)
                {
                    if (msg == "")
                    {
                        CommonService.SaveFlightSubProcessTrans(num, 4, 31, true, "Please make buildup first");
                    }
                    else
                    {
                        CommonService.SaveFlightSubProcessTrans(num, 4, 31, false, "Please make buildup first");
                    }
                }



                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                //return null;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string SaveULDDetails(ULDDetails ULDDetails, List<ULDConsumables> ULDConsumables, Int32 ULDStockSNo, Int32 DailyFlightSNo, Int32 UpdatedBy, ULDBuildUpOverhangPallet ULDBuildUpOverhangPallet, List<ULDBuildUpOverhangTrans> ULDBuildUpOverhangTrans, string CityCode, decimal ULDGrWT, decimal ULDVolumeWeight, int AirportSNo, string ULDSHC)
        {
            try
            {
                List<ULDDetails> lstULDDetails = new List<ULDDetails>();
                lstULDDetails.Add(ULDDetails);

                DataTable dtULDDetails = CollectionHelper.ConvertTo(lstULDDetails, "IsOverhangPallet,Location,Build,LoadCode,LoadIndicator,AbbrCode");
                DataTable dtULDConsumables = CollectionHelper.ConvertTo(ULDConsumables, "");


                List<ULDBuildUpOverhangPallet> lstULDBuildUpOverhangPallet = new List<ULDBuildUpOverhangPallet>();
                lstULDBuildUpOverhangPallet.Add(ULDBuildUpOverhangPallet);

                DataTable dtOverhangMaster = CollectionHelper.ConvertTo(lstULDBuildUpOverhangPallet, "");
                DataTable dtOverhangTrans = CollectionHelper.ConvertTo(ULDBuildUpOverhangTrans, "IsFFMRemarks");

                BaseBusiness baseBusiness = new BaseBusiness();

                SqlParameter paramULDDetails = new SqlParameter();
                paramULDDetails.ParameterName = "@ULDDetails";
                paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramULDDetails.Value = dtULDDetails;

                SqlParameter paramULDConsumables = new SqlParameter();
                paramULDConsumables.ParameterName = "@ULDConsumables";
                paramULDConsumables.SqlDbType = System.Data.SqlDbType.Structured;
                paramULDConsumables.Value = dtULDConsumables;

                SqlParameter paramOverhangMaster = new SqlParameter();
                paramOverhangMaster.ParameterName = "@OverhangMaster";
                paramOverhangMaster.SqlDbType = System.Data.SqlDbType.Structured;
                paramOverhangMaster.Value = dtOverhangMaster;

                SqlParameter paramOverhangTrans = new SqlParameter();
                paramOverhangTrans.ParameterName = "@OverhangTrans";
                paramOverhangTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramOverhangTrans.Value = dtOverhangTrans;

                //if((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])==null)
                //{
                //    return "SessionExpired";
                //}

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            paramULDDetails,
                                            paramULDConsumables,
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo),
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@UpdatedBy", UpdatedBy),
                                            paramOverhangMaster,
                                            paramOverhangTrans,
                                            new SqlParameter("@CityCode", CityCode),
                                             new SqlParameter("@ULDGrossWeight", ULDGrWT),
                                            new SqlParameter("@ULDVolumeWeight", ULDVolumeWeight),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@ULDSHC",ULDSHC)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveULDDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetULDBuildUpDetails(Int32 ULDStockSNo, Int32 DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo),
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDBuildUpDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string CheckForSPHCRestriction(List<ProcessedShipmentForBuildUp> ProcessedShipmentInfo, string ULDStockSNo, string AircraftTypeSNo, string CheckedAWBSNo)
        {
            /*
            DataTable dtProcessedShipmentInfo = CollectionHelper.ConvertTo(ProcessedShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramProcessedShipment = new SqlParameter();
            paramProcessedShipment.ParameterName = "@ProcessedShipment";
            paramProcessedShipment.SqlDbType = System.Data.SqlDbType.Structured;
            paramProcessedShipment.Value = dtProcessedShipmentInfo;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramProcessedShipment, new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@AircraftTypeSNo", AircraftTypeSNo), new SqlParameter("@CheckedAWBSNo", CheckedAWBSNo) };*/
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AircraftSNo", AircraftTypeSNo),
                                            new SqlParameter("@SPHCCode", ULDStockSNo)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CheckForSPHCRestriction_New", Parameters); //CheckForSPHCRestriction
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string getAirlineULDDetails(string ULDType, string ULDCity)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDType", ULDType), new SqlParameter("@ULDCity", ULDCity) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getAirlineULDDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetULDPrint(string DailyFlightSNo, string ULDStockSNo, string UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo),
                                            new SqlParameter("@UserSNo", UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "PrintULDTagBuildUP", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckForDGR(string SPHC)
        {
            try
            {
                int TotalDGR = 0;
                SqlParameter[] Parameters = {
                                            new SqlParameter("@SPHCCode", SPHC),
                                        };

                TotalDGR = Convert.ToInt32(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckForDGR", Parameters));
                return TotalDGR.ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAircraftCapacity(string AircraftNo, string CarrierCode)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AircraftNo", AircraftNo) ,
                                            new SqlParameter("@CarrierCode", CarrierCode)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAircraftCapacity", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckOnHoldShipment(Int32 AWBSNo, int McBookingSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo) ,
                                            new SqlParameter("@McBookingSNo", McBookingSNo) ,
                                           new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

                                        };
                DataSet dsResult = new DataSet();

                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckOnHoldShipment", Parameters);
                //return dsResult.Tables[0].Rows[0]["Result"].ToString();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);// changed by Sushant Kumar Nayak  Desc:Retun Multiple table 
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckFlight(string FlightNo, string FlightDate, string OriginCity)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@FlightNo", FlightNo),
                                            new SqlParameter("@FlightDate", FlightDate),
                                            new SqlParameter("@OriginCity", OriginCity)
                                        };
                DataSet dsResult = new DataSet();

                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckBuildupFlight", Parameters);
                return dsResult.Tables[0].Rows[0]["Result"].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDestinationAgainstFPSNo(int FPSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FPSNo", FPSNo) };
                DataSet dsResult = new DataSet();

                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDestinationAgainstFPSNo", Parameters);

                if (dsResult.Tables[0].Rows.Count > 0)
                    return dsResult.Tables[0].Rows[0]["Destination"].ToString();
                else
                    return "";
            }

            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string POMailDNInfo(string GroupFlightSNo, int ULDStockSNo, int MCBookingSNo, string Stage)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@GroupFlightSNo", GroupFlightSNo), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@MCBookingSNo", MCBookingSNo), new SqlParameter("@Stage", Stage), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "sp_GetFC_DNDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string IsInternationalOffpoint(string UldOffPoint, string ShipmentDestination)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UldOffPoint", UldOffPoint), new SqlParameter("@ShipmentDestination", ShipmentDestination) };
                DataSet ds = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "sp_IsInternationOffPoint", Parameters);

                if (ds != null)
                    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                else
                    return "";
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string MoveToLyingList(string DailyFlightSNo, string ShipmentType, int ShipmentNo, int recordSNo, int UldStockSNo, int Pieces, decimal GrossWeight, decimal Volume, decimal CBM, bool IsPlanned)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@ShipmentType", ShipmentType),
                                            new SqlParameter("@ShipmentNo", ShipmentNo),
                                            new SqlParameter("@RecordSNo", recordSNo),
                                            new SqlParameter("@UldStockSNo", UldStockSNo),
                                            new SqlParameter("@Pieces", Pieces),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@Volume", Volume),
                                            new SqlParameter("@CBM",CBM),
                                            new SqlParameter("@IsPlanned",IsPlanned),
                                            new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@AirportSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo),
                                            new SqlParameter("@AirlineSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirlineSNo),
                                        };
                DataSet dsResult = new DataSet();

                dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spMoveToLyingFromBuildUp", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Stream BuildUPReport(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BuildUpReport", Parameters);
                byte[] resultBytes = Encoding.UTF8.GetBytes(GetReportHTML(ds));
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultBytes);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetReportHTML(DataSet ds)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    string logo = ds.Tables[3].Rows[0][0].ToString();
                    string[] logopath = logo.Split('/');
                    logo = logopath[3] + "/" + logopath[4];

                    tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                    tbl.Append("<tr align=\"center\"><td colspan=\"14\" ><img src='../BLOBUploadAndDownload/DownloadFromBlob/?filenameOrUrl=" + ds.Tables[0].Rows[0]["AirlineLogo"].ToString() + "' width='300px' height='90px' onError='this.onerror=null;this.src=\"" + logo + "\";' /></td></tr><tr align=\"center\"><td colspan=\"14\"></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"14\" ><h2>BUILD UP PLAN REPORT</h2></td></tr> ");

                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["Operator"].ToString() + "</td>");
                    tbl.Append("<td colspan=\"2\" align=\"left\">Aircraft Reg no</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["AircraftType"].ToString() + "</td>");
                    tbl.Append("<td colspan=\"2\" align=\"left\">Routing</td><td colspan=\"4\" align=\"left\" >" + ds.Tables[0].Rows[0]["Routing"].ToString() + "</td></tr>");

                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Flight Date</td><td align=\"left\" colspan=\"2\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td align=\"left\" colspan=\"2\">STD</td><td align=\"left\" colspan=\"4\">" + ds.Tables[0].Rows[0]["STD"].ToString()+ "</td></tr>");


                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["PointOfLoading"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["PointOfUnloading"].ToString() + "</td><td colspan=\"2\" align=\"left\">LI Versions</td><td colspan=\"4\" align=\"left\">" + ds.Tables[0].Rows[0]["LIVersions"].ToString() + "</td></tr>");

                    tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">FlightCapacity</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightCapacity"].ToString() + "</td><td colspan=\"2\" align=\"left\">Created By</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["CreatedBy"].ToString() + "</td><td colspan=\"2\" align=\"left\"></td><td colspan=\"4\" align=\"left\"></td></tr>");
                    
                    tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"10\" style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
                    tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">Total volume</td><td colspan=\"1\" class=\"grdTableHeader\">Agent</td><td colspan=\"1\" class=\"grdTableHeader\">Product</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">SHC</td><td colspan=\"1\" class=\"grdTableHeader\">Priority</td><td colspan=\"1\" class=\"grdTableHeader\">Location</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Ofice Use</td></tr>");
                    int count= ds.Tables[1].Rows.Count;
                    DataTable ULD = null;
                    ULD = ds.Tables[1];
                    int j = 1;
                    foreach (DataRow dtULD in ULD.Rows)
                    {
                        if (dtULD["CSSStyle"].ToString().ToUpper() == "BLUE")
                        {
                            if (j == 1)
                            {
                                tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"14\" style=\"background-color:95B1ED\" >Build Up Plan</td></tr>");
                            }
                            tbl.Append("<tr align=\"center\" class=\"grdTableRow\" style=\"background-color:95B1ED\" ><td colspan=\"1\" style=\"width:20px;\">" + j.ToString() + "</td><td colspan=\"1\" >" + dtULD["AWBNo"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Pieces"].ToString() + "</td><td colspan=\"1\" >" + dtULD["NatureOfGoods"].ToString() + "</td><td colspan=\"1\">" + dtULD["GrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["VolumeWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["AgentName"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Product"].ToString() + "</td><td colspan=\"1\" >" + dtULD["ORIandDest"].ToString() + "</td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td></tr>");
                            j++;
                        }
                    }
                    int a = 1;
                    foreach (DataRow dtULD in ULD.Rows)
                    {
                        if (dtULD["CSSStyle"].ToString().ToUpper()=="YELLOW" && dtULD["ULDType"].ToString().ToUpper()!="BULK") {
                            if (dtULD["ULDType"].ToString().ToUpper() != "BULK") { a = 1; }
                                tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"14\" style=\"background-color:yellow\" >" + dtULD["ULDType"].ToString() + "</td></tr>");
                            tbl.Append("<tr align=\"center\" class=\"grdTableRow\" style=\"background-color:yellow\" ><td colspan=\"1\" style=\"width:20px;\">" + a.ToString() + "</td><td colspan=\"1\" >" +dtULD["AWBNo"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Pieces"].ToString() + "</td><td colspan=\"1\" >" + dtULD["NatureOfGoods"].ToString() + "</td><td colspan=\"1\">" + dtULD["GrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["VolumeWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["AgentName"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Product"].ToString() + "</td><td colspan=\"1\" >" + dtULD["ORIandDest"].ToString() + "</td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td></tr>");
                            a++;
                        }
                    }
                    int r = 1;
                    foreach (DataRow dtULD in ULD.Rows)
                    {
                        if (dtULD["CSSStyle"].ToString().ToUpper() == "YELLOW" && dtULD["ULDType"].ToString().ToUpper()=="BULK")
                        {
                            if (r==1)
                            {
                                tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"14\" style=\"background-color:yellow\" >" + dtULD["ULDType"].ToString() + "</td></tr>");
                            }
                            tbl.Append("<tr align=\"center\" class=\"grdTableRow\" style=\"background-color:yellow\" ><td colspan=\"1\" style=\"width:20px;\">" + r.ToString() + "</td><td colspan=\"1\" >" + dtULD["AWBNo"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Pieces"].ToString() + "</td><td colspan=\"1\" >" + dtULD["NatureOfGoods"].ToString() + "</td><td colspan=\"1\">" + dtULD["GrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["VolumeWeight"].ToString() + "</td><td colspan=\"1\" >" + dtULD["AgentName"].ToString() + "</td><td colspan=\"1\" >" + dtULD["Product"].ToString() + "</td><td colspan=\"1\" >" + dtULD["ORIandDest"].ToString() + "</td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td><td colspan =\"1\"></td></tr>");
                            r++;
                        }
                    }
                   
                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td  colspan=\"1\" style=\"border-right: none;\"></td><td  colspan=\"1\" style=\"border-right: none;\"><b> Total</b></td><td colspan=\"1\" align=\"center\" >"+ ds.Tables[2].Rows[0]["TotalPlannedPieces"].ToString() + "</td><td colspan=\"1\" align=\"center\">&nbsp;</td><td colspan=\"1\" align=\"center\">" + ds.Tables[2].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" align=\"center\">" + ds.Tables[2].Rows[0]["TotalPlannedVolumeWeight"].ToString() + "</td><td colspan=\"1\" align=\"center\">&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td></tr>");
                    //tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td  colspan=\"2\" style=\"border-right: none;\"><b>No of AWB : " + ds.Tables[2].Rows[0]["AWBCount"].ToString() + "</b></td><td colspan=\"2\" style=\"border-left: none;border-right: none\"><b>Total Pieces : " + ds.Tables[2].Rows[0]["TotalPlannedPieces"].ToString() + "</b></td><td colspan=\"6\" style=\"border-left: none;\" ><b>Total Gross Weight  : " + ds.Tables[2].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</b></td></tr>");

                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"14\">Count of AWB :" + ds.Tables[2].Rows[0]["AWBCount"].ToString() + "     ( BULK : " + ds.Tables[2].Rows[0]["TotalPlannedGrossWeight"].ToString() + "kgs )</td>");
                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan =\"14\">Remarks:</td></tr>");
                    // tbl.Append("<tr align=\"right\"  class=\"grdTableRow;no-print\"  id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" onclick=\"window.print();\"  /></td></tr>");
                    tbl.Append("</table>");
                }

                return tbl.ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

       
    }
}
