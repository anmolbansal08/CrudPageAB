using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class CancelInvoicereportController : Controller
    {
        //
        // GET: /CancelInvoicereport/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetCancelInvoiceReport([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, CancelInvoicereRequest Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CancelInvoicereport>(filter);
                System.Data.DataSet ds = new DataSet();

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@airlineSno",Model.AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@originSno",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@destinationSno",Model.DestinationSno),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                     new System.Data.SqlClient.SqlParameter("@fromDate",dateFrom),
                                                                     new System.Data.SqlClient.SqlParameter("@Todate",datetodate),
                                                                      new System.Data.SqlClient.SqlParameter("@awbsno",Model.AWBSNo),
                                                                       new System.Data.SqlClient.SqlParameter("@cancelType",Model.CancelType),
                                                                        new System.Data.SqlClient.SqlParameter("@optionType",Model.OptionType),
                                                                        new System.Data.SqlClient.SqlParameter("@agentSno",Model.agentsno),
                                                                         new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                         new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                          new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))


                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_getCancelInvoiceRefund_Report", Parameters);

                var CancelReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.CancelInvoicereport
                {


                    awbno = e["AWBNo"].ToString().ToUpper(),
                    InvoiceNo = e["Invoiceno"].ToString().ToUpper(),
                    bookingType = e["Booking Type"].ToString().ToUpper(),
                    agentname = e["Agent Name"].ToString().ToUpper(),
                    // BookingFromDate=e["BookingFromDate"].ToString().ToUpper(),
                    origin = e["Origin"].ToString().ToUpper(),

                    destination = e["Destination"].ToString().ToUpper(),

                    flightno = e["Flight No"].ToString().ToUpper(),
                    flightdate = e["Flight Date"].ToString().ToUpper(),

                    bookingdate = e["Booking Date"].ToString().ToUpper(),
                    pieces = e["Pieces"].ToString().ToUpper(),
                    grossweight = e["Gross weight"].ToString().ToUpper(),
                    volumeweight = e["Volume weight"].ToString().ToUpper(),
                    Chargeableweight = e["Chareable weight"].ToString().ToUpper(),
                    Amount = e["Amount"].ToString().ToUpper(),
                    Type = e["Type(Cash/Credit)"].ToString().ToUpper(),
                    RequestedBy = e["Requested By"].ToString().ToUpper(),
                    ApprovedBy = e["Approved By"].ToString().ToUpper(),
                    RequestedDate = e["Requested Date"].ToString().ToUpper(),
                    ApprovalDate = e["Approved Date"].ToString().ToUpper(),

                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = CancelReportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_getCancelInvoiceRefund_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel(CancelInvoicereport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string AirlineSNo, string OriginSNo, string DestinationSno, string FromDate, string ToDate, string AWBSNo, string CancelType, string OptionType, string agentsno,int IsAutoProcess)
        {
            try
            {
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CancelInvoicereport>(filter);
                System.Data.DataSet ds = new DataSet();

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                       new System.Data.SqlClient.SqlParameter("@airlineSno",AirlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@originSno",OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@destinationSno",DestinationSno),                                                                     
                                                                     new System.Data.SqlClient.SqlParameter("@fromDate",FromDate),
                                                                     new System.Data.SqlClient.SqlParameter("@Todate",ToDate),
                                                                      new System.Data.SqlClient.SqlParameter("@awbsno",AWBSNo),
                                                                       new System.Data.SqlClient.SqlParameter("@cancelType",CancelType),
                                                                        new System.Data.SqlClient.SqlParameter("@optionType",OptionType),
                                                                        new System.Data.SqlClient.SqlParameter("@agentSno",agentsno),
                                                                        new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                         new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "usp_getCancelInvoiceRefund_ExportToExcel", Parameters);

                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_getCancelInvoiceRefund_ExportToExcel"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=CancelInvoice&Refund_'" + date + "'.xlsx");
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