using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.Cargo.Model.Master;
namespace CargoFlashCargoWebApps.Controllers
{
    public class ExcelForEdiController : Controller
    {
        //
        // GET: /ExcelForEdi/
        public ActionResult Index()
        {
            return View();
        }

       // public void DataSetToAllExcelFile(string whereCondition)
        public void DataSetToAllExcelFile(EdiInboundOutboundExcelForAll ediInboundOutboundexcelForAll)
        {
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            string date = DateTime.Now.ToString();
            SqlParameter[] Parameters = { 
                                          
                                         // new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),
                                               new SqlParameter("@FromDate", ediInboundOutboundexcelForAll.FromDate),
                                          new SqlParameter("@ToDate", ediInboundOutboundexcelForAll.ToDate),
                                          new SqlParameter("@Carrier",ediInboundOutboundexcelForAll.Carrier),
                                          new SqlParameter("@Type", ediInboundOutboundexcelForAll.EventType),
                                          new SqlParameter("@MessageTypeCheck", ediInboundOutboundexcelForAll.MessageTypeCheck),
                                          new SqlParameter("@MessageType", ediInboundOutboundexcelForAll.MessageType),
                                          new SqlParameter("@FlightNo", ediInboundOutboundexcelForAll.FlightNo),
                                          new SqlParameter("@AWb", ediInboundOutboundexcelForAll.AWBNo),
                                          new SqlParameter("@Origin",ediInboundOutboundexcelForAll.CityCode),
                                          new SqlParameter("@Status", ediInboundOutboundexcelForAll.Status),
                                          new SqlParameter("@SenderID", ediInboundOutboundexcelForAll.SenderID),
                                         new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                        };
         // System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetEdiInboundOutboundForAllExportToExcell1", Parameters);
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetEdiInboundOutboundForAllExportToExcell", Parameters);
            DataTable dt = new DataTable();
            dt = ds.Tables[0];
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=EDI_Mailbox_All_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }




        public void ExportToAllExcelInvalidRecipient(InvalidRecipientExcelForAll invalidRecipientExcelForAll)
        {
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            string date = DateTime.Now.ToString();
            SqlParameter[] Parameters = { 
                                          
                                         // new SqlParameter("@WhereCondition", CargoFlash.Cargo.Business.Common.Base64ToString(whereCondition)),
                                               new SqlParameter("@FromDate", invalidRecipientExcelForAll.FromDate),
                                          new SqlParameter("@ToDate", invalidRecipientExcelForAll.ToDate),
                                        
                                         new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                        };
            // System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetEdiInboundOutboundForAllExportToExcell1", Parameters);
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "uspGetInvalidRecipientDataForExcelAll", Parameters);
            DataTable dt = new DataTable();
            dt = ds.Tables[0];
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Invalid_Recipient_All_'" + date + "'.xlsx");
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