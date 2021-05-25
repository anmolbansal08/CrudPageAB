using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.ServiceModel.Web;
using System.Web;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ClaimComplaintTrackingController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /ClaimComplaintTracking/
        public ActionResult ClaimComplaintTracking()
        {
            return View();
        }


        public ActionResult GetClaimComplaintTracking(int BasedOn, int ClaimComplaintNo)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
           
            //CargoClaimReport_ objallotment;
            //List<CargoClaimReport_> CargoClaimReport_ = new List<CargoClaimReport_>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters ={
                                                                    new System.Data.SqlClient.SqlParameter("@BasedOn",BasedOn),
                                                                    new System.Data.SqlClient.SqlParameter("@Sno",ClaimComplaintNo),
                                                                  
                                                                  
                                                                  
                                                      
                                                                  };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetClaimComplaintTracking", Parameters);

                dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetClaimComplaintTracking"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);

        }


	}
}