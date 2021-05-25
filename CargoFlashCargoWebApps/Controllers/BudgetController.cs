using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class BudgetController : Controller
    {
        // GET: Budget
        public ActionResult Search()
        {
            return View();
        }

        public string SearchBudget()
        {


            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString,
                System.Data.CommandType.StoredProcedure, "dbo.spBudgetSearch");
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }
        [HttpPost]
        public string Info(int id) {

            System.Data.SqlClient.SqlParameter[] Parameters = {
                new SqlParameter("@BudgetMasterSNo", id),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spBudgetInfo", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        [HttpPost]
        public string UpdateStatus(int id,int statusNo,string remarks)
        {

            System.Data.SqlClient.SqlParameter[] Parameters = {
                new SqlParameter("@BudgetMasterSNo", id),
                new SqlParameter("@StatusNo", statusNo),
                new SqlParameter("@Remarks", remarks),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spBudgetUpdateStatus", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        [HttpPost]
        public string SaveBudget(BudgetMaster model)
        {

            string json = JsonConvert.SerializeObject(model);

            System.Data.SqlClient.SqlParameter[] Parameters = {
                new SqlParameter("@Json", json),
                new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spBudgetCreate", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);


        }

        [HttpPost]
        public string FetchData(FetchDataReq model)
        {

            if (ModelState.IsValid)
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                new SqlParameter("@TargetType", model.TargetType),
                new SqlParameter("@From", model.From),
                new SqlParameter("@Origin", model.Origin),
                new SqlParameter("@Destination", model.Destination)
                };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spBudgetFetchData", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            else
                return "model state not valid please provide the valid input";

        }






    }
    /// <summary>
    /// used in fetch data serach request
    /// </summary>
    public class FetchDataReq
    {
        [Required(ErrorMessage = "Target Type required")]
        public string TargetType { get; set; }
        [Required(ErrorMessage = "Month start required")]
        public string From { get; set; }
        [Required(ErrorMessage = "origin station required")]
        public int Origin { get; set; }
        public int? Destination { get; set; }

    }


    public class SaveBudgetRequest
    {


    }

    public class BudgetMaster
    {
        public int TargetType { get; set; }
        public string BudgetName { get; set; }
        public string FromMonth { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
        public int CurrencySNo { get; set; }
        public int StatusSNo { get; set; }
        public int StatusRemarks { get; set; }
        public List<BudgetMasterTrans> Trans { get; set; }

    }

    public class BudgetMasterTrans
    {

        public string Months { get; set; }
        public int NoOfFlights { get; set; }
        public decimal Revenue { get; set; }
        public decimal TargetWeight { get; set; }
        public decimal TargetPercent { get; set; }
        public decimal TotalGrossWt { get; set; }
        public decimal TotalVolume { get; set; }
        public decimal Yield { get; set; }
        public List<BudgetProduct> pdata { get; set; }
    }

    public class BudgetProduct
    {
        public int ProductSNo { get; set; }
        public string Product { get; set; }
        public decimal Revenue { get; set; }
        public decimal TargetPercent { get; set; }
        public decimal TargetWeight { get; set; }
        public decimal Yield { get; set; }
    }

}