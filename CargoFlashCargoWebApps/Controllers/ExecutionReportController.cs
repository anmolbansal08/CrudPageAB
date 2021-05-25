using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model.Export;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ExecutionReportController : Controller
    {
        //
        // GET: /ExecutionReport/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetExecutionRecord(ExecReportModel Model)
        {
            try
            {
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {


                                                                     new System.Data.SqlClient.SqlParameter("@Month",Model.Month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",Model.Year)

                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spExecReport_GetRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.ExecutionReport
                {
                    AWBCount = e["AWBCount"].ToString(),
                   POMailCount= e["POMailCount"].ToString(),
                });
                ds.Dispose();



                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spExecReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public ActionResult GetExecutionRecordDetail(ExcelReportModel Model)
        {
            try
            {
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {


                                                                     new System.Data.SqlClient.SqlParameter("@Month",Model.Month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",Model.Year),
                                                                     new System.Data.SqlClient.SqlParameter("@type",Model.RecordType)

                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spExecReport_GetRecordDetail", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.ExecutionReportDetail
                {
                   AWBNo = e["awbno"].ToString(),
                   Origin= e["Origin"].ToString(),
                   Destination= e["Destination"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    Grossweight = e["Grossweight"].ToString(),
                    Volumeweight = e["Volumeweight"].ToString(),
                    Cbm = e["Cbm"].ToString(),
                    Status = e["Status"].ToString(),
                    CreatedBy =  e["UpdatedUser"].ToString(),
                });
                ds.Dispose();



                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spExecReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public class ExecReport
            {
            public string AWBCount { get; set; }
            public string POMailCount { get; set; }
        }
        }
}