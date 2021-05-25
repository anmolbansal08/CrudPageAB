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
using CargoFlash.Cargo.Model.ULD;
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class UlducmreportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.ReadConnectionString.WebConfigConnectionString;
        //
        // GET: /Ulducmreport/ Add BY Sushant Kumar Nayak 07-02-2018

        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetULDUCMReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, ULDUCMReport Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ULDUCMReport>(filter);
            System.Data.DataSet ULDUCMReportds = new DataSet();


            IEnumerable<ULDUCMReport> CommodityList = null;

            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirportCode",Model.OriginAirPort),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",Model.todate),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNumber",Model.FlightNumber==null?"":Model.FlightNumber),
                                                                   new System.Data.SqlClient.SqlParameter("@Status",Model.NotificationStatus==null?"":Model.NotificationStatus),
                                                                   new System.Data.SqlClient.SqlParameter("@UCMType",Model.UCMType==null?"":Model.UCMType),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@CurrAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()),
                                                              };


                ULDUCMReportds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "SpGet_ULDUCMReport", Parameters);
                if (ULDUCMReportds.Tables.Count > 1 && ULDUCMReportds.Tables != null)
                {
                    CommodityList = ULDUCMReportds.Tables[0].AsEnumerable().Select(e => new ULDUCMReport
                    {
                        OriginAirPort = e["OriginAirPort"].ToString().ToUpper(),
                        Flightdate = e["Flightdate"].ToString().ToUpper(),
                        FlightNumber = e["Flightno"].ToString().ToUpper(),
                        UCMDate = e["UCMDate"].ToString().ToUpper(),
                        UCMType = e["UCMType"].ToString().ToUpper(),
                        NotificationStatus = e["NotificationStatus"].ToString().ToUpper(),
                        Remarks = e["Remarks"].ToString().ToUpper(),
                        CurrentStatus = e["CurrentStatus"].ToString().ToUpper(),
                    });
                    ULDUCMReportds.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = ULDUCMReportds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<ULDUCMReport>().ToList<ULDUCMReport>(),
                    Total = ULDUCMReportds.Tables.Count > 1 ? Convert.ToInt32(ULDUCMReportds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

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





        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string OriginAirPort, string fromdate, string todate, string FlightNumber, string NotificationStatus, string UCMType)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirportCode",OriginAirPort),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                   new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNumber",FlightNumber==null?"":FlightNumber),
                                                                   new System.Data.SqlClient.SqlParameter("@Status",NotificationStatus==null?"":NotificationStatus),
                                                                   new System.Data.SqlClient.SqlParameter("@UCMType",UCMType==null?"":UCMType),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                   new System.Data.SqlClient.SqlParameter("@CurrAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()),

                   
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "SpGet_ULDUCMReport", Parameters);
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
                Response.AddHeader("content-disposition", "attachment;filename=ULDUCMReport_'" + date + "'.xlsx");
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