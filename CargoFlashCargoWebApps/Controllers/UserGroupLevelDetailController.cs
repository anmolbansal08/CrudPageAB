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
    public class UserGroupLevelDetailController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        //
        // GET: /UserGroupLevelDetail/
        public ActionResult Index()
        {
            return View();
        }

              [HttpGet]
        public string GetUserGroupLevelDetail(UserGroupsLevelDetails model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                 new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
            new System.Data.SqlClient.SqlParameter("@UserSNo",model.UserSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
 new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spGetUserGroupsLevelDetails", Parameters);
                foreach (DataRow ds1 in ds.Tables[0].Rows)
                {
                    if (ds1["Other Airport Access"].ToString().ToUpper() == "NO")
                    {
                        ds1["Airport(s)"] = "";
                        //ds.Tables[0].Rows[0]["Airport(s)"] = "";
                    }

                }
                ds.Tables[0].AcceptChanges();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetUserGroupsLevelDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

       
        public ActionResult GetSpecialPermission(UserGroupsLevelDetails model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                 new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
            new System.Data.SqlClient.SqlParameter("@UserSNo",model.UserSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "uspGetSpecialPermissionPage", Parameters);
                var USERSpecialPermission = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.UserSpecialPermission
                {
                   SNo=e["SNo"].ToString(),
                    PageName=e["PageName"].ToString(),
                    Code=e["Code"].ToString(),
                    Description=e["Description"].ToString()
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = USERSpecialPermission.AsQueryable().ToList(),
                 
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspGetSpecialPermissionPage"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }



        public ActionResult ExtraFunctionPermission(UserGroupsLevelDetails model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                 new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),
            new System.Data.SqlClient.SqlParameter("@UserSNo",model.UserSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@GroupSNo",model.GroupSNo),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "UspGetExtraFunctionPage", Parameters);
                var USERSpecialPermission = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.UserExtraFunction
                {
                
                    PageName = e["PageName"].ToString(),
                      Description = e["Description"].ToString()
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = USERSpecialPermission.AsQueryable().ToList(),

                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UspGetExtraFunctionPage"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}