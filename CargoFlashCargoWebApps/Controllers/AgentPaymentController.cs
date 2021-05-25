using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClosedXML.Excel;
using System.Net;
using System.IO;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.Drawing;
using System.Text;




namespace CargoFlashCargoWebApps.Controllers
{
    public class AgentPaymentController : Controller
    {
        // GET: AgentPayment
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        //public KeyValuePair<string, List<AgentPayment>> GetAgentPaymentRecord(string recid, int pageNo, int pageSize, AgentPaymentRequestModel model, string sort)
        public ActionResult GetAgentPaymentRecord(string recid, int pageNo, int pageSize, AgentPaymentRequestModel model, string sort)
        {
            try
            {
               // AgentPayment creditLimitReport = new AgentPayment();
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSno",  model.AirlineSNo),
                     new SqlParameter("@AccountSNo",model.AccountSNo),
                     new SqlParameter("@ToCurrencySno", model.CurrencySNo),
                     new SqlParameter("@OfficeSNo",model.OfficeSNo),   
                     new SqlParameter("@CitySNo", model.CitySNo),
                     new SqlParameter("@PageNo", pageNo),
                     new SqlParameter("@PageSize", pageSize),
                     new SqlParameter("@OrderBy", sort),
                      

            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_CreditLimitReport_AgentWise", Parameters);
                var Agentpaymentlist = ds.Tables[0].AsEnumerable().Select(e => new AgentPayment
                {      
                                  
                    OfficeName = e["OfficeName"].ToString(),
                    AccountName= e["AccountName"].ToString(),
                    CityCode = e["CityCode"].ToString(),
                    CurrentBalance = e["CurrentBalance"].ToString(),
                    CurrencyCode = e["CurrencyCode"].ToString(),
                  
                });

                return Json(new DataSourceResultAppendGrid
                {
                    value = Agentpaymentlist.AsQueryable().ToList(),
                   // Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    key = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) :0
                }, JsonRequestBehavior.AllowGet);


                //return Json(new DataSourceResult
                //{
                //    Data = dsFPRLionReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<FPRLionReport>().ToList<FPRLionReport>(),
                //    Total = dsFPRLionReport.Tables.Count > 1 ? Convert.ToInt32(dsFPRLionReport.Tables[1].Rows[0][0].ToString()) : 0
                //}, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public void ExportToExcelFile(AgentPaymentRequestModel dataSetToExcelFile)    
        {
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            string date = DateTime.Now.ToString();

            System.Data.SqlClient.SqlParameter[] parameters = { new SqlParameter("@AirlineSno",  dataSetToExcelFile.AirlineSNo),
                     new SqlParameter("@AccountSNo",dataSetToExcelFile.AccountSNo),
                     new SqlParameter("@ToCurrencySno", dataSetToExcelFile.CurrencySNo),
                     new SqlParameter("@OfficeSNo",dataSetToExcelFile.OfficeSNo),
                     new SqlParameter("@CitySNo", dataSetToExcelFile.CitySNo),
                    // new SqlParameter("@PageNo", 1),
                     //new SqlParameter("@PageSize", 100),
                     //new SqlParameter("@OrderBy", "")
            };

               string proc = "";
               string fileName = "";
         
               proc = "sp_CreditLimitReport_AgentWise_ExportToExcel";
               fileName = "AgentCreditLimitReport";                 

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
    }
}