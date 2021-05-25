using CargoFlash.Cargo.Model.AuditLog;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class InvoiceDetailController : Controller
    {
        // GET: InvoiceDetail
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        public class Agent
        {
            public string AgentName { get; set; }
            public string AgentCode { get; set; }
            public string AWBNo { get; set; }
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }
            public string BoardingPoint { get; set; }

            public string OffPoint { get; set; }
            public string ORIGIN { get; set; }
            public string DESTINATION { get; set; }
            public string ISUPlace { get; set; }
            public string ISUDate { get; set; }
            public string ProductName { get; set; }
            public string SHC { get; set; }
            public string COMMODITYCODE { get; set; }
            public string NATUREOFGOODS { get; set; }
            public string Pieces { get; set; }
            public string GrossWeight { get; set; }
            public string Volume { get; set; }
            public string PiecesUplift { get; set; }
            public string GrossWeightUplift { get; set; }
            public string Volumelift { get; set; }

            public string SplitBooking { get; set; }

        }
        public ActionResult InvoiceDetails()
        {
            return View();
        }
        public ActionResult GenerateGSACSRReport(string careerCode, string Agentsno, string Startdate, string Enddate)
        {

            try
            {

                int RowNo = 0;
                StringBuilder strData = new StringBuilder("</br>");
             
                DataSet ds = new DataSet();
                string dsrowsvalue = string.Empty;
                string startDate, endDate;
             
              
              
                string ProcName = string.Empty;

                string cssClassRight = string.Empty, cssClassLeft = string.Empty, cssClassCenter = string.Empty;


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",careerCode),
                                                                          new System.Data.SqlClient.SqlParameter("@FromDate",Startdate),
                                                                      new System.Data.SqlClient.SqlParameter("@ToDate",Enddate),                                                               
                                                                     new System.Data.SqlClient.SqlParameter("@OfficeSNo",Agentsno),
                                                                      
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_getcsrinvoicedetail", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataView dvGSAData;
                    int srNo = 0, no = 0;
             
                    DataTable dataTable = ds.Tables[0];
                
                    strData.Append("<div class='k-grid-header-wrap' id='grid_bookingprofile' style='width: 100%; height: 100%; overflow-x: scroll; overflow-y: scroll;'><table class='dataTable' ><tr  style='background-color: #D5E1F0;border:1px solid;font-size: 12px;height: 20px;'><td ><b></b></td><td><b>AR CODE</b></td><td><b>GSA NAME</b></td><td><b>Booking Type</b></td><td><b>InvoiceAmount</b></td><td><b>InvoiceNo</b></td><td><b>InvoiceDate</b></td></tr>");

                    foreach (DataRow drGSA in dataTable.Rows)
                    {

                        no += 1;
                        strData.Append("<tr  style='background-color: #C0C0C0;border:1px;font-size: 10px;height: 20px;'><td></td><td>" + drGSA["ARCODE"].ToString() + "</td><td>" + drGSA["GSANAME"].ToString() + "</td><td>" + drGSA["AWBDate"].ToString() + "</td><td>" + drGSA["InvoiceAmount"].ToString() + "</td><td>" + drGSA["InvoiceNo"].ToString() + "</td><td>" + drGSA["InvoiceDate"].ToString() + "</td></tr>");
                        RowNo = 1;
                    }
                    strData.Append("</table></div><br/><br/>");
                }
                else
                {
                    strData.Append("Data Not Found.");
                    RowNo = 0;

                }
                return Json(new DataSourceResult
                {
                    Data = strData.ToString(),
                    Total = RowNo,
                }, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)//
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_getcsrinvoicedetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
           
        }
        public ActionResult GetGSACSRReport(string careerCode, string Agentsno, string Startdate, string Enddate)
        {
            int RowNo = 0;
            string startDate, endDate;
            StringBuilder strData = new StringBuilder("</br>");
            DateTime stdate, edate;
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;

            List<Agent> listobjagentgent = new List<Agent>();
            try
            {
                string cssClassRight = string.Empty, cssClassLeft = string.Empty, cssClassCenter = string.Empty;

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",careerCode),
                                                                          new System.Data.SqlClient.SqlParameter("@FromDate",Startdate),
                                                                      new System.Data.SqlClient.SqlParameter("@ToDate",Enddate),
                                                                     new System.Data.SqlClient.SqlParameter("@OfficeSNo",Agentsno),

                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_getcsrinvoicedetail", Parameters);
                //DataView dvData = new DataView(ds.Tables[0], "OfficeSNo !='" + 0 + "'", "OfficeSNo", DataViewRowState.CurrentRows);
                //DataTable DataView = ds.Tables[0].DefaultView.ToTable(true, "OfficeSNo");

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataView dvGSAData;
                    int srNo = 0, no = 0;

                    DataTable dataTable = ds.Tables[0];

                    strData.Append("<div class='k-grid-header-wrap' id='grid_bookingprofile' style='width: 100%; height: 100%; overflow-x: scroll; overflow-y: scroll;'><table class='dataTable' ><tr  style='background-color: #D5E1F0;border:1px solid;font-size: 12px;height: 20px;'><td ><b></b></td><td><b>AR CODE</b></td><td><b>GSA NAME</b></td><td><b>Booking Type</b></td><td><b>InvoiceAmount</b></td><td><b>InvoiceNo</b></td><td><b>InvoiceDate</b></td></tr>");

                    foreach (DataRow drGSA in dataTable.Rows)
                    {
                       no += 1;
                        strData.Append("<tr  style='background-color: #C0C0C0;border:1px;font-size: 10px;height: 20px;'><td></td><td>" + drGSA["ARCODE"].ToString() + "</td><td>" + drGSA["GSANAME"].ToString() + "</td><td>" + drGSA["AWBDate"].ToString() + "</td><td>" + drGSA["InvoiceAmount"].ToString() + "</td><td>" + drGSA["InvoiceNo"].ToString() + "</td><td>" + drGSA["InvoiceDate"].ToString() + "</td></tr>");

                        RowNo = 1;
                    }
                    strData.Append("</table></div><br/><br/>");
                
                }
                else
                {
                    strData.Append("Data Not Found.");
                    RowNo = 0;

                }


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_getcsrinvoicedetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = strData.ToString(),
                Total = RowNo,
            }, JsonRequestBehavior.AllowGet);
        }

    }
}