using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Data;

using CargoFlash.Cargo.Model;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.IO;
using System.Collections;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class StationSummaryReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: StationSummaryReport
        public ActionResult Index()
        {
            return View();
        }

        //, string CheckedStatus
        public ActionResult GetStationSummaryReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, StationSummaryRequestModel Model)
        {
            DataSet ds = new DataSet();
            IEnumerable<StationSummaryReport> CommodityList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@AgentSNo",Convert.ToInt32(Model.AgentSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSNo",Convert.ToInt32(Model.ProductSNo)),
                                                                   //new System.Data.SqlClient.SqlParameter("@ISCumulative", Model.ISCumulative),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_StationSummaryReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new StationSummaryReport
                    {
                        //STATIONS AGENT   TOTALSHPTS GRSWT CHWT   CumulativeShpts    CumulativeGrWt CumulativeChWt
                        SNo = Convert.ToInt32(e["SNo"]),
                        STATIONS = e["STATIONS"].ToString().ToUpper(),
                        AGENT = e["AGENT"].ToString().ToUpper(),
                        TOTALSHPTS = e["TOTALSHPTS"].ToString().ToUpper(),
                        GRSWT = e["GRSWT"].ToString().ToUpper(),
                        CHWT = e["CHWT"].ToString().ToUpper(),
                        CumulativeShpts = e["CumulativeShpts"].ToString().ToUpper(),
                        CumulativeGrWt = e["CumulativeGrWt"].ToString().ToUpper(),
                        CumulativeChWt = e["CumulativeChWt"].ToString().ToUpper()

                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_StationSummaryReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void GetStationSummaryReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, StationSummaryRequestModel Model)
        {
            DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@AgentSNo",Convert.ToInt32(Model.AgentSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@productSNo",Convert.ToInt32(Model.ProductSNo)),
                                                                   //new System.Data.SqlClient.SqlParameter("@ISCumulative", Model.ISCumulative),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048578)
                                                              };
            try
            {
                //spBookingvarianceReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_StationSummaryReport_GetRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_StationSummaryReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=StationSummaryReport_'" + date + "'.xlsx");
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

    public class StationSummaryReport
    {
        //STATIONS AGENT   TOTALSHPTS GRSWT CHWT   CumulativeShpts    CumulativeGrWt CumulativeChWt

        public int SNo { get; set; }
        public string STATIONS { get; set; }
        public string AGENT { get; set; }
        public string TOTALSHPTS { get; set; }
        public string GRSWT { get; set; }
        public string CHWT { get; set; }
        public string CumulativeShpts { get; set; }
        public string CumulativeGrWt { get; set; }
        public string CumulativeChWt { get; set; }

    }

    public class StationSummaryRequestModel
    {
        public string AirlineCode { get; set; }
        public string ProductSNo { get; set; }
        public string AgentSNo { get; set; }
        //public string ISCumulative { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }

}
