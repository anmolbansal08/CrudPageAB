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
using CargoFlash.Cargo.Model.Reservation;
using ClosedXML.Excel;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class DailyReportForHOController : Controller
    {
        //
        // GET: /DailyReportForHO/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult DailyReportForHOGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyReportForHOModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DailyReportForHO>(filter);
            System.Data.DataSet dsSailySales = new DataSet();


            IEnumerable<DailyReportForHO> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
																	new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.Airport ==""?"0":Model.Airport),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                     new System.Data.SqlClient.SqlParameter("@OrderBy", sorts)
                                                                    //,
                                                                    //new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType) 
                                                              };

                dsSailySales = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailyReportForHO_getrecord", Parameters);
                if (dsSailySales.Tables.Count > 1 && dsSailySales.Tables != null)
                {
                    CommodityList = dsSailySales.Tables[0].AsEnumerable().Select(e => new DailyReportForHO
                    {
                        Date = Convert.ToDateTime(e["Date"]).ToString("dd-MM-yyyy"),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        Pcs = e["Pcs"].ToString(),
                        GrossWeight = e["GrossWeight"].ToString(),
                        ChargeableWeight = e["ChargeableWeight"].ToString()
                    });
                    dsSailySales.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsSailySales.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<DailyReportForHO>().ToList<DailyReportForHO>(),
                    Total = dsSailySales.Tables.Count > 1 ? Convert.ToInt32(dsSailySales.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportForHO_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, DailyReportForHOModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<DailyReportForHO>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
																	new System.Data.SqlClient.SqlParameter("@AirportSNo",Model.Airport ==""?"0":Model.Airport)

															  };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spDailyReportForHO_getrecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportForHO_getrecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=DailyReportForHO_'" + date + "'.xlsx");
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