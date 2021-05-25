using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlashCargoWebApps.Controllers
{
    public class UserHistoryController : Controller
    {

        //
        // GET: /UserHistory/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult UserHistoryGetRecord(UserHistory model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, UserHistoryGetRecord userHistoryGetRecord)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<UserHistory>(filter);
                if (string.IsNullOrEmpty(userHistoryGetRecord.Email))
                {
                    userHistoryGetRecord.Email = "";
                }

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@UserSNo",filters == "" ? userHistoryGetRecord.userSNo : 0),
                                                                    new System.Data.SqlClient.SqlParameter("@Mail",filters == "" ? userHistoryGetRecord.Email : ""),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@WhereCondition", filters.ToString()),
                                                                    new System.Data.SqlClient.SqlParameter("@OrderBy", sorts)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spuserhistory_getrecord", Parameters);
                if(filters == "")
                {
                    var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new UserHistory
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        Airline = e["Airline"].ToString().ToUpper(),
                        UserName = e["UserName"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        GroupName = e["GroupName"].ToString().ToUpper(),
                        //UserType = e["UserType"].ToString().ToUpper(),
                        EmailAddress = e["EmailAddress"].ToString().ToUpper(),
                        CityCode = e["CityCode"].ToString().ToUpper(),
                        NoOfBadAttemps = e["NoOfBadAttemps"].ToString().ToUpper(),
                        LastLoggedOn = e["LastLoggedOnByUser"].ToString().ToUpper(),
                        Active = e["Active"].ToString().ToUpper(),
                        Blocked = e["Blocked"].ToString().ToUpper(),
                        Created = e["Created"].ToString().ToUpper(),
                        Modified = e["Modified"].ToString().ToUpper(),
                        Deleted = e["Deleted"].ToString().ToUpper()
                    });
                    ds.Dispose();
                    return Json(new DataSourceResult
                    {
                        //Data = CommodityList.AsQueryable().ToList(),
                        //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                        Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<UserHistory>().ToList<UserHistory>(),
                        Total = ds.Tables[0].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                    //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
                }
                else
                {
                    var CommodityList = ds.Tables[1].AsEnumerable().Select(e => new UserHistory
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        Airline = e["Airline"].ToString().ToUpper(),
                        UserName = e["UserName"].ToString().ToUpper(),
                        UserId = e["UserId"].ToString().ToUpper(),
                        GroupName = e["GroupName"].ToString().ToUpper(),
                        //UserType = e["UserType"].ToString().ToUpper(),
                        EmailAddress = e["EmailAddress"].ToString().ToUpper(),
                        CityCode = e["CityCode"].ToString().ToUpper(),
                        NoOfBadAttemps = e["NoOfBadAttemps"].ToString().ToUpper(),
                        LastLoggedOn = e["LastLoggedOnByUser"].ToString().ToUpper(),
                        Active = e["Active"].ToString().ToUpper(),
                        Blocked = e["Blocked"].ToString().ToUpper(),
                        Created = e["Created"].ToString().ToUpper(),
                        Modified = e["Modified"].ToString().ToUpper(),
                        Deleted = e["Deleted"].ToString().ToUpper()
                    });
                    ds.Dispose();
                    return Json(new DataSourceResult
                    {
                        //Data = CommodityList.AsQueryable().ToList(),
                        //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                        Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<UserHistory>().ToList<UserHistory>(),
                        Total = ds.Tables[1].Rows.Count > 0 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                    //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public ActionResult GetUserHistoryDescription(UserHistoryDescription model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string SNo)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<UserHistoryDescription>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                     new System.Data.SqlClient.SqlParameter("@UsersHistorySNo",SNo),
                                                                     new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                     new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                  };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spuserhistory_GetUserHistoryDescription", Parameters);
              
                    var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new UserHistoryDescription
                    {
                        UsersHistorySNo = Convert.ToInt32(e["UsersHistorySNo"]),
                        CityCode = e["CityCode"].ToString().ToUpper(),
                        CityName = e["CityName"].ToString().ToUpper(),
                        AirlineName = e["AirlineName"].ToString().ToUpper(),
                        IsDefaultCity = e["IsDefaultCity"].ToString().ToUpper(),
                        Active = e["Active"].ToString().ToUpper(),
                        Created = e["Created"].ToString().ToUpper(),
                        Modified = e["Modified"].ToString().ToUpper()
                    });
                    ds.Dispose();
                    return Json(new DataSourceResult
                    {
                        Data = CommodityList.AsQueryable().ToList(),
                        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    }, JsonRequestBehavior.AllowGet);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}