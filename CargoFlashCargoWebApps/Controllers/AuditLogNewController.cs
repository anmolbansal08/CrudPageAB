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
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AuditLogNewController : Controller
    {
        //
        // GET: /AuditLogNew/
        //Created By Shivali Thakur for Audit Log on 01-08-2017
        public ActionResult AuditLogNew()
        {
            return View();
        }
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();

      
        public JsonResult GetActivityRecordSearch(AuditLogRequest model, string PageNo, string PageSize, string page, string fromDate, string toDate)
         {

             try
             {
                 var Page = "";
                 var KeyValue = "";
                 var StartDate = "";
                 var EndDate = "";
                 if (model != null)
                 {


                     Page = model.pagename.ToString();
                     if (model.keyvalue != null)
                     {
                         KeyValue = model.keyvalue.ToString();
                     }
                     StartDate = model.startdate.ToString();
                     EndDate = model.enddate.ToString();



                 }
                 else
                 {
                     StartDate = fromDate;
                     EndDate = toDate;
                 }

                 AuditLogReport activitylogReport = new AuditLogReport();
                 SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", PageSize), new SqlParameter("@KeyValue", KeyValue), new SqlParameter("@Page", Page), new SqlParameter("@FromDate", StartDate), new SqlParameter("@ToDate", EndDate), new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                 DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search", Parameters);
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                 List<AuditLogReport> ActivityLogReportList = new List<AuditLogReport>();

                 foreach (DataRow e in ds.Tables[0].Rows)
                 {
                     AuditLogReport ar = new AuditLogReport();

                     if (e["FormAction"].ToString() == "NEW" || e["FormAction"].ToString() == "DELETE" || e["FormAction"].ToString() == "New" || e["FormAction"].ToString() == "Delete")
                     {
                         ar.SNo = Convert.ToInt32(e["SNo"]);
                         // KeyColumn = (e["KeyColumn"]).ToString(),                                         
                         ar.KeyColumn = e["KeyColumn"].ToString();
                         ar.KeyValue = e["KeyValue"].ToString();
                         ar.OldValue = e["OldValue"].ToString();
                         ar.NewValue = e["NewValue"].ToString();
                         //TerminalID = (e["TerminalID"]).ToString(),
                         ar.TerminalID = e["IpAddress"].ToString();
                         ar.TerminalName = e["TerminalName"].ToString();
                         ar.UserName = e["UserName"].ToString();
                         ar.FormAction = e["FormAction"].ToString();
                         //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                         ar.RequestedOn = e["RequestedOn"].ToString();
                     }
                     else
                     {
                         ar.SNo = Convert.ToInt32(e["SNo"]);
                         //Added By Shivali Thakur
                         if ((e["ColumnName"].ToString().Contains("TOTALLPIECES")) == true || (e["KeyColumn"].ToString().Contains("ADDPIECES")) == true)
                         {
                             if (e["ColumnName"].ToString().Contains("TOTALLPIECES") == true)
                             {
                                 ar.KeyColumn = e["ColumnName"].ToString().Replace("LL", "L-");
                             }
                             if (e["KeyColumn"].ToString().Contains("ADDPIECES") == true)
                             {
                                 ar.KeyColumn = e["ColumnName"].ToString().Replace("DD", "DD-");
                             }
                         }
                         else
                         {
                             ar.KeyColumn = e["ColumnName"].ToString();
                         }
                         ar.subprocessname = e["subprocessname"].ToString();
                         ar.KeyValue = e["KeyValue"].ToString();
                         ar.OldValue = e["OldValue"].ToString();
                         ar.NewValue = e["NewValue"].ToString();
                         //TerminalID = (e["TerminalID"]).ToString(),
                         ar.TerminalID = e["IpAddress"].ToString();
                         ar.TerminalName = e["TerminalName"].ToString();
                         ar.UserName = e["UserName"].ToString();
                         ar.FormAction = e["FormAction"].ToString();
                         //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                         ar.RequestedOn = e["RequestedOn"].ToString();
                     }
                     ActivityLogReportList.Add(ar);
                 }

                 var jsonResult = Json(new { key = ds.Tables[1].Rows[0][0].ToString(), value = ActivityLogReportList.AsQueryable().ToList() }, JsonRequestBehavior.AllowGet);
                 jsonResult.MaxJsonLength = int.MaxValue;
                 return jsonResult;
             }
             catch (Exception ex)
             {
                 DataSet dsError;
                 System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAuditLog_Search"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                 dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                 throw ex;
             }
        }
        public JsonResult GetActivityRecordSearch_Booking(AuditLogRequest model,  string PageNo, string PageSize, string page, string fromDate, string toDate)
        {

            try
            {
                var prefix = "";
                var AWBNo = "";
                var StartDate = "";
                var EndDate = "";
                if (model != null)
                {

                    if (model.awbno != null)
                    {
                        prefix = model.prefix.ToString();
                        AWBNo = model.awbno.ToString();
                    }
                    StartDate = model.startdate.ToString();
                    EndDate = model.enddate.ToString();

                    AWBNo = prefix+AWBNo;

                }
                else
                {
                    StartDate = fromDate;
                    EndDate = toDate;
                }

                AuditLogReport activitylogReport = new AuditLogReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", PageSize), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@FromDate", StartDate), new SqlParameter("@ToDate", EndDate), new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search_Booking", Parameters);

            
                    List<AuditLogReport> ActivityLogReportList = new List<AuditLogReport>();

                    foreach (DataRow e in ds.Tables[0].Rows)
                    {
                        AuditLogReport ar = new AuditLogReport();

                        if (e["FormAction"].ToString() == "NEW" || e["FormAction"].ToString() == "DELETE" || e["FormAction"].ToString() == "New" || e["FormAction"].ToString() == "Delete")
                        {
                            ar.SNo = Convert.ToInt32(e["SNo"]);
                            // KeyColumn = (e["KeyColumn"]).ToString(),                                         
                            ar.KeyColumn = e["KeyColumn"].ToString();
                            ar.KeyValue = e["KeyValue"].ToString();
                            ar.OldValue = e["OldValue"].ToString();
                            ar.NewValue = e["NewValue"].ToString();
                            //TerminalID = (e["TerminalID"]).ToString(),
                            ar.TerminalID = e["IpAddress"].ToString();
                            ar.TerminalName = e["TerminalName"].ToString();
                            ar.UserName = e["UserName"].ToString();
                            ar.FormAction = e["FormAction"].ToString();
                            //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                            ar.RequestedOn = e["RequestedOn"].ToString();
                        }
                        else
                        {
                            ar.SNo = Convert.ToInt32(e["SNo"]);
                            //Added By Shivali Thakur
                            if ((e["ColumnName"].ToString().Contains("TOTALLPIECES")) == true || (e["KeyColumn"].ToString().Contains("ADDPIECES")) == true)
                            {
                                if (e["ColumnName"].ToString().Contains("TOTALLPIECES") == true)
                                {
                                    ar.KeyColumn = e["ColumnName"].ToString().Replace("LL", "L-");
                                }
                                if (e["KeyColumn"].ToString().Contains("ADDPIECES") == true)
                                {
                                    ar.KeyColumn = e["ColumnName"].ToString().Replace("DD", "DD-");
                                }
                            }
                            else
                            {
                                ar.KeyColumn = e["ColumnName"].ToString();
                            }
                            //  ar.KeyColumn = e["ColumnName"].ToString();
                            ar.KeyValue = e["KeyValue"].ToString();
                            ar.OldValue = e["OldValue"].ToString();
                            ar.NewValue = e["NewValue"].ToString();
                            //TerminalID = (e["TerminalID"]).ToString(),
                            ar.TerminalID = e["IpAddress"].ToString();
                            ar.TerminalName = e["TerminalName"].ToString();
                            ar.UserName = e["UserName"].ToString();
                            ar.FormAction = e["FormAction"].ToString();
                            //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                            ar.RequestedOn = e["RequestedOn"].ToString();
                        }
                        ActivityLogReportList.Add(ar);
                    }
               
                    var jsonResult = Json(new { key = ds.Tables[1].Rows[0][0].ToString(), value = ActivityLogReportList.AsQueryable().ToList() }, JsonRequestBehavior.AllowGet);
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return jsonResult;
                
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAuditLog_Search"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public JsonResult GetActivityRecordSearch_Acceptence(AuditLogRequest model, string PageNo, string PageSize, string page, string fromDate, string toDate)
        {

            try
            {
                var prefix = "";
                var AWBNo = "";
                var StartDate = "";
                var EndDate = "";
                if (model != null)
                {


                    
                    if (model.awbno != null)
                    {
                        prefix = model.prefix.ToString();
                        AWBNo = model.awbno.ToString();
                    }
                    StartDate = model.startdate.ToString();
                    EndDate = model.enddate.ToString();
                    AWBNo = prefix + AWBNo;


                }
                else
                {
                    StartDate = fromDate;
                    EndDate = toDate;
                }

                AuditLogReport activitylogReport = new AuditLogReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", PageSize), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@FromDate", StartDate), new SqlParameter("@ToDate", EndDate), new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search_Acceptence", Parameters);


                List<AuditLogReport> ActivityLogReportList = new List<AuditLogReport>();

                foreach (DataRow e in ds.Tables[0].Rows)
                {
                    AuditLogReport ar = new AuditLogReport();

                    if (e["FormAction"].ToString() == "NEW" || e["FormAction"].ToString() == "DELETE" || e["FormAction"].ToString() == "New" || e["FormAction"].ToString() == "Delete")
                    {
                        ar.SNo = Convert.ToInt32(e["SNo"]);
                        // KeyColumn = (e["KeyColumn"]).ToString(),                                         
                        ar.KeyColumn = e["KeyColumn"].ToString();
                        ar.KeyValue = e["KeyValue"].ToString();
                        ar.OldValue = e["OldValue"].ToString();
                        ar.NewValue = e["NewValue"].ToString();
                        //TerminalID = (e["TerminalID"]).ToString(),
                        ar.TerminalID = e["IpAddress"].ToString();
                        ar.TerminalName = e["TerminalName"].ToString();
                        ar.UserName = e["UserName"].ToString();
                        ar.FormAction = e["FormAction"].ToString();
                        //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                        ar.RequestedOn = e["RequestedOn"].ToString();
                    }
                    else
                    {
                        ar.SNo = Convert.ToInt32(e["SNo"]);
                        //Added By Shivali Thakur
                        if ((e["ColumnName"].ToString().Contains("TOTALLPIECES")) == true || (e["KeyColumn"].ToString().Contains("ADDPIECES")) == true)
                        {
                            if (e["ColumnName"].ToString().Contains("TOTALLPIECES") == true)
                            {
                                ar.KeyColumn = e["ColumnName"].ToString().Replace("LL", "L-");
                            }
                            if (e["KeyColumn"].ToString().Contains("ADDPIECES") == true)
                            {
                                ar.KeyColumn = e["ColumnName"].ToString().Replace("DD", "DD-");
                            }
                        }
                        else
                        {
                            ar.KeyColumn = e["ColumnName"].ToString();
                        }
                        //  ar.KeyColumn = e["ColumnName"].ToString();
                        ar.subprocessname = e["subprocessname"].ToString();
                        ar.KeyValue = e["KeyValue"].ToString();
                        ar.OldValue = e["OldValue"].ToString();
                        ar.NewValue = e["NewValue"].ToString();
                        //TerminalID = (e["TerminalID"]).ToString(),
                        ar.TerminalID = e["IpAddress"].ToString();
                        ar.TerminalName = e["TerminalName"].ToString();
                        ar.UserName = e["UserName"].ToString();
                        ar.FormAction = e["FormAction"].ToString();
                        //   RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                        ar.RequestedOn = e["RequestedOn"].ToString();
                    }
                    ActivityLogReportList.Add(ar);
                }

                var jsonResult = Json(new { key = ds.Tables[1].Rows[0][0].ToString(), value = ActivityLogReportList.AsQueryable().ToList() }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAuditLog_Search"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string PageNameSNo, string KeyValueNameSNo, string fromdate, string todate)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AuditLogReport>(filter);
            try
            {
                AuditLogReport activitylogReport = new AuditLogReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", request.Page), new SqlParameter("@PageSize", 1048576), new SqlParameter("@KeyValue", KeyValueNameSNo), new SqlParameter("@Page", PageNameSNo), new SqlParameter("@FromDate", fromdate), new SqlParameter("@ToDate", todate), new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search", Parameters);        
                DataTable dt1 = ds.Tables[0];          
                ConvertDSToExcel_Success(dt1, 0);     
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SpGet_ULDUCMReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public void ExportToExcel_Booking([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string PageNameSNo, string fromdate, string todate)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AuditLogReport>(filter);

            try
            {
                AuditLogReport activitylogReport = new AuditLogReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", request.Page), new SqlParameter("@PageSize", 1048576), new SqlParameter("@AWBNo", PageNameSNo), new SqlParameter("@FromDate", fromdate), new SqlParameter("@ToDate", todate), new SqlParameter("@UserSNO", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search_Booking", Parameters);
                DataSet ds1 = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_Search_Acceptence", Parameters);

                DataTable dt = ds.Tables[0];
                DataTable dt1 = ds1.Tables[0];
                dt1.Merge(dt);
                dt1.AcceptChanges();
                ConvertDSToExcel_Success(dt1, 0);            
            }
            catch (Exception ex)
            {               
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SpGet_ULDUCMReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=AuditLogReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                  //  Response.ClearHeaders();  
                }

            }
        }
        
        //public string selectKey(int id)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@Key", id) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAuditLog_SearchKeyValue", Parameters);
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}

    }
    
}