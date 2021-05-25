using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CargoFlash.SoftwareFactory.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Export;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System.Data;
using System.ServiceModel.Web;
using System.Net;
using ClosedXML.Excel;
using System.IO;

namespace CargoFlashCargoWebApps.Controllers
{
    public class PenaltyApprovalReportController : Controller
    {
        // GET: PenaltyApprovalReportController
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]

        public ActionResult GetApprovalData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, PenaltyApprovalRquest Model)
        {
            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.OriginCity))
                {
                    Model.OriginCity = "";
                }


                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Export.PenaltyApprovalRquest>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirLineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@PenaltyType",Model.PenaltyType),
                                                                    new System.Data.SqlClient.SqlParameter("@OrigicitySno",Model.OriginCity),
                                                                     new System.Data.SqlClient.SqlParameter("@ReportType",Model.ReportType),
                                                                     new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                         new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)

                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "UspShowPenaltyApprovalData", Parameters);

                var AWBPenaltyList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.PenaltyApprovalReport
                {


                    AirLineName = e["AirLine Name"].ToString().ToUpper(),
                    AWBNumber = e["AWBNumber"].ToString().ToUpper(),
                    AWBDate = e["AWBDate"].ToString().ToUpper(),
                    // BookingFromDate=e["BookingFromDate"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),

                    AjentName = e["AgentName"].ToString().ToUpper(),

                    Destination = e["Destination"].ToString().ToUpper(),
                    PCS = e["PCS"].ToString().ToUpper(),

                    GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                    Volume = e["Volume"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    Commidity = e["CommodityCode"].ToString().ToUpper(),
                    PenaltyCurrency= e["CurrencyCode"].ToString().ToUpper(),
                    PenaltyCharges = e["PenaltyCharges"].ToString().ToUpper(),
                    UserName = e["UserName"].ToString().ToUpper(),
                    PenaltyApplyDate = e["PenaltyApplyDate"].ToString().ToUpper(),
                    ModeOfPenalty = e["ModeOfPenalty"].ToString().ToUpper(),
                    BookedBy = e["BookedBy"].ToString().ToUpper(),
                    PenaltyWeight = e["PenaltyWeight"].ToString().ToUpper(),
                    Remarks = e["Remarks"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    Tax = e["Tax"].ToString().ToUpper(),
                    TotalPenalty = e["TotalPenalty"].ToString().ToUpper(),
                    PenaltyParameterReferenceNo = e["PenaltyParameterReferenceNo"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    ApprovedBy = e["ApprovedBy"].ToString().ToUpper(),
                    SNo = e["SNo"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AWBPenaltyList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UspShowPenaltyApprovalData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        [HttpPost]
        public ActionResult GetCitiesUSERWISE([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, AWBPenaltyReportCityUserWise Model)
        {
            try
            {


                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Export.PenaltyReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "USPGetCityUserWise", Parameters);

                var AWBPenaltyList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.PenaltyApprovalReportCityUserWise
                {


                    Cities = e["Cities"].ToString().ToUpper(),
                    IsAll = e["IsAll"].ToString().ToUpper(),

                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AWBPenaltyList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","USPGetCityUserWise"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        [HttpPost]
        public void PenaltyApprovalReportExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, PenaltyApprovalRquest Model)
        {


            try
            {
                string dateFrom = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");

                string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

                if (string.IsNullOrEmpty(Model.OriginCity))
                {
                    Model.OriginCity = "";
                }




                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirLineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFrom),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@PenaltyType",Model.PenaltyType),
                                                                    new System.Data.SqlClient.SqlParameter("@OrigicitySno",Model.OriginCity),
                                                                     new System.Data.SqlClient.SqlParameter("@ReportType",Model.ReportType)


                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "UspExportToExcelShowPenaltyApprovalData", Parameters);
                DataTable dt = new DataTable();
                dt = ds.Tables[0];

                ConvertDSToExcel_Success(dt, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UspExportToExcelShowPenaltyApprovalData"),
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
                Response.AddHeader("content-disposition", "attachment;filename=PenaltyApprovalReport_'" + date + "'.xlsx");
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