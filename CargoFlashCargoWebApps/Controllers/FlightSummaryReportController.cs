using CargoFlash.Cargo.Model.Report;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightSummaryReportController : Controller
    {
        //
        // GET: /FlightSummaryReport/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public string GetFlightSummaryDetail(FlightSummaryDetail model)
        {
            try
            {
                DateTime fromdt = DateTime.ParseExact(model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(model.ToDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                 new System.Data.SqlClient.SqlParameter("@From",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@To",todate_result),
            new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode",model.Airline),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightStatus",model.FlightStatus),
                                                                     new System.Data.SqlClient.SqlParameter("@FlightType",model.FlightType),
                                                                    new System.Data.SqlClient.SqlParameter("@RouteType",model.RouteType),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightSummary", Parameters);
              
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightSummary"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public ActionResult FlightSummaryMGMT()
        {
            return View();
        }


        [HttpGet]
        public string GetFlightSummaryMGMTDetail(FlightSummaryDetail model)
        {
            try
            {
                DateTime fromdt = DateTime.ParseExact(model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(model.ToDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                 new System.Data.SqlClient.SqlParameter("@From",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@To",todate_result),
            new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode",model.Airline),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightStatus",model.FlightStatus)
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_FlightSummaryMGMT", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_FlightSummary"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}