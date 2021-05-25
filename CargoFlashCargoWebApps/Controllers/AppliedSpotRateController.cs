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
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class AppliedSpotRateController : Controller
    {
        //
        // GET: /AppliedSpotRate/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetRecordAppliedSpotRate([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSno, string officeSno, string citySno, string accountSNo, string fromDate, string toDate, string whereCondition, string orderBy)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Rate.AppliedSpotRateReport>(filter);

             
                System.Data.SqlClient.SqlParameter[] Parameters = { 

                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSno",airlineSno),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSno",officeSno),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySno",citySno),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",accountSNo),
                                                                   
                                                                     new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition",whereCondition),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy",orderBy)
                                                                    
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spAppliedSpotRate_GetRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Rate.AppliedSpotRateReport
                {
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    OfficeName = e["OfficeName"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                    TotalGrossWeight = Convert.ToDecimal(e["TotalGrossWeight"]),
                    TotalChargeableWeight = Convert.ToDecimal(e["TotalChargeableWeight"]),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    IsSingleCompaignCode = e["IsSingleCompaignCode"].ToString().ToUpper(),
                    MKTRate = Convert.ToDecimal(e["MKTRate"]),
                    MKTFreight = Convert.ToDecimal(e["MKTFreight"]),
                    SpotCode = e["SpotCode"].ToString().ToUpper(),
                    AppliedBy = e["AppliedBy"].ToString().ToUpper(),
                    AppliedOn = e["AppliedOn"].ToString()
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAppliedSpotRate_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

    }
}