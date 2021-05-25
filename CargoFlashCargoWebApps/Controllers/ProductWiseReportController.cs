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
    public class ProductWiseReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: StationSummaryReport
        public ActionResult Index()
        {
            return View();
        }

        //, string CheckedStatus
        public ActionResult GetProductWiseReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, StationSummaryRequestModel Model)
        {
            DataSet ds = new DataSet();
            IEnumerable<ProductWiseReport> CommodityList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),                                                                   
                                                                   new System.Data.SqlClient.SqlParameter("@productSNo",Model.ProductSNo),                                                                   
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_ProductWiseReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new ProductWiseReport
                    {
                        //Product	Noofshipments	GrWt	ChWt
                        SNo = Convert.ToInt32(e["SNo"]),
                        Product = e["Product"].ToString().ToUpper(),
                        Noofshipments = e["Noofshipments"].ToString().ToUpper(),
                        GrWt = e["GrWt"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper()

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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_ProductWiseReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void GetProductWiseReportForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, StationSummaryRequestModel Model)
        {
            DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                 new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@productSNo",Model.ProductSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048578)
                                                              };
            try
            {
                //spBookingvarianceReport_GetRecordForExcel
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_ProductWiseReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_ProductWiseReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=ProductWiseReport_'" + date + "'.xlsx");
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

    public class ProductWiseReport
    {
        //Product	Noofshipments	Grwt	ChWt


        public int SNo { get; set; }
        public string Product { get; set; }
        public string Noofshipments { get; set; }       
        public string GrWt { get; set; }

        public string ChWt { get; set; }
        

    }

    public class ProductWiseRequestModel
    {
        public string AirlineCode { get; set; }
        public string ProductSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
}