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
    public class BTBReportController : Controller
    {
        // GET: BTBReport
        public ActionResult Index()
        {
            return View("BTBReport");
        }
        [HttpPost]
        public ActionResult GetBTBReportData(string recid, int pageNo, int pageSize, BTBreportRequest model, string sort)
        {
            try
            {
                PaymentStatusReport creditLimitReport = new PaymentStatusReport();
                SqlParameter[] Parameters = {
                 new SqlParameter("@PageNo", pageNo),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@User",model.User),
                new SqlParameter("@AWBNo",model.AWBNo),
                new SqlParameter("@ValidFrom",model.FromDate),
                new SqlParameter("@ValidTo",model.ToDate),
                new SqlParameter("@OrderBy", sort),
                new SqlParameter("@Airport", model.Airport),
                     new SqlParameter("@AirlineSNo",model.AirlineSNo),
                new SqlParameter ("@UserSNo" , ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBTBRecord", Parameters);
                var CreditLimitReportList = ds.Tables[0].AsEnumerable().Select(e => new BTBReportData
                {

                    SNo = (e["SNo"]).ToString(),
                    UserID = e["UserID"].ToString(),
                    UserName = e["UserName"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                   


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

        public void ExportToExcel(string ValidFrom, string ValidTo,  string Airport,  string AirlineSNo, string User, string AWBNo)
        {

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            SqlParameter[] Parameters = {
                   new SqlParameter("@PageNo", 1),
                new SqlParameter("@PageSize", 1048576),
                new SqlParameter("@User",User),
                new SqlParameter("@AWBNo",AWBNo),
                new SqlParameter("@ValidFrom", ValidFrom),
                new SqlParameter("@ValidTo",ValidTo),
                new SqlParameter("@OrderBy", ""),
                new SqlParameter("@Airport", Airport),
                    new SqlParameter("@AirlineSNo", AirlineSNo),
                new SqlParameter ("@UserSNo" , ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

            };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBTBRecord", Parameters);
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
                Response.AddHeader("content-disposition", "attachment;filename=BTBReport_'" + date + "'.xlsx");
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

   public class BTBreportRequest
    {
        public string User { get; set; }
        public string Airport { get; set; }
        public string AWBNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }

        public string AirlineSNo { get; set; }
    }

   public class BTBReportData
    {
        public string SNo { get; set; }
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string AWBNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }

    }
}