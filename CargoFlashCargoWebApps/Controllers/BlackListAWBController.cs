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
    public class BlackListAWBController : Controller
    {
        //
        // GET: /BlackListAWB/
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetRecordBlackListAWB([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSno, string officeSno, string citySno, string accountSNo, string stockType, string fromDate, string toDate, string aWBNo, string whereCondition, string orderBy, string type)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Stock.AWBStockStatusForExcel>(filter);

            System.Data.DataSet ds = new DataSet();
            IEnumerable<CargoFlash.Cargo.Model.Stock.BlackLIstStock> CommodityList = null;
            try
            {




                System.Data.SqlClient.SqlParameter[] Parameters = { 

                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSno),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSno),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySno),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",accountSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@StockType",stockType),
                                                                     new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",aWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition",whereCondition),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy",orderBy),
                                                                      new System.Data.SqlClient.SqlParameter("@Type",type) 
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spBlackListStock_GetRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.BlackLIstStock
                   {
                       AWBNo = e["AWBNo"].ToString().ToUpper(),
                       StockType = e["StockType"].ToString().ToUpper(),
                       AWBType = e["AWBType"].ToString().ToUpper(),
                       CityName = e["CityName"].ToString().ToUpper(),
                       OfficeName = e["OfficeName"].ToString().ToUpper(),
                       AgentName = e["AgentName"].ToString().ToUpper(),
                       Createddate = e["Createddate"].ToString().ToUpper(),
                       IssueDate = e["IssueDate"].ToString().ToUpper(),
                       StockStatus = e["StockStatus"].ToString().ToUpper()
                   });
                    ds.Dispose();
                }

                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<BlackLIstStock>().ToList<BlackLIstStock>(),
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBlackListStock_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public string UpdateGetRecordBlackListAWB(List<BlackLIstStockUpdate> AwbNoList)
        {

            DataSet ds = null;
            try
            {
                if (AwbNoList != null)
                {
                    DataTable DtRateTypePriority = CollectionHelper.ConvertTo(AwbNoList, "");
                    SqlParameter[] Parameters = { 
                                            new SqlParameter("@BlackListAWbStock", SqlDbType.Structured){Value=DtRateTypePriority},
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "UpdateBlackListAWbStock", Parameters);
                }

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UpdateBlackListAWbStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}