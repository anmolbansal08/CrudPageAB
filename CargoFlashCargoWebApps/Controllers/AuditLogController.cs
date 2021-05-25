using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.DataService.Common;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.AuditLog;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.SoftwareFactory.Data;
using System.ServiceModel.Web;
using System.Net;





namespace CargoFlashCargoWebApps.Controllers
{
    public class AuditLogController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ActivityLog()
        {

            return View();
        }

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public JsonResult GetActivityRecordSearch(ActivityLogRequest model, string PageNo, string PageSize, string userId, string module, string page, string action, string fromDate, string toDate)
        {
            try
            {
                //var PageNo = "";
                //var PageSize = "";

                //string action=string.Empty;
                //if (model != null )
                //{

                //    userid = model.UserId;
                //    Module = model.Module;
                //    Page = WhereClause[2].ToString();
                //    Action = WhereClause[3].ToString();
                //    StartDate = WhereClause[4].ToString();
                //    EndDate = WhereClause[5].ToString();
                //    //PageNo = WhereClause[6].ToString();
                //    //PageSize = WhereClause[7].ToString();
                //}
                //else
                //{
                //    StartDate = fromDate;
                //    EndDate = toDate;
                //}

                ActivityLogReport activitylogReport = new ActivityLogReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", PageSize), new SqlParameter("@UserId", model.UserId), new SqlParameter("@Module", model.Module), new SqlParameter("@Page", model.Page), new SqlParameter("@Action", model.Action), new SqlParameter("@FromDate", model.StartDate), new SqlParameter("@ToDate", model.EndDate) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spActivityLog_SearchData", Parameters);
                var ActivityLogReportList = ds.Tables[0].AsEnumerable().Select(e => new ActivityLogReport
                {

                    SNo = Convert.ToInt32(e["SNo"]),
                    UserID = e["UserID"].ToString(),
                    SessionKey = e["SessionKey"].ToString(),
                    City = e["CityCode"].ToString(),
                    Module = e["Module"].ToString(),
                    Page = (e["Page"]).ToString(),
                    Action = (e["Action"]).ToString(),
                    IpAddress = (e["IpAddress"]).ToString(),
                    TerminalName = (e["TerminalName"]).ToString(),
                    Browser = e["Browser"].ToString(),
                    //RequestedOn = (DateTime.Parse(e["RequestedOn"].ToString()).Date).ToString("dd/MM/yyyy"),
                    RequestedOn = e["RequestedOn"].ToString() == "" ? "" : e["RequestedOn"].ToString()
                });

                var jsonResult = Json(new { key = ds.Tables[1].Rows[0][0].ToString(), value = ActivityLogReportList.AsQueryable().ToList() }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            catch(Exception ex)// (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spActivityLog_SearchData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        //ConvertDSToExcel_Success() Function Added to Export Excel by rahul singh at 04-08-2017 
        public void GetActivityRecordInExcel(string userId, string module, string page, string Raction, string fromDate, string toDate)
        {


            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@UserId",userId),
                                                                    new System.Data.SqlClient.SqlParameter("@Module",module),
                                                                    new System.Data.SqlClient.SqlParameter("@Page",page),
                                                                    new System.Data.SqlClient.SqlParameter("@Action",Raction),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spActivityLog_ExcelExport", Parameters);
                //ExportActivityDataSetToExcel(ds, "ActivityLog");
                //return View();

                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch(Exception ex)// (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spActivityLog_ExcelExport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            try
            {
                string date = DateTime.Now.ToString();
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dt);
                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename=ActivityLog_'" + date + "'.xlsx");
                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            catch(Exception ex)//(Exception ex)//
            {
                throw ex;
            }
        }

        public static void ExportActivityDataSetToExcel(DataSet ds, string filename)
        {
            try
            { 
            HttpResponse response = System.Web.HttpContext.Current.Response;

            // first let's clean up the response.object
            response.Clear();
            response.Charset = "";

            // set the response mime type for excel
            response.ContentType = "application/vnd.ms-excel";
            response.AddHeader("Content-Disposition", "attachment;filename=\"" + filename + "\"");

            // create a string writer
            using (StringWriter sw = new StringWriter())
            {
                using (HtmlTextWriter htw = new HtmlTextWriter(sw))
                {
                    // instantiate a datagrid
                    DataGrid dg = new DataGrid();
                    dg.DataSource = ds.Tables[0];
                    dg.DataBind();
                    dg.RenderControl(htw);
                    response.Write(sw.ToString());
                    response.End();
                }
            }
        }
            catch(Exception ex)//(Exception ex)//
            {
                throw ex;
            }
        }
       

        public ActionResult GetRecordInExcel(string applicationName, string keyColumn, string keyValue, string userName, DateTime startDate, DateTime endDate, string columnName)
        {
         try
         {

            // string Name = applicationName.Replace(" ", "");
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@ApplicationName",applicationName),
                                                                    new System.Data.SqlClient.SqlParameter("@KeyColumn",keyColumn),
                                                                    new System.Data.SqlClient.SqlParameter("@KeyValue",keyValue),
                                                                    new System.Data.SqlClient.SqlParameter("@UserName",userName),
                                                                    new System.Data.SqlClient.SqlParameter("@StartDate",startDate),
                                                                    new System.Data.SqlClient.SqlParameter("@EndDate",endDate),
                                                                    new System.Data.SqlClient.SqlParameter("@Fieldname",columnName),
                                                              };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAuditLog_SearchData", Parameters);
            ExportDataSetToExcel(ds, "AuditLog");
            return View();
          }
         catch(Exception ex)//
         {
             throw ex;
         }
        }

        public static void ExportDataSetToExcel(DataSet ds, string filename)
        {
            try
            {
                HttpResponse response = System.Web.HttpContext.Current.Response;

                // first let's clean up the response.object
                response.Clear();
                response.Charset = "";

                // set the response mime type for excel
                response.ContentType = "application/vnd.ms-excel";
                response.AddHeader("Content-Disposition", "attachment;filename=\"" + filename + "\"");

                // create a string writer
                using (StringWriter sw = new StringWriter())
                {
                    using (HtmlTextWriter htw = new HtmlTextWriter(sw))
                    {
                        // instantiate a datagrid
                        DataGrid dg = new DataGrid();
                        dg.DataSource = ds.Tables[0];
                        dg.DataBind();
                        dg.RenderControl(htw);
                        response.Write(sw.ToString());
                        response.End();
                    }
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}