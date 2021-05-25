using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace CargoFlashCargoWebApps.Controllers
{
    public class PaymentStatusReportController : Controller
    {
        // GET: PaymentStatusReport
        public ActionResult Index()
        {
            return View("PaymentStatusReport");
        }
        [HttpPost]
        public ActionResult GetPaymentStatusRecord(string recid, int pageNo, int pageSize, PaymentStatusRequest model, string sort)
        {
            try
            {
                PaymentStatusReport creditLimitReport = new PaymentStatusReport();
                    SqlParameter[] Parameters = {
                 new SqlParameter("@PageNo", pageNo),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@PaymentType",model.PaymentType),
                 new SqlParameter("@AgentName",model.AgentName),
                new SqlParameter("@PaymentStatus",model.PaymentStatus),
                new SqlParameter("@ValidFrom",model.ValidFrom),
                new SqlParameter("@ValidTo",model.ValidTo),
                new SqlParameter("@OrderBy", sort),
                new SqlParameter ("@UserSNo" , ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
               
            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPaymentStatusRecord", Parameters);
                var CreditLimitReportList = ds.Tables[0].AsEnumerable().Select(e => new PaymentStatusReport
                {

                    SNo = (e["SNo"]).ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    AccountSNo = e["AccountSNo"].ToString(),
                    RequestedID = e["RequestedID"].ToString(),
                    CityCode = e["CityCode"].ToString(),
                    OfficeName = e["OfficeName"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    Currency = e["Currency"].ToString(),
                    Amount = e["Amount"].ToString(),
                    PaymentMode = (e["PaymentMode"]).ToString(),
                    RequestedDate = (e["RequestedDate"]).ToString(),
                    RequestedBy = (e["RequestedBy"]).ToString(),
                    RequestedRemarks = e["RequestedRemarks"].ToString(),
                    TransactionDate = e["TransactionDate"].ToString(),
                    Status = e["Status"].ToString(),
                    ApprovedBy = e["ApprovedBy"].ToString(),
                    ReferenceNo = e["ReferenceNo"].ToString(),
                    ApprovedOn = e["ApprovedOn"].ToString(),
                    ApprovedRemarks = e["ApprovedRemarks"].ToString(),
                    ReversedBy=e["ReversedBy"].ToString(),
                    ReversedOn = e["ReversedOn"].ToString(),
                    ReversalRemarks=e["ReversalRemarks"].ToString()
           
                });
                  
                 return Json(new DataSourceResultAppendGrid
                 {
                    value = CreditLimitReportList.AsQueryable().ToList(),
                    key = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public void ExportToExcel(string ValidFrom, string ValidTo, string PaymentType, string PaymentStatus, string UserSNo , string AgentName )
        {

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            SqlParameter[] Parameters = {
                new SqlParameter("@PageNo", 1),
                new SqlParameter("@PageSize", 1048576),
                new SqlParameter("@AgentName",AgentName),
                new SqlParameter("@PaymentType",PaymentType),
                new SqlParameter("@PaymentStatus",PaymentStatus),
                new SqlParameter("@ValidFrom",ValidFrom),
                new SqlParameter("@ValidTo",ValidTo),
                new SqlParameter("@OrderBy", ""),
                new SqlParameter ("@UserSNo" , ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
            };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPaymentStatusRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetPaymentStatusRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=PaymentStatusReport_'" + date + "'.xlsx");
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