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
    public class GroupPermissionDetailController : Controller
    {
        //
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();

        // GET: /GroupPermissionDetail/
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        //  public string GetGroupPermissionDetail(string GroupName, string ModuleName, string PageName)
        public string GetGroupPermissionDetail(GroupPermissionDetail model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
            new System.Data.SqlClient.SqlParameter("@GroupName",model.GroupName==null ? "" :model.GroupName),
                                                                    new System.Data.SqlClient.SqlParameter("@ModuleName",model.ModuleName == null ? "" : model.ModuleName ),
                                                                    new System.Data.SqlClient.SqlParameter("@PageName",model.PageName == null ? "" : model.PageName),new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo == null ? "0" : model.AirlineSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",model.IsAutoProcess)
                };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_GroupsPermissionDetails", Parameters);


                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Columns.Contains("DisplayOrder"))
                        ds.Tables[0].Columns.Remove("DisplayOrder");
                }


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spMasterBookListFlightData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        private void RemoveColumns(DataTable dataTable, DataColumn dataColumn)
        {
            throw new NotImplementedException();
        }
    }
}