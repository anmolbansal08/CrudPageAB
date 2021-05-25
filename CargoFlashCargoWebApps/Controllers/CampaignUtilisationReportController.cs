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
using ClosedXML.Excel;

namespace CargoFlashCargoWebApps.Controllers
{
    public class CampaignUtilisationReportController : Controller
    {
        //
        // GET: /CampaignUtilisationReport/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CampaignUtilisationRequestModel Model)
        {
            string dateFropm = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");



            string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");

            if (string.IsNullOrEmpty(Model.CampaignCode))
            {
                Model.CampaignCode = "";
            }
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CampaignUtilisationReport> CommodityList = null;
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@CampaignCode",Model.CampaignCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFropm ),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSNo", Model.AgentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CodeType", Model.CodeType),
                                                                    new System.Data.SqlClient.SqlParameter("@Status", Model.Status),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                              new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                                      new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spCampaignUtilisationReport_GetRecord", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Rate.CampaignUtilisationReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        Code = e["Code"].ToString().ToUpper(),
                        ReferenceNo=e["ReferenceNo"].ToString().ToUpper(),
                        RSPRate = e["RSPRate"].ToString().ToUpper(),
                        RequestedRate = e["RequestedRate"].ToString().ToUpper(),
                        ApprovedRate = e["ApprovedRate"].ToString().ToUpper(),
                        NoOfCode = e["NoOfCode"].ToString().ToUpper(),
                        UtilizedAWB = e["UtilizedAWB"].ToString().ToUpper(),
                        IsApproved = e["IsApproved"].ToString().ToUpper(),
                        CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                        ApprovedBy = e["ApprovedBy"].ToString().ToUpper()
                    });
                    ds.Dispose();
                }
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCampaignUtilisationReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }
            return Json(new DataSourceResult
            {
                Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CampaignUtilisationReport>().ToList<CampaignUtilisationReport>(),
                Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            }, JsonRequestBehavior.AllowGet);


        }



        public ActionResult GetCodeDescription([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string code, int sNo, int codeType)
        {



            System.Data.DataSet ds = new DataSet();
            IEnumerable<CampaignUtilisationReport> CommodityList = null;
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Code",code),
                                                                     new System.Data.SqlClient.SqlParameter("@SNo",sNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CodeType",codeType),
                                                                     new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)

                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spcampaignUtilisationReport_GetCodeData", Parameters);                          
                           
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Rate.CampaignUtilisationReport
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AgentName = e["AgentName"].ToString().ToUpper(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        CommodityDescription = e["CommodityDescription"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        ProductName = e["ProductName"].ToString().ToUpper(),
                        TotalChargeableWeight = e["TotalChargeableWeight"].ToString().ToUpper(),
                        SHCCodeName = e["SHCCodeName"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString().ToUpper(),
                        FLightNo = e["FLightNo"].ToString().ToUpper(),
                        CodeUsed = e["CodeUsed"].ToString().ToUpper(),
                        AppliedCode = e["AppliedCode"].ToString().ToUpper(),
                        Remaining = e["Remaining"].ToString().ToUpper(),
                        AppliedBy = e["AppliedBy"].ToString().ToUpper()
                    });
                
                ds.Dispose();

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spcampaignUtilisationReport_GetCodeData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);


            }
            return Json(new DataSourceResult
            {
                Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CampaignUtilisationReport>().ToList<CampaignUtilisationReport>(),
                Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            }, JsonRequestBehavior.AllowGet);



        }





        public void ExportToExcel(CampaignUtilisationRequestModel Model)
        {
            string dateFropm = Convert.ToDateTime(Model.FromDate).ToString("dd-MMM-yyyy");
            string datetodate = Convert.ToDateTime(Model.ToDate).ToString("dd-MMM-yyyy");
            if (string.IsNullOrEmpty(Model.CampaignCode))
            {
                Model.CampaignCode = "";
            }
            System.Data.DataSet ds = new DataSet();

            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@CampaignCode",Model.CampaignCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",dateFropm ),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",datetodate),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSNo", Model.AgentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CodeType", Model.CodeType),
                                                                    new System.Data.SqlClient.SqlParameter("@Status", Model.Status),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", 1),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1000000),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess", Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
            ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spCampaignUtilisationReport_GetRecord", Parameters);
            DataTable dt1 = ds.Tables[0];

            if (dt1.Columns.Contains("SNo"))            
                dt1.Columns.Remove("SNo");


            if (dt1.Columns.Contains("AccountSNo"))
                dt1.Columns.Remove("AccountSNo");


            if (dt1.Columns.Contains("AccountSNo1"))
                dt1.Columns.Remove("AccountSNo1");


            dt1.Columns[1].ColumnName = "Status";
            dt1.Columns[1].Caption = "Status";
            dt1.AcceptChanges();


            ConvertDSToExcel_Success(dt1, 0);

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
                Response.AddHeader("content-disposition", "attachment;filename=CampaignUtilizationReport_'" + date + "'.xlsx");
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