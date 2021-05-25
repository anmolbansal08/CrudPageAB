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
    public class WarehouseInventoryReportController : Controller
    {
        //
        // GET: /WarehouseInventoryReport/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult WarehouseInventoryReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, WarehouseInventoryReportRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseInventoryReport>(filter);
            System.Data.DataSet dsWarehouseInventoryReport = new DataSet();


            IEnumerable<WarehouseInventoryReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   //new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySNo",Model.OriginSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     //new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };

                dsWarehouseInventoryReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spWarehouseInventoryReport_GetRecord", Parameters);
                if (dsWarehouseInventoryReport.Tables.Count > 1 && dsWarehouseInventoryReport.Tables != null)
                {
                    CommodityList = dsWarehouseInventoryReport.Tables[0].AsEnumerable().Select(e => new WarehouseInventoryReport
                    {
                        //ReceiveChWt 	Location	
                        SNo = Convert.ToInt32(e["SNo"]),
                        //Org = e["Org"].ToString().ToUpper(),
                        //Dest = e["Dest"].ToString().ToUpper(),
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString().ToUpper(),
                        MAWB = e["AWBNo"].ToString().ToUpper(),
                        HAWB = e["HAWBNo"].ToString().ToUpper(),                       
                        ReceivePcs = e["ReceivePcs"].ToString().ToUpper(),
                        ReceiveGWt = e["ReceiveGWt"].ToString().ToUpper(),
                        ReceiveChWt = e["ReceiveChWt"].ToString().ToUpper(),
                        Location = e["Location"].ToString().ToUpper()
                    });
                    dsWarehouseInventoryReport.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = dsWarehouseInventoryReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<WarehouseInventoryReport>().ToList<WarehouseInventoryReport>(),
                    Total = dsWarehouseInventoryReport.Tables.Count > 1 ? Convert.ToInt32(dsWarehouseInventoryReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spWarehouseInventoryReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, WarehouseInventoryReportRequestModel Model)
        {
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   //new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySNo",Model.OriginSNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.@OriginAirportSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     //new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)
                   
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spWarehouseInventoryReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spWarehouseInventoryReport_GetRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=WarehouseInventoryReport_'" + date + "'.xlsx");
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