using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class CargoClaimReportController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /CargoClaimReport/
        public ActionResult CargoClaimReport()
        {
            return View();
        }



        public ActionResult GetCargoClaimReport(string BranchOffice, string MonthofClaim, string YearofClaim, string StatusOfClaim, int IsAutoProcess)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            //CargoClaimReport_ objallotment;
            List<CargoClaimReport_> CargoClaimReport_ = new List<CargoClaimReport_>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters ={
                                                                    new System.Data.SqlClient.SqlParameter("@BranchOffice",BranchOffice),
                                                                    new System.Data.SqlClient.SqlParameter("@MonthofClaim",MonthofClaim),
                                                                    new System.Data.SqlClient.SqlParameter("@YearofClaim",YearofClaim),
                                                                    new System.Data.SqlClient.SqlParameter("@StatusOfClaim",StatusOfClaim),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)                                                   (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                                                  };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetCargoClaimReport", Parameters);

                dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCargoClaimReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        public class CargoClaimReport_
        {
            public string BranchOffice { get; set; }
            public string MonthofClaim { get; set; }

            public string YearofClaim { get; set; }
            public string StatusOfClaim { get; set; }


        }


    }
}