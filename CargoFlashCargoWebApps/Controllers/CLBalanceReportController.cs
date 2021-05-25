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
    public class CLBalanceReportController : Controller
    {
        // GET: CLBalanceReport
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetCLBalanceRecord([Kendo.Mvc.UI.DataSourceRequest] Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, CLBalanceReportRequest Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CLBalanceReport>(filter);
            System.Data.DataSet dsCLBalanceReport = new DataSet();


            IEnumerable<CLBalanceReport> CLBalanceReport = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   
                                                                   new System.Data.SqlClient.SqlParameter("@OfficeSNo",Model.OfficeSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@ValidFrom",Model.ValidFrom),
                                                                   new System.Data.SqlClient.SqlParameter("@ValidTo",Model.ValidTo),
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.CitySNo),
                                                                   new System.Data.SqlClient.SqlParameter("@BgType",Model.Type),
                                                                   new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@CurrencySNo",Model.CurrencySNo),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                   new System.Data.SqlClient.SqlParameter("@OrderBy","")
                                                                 };

                dsCLBalanceReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "Usp_GetListClBalanceReport", Parameters);
                if (dsCLBalanceReport.Tables.Count > 1 && dsCLBalanceReport.Tables != null)
                {
                    CLBalanceReport = dsCLBalanceReport.Tables[0].AsEnumerable().Select(e => new CLBalanceReport
                    {

                        SNo = Convert.ToInt32(e["SNo"]),
                        Origin = e["OriginCity"].ToString(),
                        OfficeName = e["OfficeName"].ToString(),
                        AgentName = e["AccountName"].ToString(),
                        MaxCL = e["MaxCreditLimit"].ToString(),
                        AvlBalanceCL = e["BalanceCreditLimit"].ToString(),
                        TransactionAmount = Convert.ToDecimal(e["TransactionAmount"]),
                        TransactionType = e["TransactionType"].ToString(),
                        Currency = e["CurrencyCode"].ToString(),
                        ReferenceNo = e["ReferenceNo"].ToString(),
                        ApprovedBy = e["ApprovedBy"].ToString(),
                        ApprovedDate = e["ApprovedDate"].ToString(),
                        Remarks = e["Remarks"].ToString(),
                        Status = e["Approved"].ToString()
                    });
                    dsCLBalanceReport.Dispose();
                }



                return Json(new DataSourceResult
                {
                   Data = dsCLBalanceReport.Tables.Count > 1 ? CLBalanceReport.AsQueryable().ToList() : Enumerable.Empty<CLBalanceReport>().ToList<CLBalanceReport>(),
                    Total = dsCLBalanceReport.Tables.Count > 1 ? Convert.ToInt32(dsCLBalanceReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Usp_GetListClBalanceReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        //public string GetCurrencyInformation(string SNo)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@SNo", SNo) };
        //        ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetAirLineInformation", Parameters);
        //        ds.Dispose();

        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}

        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest] Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, CLBalanceReportRequest Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);
            System.Data.DataSet dsCLBalanceReport = new DataSet();
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@OfficeSNo",Model.OfficeSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@ValidFrom",Model.ValidFrom),
                                                                   new System.Data.SqlClient.SqlParameter("@ValidTo",Model.ValidTo),
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineSNo",Model.AirlineSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.CitySNo),
                                                                   new System.Data.SqlClient.SqlParameter("@BgType",Model.Type),
                                                                   new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                   new System.Data.SqlClient.SqlParameter("@CurrencySNo",Model.CurrencySNo),
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", "1"),
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", "10000"),
                                                                   new System.Data.SqlClient.SqlParameter("@OrderBy","")
                                                              };
            try
            {
                dsCLBalanceReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "Usp_GetListClBalanceReport_Excel", Parameters);
                if (dsCLBalanceReport != null && dsCLBalanceReport.Tables.Count > 0)
                {
                    DataTable dt1 = dsCLBalanceReport.Tables[0];
                    dt1.Columns.Remove("SNo");
                    dt1.Columns.Remove("Updatedon");
                    dt1.Columns["Approved"].ColumnName = "Status";

                    ConvertDSToExcel_Success(dt1, 1);
                }
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Usp_GetListClBalanceReport_Excel"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            StringBuilder sb = new StringBuilder();


            if (dt.Rows.Count > 0)
            {
             
                foreach (DataColumn column in dt.Columns)
                    sb.Append(column.ColumnName + ",");

                sb.Append(Environment.NewLine);

                foreach (DataRow row in dt.Rows)
                {
                    for (int i = 0; i < dt.Columns.Count; i++)
                        sb.Append(row[i].ToString() + ",");

                    sb.Append(Environment.NewLine);
                }
            }
            Response.Write(sb.ToString());
            Response.ContentType = "text/csv";
            Response.AppendHeader("Content-Disposition", "attachment; filename=CLBalanceReport_'" + date + "'.csv");
            Response.End();


        }
    }
}