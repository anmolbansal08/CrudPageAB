using System;
using System.Collections.Generic;
using System.Linq;
using Kendo.Mvc.UI;
using System.Web.Mvc;
using System.Data;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.IO;

namespace CargoFlashCargoWebApps.Controllers
{
    public class DashBoardFlightReportController : Controller
    {
        // GET: DashBoardFlightReport
        public ActionResult DashBoardFlightReport()
        {
            return View();
        }
        [HttpPost]
        public ActionResult DashBoardFlightReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DashBoardFlightReport Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DashBoardFlightReport>(filter);
            System.Data.DataSet dsDashBoardFlightReport = new DataSet();
            IEnumerable<DashBoardFlightReport> DashBoardList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationAirportSNo",Model.DestinationSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@Status",Model.Status),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                  };
                dsDashBoardFlightReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_GetDashBoardFlightReport", Parameters);
                if (dsDashBoardFlightReport.Tables.Count > 1 && dsDashBoardFlightReport.Tables != null)
                {
                    DashBoardList = dsDashBoardFlightReport.Tables[0].AsEnumerable().Select(e => new DashBoardFlightReport
                    {
                        FlightNos = Convert.ToString(e["FlightNos"]).ToUpper(),
                        DepartureDate =Convert.ToString(e["DepartureDate"]).ToUpper(),
                        BoardPoint =Convert.ToString(e["BoardPoint"]).ToUpper(),
                        Offpoint = Convert.ToString(e["Offpoint"]).ToUpper(),
                        Sector =Convert.ToString(e["Sector"]).ToUpper(),
                        Stretch =Convert.ToString(e["Stretch"]).ToUpper(),
                        PlannedAircraftType =Convert.ToString(e["PlannedAircraftType"]).ToUpper(),
                        OperatedAircraftType =Convert.ToString(e["OperatedAircraftType"]).ToUpper(),
                        Distance =Convert.ToString(e["Distance"]).ToUpper(),
                        Commercialcapacity =Convert.ToString(e["Commercialcapacity"]).ToUpper(),
                        RTKC =Convert.ToString(e["RTKC"]).ToUpper(),
                        ATKC=Convert.ToString(e["ATKC"]).ToUpper(),
                        ActualCLF=Convert.ToString(e["ActualCLF"]).ToUpper(),
                        GrossWeight=Convert.ToString(e["GrossWeight"]).ToUpper(),
                        GrossVolume=Convert.ToString(e["GrossVolume"]).ToUpper(),
                        Revenue=Convert.ToString(e["Revenue"]).ToUpper(),
                        FlightStatus=Convert.ToString(e["FlightStatus"]).ToUpper(),
                        TargetedGrossWeight=Convert.ToString(e["TargetedGrossWeight"]).ToUpper(),
                        TargetedRevenue=Convert.ToString(e["TargetedRevenue"]).ToUpper(),
                        TargetedRTKC=Convert.ToString(e["TargetedRTKC"]).ToUpper(),
                        TargetedATKC=Convert.ToString(e["TargetedATKC"]).ToUpper()
                    });
                    dsDashBoardFlightReport.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = dsDashBoardFlightReport.Tables.Count > 1 ? DashBoardList.AsQueryable().ToList() : Enumerable.Empty<DashBoardFlightReport>().ToList<DashBoardFlightReport>(),
                    Total = dsDashBoardFlightReport.Tables.Count > 1 ? Convert.ToInt32(dsDashBoardFlightReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                        new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                        new System.Data.SqlClient.SqlParameter("@ProcName","spDiscrepancyReport_GetRecord"),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, DashBoardFlightReport Model)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DashBoardFlightReport>(filter);
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",Model.OriginSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationAirportSNo",Model.DestinationSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@Status",Model.Status),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetDashBoardFlightReport", Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                         new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                         new System.Data.SqlClient.SqlParameter("@ProcName","sp_GetDashBoardFlightReport"),
                                                                         new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=DashBoardFlightReport_'" + date + "'.xlsx");
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