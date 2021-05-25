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


    public class DailySalesReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.ReadConnectionString.WebConfigConnectionString;

        //
        // GET: /DailySalesReport/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult DailySalesReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, DailySalesRequestModel Model)
        {

            System.Data.DataSet dsSailySales = new DataSet();


            IEnumerable<DailySalesReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@Type",Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Model.Origin),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Model.Destination),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBSNo", Model.AWBSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };

                dsSailySales = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailySalesReport_getrecord", Parameters);
                if (dsSailySales.Tables.Count > 1 && dsSailySales.Tables != null)
                {
                    CommodityList = dsSailySales.Tables[0].AsEnumerable().Select(e => new DailySalesReport
                    {
                       // SNo = Convert.ToInt32(e["SNo"]),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        BookingType = e["BookingType"].ToString().ToUpper(),
                        FlightDate = Convert.ToDateTime(e["FlightDate"]).ToString("yyyy-MM-dd"),
                        BookingDate = Convert.ToDateTime(e["BookingDate"]).ToString("yyyy-MM-dd"),
                        GSAName = e["AccountName"].ToString().ToUpper(),
                        ParticipantID = e["ParticipantID"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        Pieces = e["Pieces"].ToString().ToUpper(),
                        GrWt = e["GrWt"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        Amount = e["Amount"].ToString().ToUpper(),
                        Rate = e["Rate"].ToString().ToUpper(),
                        Yield = e["Yield"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        OfficeName = e["OfficeName"].ToString().ToUpper()

                    });
                    dsSailySales.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsSailySales.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<DailySalesReport>().ToList<DailySalesReport>(),
                    Total = dsSailySales.Tables.Count > 1 ? Convert.ToInt32(dsSailySales.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailySalesReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, DailySalesRequestModel Model)
        {

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@Type",Model.Type),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                    new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginCitySno",Model.Origin),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Model.Destination),
                                                                   new System.Data.SqlClient.SqlParameter("@AWBSNo", Model.AWBSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spDailySalesReport_getrecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailySalesReport_getrecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=DailySalesReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        // Add By sushant : 30-05-2018
        [HttpGet]
        public JsonResult IdefaultAirportSno()
        {

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetIdefaultAirport", Parameters);


                var IsdefaultAirPort = ds.Tables[0].AsEnumerable().Select(e => new AirPortSno
                {
                    IsdefaultAirPortSno = e["IsdefaultAirPortSno"].ToString(),
                });
                ds.Dispose();

                return Json(new DataSourceResult
                {
                    Data = IsdefaultAirPort.AsQueryable().ToList(),
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//
            {
                throw ex;

            }

        }

        public class AirPortSno
        {

            public string IsdefaultAirPortSno { get; set; }

        }

        public void GetDailyFinalDeliveryReport_Excel(String airportsno, String FromDate, String ToDate, int page, int pageSize)
        {
            try
            {
                // IEnumerable<DailyFinalDeliveryReport> CommodityList = null;
                String procname = string.Empty;
                procname = "spDailyFinalDeliveryReport";
                System.Data.DataSet ds = new DataSet();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                    //new  SqlParameter("@AirlineSno",Convert.ToInt32(airlinesno)),
                                                      new  System.Data.SqlClient.SqlParameter("@AirportSno",Convert.ToInt32(airportsno)),
                                                      new System.Data.SqlClient.SqlParameter("@FromDate", Convert.ToDateTime(FromDate.Replace('_', ':'))),
                                            new System.Data.SqlClient.SqlParameter("@ToDate",Convert.ToDateTime(ToDate.Replace('_', ':'))),                                new System.Data.SqlClient.SqlParameter("@PageNo",page),
                                            new System.Data.SqlClient.SqlParameter("@PageSize",pageSize),
                                            };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, procname, Parameters);
                DataTable dt = ds.Tables[0];
                dt.AcceptChanges();
                ConvertDSToExcel_DailyFinalDeliveryReport(dt, 0);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        public void ConvertDSToExcel_DailyFinalDeliveryReport(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=Daily_Final_DeliveryReport_'" + date + "'.xlsx");
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