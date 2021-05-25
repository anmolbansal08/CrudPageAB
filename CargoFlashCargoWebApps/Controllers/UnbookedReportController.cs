
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System.Data.SqlClient;
using System.IO;


namespace CargoFlashCargoWebApps.Controllers
{
    public class UnbookedReportController : Controller
    {
       
        // GET: UnbookedReport
        public ActionResult UnbookedReport()
        {
            return View();
        }

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        [HttpPost]
        public ActionResult GetUnbookedDetail(string recid, int pageNo, int pageSize, UbbookedReportRequestModel model, string sort)
       // public ActionResult GetUnbookedDetail(string fromdate, string todate, int pageNo, int pageSize, string sort)
        {

            try
            {
               // UbbookedReport creditLimitReport = new UbbookedReport();
                SqlParameter[] Parameters = {               
                new SqlParameter("@Fromdate",model.Fromdate),
                new SqlParameter("@Todate",model.Todate),
                new SqlParameter("@PageNo", pageNo),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@OrderBy", sort)
                //new SqlParameter ("@UserSNo" , ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

            };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUnbookedShipmentDetail", Parameters);
                var CreditLimitReportList = ds.Tables[0].AsEnumerable().Select(e => new UbbookedReport
                {

                    AWbNo = (e["AWbNo"]).ToString(),
                    BookingType = e["BookingType"].ToString(),
                    GSAName = e["GSAName"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    Pieces= e["Pieces"].ToString(),
                    Grossweight = e["Grossweight"].ToString(),
                    Bookeddate = e["Bookeddate"].ToString(),                
                   Remarks = (e["Remarks"]).ToString(),
                  TotalPieces= (e["totalpieces"]).ToString(),
                    Totalweight = (e["totalweight"]).ToString(),
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



        public void ExportToExcelFile(UbbookedReportRequestModel dataSetToExcelFile)
        {
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            string date = DateTime.Now.ToString();
            System.Data.SqlClient.SqlParameter[] parameters = { new SqlParameter("@Fromdate",  dataSetToExcelFile.Fromdate),
             new SqlParameter("@Todate",dataSetToExcelFile.Todate),
                   
                    // new SqlParameter("@PageNo", 1),
                     //new SqlParameter("@PageSize", 100),
                     //new SqlParameter("@OrderBy", "")
            };

            string proc = "";
            string fileName = "";

            proc = "GetUnbookedShipmentDetail_ExportToexcel";
            fileName = "UnbookedReport";

            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, proc, parameters);
            DataTable dt = new DataTable();
            dt = ds.Tables[0];
            //dt.Columns.RemoveAt(0);

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename='" + fileName + "''" + date + "'.xlsx");

                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(System.Web.HttpContext.Current.Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        public class UbbookedReportRequestModel
        {
            public string Fromdate { get; set; }
            public string Todate { get; set; }        
        }


        public class UbbookedReport
        {
            public string AWbNo { get; set; }
            public string BookingType { get; set; }
            public string GSAName { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
             public string Pieces { get; set; }
            public string Grossweight { get; set; }
            public string Bookeddate { get; set; }
            public string Remarks { get; set; }
            public string TotalPieces { get; set; }
            public string Totalweight { get; set; }



        }
    }

}