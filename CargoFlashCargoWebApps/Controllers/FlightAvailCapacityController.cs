using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using CargoFlash.Cargo.Model.Report;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightAvailCapacityController : Controller
    {

      // GET: FlightAvailCapacity
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
            public ActionResult Index()
            {
                return View("Index");
            }

        public ActionResult GetFlightCapacityDetail([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string FlightDate, string FlightNo, string OriginSNo, string DestinationSNo)
        {
            DataSet ds = new DataSet();
            IEnumerable<SpaceAvailability> SpaceAvail = null;
            try
            {
                DateTime FlightDate_C = DateTime.ParseExact(FlightDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = FlightDate_C.ToString("yyyy-MM-dd");               

                SqlParameter[] Parameters = {
                                            new System.Data.SqlClient.SqlParameter("@Date", fromdate_result),
                                            new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo),
                                            new System.Data.SqlClient.SqlParameter("@Ori",OriginSNo),
                                            new System.Data.SqlClient.SqlParameter("@Dest", DestinationSNo),
                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                            new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),

                                                               };
                
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightAvlFreeSaleCapacity", Parameters);

                SpaceAvail = ds.Tables[0].AsEnumerable().Select(e => new SpaceAvailability
                {

                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    Origin = e["OriginAirportCode"].ToString().ToUpper(),
                    Destination = e["DestinationAirportCode"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    STD = e["STD"].ToString().ToUpper(),
                    STA = e["STA"].ToString().ToUpper(),
                    AircraftType = e["AircraftType"].ToString().ToUpper(),
                    AvlFreesaleGross = e["AvlFreesaleGross"].ToString().ToUpper(),
                    AvlFreeSaleVolume = e["AvlFreeSaleVolume"].ToString().ToUpper(),
                    CLOSED = e["CLOSED"].ToString().ToUpper()
                 });
                ds.Dispose();

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;

                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightAvlFreeSaleCapacity"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }
            return Json(new DataSourceResult
            {
                Data = SpaceAvail.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            }, JsonRequestBehavior.AllowGet);

        }




        // [HttpGet]
        //public string GetFlightCapacityDetail(FlightSummaryDetail model)
        //{
        //    try
        //    {
        //        DateTime fromdt = DateTime.ParseExact(model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
        //        var fromdate_result = fromdt.ToString("yyyy-MM-dd");




        //        System.Data.SqlClient.SqlParameter[] Parameters = {
        //                     new System.Data.SqlClient.SqlParameter("@Date",fromdate_result),

        //new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),
        //                                                        new System.Data.SqlClient.SqlParameter("@Ori",model.OriginSNo),
        //                                                        new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
        //                                                        new System.Data.SqlClient.SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
        //                                                       };

        //        System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightAvlFreeSaleCapacity", Parameters);

        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }
        //    catch (Exception ex)
        //    {
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = {
        //                                                       new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                        new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightSummary"),
        //                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                  };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;
        //    }
        //}
    }
}