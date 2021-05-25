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
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBHistoryController : Controller
    {
        //
        // GET: /AWBHistory/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult Index()
        {
            return View();
        }

        public string GeTAWBHistory(int aWBNo, int aWBPrefix, string Act)
        {
            try
            {
                DataSet ds = new DataSet();
                dynamic dslist = "";
             
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",aWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBPrefix",aWBPrefix),
                                                                    new System.Data.SqlClient.SqlParameter("@Act",Act),
                                                                    //new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
                                                  };
                try
                {
                    ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "sp_GetAWBHistory", Parameters);
                    dslist = ds;
                }
                catch (Exception ex)
                {
                    dslist = "Error Occured";
                }

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dslist);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_GetAWBHistory"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}