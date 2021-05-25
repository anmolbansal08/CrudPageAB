using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using CargoFlash.Cargo.Model.Report;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data.SqlClient;
using System.IO;
using ClosedXML.Excel;

namespace CargoFlashCargoWebApps.Controllers
{
    public class SpecialCargoReportsController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        // GET: SpecialCargoReports
        public ActionResult Index()
        {
            return View();
        }



        // public string GetSpecialCargoDetail(SpecialCargoDetail model)
        public ActionResult GetSpecialCargoDetail([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, SpecialCargoDetail model)
        {
            try
            {
                List<SpecialCargoReportResponse> obj = new List<SpecialCargoReportResponse>();
                //DateTime fromdt = DateTime.ParseExact(model.FromDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var fromdate_result = fromdt.ToString("yyyy-MM-dd");
                //DateTime todt = DateTime.ParseExact(model.ToDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var todate_result = todt.ToString("yyyy-MM-dd");
                //DateTime flightdt = DateTime.ParseExact(model.FlightDate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var flightdt_result = flightdt.ToString("yyyy-MM-dd");

                System.Data.SqlClient.SqlParameter[] Parameters = {                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@From",model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@To",model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),                                                             
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                     new System.Data.SqlClient.SqlParameter("@PageSize",request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_SpecialCargo", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var DailyDepartedFlightReportReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.SpecialCargoReportResponse
                    {
                        SNo = Convert.ToString(e["SNo"]).ToUpper(),
                        AWBNo= Convert.ToString(e["AWBNo"]).ToUpper(),
                        OriginAirport = Convert.ToString(e["OriginAirport"]).ToUpper(),
                        DestinationAirport = Convert.ToString(e["DestinationAirport"]).ToUpper(),
                        BookingDate = Convert.ToString(e["BookingDate"]).ToUpper(),
                        AgentName = Convert.ToString(e["AgentName"]).ToUpper(),
                        AWBPieces = Convert.ToString(e["AWBPieces"]).ToUpper(),
                        GrossWeight = Convert.ToString(e["GrossWeight"]).ToUpper(),
                        Volume = Convert.ToString(e["Volume"]).ToUpper(),
                        Commodity = Convert.ToString(e["Commodity"]).ToUpper(),
                        SHC = Convert.ToString(e["SHC"]).ToUpper(),
                        AWBSTATUS = Convert.ToString(e["AWBSTATUS"]).ToUpper(),
                        RouteType = Convert.ToString(e["RouteType"]).ToUpper(),
                        FlightDate = Convert.ToString(e["FlightDate"]).ToUpper(),
                        FlightNo = Convert.ToString(e["FlightNo"]).ToUpper(),
                        ShipmentStatus = Convert.ToString(e["ShipmentStatus"]).ToUpper(),
                        Createdby = Convert.ToString(e["Createdby"]).ToUpper(),
                    });
                    ds.Dispose();
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = DailyDepartedFlightReportReportList.AsQueryable().ToList(),
                        Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }

                else
                {
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = obj,
                        Total = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_SpecialCargo"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public void ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, SpecialCargoDetail Model)

        {
            try
            {

                //string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                // string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.SpecialCargoDetail>(filter);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@From",Model.FromDate),
                                                                    new SqlParameter("@To",Model.ToDate),
                                                                    new SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new SqlParameter("@Origin",Model.OriginSNo),
                                                                    new SqlParameter("@Dest",Model.DestinationSNo),
                                                                    new SqlParameter ("@PageSize", request.PageSize),
                                                                    new SqlParameter("@PageNo", request.Page),

            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_SpecialCargo", Parameters);


                DataTable dt1 = ds.Tables[0];
                // dt1.Columns.Remove("Aircraft1");
                //dt1.Columns.Remove("Agent1");
                //
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetBillingRecord"),
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
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
                Response.AddHeader("content-disposition", "attachment;filename=SpecialCargoReport'" + date + "'.xlsx");
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