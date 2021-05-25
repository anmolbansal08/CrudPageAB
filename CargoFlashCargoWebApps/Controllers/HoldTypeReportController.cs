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
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class HoldTypeReportController : Controller
    {
        //
        // GET: /HoldTypeReport/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult HoldTypeReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, HoldTypeReportRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);
            System.Data.DataSet dsHoldTypeReport = new DataSet();


            IEnumerable<HoldTypeReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    //new System.Data.SqlClient.SqlParameter("@HoldType",Model.HoldType),
                                                                    //new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };

                dsHoldTypeReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spHoldTypeReport_GetRecord", Parameters);
                if (dsHoldTypeReport.Tables.Count > 1 && dsHoldTypeReport.Tables != null)
                {
                    CommodityList = dsHoldTypeReport.Tables[0].AsEnumerable().Select(e => new HoldTypeReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AWB = e["AWB"].ToString().ToUpper(),
                        HAWBNo = e["HAWBNo"].ToString().ToUpper(),
                        Pkgs = e["Pkgs"].ToString().ToUpper(),
                        Gwt = e["Gwt"].ToString().ToUpper(),
                        HoldDate = e["HoldDate"].ToString().ToUpper(),
                        HoldedBy = e["HoldedBy"].ToString().ToUpper(),
                        HoldRemark = e["HoldRemark"].ToString().ToUpper()
                    });
                    dsHoldTypeReport.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = dsHoldTypeReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<HoldTypeReport>().ToList<HoldTypeReport>(),
                    Total = dsHoldTypeReport.Tables.Count > 1 ? Convert.ToInt32(dsHoldTypeReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spHoldTypeReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, HoldTypeReportRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    //new System.Data.SqlClient.SqlParameter("@HoldType",Model.HoldType),
                                                                    //new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)
                                                               };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spHoldTypeReport_GetRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                    new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spHoldTypeReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=HoldTypeReport_'" + date + "'.xlsx");
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