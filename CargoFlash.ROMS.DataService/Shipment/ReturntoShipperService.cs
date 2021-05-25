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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReturntoShipperService : BaseWebUISecureObject, IReturntoShipperService
    {
        //public DataSourceResult GetWMSWaybillGridDataFBL(string OriginCity, string DestinationCity, string FlightNo, string FlightDateSearch, string AWBPrefix, string AWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        //{

        //    // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
        //    //FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString)

        //    string sorts = GridSort.ProcessSorting(sort);
        //    string ProcName = "";
        //    if (filter == null)
        //    {
        //        filter = new GridFilter();
        //        filter.Logic = "AND";
        //        filter.Filters = new List<GridFilter>();
        //    }
        //    DataSet ds = new DataSet();

        //    ProcName = "GetListWMSBookingParamFBL";

        //    string filters = GridFilter.ProcessFilters<WMSBookingGridDataFBL>(filter);

        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDateSearch", FlightDateSearch), new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@LoggedInCity", LoggedInCity)/*For Multicity*/ , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()) };

        //    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

        //    var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSBookingGridDataFBL
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
        //        AWBNo = e["AWBNo"].ToString(),
        //        AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
        //        ShipmentOrigin = e["ShipmentOrigin"].ToString(),
        //        ShipmentDestination = e["ShipmentDestination"].ToString(),
        //        Origin = e["Origin"].ToString(),
        //        Destination = e["Destination"].ToString(),
        //        Gross = Convert.ToDecimal(e["Gross"].ToString() == "" ? 0 : e["Gross"]),
        //        Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
        //        ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
        //        Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
        //        FlightNo = e["FlightNo"].ToString(),
        //        FlightDateSearch = e["FlightDateSearch"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDateSearch"]), DateTimeKind.Utc),
        //        FlightOrigin = e["FlightOrigin"].ToString(),
        //        FlightDestination = e["FlightDestination"].ToString(),
        //    });
        //    ds.Dispose();
        //    return new DataSourceResult
        //    {
        //        Data = wmsBookingList.AsQueryable().ToList(),
        //        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
        //        FilterCondition = filters,
        //        SortCondition = sorts,
        //        StoredProcedure = ProcName
        //    };
        //}
        //public string GetProcessSequence(string ProcessName)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
        //    ds.Dispose();
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}
        //public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        //{
        //    return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        //}
        public string SaveReturnShipment(List<SaveReturnShipment> SaveReturnShip, string Hawb)
        {
            int ret = 0;

            try
            {
                DataTable DtRetShip = CollectionHelper.ConvertTo(SaveReturnShip, "");
                DtRetShip.Columns.Remove("SNo");
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ReturnShipmentTable", DtRetShip) ,
                                             new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@Hawb", Hawb)


                                        };
                  DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveReturnShipment", Parameters);
                  return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetReturntoShipperData(string AwbSno, int UpdatedBy, string hawbno)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSno",AwbSno),
                                            new SqlParameter("@UpdatedBy",UpdatedBy) ,
                                            new SqlParameter("@hawbno",hawbno) ,
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDetailsReturntoShipperDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetReturntoShipperDataFormReturnShipper(string AwbSno)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSno",AwbSno)

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDetailsReturntoShipperDetailsFromReturntoShipper", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ReturntoShipperGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListReturntoShipper", Parameters);
                var returntoShipperGridDataList = ds.Tables[0].AsEnumerable().Select(e => new ReturntoShipperGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    TotalCharges = e["TotalCharges"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    ReturnDate = e["ReturnDate"].ToString()



                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = returntoShipperGridDataList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }



    }
}
