
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class TransitAWBReportController : Controller
    {
        // GET: TransitAWBReport
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public ActionResult GetAwbTransitReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, TransitAWBReport Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<TransitAWBReport>(filter);
            System.Data.DataSet dsSailySales = new DataSet();


            IEnumerable<TransitAWBReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirportCode",Model.AirportCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                    //,
                                                                    //new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType) 
                                                              };

                dsSailySales = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetTransitAwbReport", Parameters);
                if (dsSailySales.Tables.Count > 1 && dsSailySales.Tables != null)
                {
                    CommodityList = dsSailySales.Tables[0].AsEnumerable().Select(e => new TransitAWBReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        AWBDate = e["AWBDate"].ToString().ToUpper(),
                        TransitStation = e["TransitStation"].ToString().ToUpper(),
                        AgentName = e["AgentName"].ToString().ToUpper(),
                        AgentCode = e["AgentCode"].ToString().ToUpper(),
                        AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                        FlightNbr = e["FlightNbr"].ToString().ToUpper(),
                        ATD = e["ATD"].ToString().ToUpper(),
                        AircraftType = e["AircraftType"].ToString().ToUpper(),
                        GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                        ProductName = e["ProductName"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        Station = e["TransitStation"].ToString().ToUpper(),
                        FlightType = e["FlightType"].ToString().ToUpper()
                        //FlightNbr = e["TransitStation"].ToString().ToUpper(),
                        //ATD = e["Agentname"].ToString().ToUpper(),
                        //AircraftType = e["AgentCode"].ToString().ToUpper(),
                    });
                    dsSailySales.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsSailySales.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<TransitAWBReport>().ToList<TransitAWBReport>(),
                    Total = dsSailySales.Tables.Count > 1 ? Convert.ToInt32(dsSailySales.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetTransitAwbReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, TransitAWBReport Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<TransitAWBReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirportCode",Model.AirportCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576)

                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetTransitAwbReportExcel", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetTransitAwbReport"),
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
                Response.AddHeader("content-disposition", "attachment;filename=TransitAWBReport_'" + date + "'.xlsx");
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