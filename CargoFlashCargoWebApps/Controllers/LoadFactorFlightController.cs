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
    public class LoadFactorFlightController : Controller
    {
        // GET: LoadFactorFlight
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetLoadFactorFlightReport([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, LoadFactorFlight Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                //if (string.IsNullOrEmpty(Model.DestinationAirPortSNo))
                //{
                //    Model.DestinationAirPortSNo = "";
                //}
                //if (string.IsNullOrEmpty(Model.OriginAirPortSNo))
                //{
                //    Model.OriginAirPortSNo = "";
                //}
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.LoadFactorFlight>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortSNo",Model.DestinationAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetLoadFactorFlightReport", Parameters);

                var LoadFactorFlightList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.LoadFactorFlight
                {
                    Origin = e["Origin"].ToString().ToUpper(),
                    Dest = e["Dest"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightType = e["FlightType"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    RouteType = e["RouteType"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    Aircraft = e["Aircraft"].ToString().ToUpper(),
                    TotalCapacityGross = e["TotalCapacityGross"].ToString().ToUpper(),
                    TotalCapacityVolume = e["TotalCapacityVolume"].ToString().ToUpper(),
                    UsedTotalCapacityGross = e["UsedTotalCapacityGross"].ToString().ToUpper(),
                    UsedTotalCapacityVolume = e["UsedTotalCapacityVolume"].ToString().ToUpper(),
                    UsedChargeableTotalCapacity = e["UsedChargeableTotalCapacity"].ToString().ToUpper(),
                    LoadFactorFlights = e["LoadFactorFlights"].ToString().ToUpper(),
                    FlightStatus = e["FlightStatus"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = LoadFactorFlightList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [HttpPost]
        public ActionResult ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, LoadFactorFlight Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.LoadFactorFlight>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortSNo",Model.DestinationAirPortSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetLoadFactorFlightReportForExcel", Parameters);

                var LoadFactorFlightList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.LoadFactorFlight
                {
                    Origin = e["Origin"].ToString().ToUpper(),
                    Dest = e["Dest"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightType = e["FlightType"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    RouteType = e["RouteType"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    Aircraft = e["Aircraft"].ToString().ToUpper(),
                    TotalCapacityGross = e["Total Gross Capacity"].ToString().ToUpper(),
                    TotalCapacityVolume = e["Total Volume Capacity"].ToString().ToUpper(),
                    UsedTotalCapacityGross = e["Total Gross Capacity Used"].ToString().ToUpper(),
                    UsedTotalCapacityVolume = e["Total Volume Capacity Used"].ToString().ToUpper(),
                    UsedChargeableTotalCapacity = e["Total Chargeable Capacity Used"].ToString().ToUpper(),
                    LoadFactorFlights = e["Flight Load Factor(%)"].ToString().ToUpper(),
                    FlightStatus = e["FlightStatus"].ToString().ToUpper(),
                });
                ds.Dispose();
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = LoadFactorFlightList.AsQueryable().ToList(),
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
                Response.AddHeader("content-disposition", "attachment;filename=LoadFactorFlightReport_'" + date + "'.xlsx");
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