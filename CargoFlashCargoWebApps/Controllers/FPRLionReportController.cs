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
    public class FPRLionReportController : Controller
    {
        // GET: FPRLionReport
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult FPRLionReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRLionReportRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<FPRLionReport>(filter);
            System.Data.DataSet dsFPRLionReport = new DataSet();


            IEnumerable<FPRLionReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   //new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    //new System.Data.SqlClient.SqlParameter("@CurrencySNo",Model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@ToCurrencySNo", Model.CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };

                dsFPRLionReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFPRLionReport_GetRecord", Parameters);
                if (dsFPRLionReport.Tables.Count > 1 && dsFPRLionReport.Tables != null)
                {
                    CommodityList = dsFPRLionReport.Tables[0].AsEnumerable().Select(e => new FPRLionReport
                    {
                        //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
                       // SNo = Convert.ToInt32(e["SNo"]),
                        TransactionDate = e["TransactionDate"].ToString().ToUpper(),
                        AgentCode = e["AgentCode"].ToString().ToUpper(),
                        AgentName = e["AgentName"].ToString().ToUpper(),
                        DebitCredit = e["DebitCredit"].ToString().ToUpper(),
                        TransactionType = e["TransactionType"].ToString().ToUpper(),
                        PenaltySubType = e["PenaltySubType"].ToString().ToUpper(),
                        ServiceCargo = e["ServiceCargo"].ToString().ToUpper(),
                        RateClass = e["RateClass"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                      NOG= e["NatureOfGoods"].ToString().ToUpper(),
                        Product = e["Product"].ToString().ToUpper(),
                        ExchangeCurrency=e["ExchangeCurrency"].ToString().ToUpper(),
                        ExchangeRate = e["ExchangeRate"].ToString().ToUpper(),
                        SPCharges = e["SPCharges"].ToString().ToUpper(),
                        ReplanCharges = e["ReplanCharges"].ToString().ToUpper(),                  
                        NetPayable = e["NetPayable"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        AWBOrigin= e["AWBOrigin"].ToString().ToUpper(),
                        AWBDestination = e["AWBDestination"].ToString().ToUpper(),
                        User = e["User"].ToString().ToUpper(),
                        Remark = e["Remark"].ToString().ToUpper(),
                        TariffRate = e["TariffRate"].ToString().ToUpper(),
                        ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                        AWBCurrency = e["AWBCurrency"].ToString().ToUpper(),
                        Sector = e["Sector"].ToString().ToUpper(),
                        LACharges = e["LACharges"].ToString(),
                    });
                    dsFPRLionReport.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsFPRLionReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<FPRLionReport>().ToList<FPRLionReport>(),
                    Total = dsFPRLionReport.Tables.Count > 1 ? Convert.ToInt32(dsFPRLionReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRLionReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRLionReportRequestModel Model)
        {
            //1048576
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   //new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AccountSNo",Model.AccountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                     new System.Data.SqlClient.SqlParameter("@ToCurrencySNo", Model.CurrencySNo),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                  new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spFPRLionReport_GetRecord_Excel", Parameters);
                DataTable dt1 = ds.Tables[0];
               // dt1.Columns.Add("ABC", typeof(int));
              
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRLionReport_GetRecord_Excel"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

       
        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            DataSet ds = new DataSet();
            StringBuilder sb = new StringBuilder();
            string date = DateTime.Now.ToString();     
                  
            if (dt.Rows.Count > 0)
            {
                //DataTable table = ds.Tables[0];
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
            Response.AppendHeader("Content-Disposition", "attachment; filename=FPRReport_'" + date + "'.csv");
            Response.End();

            // For Excel Export code
            //StringBuilder sb = new StringBuilder();
            //string attachment = "attachment; filename=Report.xls";
            //Response.ClearContent();
            //Response.AddHeader("content-disposition", attachment);
            //Response.ContentType = "application/vnd.ms-excel";
            //string tab = "";
            //foreach (DataColumn dc in dt.Columns)
            //{
            //    Response.Write(tab + dc.ColumnName);
            //    tab = "\t";
            //}
            //Response.Write("\n");
            //int i;
            //foreach (DataRow dr in dt.Rows)
            //{
            //    tab = "";
            //    for (i = 0; i < dt.Columns.Count; i++)
            //    {
            //        Response.Write(tab + dr[i].ToString());
            //        tab = "\t";
            //    }
            //    Response.Write("\n");
            //}
            //Response.End();

        }   
    }
}