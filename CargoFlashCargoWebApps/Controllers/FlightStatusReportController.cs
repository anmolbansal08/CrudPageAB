using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;
using CargoFlash.Cargo.Model.Report;
namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightStatusReportController : Controller
    {
        //
        // GET: /FlightStatusReport/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FlightStatusReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string airlineSNo, string fromDate, string toDate, string FromTime, string ToTime, string OriginSNo, string DestinationSNo, string FlightNo, string CitySNo, int SearchBy, int LoginAirportSNo)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<FlightStatusReport> FlightStatusList = null;
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                             new System.Data.SqlClient.SqlParameter("@ReportType",SearchBy),
                             new System.Data.SqlClient.SqlParameter("@AirlineSNo",airlineSNo),
                             new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                             new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                             new System.Data.SqlClient.SqlParameter("@FromTime",FromTime),
                             new System.Data.SqlClient.SqlParameter("@ToTime",ToTime),                           
                             new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",OriginSNo),
                             new System.Data.SqlClient.SqlParameter("@DestinationAirPortSNo",DestinationSNo),
                             new System.Data.SqlClient.SqlParameter("@CitySNo",CitySNo),
                             new System.Data.SqlClient.SqlParameter("@FlightNo",FlightNo),   
                             new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                             new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize), 
                              new System.Data.SqlClient.SqlParameter("@LoginAirportSNo", LoginAirportSNo) 
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFlightStatus", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    FlightStatusList = ds.Tables[0].AsEnumerable().Select(e => new FlightStatusReport
                    {
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString().ToUpper(),
                        FlightStatus = e["FlightStatus"].ToString().ToUpper(),
                        FlightRoute = e["FlightRoute"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        STD = e["STD"].ToString(),
                        ETD = e["ETD"].ToString(),
                        ATD = e["ATD"].ToString(),
                        STA = e["STA"].ToString(),
                        ETA = e["ETA"].ToString(),
                        ATA = e["ATA"].ToString(),
                        UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                        UpdatedOn = e["UpdatedOn"].ToString(),
                        LocalTime = e["CurrentTime"].ToString(),
                        StatusColor = e["StatusColor"].ToString()

                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? FlightStatusList.AsQueryable().ToList() : Enumerable.Empty<FlightStatusReport>().ToList<FlightStatusReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFlightStatus"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}