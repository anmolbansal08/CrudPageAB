using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ReservationVSCRAComparisionController : Controller
    {
        //
        // GET: /ReservationVSCRAComparision/
        string connectionStringCRA = CargoFlash.SoftwareFactory.Data.CRAConnectionString.WebConfigConnectionString;
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ReservationVSCRAComparisionGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string fromDate, string toDate, string reportType, string AWBNo, int IsAutoProcess)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ReservationVSCRAComparision>(filter);
            System.Data.DataSet dsReservation = new DataSet();
            System.Data.DataSet dsCRA = new DataSet();
            IEnumerable<ReservationVSCRAComparision> CommodityList = null;
            var Total = string.Empty;

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };

            try
            {

                dsReservation = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReservationVSCRAComparision_GetRecord", Parameters);
               // dsCRA = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionStringCRA, System.Data.CommandType.StoredProcedure, "spReservationVSCRAComparision_GetRecord", Parameters);

                if (dsReservation.Tables[0] != null && dsReservation.Tables[0].Rows.Count > 0)
                {
                    //dsReservation.Tables[0].Columns.Remove("CRAAWBTransfer");
                    //dsReservation.Tables[0].Columns.Add("CRAAWBTransfer", typeof(string));
                   // dsReservation.Tables[0].Columns.Add("CRAPOSTransfer", typeof(string));
                    //dsReservation.Tables[0].Columns.Add("CRACCATransfer", typeof(string));
                    dsReservation.Tables[0].Rows[0]["CRAAWBTransfer"] = dsReservation.Tables[0].Rows[0]["CRAAWBTransfer"].ToString();
                    dsReservation.Tables[0].Rows[0]["CRAPOSTransfer"] = dsReservation.Tables[0].Rows[0]["CRAPOSTransfer"].ToString();
                    dsReservation.Tables[0].Rows[0]["CRACCATransfer"] = dsReservation.Tables[0].Rows[0]["CRACCATransfer"].ToString();

                    //=================================================
                    dsReservation.Tables[0].Columns.Add("TotalRESTransfer", typeof(string));
                    dsReservation.Tables[0].Columns.Add("TotalRESNotTransfer", typeof(string));
                    dsReservation.Tables[0].Columns.Add("TotalRESFailed", typeof(string));
                    dsReservation.Tables[0].Columns.Add("TotalCRATransfer", typeof(string));

                    dsReservation.Tables[0].Rows[0]["TotalRESTransfer"] = dsReservation.Tables[0].Rows[0]["RESTransfer"].ToString();
                    dsReservation.Tables[0].Rows[0]["TotalRESNotTransfer"] = dsReservation.Tables[0].Rows[0]["RESNotTransfer"].ToString();
                    dsReservation.Tables[0].Rows[0]["TotalRESFailed"] = dsReservation.Tables[0].Rows[0]["RESFailed"].ToString();
                    dsReservation.Tables[0].Rows[0]["TotalCRATransfer"] = dsReservation.Tables[0].Rows[0]["CRATransfer"].ToString();
                    //Total = ViewBag.RESTransfer + ',' + ViewBag.RESNotTransfer + ',' + ViewBag.RESFailed + ',' + ViewBag.CRATransfer;
                    //=================================================
                    CommodityList = dsReservation.Tables[0].AsEnumerable().Select(e => new ReservationVSCRAComparision
                    {
                        //SNo = Convert.ToInt32(e["SNo"]),
                        ResAWBTransfer = e["ResAWBTransfer"].ToString(),
                        ResPOSTransfer = e["ResPOSTransfer"].ToString(),
                        ResCCATransfer = e["ResCCATransfer"].ToString(),
                        ResAWBNotTransfer = e["ResAWBNotTransfer"].ToString(),
                        ResPOSNotTransfer = e["ResPOSNotTransfer"].ToString(),
                        ResCCANotTransfer = e["ResCCANotTransfer"].ToString(),
                        ResAWBFailed = e["ResAWBFailed"].ToString(),
                        ResPOSFailed = e["ResPOSFailed"].ToString(),
                        CRAAWBTransfer = e["CRAAWBTransfer"].ToString(),
                        CRAPOSTransfer = e["CRAPOSTransfer"].ToString(),
                        CRACCATransfer = e["CRACCATransfer"].ToString(),
                        TotalRESTransfer = e["TotalRESTransfer"].ToString(),
                        TotalRESNotTransfer = e["TotalRESNotTransfer"].ToString(),
                        TotalRESFailed = e["TotalRESFailed"].ToString(),
                        TotalCRATransfer = e["TotalCRATransfer"].ToString(),

                    });
                }

                dsReservation.Dispose();
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReservationVSCRAComparision_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }


            return Json(new DataSourceResult
            {
                Data = CommodityList.AsQueryable().ToList(),
                //Total = Convert.ToInt32(Total)
            }, JsonRequestBehavior.AllowGet);

            //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
        }




        public ActionResult ShowAWBDetails([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string fromDate, string toDate, string reportType, string keyColumn, string AWBNo)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ShowAWBDetails>(filter);
            System.Data.DataSet ds = new DataSet();
            //var CommodityList = (string)null;
            //var CommodityList = default(object);
            IEnumerable<ShowAWBDetails> CommodityList = null;
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                                                    new System.Data.SqlClient.SqlParameter("@KeyColumn",keyColumn),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo)
                                                              };

            try
            {
                string GetConnectionName = string.Empty;

                if (keyColumn.Substring(0, 3).ToUpper() == "RES")
                    GetConnectionName = connectionString;
                else if (keyColumn.Substring(0, 3).ToUpper() == "CRA")
                    GetConnectionName = connectionStringCRA;
                else
                    GetConnectionName = connectionString;




                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(GetConnectionName, System.Data.CommandType.StoredProcedure, "spReservationVSCRAComparision_GetAWBDetails", Parameters);


                CommodityList = ds.Tables[0].AsEnumerable().Select(e => new ShowAWBDetails
                {
                    //SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    TotalPieces = e["Pieces"].ToString(),
                    TotalGrossWeight = e["GrossWeight"].ToString(),
                    TotalCBM = e["Volume"].ToString(),
                    TotalChargeableWeight = e["ChargeableWeight"].ToString()
                });
                ds.Dispose();
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReservationVSCRAComparision_GetAWBDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }


            return Json(new DataSourceResult
            {
                Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<ShowAWBDetails>().ToList<ShowAWBDetails>(),
                Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            }, JsonRequestBehavior.AllowGet);

            //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
        }



        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string fromDate, string toDate, string reportType, string keyColumn, string AWBNo,int IsAutoProcess)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ReservationVSCRAComparision>(filter);

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                                                    new System.Data.SqlClient.SqlParameter("@KeyColumn",keyColumn),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess)
                                                              };
            try
            {

                string GetConnectionName = string.Empty;

                if (keyColumn.Substring(0, 3).ToUpper() == "RES")
                    GetConnectionName = connectionString;
                else if (keyColumn.Substring(0, 3).ToUpper() == "CRA")
                    GetConnectionName = connectionStringCRA;
                else
                    GetConnectionName = connectionString;



                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(GetConnectionName, System.Data.CommandType.StoredProcedure, "spReservationVSCRAComparision_GetAWBDetails", Parameters);



                DataTable dt1 = ds.Tables[0];




                if (keyColumn.Substring(0, 3).ToUpper() == "RES")
                {
                    dt1.Columns.Remove("SNo");

                }
                else if (keyColumn.Substring(0, 3).ToUpper() == "CRA")
                {

                    dt1.Columns.Remove("Document_Type");
                    dt1.Columns.Remove("Customer_Type");
                }

                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReservationVSCRAComparision_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
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
                Response.AddHeader("content-disposition", "attachment;filename=ReservationVsCRACamparision_'" + date + "'.xlsx");
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