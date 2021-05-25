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
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBStockHistoryController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: /AWBStockHistory/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAirlineData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string officeSNo, string agentSNo)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Stock.AWBStockHistory>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSno",agentSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAwbStockHistory_GetRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockHistory
                {
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    StartAWB = e["StartAWB"].ToString().ToUpper(),
                    EndAWB = e["EndAWB"].ToString().ToUpper(),
                    IssueDate = e["IssueDate"].ToString().ToUpper(),
                    OfficeName = e["OfficeName"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper()
                });
                ds.Dispose();
                return Json(new DataSourceResult
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockHistory_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


    }
}