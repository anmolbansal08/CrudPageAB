using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.IO;

namespace CargoFlashCargoWebApps.Controllers
{
    public class PendingArrivalReportController : Controller
    {
        // GET: PendingArrivalReport
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetPendingArriveData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, PendingArrivalReport Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                
                if (string.IsNullOrEmpty(Model.DestinationAirPortSNo))
                {
                    Model.DestinationAirPortSNo = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.PendingArrivalReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortSNo",Model.DestinationAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetPendingArrivalReport", Parameters);

                var PendingArrivalList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.PendingArrivalReport
                {
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    Sector = e["Sector"].ToString().ToUpper(),
                    AWBDate = e["AWBDate"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    AgentCode = e["AgentCode"].ToString().ToUpper(),
                    Pieces = e["Pieces"].ToString().ToUpper(),
                    GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    VolumeWeight = e["VolumeWeight"].ToString().ToUpper(),
                    ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    FlightType = e["FlightType"].ToString().ToUpper(),
                    BookingFlightNo = e["BookingFlightNo"].ToString().ToUpper(),
                    BookingFlightDate = e["BookingFlightDate"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    RemainingPCS = e["RemainingPCS"].ToString().ToUpper(),
                    RemainingGrossWeight = e["RemainingGrossWeight"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = PendingArrivalList.AsQueryable().ToList(),
                    Total= Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public ActionResult ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, PendingArrivalReport Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.DestinationAirPortSNo))
                {
                    Model.DestinationAirPortSNo = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.PendingArrivalReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortSNo",Model.DestinationAirPortSNo)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetPendingArrivalReportForExcel", Parameters);

                var PendingArrivalList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.PendingArrivalReport
                {
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    Sector = e["Sector"].ToString().ToUpper(),
                    AWBDate = e["AWBDate"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    AgentCode = e["AgentCode"].ToString().ToUpper(),
                    Pieces = e["Pieces"].ToString().ToUpper(),
                    GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    VolumeWeight = e["VolumeWeight"].ToString().ToUpper(),
                    ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    FlightType = e["FlightType"].ToString().ToUpper(),
                    BookingFlightNo = e["BookingFlightNo"].ToString().ToUpper(),
                    BookingFlightDate = e["BookingFlightDate"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    RemainingPCS = e["RemainingPCS"].ToString().ToUpper(),
                    RemainingGrossWeight = e["RemainingGrossWeight"].ToString().ToUpper(),
                });
                ds.Dispose();
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = PendingArrivalList.AsQueryable().ToList(),
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=PendingArrivalReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }                                      

            }
        }
    }
}