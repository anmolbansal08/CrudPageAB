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
    public class AgeingReportController : Controller
    {
        //
        // GET: /AgeingReport/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string AgeingReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, AgeingReportModel Model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSno ==""?"0":Model.AgentSno),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType", Model.ReportType)
                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAgeingReport_getrecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        [HttpPost]
        public ActionResult AgeingReportGetRecord11([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, AgeingReportModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AgeingReport>(filter);
            System.Data.DataSet dsAgeingData= new DataSet();



            IEnumerable<AnalysisReport> CommodityList1 = null;
            IEnumerable<PartyWiseReport> CommodityList2 = null;
            IEnumerable<AgeingReport> CommodityList3 = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSno ==""?"0":Model.AgentSno),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
																	new System.Data.SqlClient.SqlParameter("@ReportType", Model.ReportType) 
                                                              };

                dsAgeingData = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAgeingReport_getrecord", Parameters);
                if (dsAgeingData.Tables.Count > 1 && dsAgeingData.Tables != null)
                {
                    if (Model.ReportType == "AnalysisReport")
                    {
                        CommodityList1 = dsAgeingData.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Reservation.AnalysisReport
                        {
                            GSACODE = e["GSACODE"].ToString(),
                            GSAARCODE = e["GSAARCODE"].ToString(),
                            GSANAME = e["GSANAME"].ToString(),
                            InvoiceAmount = e["InvoiceAmount"].ToString(),
                            ReceiptAmount = e["ReceiptAmount"].ToString(),
                            OverDue = e["OverDue"].ToString()
                        });
                    }
                    else if (Model.ReportType == "PartyWiseReport")
                    {
                        CommodityList2 = dsAgeingData.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Reservation.PartyWiseReport
                        {
                            InvoiceNo = e["InvoiceNo"].ToString(),
                            InvoiceDate = Convert.ToDateTime(e["InvoiceDate"]).ToString("dd-MM-yyyy"),
                            InvoiceAmount = e["InvoiceAmount"].ToString().ToUpper(),
                            ReceiptNo = e["ReceiptNo"].ToString(),
                            ReceiptDate = Convert.ToDateTime(e["ReceiptDate"]).ToString("dd-MM-yyyy"),
                            ReceiptAmount = e["ReceiptAmount"].ToString(),
                            FinalOverDue = e["FinalOverDue"].ToString()
                        });
                    }
                    else
                    {
                        CommodityList3 = dsAgeingData.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Reservation.AgeingReport
                        {
                            InvoiceNo = e["InvoiceNo"].ToString(),
                            InvoiceDate = Convert.ToDateTime(e["InvoiceDate"]).ToString("dd-MM-yyyy"),
                            TotalAmount = e["TotalAmount"].ToString().ToUpper(),
                            ReceiptNo = e["ReceiptNo"].ToString(),
                            ReceiptDate = Convert.ToDateTime(e["ReceiptDate"]).ToString("dd-MM-yyyy"),
                            ReceiptAmount = e["ReceiptAmount"].ToString(),
                            Days_01_30 = e["01-30 Days"].ToString(),
                            Days_31_60 = e["31-60 Days"].ToString(),
                            Days_61_90 = e["61-90 Days"].ToString(),
                            Days_91_180 = e["91-180 Days"].ToString(),
                            Days_181_360 = e["181-360 Days"].ToString(),
                            Days_360 = e["> 360 Days"].ToString()
                        });
                    }
                    dsAgeingData.Dispose();
                }


                if (Model.ReportType == "AnalysisReport")
                {
                    return Json(new DataSourceResult
                    {
                        Data = dsAgeingData.Tables.Count > 1 ? CommodityList1.AsQueryable().ToList() : Enumerable.Empty<AnalysisReport>().ToList<AnalysisReport>(),
                        Total = dsAgeingData.Tables.Count > 1 ? Convert.ToInt32(dsAgeingData.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }
                else if (Model.ReportType == "PartyWiseReport")
                {
                    return Json(new DataSourceResult
                    {
                        Data = dsAgeingData.Tables.Count > 1 ? CommodityList2.AsQueryable().ToList() : Enumerable.Empty<PartyWiseReport>().ToList<PartyWiseReport>(),
                        Total = dsAgeingData.Tables.Count > 1 ? Convert.ToInt32(dsAgeingData.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new DataSourceResult
                    {
                        Data = dsAgeingData.Tables.Count > 1 ? CommodityList3.AsQueryable().ToList() : Enumerable.Empty<AgeingReport>().ToList<AgeingReport>(),
                        Total = dsAgeingData.Tables.Count > 1 ? Convert.ToInt32(dsAgeingData.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }


                

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spDailyReportForHO_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        //public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, AgeingReportModel Model)
        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, AgeingReportModel Model)
        {

            //string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<AgeingReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Model.AgentSno ==""?"0":Model.AgentSno),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType", Model.ReportType)
                                                                };
                        
          

            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAgeingReport_getrecord", Parameters);
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAgeingReport_getrecord"),
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
                Response.AddHeader("content-disposition", "attachment;filename=AgeingReport_'" + date + "'.xlsx");
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