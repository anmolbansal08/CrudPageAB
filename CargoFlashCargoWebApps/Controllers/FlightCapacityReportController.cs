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
using CargoFlash.Cargo.Model.Reservation;

namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightCapacityReportController : Controller
    {
        //
        // GET: /FlightCapacityReport/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetFlightCapacityReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, FlightCapacityRequestModel Model)
        {
            DataSet ds = new DataSet();
            IEnumerable<FlightCapacityReport> CommodityList = null;
            try
            {
                //DateTime fromdt = DateTime.ParseExact(Model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var fromdate_result = fromdt.ToString("yyyy-MM-dd");
                //DateTime todt = DateTime.ParseExact(Model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var todate_result = todt.ToString("yyyy-MM-dd");

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Convert.ToInt32(Model.OriginSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationSNo",Convert.ToInt32(Model.DestinationSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),                                                                  
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", Model.DateType),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo", Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFlightCapacityReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new FlightCapacityReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        FlightNumber = e["FlightNumber"].ToString().ToUpper(),
                        DepartureDate = e["DepartureDate"].ToString().ToUpper(),
                        BoardPoint = e["BoardPoint"].ToString().ToUpper(),
                        OffPoint = e["OffPoint"].ToString().ToUpper(),
                        Sector = e["Sector"].ToString().ToUpper(),
                        Stretch = e["Stretch"].ToString().ToUpper(),
                        PlannedAircraftType = e["PlannedAircraftType"].ToString().ToUpper(),
                        OperatedAircraftType = e["OperatedAircraftType"].ToString().ToUpper(),
                        Distance = e["Distance"].ToString().ToUpper(),
                        CommercialCapacity = e["CommercialCapacity"].ToString().ToUpper(),
                        RTKC = e["RTKC"].ToString().ToUpper(),
                        ATKC = e["ATKC"].ToString().ToUpper(),
                        ActualCLF = e["ActualCLF"].ToString().ToUpper(),
                        GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                        GrossVolume = e["GrossVolume"].ToString().ToUpper(),
                        Revenue = e["Revenue"].ToString().ToUpper(),
                        FlightStatus = e["FlightStatus"].ToString().ToUpper(),
                        TargetedGrossWeight = e["TargetedGrossWeight"].ToString().ToUpper(),
                        TargetedRevenue = e["TargetedRevenue"].ToString().ToUpper(),
                        TargetedRTKC = e["TargetedRTKC"].ToString().ToUpper(),
                        TargetedATKC = e["TargetedATKC"].ToString().ToUpper(),
                        TargetedCLF = e["TargetedCLF"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<FlightCapacityReport>().ToList<FlightCapacityReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFlightCapacityReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public void GetFlightCapacityForExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string AirlineCode, string OriginSNo, string DestinationSNo, string FromDate, string ToDate, string DateType, string FlightNo)
        {

            DataSet ds = new DataSet();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Convert.ToInt32(OriginSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@DestinationSNo",Convert.ToInt32(DestinationSNo)),
                                                                   new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                   new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),                                                                  
                                                                   new System.Data.SqlClient.SqlParameter("@DateType", DateType),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", 1), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", 1048540)
                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFlightCapacityReport_GetRecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFlightCapacityReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=FlightCapacityReport_'" + date + "'.xlsx");
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