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
    public class TransitShipmentsReportController : Controller
    {
        //
        // GET: /TransitShipmentsReport/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult TransitShipmentsReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, TransitShipmentsReportRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<TransitShipmentsReport>(filter);
            System.Data.DataSet dsTransitShipmentsReport = new DataSet();


            IEnumerable<TransitShipmentsReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                      new System.Data.SqlClient.SqlParameter("@LoginAirportSNo",Model.LoginAirportSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                                                                    new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };

                dsTransitShipmentsReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spTransitShipmentsReport_GetRecord", Parameters);
                if (dsTransitShipmentsReport.Tables.Count > 1 && dsTransitShipmentsReport.Tables != null)
                {
                    CommodityList = dsTransitShipmentsReport.Tables[0].AsEnumerable().Select(e => new TransitShipmentsReport
                    {
                        //Station,Org,Dest,JoiningCargo,RampTransfer,Transit,Total
                        SNo = Convert.ToInt32(e["SNo"]),
                        Station = e["Station"].ToString().ToUpper(),
                        Org = e["Org"].ToString().ToUpper(),
                        Dest = e["Dest"].ToString().ToUpper(),
                        JoiningCargo = e["JoiningCargo"].ToString().ToUpper(),
                        RampTransfer = e["RampTransfer"].ToString().ToUpper(),
                        Transit = e["Transit"].ToString().ToUpper(),
                        Total = e["Total"].ToString().ToUpper()
                    });
                    dsTransitShipmentsReport.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsTransitShipmentsReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<TransitShipmentsReport>().ToList<TransitShipmentsReport>(),
                    Total = dsTransitShipmentsReport.Tables.Count > 1 ? Convert.ToInt32(dsTransitShipmentsReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spTransitShipmentsReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult ShowAWBDetails([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, TransitShipmentsAWBRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<TransitShipmentsShowAWBDetails>(filter);
            System.Data.DataSet dsTransitShipmentsReport = new DataSet();


            IEnumerable<TransitShipmentsShowAWBDetails> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                      new System.Data.SqlClient.SqlParameter("@LoginAirportSNo",Model.LoginAirportSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                                                                    new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@SNo", Model.SNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Type", Model.Type)
                                                              };

                dsTransitShipmentsReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spTransitShipmentsReport_GetAWBRecord", Parameters);
                if (dsTransitShipmentsReport.Tables.Count > 1 && dsTransitShipmentsReport.Tables != null)
                {
                    CommodityList = dsTransitShipmentsReport.Tables[0].AsEnumerable().Select(e => new TransitShipmentsShowAWBDetails
                    {
                        //SNo = Convert.ToInt32(e["SNo"]),
                        AWBNo = e["AWBNo"].ToString(),
                        TotalPieces = e["Pieces"].ToString(),
                        TotalGrossWeight = e["GrossWeight"].ToString(),
                        FlightNo = e["FlightNo"].ToString(),
                        FlightDate = e["FlightDate"].ToString(),
                        VolumeWeight = e["Volume"].ToString(),
                        TotalChargeableWeight = e["ChargeableWeight"].ToString()
                    });
                    dsTransitShipmentsReport.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsTransitShipmentsReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<TransitShipmentsShowAWBDetails>().ToList<TransitShipmentsShowAWBDetails>(),
                    Total = dsTransitShipmentsReport.Tables.Count > 1 ? Convert.ToInt32(dsTransitShipmentsReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spTransitShipmentsReport_GetAWBRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }



        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, TransitShipmentsReportRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@LoginAirportSNo",Model.LoginAirportSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@Origin",Model.Origin),
                                                                    new System.Data.SqlClient.SqlParameter("@Destination",Model.Destination),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)
                   
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spTransitShipmentsReport_GetRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                dt1.Columns.Remove("RowNumber");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spTransitShipmentsReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public void ExportToExcelAWBShowDetails([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string AirlineCode, string Origin, string Destination, string FromDate, string ToDate, int SNo, string TypeOf)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@LoginAirportSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()),
                                                                new System.Data.SqlClient.SqlParameter("@AirlineCode",AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@Origin",Origin),
                                                                    new System.Data.SqlClient.SqlParameter("@Destination",Destination),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@SNo", SNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Type", TypeOf),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spTransitShipmentsReport_GetAWBRecord", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("SNo");
                dt1.Columns.Remove("RowNumber");

                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spTransitShipmentsReport_GetAWBRecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=TransitShipmentsReport_'" + date + "'.xlsx");
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