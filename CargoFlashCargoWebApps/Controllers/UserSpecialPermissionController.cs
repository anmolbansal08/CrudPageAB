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
using System.Data.SqlClient;
using System.Text;
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlashCargoWebApps.Controllers
{
    public class UserSpecialPermissionController : Controller
    {

        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /UserSpecialPermission/
        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public string UserSpecialPermissionDetail(UserSpecialPermissionDetails model)
        {
            int a;
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                      new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
            new System.Data.SqlClient.SqlParameter("@UserSNo",model.UserSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                                                                          new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_UserSpecialPermission", Parameters);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && ds.Tables[0].Columns.Count > 1)
                {
                    a = 1;
                }
                else
                {
                    a = 0;
                }
                return a == 1 ? CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds) : ("No Record Found").ToString();
                //  return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return "Bad Request";
                //DataSet dsError;
                //System.Data.SqlClient.SqlParameter[] ParametersError = { 
                //                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                //                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_UserSpecialPermission"),
                //                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                //                                              };
                //dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                //throw ex;
            }
        }


    }
}