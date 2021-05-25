using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using ClosedXML.Excel;
using System.IO;
using CargoFlash.Cargo.Model.Report;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AddShipmentReportController : Controller
    {
        // GET: AddShipmentReport
        public ActionResult Index()
        {
            return View();

        }

        [HttpPost]
        public ActionResult SearchAddShipmentData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, AddShipmentReport Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.DestinationAirPortCode))
                {
                    Model.DestinationAirPortCode = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.AddShipmentReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortCode",Model.DestinationAirPortCode),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetAddShipmentReport", Parameters);

                var AddShipmentList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.AddShipmentReport
                {
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    Sector = e["Sector"].ToString().ToUpper(),
                    AWBDate = e["AWBDate"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    AgentCode = e["AgentCode"].ToString().ToUpper(),
                    Pieces = e["Pieces"].ToString().ToUpper(),
                    GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    VolumeWeight = e["VolumeWeight"].ToString().ToUpper(),
                    ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    FlightType = e["FlightType"].ToString().ToUpper(),
                    BookingFlightNo = e["BookingFlightNo"].ToString().ToUpper(),
                    BookingFlightDate = e["BookingFlightDate"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    AddShipmentAt = e["AddShipmentAt"].ToString().ToUpper(),
                    AddShipmentFlight = e["AddShipmentFlight"].ToString().ToUpper(),
                    DateAddShipment = e["DateAddShipment"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AddShipmentList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult ExportToExcel([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, AddShipmentReport Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.DestinationAirPortCode))
                {
                    Model.DestinationAirPortCode = "";
                }
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.AddShipmentReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationAirPortCode",Model.DestinationAirPortCode),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                 };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetAddShipmentReportForExcel", Parameters);

                var AddShipmentList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.AddShipmentReport
                {
                    AWBNo = e["AWB No"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    Sector = e["Sector"].ToString().ToUpper(),
                    AWBDate = e["AWB Date"].ToString().ToUpper(),
                    AgentName = e["Agent Name"].ToString().ToUpper(),
                    AgentCode = e["Agent Code"].ToString().ToUpper(),
                    Pieces = e["Pcs"].ToString().ToUpper(),
                    GrossWeight = e["Gr. Wt."].ToString().ToUpper(),
                    ProductName = e["Product Name"].ToString().ToUpper(),
                    VolumeWeight = e["Vol. Wt."].ToString().ToUpper(),
                    ChargeableWeight = e["Ch. Wt."].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    FlightType = e["Flight Type"].ToString().ToUpper(),
                    BookingFlightNo = e["Flight No"].ToString().ToUpper(),
                    BookingFlightDate = e["Flight Date"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    AddShipmentAt = e["Shipment Added At Station"].ToString().ToUpper(),
                    AddShipmentFlight = e["Shipment Added on Flight"].ToString().ToUpper(),
                    DateAddShipment = e["Shipment Added on Date"].ToString().ToUpper(),
                });
                ds.Dispose();
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AddShipmentList.AsQueryable().ToList(),
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
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
                Response.AddHeader("content-disposition", "attachment;filename=AddShipmentReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        [HttpPost]
        public ActionResult GetAWBInformation(int FFMFlightMasterSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spGetAWBInformation", Parameters);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                ds.Dispose();
                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
                return Json(JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }            
        }
    }
}