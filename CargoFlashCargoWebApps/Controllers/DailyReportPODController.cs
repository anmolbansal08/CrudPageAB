using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class DailyReportPODController : Controller
    {
        // GET: DailyReportPOD
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult DailyReportPODRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyReportPOD Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DailyReportPOD>(filter);
            System.Data.DataSet dsdailyreportpod = new DataSet();
            string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("yyyy-MM-dd");
            string datetodate = Convert.ToDateTime(Model.ToDate).ToString("yyyy-MM-dd");
            IEnumerable<DailyReportPOD> dailyreportpodlist = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.AirportSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };
                dsdailyreportpod = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyReportPOD", Parameters);
                if (dsdailyreportpod.Tables[1].Rows.Count > 0 && dsdailyreportpod.Tables != null)
                {
                    dailyreportpodlist = dsdailyreportpod.Tables[1].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.DailyReportPOD
                    {
                        No = Convert.ToString(e["No"]).ToUpper(),
                        FlightNo = Convert.ToString(e["FlightNo"]).ToUpper(),
                        ArrDate = Convert.ToDateTime(e["ArrDate"]).ToString("dd-MMM-yyyy").ToUpper(),
                        MAWB = Convert.ToString(e["MAWB"]).ToUpper(),
                        HAWBNo = Convert.ToString(e["HAWBNo"]).ToUpper(),
                        Pieces = Convert.ToString(e["Pieces"]).ToUpper(),
                        weight = Convert.ToString(e["GrossWeight"]).ToUpper(),
                        Date = Convert.ToDateTime(e["DODate"]).ToString("dd-MMM-yyyy").ToUpper(),
                        Time = Convert.ToString(e["DOTime"]).ToUpper(),
                        TransferTime = Convert.ToString(e["Time_Minutes"]).ToUpper(),
                        CgoTime = Convert.ToString(e["CGOTime"]).ToUpper(),
                        Consignee = Convert.ToString(e["ConsigneeName"]).ToUpper(),
                        Note = Convert.ToString(e["Note"]).ToUpper()
                    });
                    dsdailyreportpod.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = dsdailyreportpod.Tables[1].Rows.Count > 0 ? dailyreportpodlist.AsQueryable().ToList() : Enumerable.Empty<DailyReportPOD>().ToList<DailyReportPOD>(),
                    Total = dsdailyreportpod.Tables[1].Rows.Count > 0 ? Convert.ToInt32(dsdailyreportpod.Tables[2].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                    new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportPOD"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ExportExcelDailyReportPOD([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyReportPOD Model)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DailyReportPOD>(filter);
            string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("yyyy-MM-dd");
            string datetodate = Convert.ToDateTime(Model.ToDate).ToString("yyyy-MM-dd");
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.AirportSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                      new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spDailyReportPOD", Parameters);
                DataTable dt1 = ds.Tables[1];
                ConvertDSToExcel_Success(dt1, 1);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportPOD"),
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
                Response.AddHeader("content-disposition", "attachment;filename=DailyReportPOD_'" + date + "'.xlsx");
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