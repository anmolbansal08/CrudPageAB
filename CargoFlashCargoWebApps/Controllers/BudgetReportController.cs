using System;
using System.Collections.Generic;
using System.Linq;
using Kendo.Mvc.UI;
using System.Web.Mvc;
using System.Data.SqlClient;
using System.Data;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class BudgetReportController : Controller
    {
        // GET: BudgetReport
        [HttpGet]
        public ActionResult TargetBudgetReport()
        {
            return View();
        }
        
        [HttpPost]
        public ActionResult GetTargetBudgetGridData([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, TargetBudget Budget)
        {
            try
            {
                DataSet ds = new DataSet();

                List<TargetBugetModel> TBM = new List<TargetBugetModel>();

                SqlParameter[] Parameters = {
                new SqlParameter("@FromMonth", Budget.FromDate),
                new SqlParameter("@ToMonth", Budget.ToDate),
                new SqlParameter("@OriginSNo", Budget.OriginSNo),
                new SqlParameter("@DestinationSNo", Budget.DestinationSNo),
                new SqlParameter("@Type", Budget.Type),
                new SqlParameter("@PageNo",request.Page),
                new SqlParameter("@PageSize", request.PageSize),
                new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};

                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_TargetBudget", Parameters);

                if (ds.Tables.Count > 0)
                {
                    TargetBugetModel T;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        T = new TargetBugetModel();
                        T.SNo = Convert.ToInt32(dr["SNo"]);
                        T.BudgetName = dr["BudgetName"].ToString();
                        T.Months=dr["Months"].ToString();
                        T.BaseNoOfFlights = Convert.ToInt32(dr["BaseNoOfFlights"]) ;
                        T.BaseCapacityWeight = Convert.ToDecimal(dr["BaseCapacityWeight"]) ;
                        T.BaseTargetPercent = Convert.ToDecimal(dr["BaseTargetPercent"]) ;
                        T.BaseTargetWeight = Convert.ToDecimal(dr["BaseTargetWeight"]) ;
                        T.BaseTargetYield = Convert.ToDecimal(dr["BaseTargetYield"]) ;
                        T.BaseTargetRevenue = Convert.ToDecimal(dr["BaseTargetRevenue"]) ;
                        T.RevisedNoOfFlights = Convert.ToInt32(dr["RevisedNoOfFlights"]) ;
                        T.RevisedCapacityWeight = Convert.ToDecimal(dr["RevisedCapacityWeight"]) ;
                        T.RevisedTargetPercent = Convert.ToDecimal(dr["RevisedTargetPercent"]) ;
                        T.RevisedTargetWeight = Convert.ToDecimal(dr["RevisedTargetWeight"]) ;
                        T.RevisedTargetYield = Convert.ToDecimal(dr["RevisedTargetYield"]) ;
                        T.RevisedTargetRevenue = Convert.ToDecimal(dr["RevisedTargetRevenue"]) ;
                        T.AchievedNoOfFlights = Convert.ToInt32(dr["AchievedNoOfFlights"]) ;
                        T.AchievedCapacityWeight = Convert.ToDecimal(dr["AchievedCapacityWeight"]) ;
                        T.AchievedTargetPercent = Convert.ToDecimal(dr["AchievedTargetPercent"]) ;
                        T.AchievedTargetWeight = Convert.ToDecimal(dr["AchievedTargetWeight"]) ;
                        T.AchievedTargetYield = Convert.ToDecimal(dr["AchievedTargetYield"]) ;
                        T.AchievedTargetRevenue = Convert.ToDecimal(dr["AchievedTargetRevenue"]) ;
                        T.AchievedVsBaseTonnageTarget = Convert.ToDecimal(dr["AchievedVsBaseTonnageTarget"]) ;
                        T.AchievedVsBaseRevenueTarget = Convert.ToDecimal(dr["AchievedVsBaseRevenueTarget"]) ;
                        T.AchievedVsRevisedTonnageTarget = Convert.ToDecimal(dr["AchievedVsRevisedTonnageTarget"]) ;
                        T.AchievedVsRevisedRevenueTarget = Convert.ToDecimal(dr["AchievedVsRevisedRevenueTarget"]);

                        TBM.Add(T);
                    }
                }

                return Json(new Kendo.Mvc.UI.DataSourceResult
                {
                    Data = TBM.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0])
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_TargetBudget"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }

    public class TargetBudget
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int OriginSNo { get; set; }
        public int DestinationSNo { get; set; }
        public int Type { get; set; }
    }

    public  class TargetBugetModel
    {
        public int SNo { get; set; }
        public string BudgetName { get; set; }
        public string Months { get; set; } 
        public int BaseNoOfFlights { get; set; } 
        public decimal BaseCapacityWeight { get; set; } 
        public decimal BaseTargetPercent { get; set; } 
        public decimal BaseTargetWeight { get; set; } 
        public decimal BaseTargetYield { get; set; } 
        public decimal BaseTargetRevenue { get; set; } 
        public int RevisedNoOfFlights { get; set; } 
        public decimal RevisedCapacityWeight { get; set; } 
        public decimal RevisedTargetPercent { get; set; } 
        public decimal RevisedTargetWeight { get; set; } 
        public decimal RevisedTargetYield { get; set; } 
        public decimal RevisedTargetRevenue { get; set; } 
        public int AchievedNoOfFlights { get; set; } 
        public decimal AchievedCapacityWeight { get; set; } 
        public decimal AchievedTargetPercent { get; set; } 
        public decimal AchievedTargetWeight { get; set; } 
        public decimal AchievedTargetYield { get; set; } 
        public decimal AchievedTargetRevenue { get; set; } 
        public decimal AchievedVsBaseTonnageTarget { get; set; } 
        public decimal AchievedVsBaseRevenueTarget { get; set; } 
        public decimal AchievedVsRevisedTonnageTarget { get; set; } 
        public decimal AchievedVsRevisedRevenueTarget { get; set; }
    }
}