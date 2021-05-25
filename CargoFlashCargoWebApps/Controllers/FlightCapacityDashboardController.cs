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
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;
namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightCapacityDashboardController : Controller
    {
        //
        // GET: /FlightCapacityDashboard/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult FlightCapacityDashboardGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, FlightCapacityDashboardRequestModel Model)
        {

            System.Data.DataSet ds = new DataSet();
            IEnumerable<FlightCapacityDashboard> CommodityList = null;
            string FromDate = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
            string ToDate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineSNo),                                                                    
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo == null ? "" : Model.FlightNo),  
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize) ,
                                                                    new System.Data.SqlClient.SqlParameter("@flightStatus", Model.FlightStatus) 

                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFlightCapacityDashboard_getrecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new FlightCapacityDashboard
                   {
                       SNo = Convert.ToInt32(e["SNo"]),
                       CarrierFlightNumberSuffix = e["CarrierFlightNumberSuffix"].ToString().ToUpper(),
                       FlightNo = e["FlightNo"].ToString().ToUpper(),
                       DepartureDate = e["DepartureDate"].ToString().ToUpper(),
                       BoardPoint = e["BoardPoint"].ToString().ToUpper(),
                       OffPoint = e["OffPoint"].ToString().ToUpper(),
                       Mode = e["Mode"].ToString().ToUpper(),
                       PlannedAircraftType = e["PlannedAircraftType"].ToString().ToUpper(),
                       OperatedAircraftType = e["OperatedAircraftType"].ToString().ToUpper(),
                       GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                       GrossVolume = e["ChargeableWeight"].ToString().ToUpper(),
                       Revenue = e["Revenue"].ToString().ToUpper(),
                       //Grossweightutilization = e["Grossweightutilization"].ToString().ToUpper(),
                       //Grossvolumeutilization = e["Grossweightchargeableutilization"].ToString().ToUpper(),
                       YieldbyChargeableWeight = e["YieldbyChargeableWeight"].ToString().ToUpper(),
                     
                    
                       FlightStatus = e["FlightStatus"].ToString().ToUpper()//,
                       //TargetedGrossWeight = e["TargetedGrossWeight"].ToString().ToUpper(),
                       //TargetedRevenue = e["TargetedRevenue"].ToString().ToUpper(),
                       //TargetedYield = e["TargetedYield"].ToString().ToUpper(),
                       //GrossWeightDeviation = e["GrossWeightDeviation"].ToString().ToUpper(),
                       //RevenueDeviation = e["RevenueDeviation"].ToString().ToUpper(),
                       //YieldDeviation = e["YieldDeviation"].ToString().ToUpper()


                   });
                    ds.Dispose();
                }


                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<FlightCapacityDashboard>().ToList<FlightCapacityDashboard>(),
                    Total = ds.Tables.Count > 0 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFlightCapacityDashboard_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }




        public void ExportToExcelAll(string airlineSNo, string flightNo, string fromDate, string toDate,string flightstatus)
        {


            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),                                                                    
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo",flightNo),  
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),                                                                    
                                                                     new System.Data.SqlClient.SqlParameter("@ToDate",toDate),     
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", 1), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576) ,
                                                                      new System.Data.SqlClient.SqlParameter("@flightStatus",Convert.ToInt32(flightstatus)) 
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFlightCapacityDashboard_getrecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                ConvertDSToExcel(dt1);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFlightCapacityDashboard_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public void ConvertDSToExcel(DataTable dt)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=FlightReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(System.Web.HttpContext.Current.Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }
    }
}