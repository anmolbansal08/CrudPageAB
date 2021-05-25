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
    public partial class AWBRateAuditLogController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string GetData(int AwbReferenceSNo = 0, int Mode = 1, int SearchByOption = 1)
        {
            try
            {
                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@AwbReferenceSNo", AwbReferenceSNo) ,
                                                                  new System.Data.SqlClient.SqlParameter("@Mode", Mode) ,
                                                                  new System.Data.SqlClient.SqlParameter("@SearchBy",SearchByOption),
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_AWBRateAuditLogDetail", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_AWBRateAuditLogDetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}