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
using CargoFlash.Cargo.Model.ULD.Stock;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class BlackListAWBHistoryController : Controller
    {
        //
        // GET: /BlackListAWBHistory/
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public ActionResult GetRecordBlackListAWBHistory(BlackListAWBHistoryRequestModel Model)
        {
            IEnumerable<BlackLIstStockReport> CommodityList = null;
            System.Data.DataSet ds = new DataSet();
            DataSet dsError;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 

                                                                    new System.Data.SqlClient.SqlParameter("@AWBPrefix",Model.AWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",Model.OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",Model.CitySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSNo",Model.AgentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",Model.StockType),
                                                                     new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),                                                                    
                                                                      new System.Data.SqlClient.SqlParameter("@Type",Model.Type) 
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBlackListStockHistory_GetRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new BlackLIstStockReport
                   {
                       AWBNo = e["AWBNo"].ToString().ToUpper(),
                       StockType = e["StockType"].ToString().ToUpper(),
                       AWBType = e["AWBType"].ToString().ToUpper(),
                       CityName = e["CityName"].ToString().ToUpper(),
                       OfficeName = e["OfficeName"].ToString().ToUpper(),
                       AgentName = e["AgentName"].ToString().ToUpper(),
                       Createddate = e["Createddate"].ToString().ToUpper(),
                       IssueDate = e["IssueDate"].ToString().ToUpper(),
                       StockStatus = e["StockStatus"].ToString().ToUpper(),
                       UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                       Remarks = e["Remarks"].ToString().ToUpper()
                   });
                    ds.Dispose();
                }
            }
            catch (Exception ex)
            {
                // do something for error

                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBlackListStockHistory_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

            return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
            {
                Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<BlackLIstStockReport>().ToList<BlackLIstStockReport>(),

            }, JsonRequestBehavior.AllowGet);


        }


    }
}