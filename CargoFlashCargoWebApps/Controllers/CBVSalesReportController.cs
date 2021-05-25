using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class CBVSalesReportController : Controller
    {
        // GET: CBVSalesReport
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetInvoiceDetail([FromUri]int AirlineSNo, int OfficeSNo, string month, string year = null, string Fortnight = null, int CurrencySNo = 0)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Month",month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",year),
                                                                    new System.Data.SqlClient.SqlParameter("@Fortnight",Fortnight),
                                                                    new System.Data.SqlClient.SqlParameter("@CurrencySNo",CurrencySNo)

                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetCBVSalesReportDetails", Parameters);
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAWBStockHistoryReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}