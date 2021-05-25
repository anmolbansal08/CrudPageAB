using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AllotmentReleaseController : Controller
    {
        //
        // GET: /AllotmentRelease/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult AllotmentReleaseView()
        {
            return View();
        }
        public ActionResult GetFlightData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter,
        string AirlineSNo, string FlightDate, string OriginSNo, string DestinationSNo, string FlightSNo, string OfficeSNo, string AccountSNo, string ShipperAccountSNo, string AllotmentType, string AllotmentSNo)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AllotmentReleaseFlight>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightDate",FlightDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightSNo",FlightSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ShipperAccountSNo",ShipperAccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AllotmentType",AllotmentType),
                                                                    new System.Data.SqlClient.SqlParameter("@AllotmentSNo",AllotmentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAllotmentReleaseFlightData", Parameters);

                var AllotmentReleaseFlightList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Schedule.AllotmentReleaseFlight
                {
                    SNo = e["SNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    //DepDate = e["DepDate"].ToString(),
                    ETD_ETA = e["ETD_ETA"].ToString(),
                    TotalGroUsedAvail = e["TotalGroUsedAvail"].ToString(),
                    TotalVolUsedAvail = e["TotalVolUsedAvail"].ToString(),
                    ReserveGroUsedAvail = e["ReserveGroUsedAvail"].ToString(),
                    ReserveVolUsedAvail = e["ReserveVolUsedAvail"].ToString(),
                    AllotmentGroUsedAvail = e["AllotmentGroUsedAvail"].ToString(),
                    AllotmentVolUsedAvail = e["AllotmentVolUsedAvail"].ToString()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = AllotmentReleaseFlightList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAllotmentReleaseFlightData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public ActionResult GetAgentData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter,
          string DailyFlightSNo, string AirlineSNo, string FlightDate, string OriginSNo, string DestinationSNo, string FlightSNo, string OfficeSNo, string AccountSNo, string ShipperAccountSNo, string AllotmentType, string AllotmentSNo)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AllotmentReleaseAgent>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo",DailyFlightSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightDate",FlightDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightSNo",FlightSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ShipperAccountSNo",ShipperAccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AllotmentType",AllotmentType),
                                                                    new System.Data.SqlClient.SqlParameter("@AllotmentSNo",AllotmentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAllotmentReleaseAgentData", Parameters);

                var AllotmentReleaseFlightList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Schedule.AllotmentReleaseAgent
                {
                    SNo = e["SNo"].ToString(),
                    DailyFlightAllotmentSNo = e["DailyFlightAllotmentSNo"].ToString(),
                    //Office = e["Office"].ToString(),
                    Agent = e["Agent"].ToString(),
                    //Shipper = e["Shipper"].ToString(),
                    AllotmentType = e["AllotmentType"].ToString(),
                    AllotmentCode = e["AllotmentCode"].ToString(),
                    AvaGross = Convert.ToDecimal(e["AvailableGross"]),
                    AvaVol = Convert.ToDecimal(e["AvailableVol"]),
                    Gross = e["Gross"].ToString(),
                    Volume = e["Volume"].ToString(),

                    TotalReleaseGross = e["ReleaseGross"].ToString(),
                    TotalReleaseVol = e["ReleaseVol"].ToString(),
                    //Commodity = e["Commodity"].ToString(),
                    //Commodity_Type = e["Commodity_Type"].ToString(),
                    //SHC = e["SHC"].ToString(),
                    //SHC_Type = e["SHC_Type"].ToString(),
                    //Product = e["Product"].ToString(),
                    //Product_Type = e["Product_Type"].ToString(),
                    ReleaseTime = e["ReleaseTime"].ToString(),
                    RemainingReleaseTime = e["RemainingReleaseTime"].ToString(),
                    AutoRelease = e["AutoRelease"].ToString(),
                    ReleaseGross = "", //e["AvailableGross"].ToString(),
                    ReleaseVol = ""//e["AvailableVol"].ToString(),
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = AllotmentReleaseFlightList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAllotmentReleaseAgentData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }


        }


        public ActionResult GetShipmentData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter,
            string DailyFlightAllotmentSNo
        //  string DailyFlightSNo, string AirlineSNo, string FlightDate, string OriginSNo, string DestinationSNo, string FlightSNo, string OfficeSNo, string AccountSNo, string ShipperAccountSNo, string AllotmentType, string AllotmentSNo
            )
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AllotmentReleaseShipment>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    //new System.Data.SqlClient.SqlParameter("@DailyFlightSNo",DailyFlightSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@FlightDate",FlightDate),
                                                                    //new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@DestinationSNo",DestinationSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@FlightSNo",FlightSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@AccountSNo",AccountSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@ShipperAccountSNo",ShipperAccountSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@AllotmentType",AllotmentType),
                                                                    //new System.Data.SqlClient.SqlParameter("@AllotmentSNo",AllotmentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DailyFlightAllotmentSNo",DailyFlightAllotmentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAllotmentReleaseShipmentData", Parameters);

                var AllotmentReleaseFlightList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Schedule.AllotmentReleaseShipment
                {
                    SNo = e["SNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    //FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    //ETD_ETA = e["ETD_ETA"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    Gross = e["Gross"].ToString(),
                    Volume = e["Volume"].ToString(),
                    Product = e["Volume"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    //AircraftType = e["AircraftType"].ToString(),
                    AllotmentCode = e["AllotmentCode"].ToString()
                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = AllotmentReleaseFlightList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAllotmentReleaseShipmentData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public ActionResult UpdateAgentData([DataSourceRequest]DataSourceRequest request, AllotmentReleaseAgent allotmentReleaseAgent)
        {
            try
            {
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightAllomentSNo",allotmentReleaseAgent.DailyFlightAllotmentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ReleaseGross",allotmentReleaseAgent.ReleaseGross),
                                                                    new System.Data.SqlClient.SqlParameter("@ReleaseVol",allotmentReleaseAgent.ReleaseVol),
                                                                    new System.Data.SqlClient.SqlParameter("@UpdatedBy", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAllotmentRelease_Update", Parameters);
                //return Json("Success", JsonRequestBehavior.AllowGet);
                return Json(new DataSourceResult
                {
                    Data = null,
                    Errors = ds.Tables[0].Rows[0][0].ToString(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAllotmentRelease_Update"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}