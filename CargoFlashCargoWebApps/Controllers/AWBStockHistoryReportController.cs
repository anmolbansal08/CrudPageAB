using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Stock;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBStockHistoryReportController : Controller
    {
        //
        // GET: /BlackListAWB/
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetRecordAWBStockHistoryReport(string aWBNo)
        {
            DataSet ds = new DataSet();
            IEnumerable<AWBStockHistoryReport> CommodityList = null;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",aWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition",""),
                                                                    //new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spAWBStockHistoryReport_GetRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockHistoryReport
                   {
                       Status = e["Status"].ToString().ToUpper(),
                       AWBNo = e["AWBNo"].ToString().ToUpper(),
                       StockType = e["StockType"].ToString().ToUpper(),
                       AWBType = e["AWBType"].ToString().ToUpper(),
                       CityName = e["CityName"].ToString().ToUpper(),
                       OfficeName = e["OfficeName"].ToString().ToUpper(),
                       AgentName = e["AgentName"].ToString().ToUpper(),
                       Createddate = e["Createddate"].ToString().ToUpper(),
                       IssueDate = e["IssueDate"].ToString().ToUpper(),
                        AWBStockStatus = e["AWBStockStatus"].ToString().ToUpper(),
                        StockStatus = e["StockStatus"].ToString().ToUpper(),
                       UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                       UpdatedOn = e["UpdatedOn"].ToString().ToUpper()

                   });
                }
                ds.Dispose();

                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<AWBStockHistoryReport>().ToList<AWBStockHistoryReport>(),

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