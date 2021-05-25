using CargoFlash.Cargo.Model.ULD.Stock;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;
namespace CargoFlashCargoWebApps.Controllers
{
    public class DailyStockTransactionReportController : Controller
    {
        //
        // GET: /DailyStockTransactionReport/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DailyStockTransactionReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string airlineSNo, string fromDate, string toDate, string OriginSNo, int IsAutoProcess)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<DailyStockTransactionReport> CommodityList = null;
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    //new System.Data.SqlClient.SqlParameter("@DestinationSNo",DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyStockTransactionReport_getrecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new DailyStockTransactionReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        FromLocation = e["FromLocation"].ToString().ToUpper(),
                        ToLocation = e["ToLocation"].ToString().ToUpper(),
                        StartRange = e["StartRange"].ToString().ToUpper(),
                        EndRange = e["EndRange"].ToString().ToUpper(),
                        Count = e["Count"].ToString().ToUpper(),
                        TransactionType = e["TransactionType"].ToString().ToUpper(),
                        TransactionDate = e["TransactionDate"].ToString().ToUpper()
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<DailyStockTransactionReport>().ToList<DailyStockTransactionReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyStockTransactionReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string airlineSNo, string fromDate, string toDate, string OriginSNo,int IsAutoProcess)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<DailyStockTransactionReport> CommodityList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",OriginSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@DestinationSNo",DestinationSNo), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 100000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyStockTransactionReport_getrecord", Parameters);

                DataTable dt = ds.Tables[0];
                ConvertDSToExcel_Success(dt, 0);
                //if (ds.Tables.Count > 0 && ds.Tables != null)
                //{
                //    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new DailyStockTransactionReport
                //   {
                //       SNo = Convert.ToInt32(e["SNo"]),
                //       FromLocation = e["FromLocation"].ToString().ToUpper(),
                //       ToLocation = e["ToLocation"].ToString().ToUpper(),
                //       StartRange = e["StartRange"].ToString().ToUpper(),
                //       EndRange = e["EndRange"].ToString().ToUpper(),
                //       Count = e["Count"].ToString().ToUpper(),
                //       TransactionType = e["TransactionType"].ToString().ToUpper(),
                //       TransactionDate = e["TransactionDate"].ToString().ToUpper()

                //   });
                //    ds.Dispose();
                //}
                //return Json(new DataSourceResult
                //{
                //    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<DailyStockTransactionReport>().ToList<DailyStockTransactionReport>(),
                //}, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyStockTransactionReport_getrecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=DailyTransactionReport_'" + date + "'.xlsx");
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
    }
}