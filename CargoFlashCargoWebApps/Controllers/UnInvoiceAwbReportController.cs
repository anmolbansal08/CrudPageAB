using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class UnInvoiceAwbReportController : Controller
    {
        // GET: UnInvoiceAwbReport
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult UnInvoicedAWBData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, UnInvoiceAwbReport Model)
        {
            try
            {
                if (string.IsNullOrEmpty(Model.Airline))
                {
                    Model.Airline = "";
                }
                if (string.IsNullOrEmpty(Model.GSAnames))
                {
                    Model.GSAnames = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.UnInvoiceAwbReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Airline",Model.Airline),
                                                                    new System.Data.SqlClient.SqlParameter("@GSAname",Model.GSAnames),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetUnInvoicedAwbReport", Parameters);

                var UnInvoiceAwbReport = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.UnInvoiceAwbReport
                {
                    SNo = e["SNo"].ToString().ToUpper(),
                    ARCode = e["ARCode"].ToString().ToUpper(),
                    GSAName = e["GSAName"].ToString().ToUpper(),
                    ActualCrLimit = e["ActualCrLimit"].ToString().ToUpper(),
                    CurrentCrLimit = e["CurrentCrLimit"].ToString().ToUpper(),
                    AvailableLimit = e["AvailableLimit"].ToString().ToUpper(),
                    UnInvoiced = e["UnInvoiced"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = UnInvoiceAwbReport.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public PartialViewResult GetUnInvoicedAwbTransReport(UnInvoiceAwbReport Model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {   new System.Data.SqlClient.SqlParameter("@GSASNo",Model.SNo)};
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetUnInvoicedAwbTransReport", Parameters);
                ViewBag.SNo = Model.SNo;
                return PartialView("_UnInvoiceAwbReport", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, UnInvoiceAwbReport Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<UnInvoiceAwbReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Airline",Model.Airline),
                                                                    new System.Data.SqlClient.SqlParameter("@GSAname",Model.GSAnames),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetUnInvoicedAwbReport", Parameters);
                DataTable dt1 = ds.Tables[0]; 
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                         new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                         new System.Data.SqlClient.SqlParameter("@ProcName","GetUnInvoicedAwbReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=UnInvoiceAwbReport_'" + date + "'.xlsx");
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