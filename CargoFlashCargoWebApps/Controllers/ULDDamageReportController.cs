using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel.Web;
using System.Web;
using System.Web.Mvc;
using CargoFlash.Cargo.Model.ULDDamage;
namespace CargoFlashCargoWebApps.Controllers
{
    public class ULDDamageReportController : Controller
    {
        //
        // GET: /ULDDamageReport/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult ULDDamageReport()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetDamageRecordSearch([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort
            , CargoFlash.SoftwareFactory.Data.GridFilter filter, ULDDamage model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ULDDamage>(filter);
            System.Data.DataSet UldDamage = new DataSet();


            IEnumerable<ULDDamage> CommodityList = null;

            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                   new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                   new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@ULDType", model.ULDType),
                                                                     new System.Data.SqlClient.SqlParameter("@ULDNo", model.ULDNo),
                                                                      new System.Data.SqlClient.SqlParameter("@station", model.Station),                                                                    
                                                                       new System.Data.SqlClient.SqlParameter("@DateOfDamage", model.DamageDate),
                                                                         new System.Data.SqlClient.SqlParameter("@MaintenanceTypesno", model.MaintenanceType),
                                                                          new System.Data.SqlClient.SqlParameter("@AMaintenanceTypesno", model.AMaintenanceType),
                                                                           new System.Data.SqlClient.SqlParameter("@Ownership", model.Ownership),
                                                              };


                UldDamage = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spDamageReport_Search", Parameters);
                if (UldDamage.Tables.Count > 1 && UldDamage.Tables != null)
                {
                    CommodityList = UldDamage.Tables[1].AsEnumerable().Select(e => new ULDDamage
                    {
                        ULDNo = e["ULDNo"].ToString().ToUpper(),
                        ULDType = e["ULDType"].ToString().ToUpper(),
                        MaintenanceType = e["MaintenanceType"].ToString().ToUpper(),
                        AMaintenanceType = e["AMaintenanceType"].ToString().ToUpper(),
                        Ownership = e["Ownership"].ToString().ToUpper(),
                        DamageDate = e["DateoFDamge"].ToString().ToUpper(),
                        Station = e["Station"].ToString().ToUpper(),
                        MaintenanceStatus = e["MaintenanceStatus"].ToString().ToUpper(),
                        MaintenanceDate = e["MaintenanceDate"].ToString().ToUpper(),

                    });
                    UldDamage.Dispose();
                }


               
                return Json(new DataSourceResult
                {
                    Data = UldDamage.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<ULDDamage>().ToList<ULDDamage>(),
                    Total = UldDamage.Tables.Count > 1 ? Convert.ToInt32(UldDamage.Tables[1].Rows.Count.ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public JsonResult GetDamageRecordSearch(ULDDamage model, string PageNo, string PageSize, string page, string fromDate, string toDate)
        //{

        //    try
        //    {
        //        //string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
        //        string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<ULDDamage>(filter);
        //        System.Data.DataSet ULDOutInReportds = new DataSet();
        //        ULDDamage DamageReport = new ULDDamage();
        //        SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", PageSize)
        //                                       };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spDamageReport_Search", Parameters);
        //        // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        //        List<ULDDamage> DamageReportList = new List<ULDDamage>();

        //        ULDOutInReportds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spDamageReport_Search", Parameters);
        //        if (ULDOutInReportds.Tables.Count > 1 && ULDOutInReportds.Tables != null)
        //        {
        //            CommodityList = ULDOutInReportds.Tables[0].AsEnumerable().Select(e => new ULDUCMReport
        //            {

        //                ULDType = e["ULDType"].ToString().ToUpper(),
        //                ULDCategory = e["ULDCategory"].ToString().ToUpper(),
        //                ContentIndicator = e["ContentIndicator"].ToString().ToUpper(),
        //                NoOfReceipts = e["NoOfReceipts"].ToString().ToUpper(),
        //                NoOfIssues = e["NoOfIssues"].ToString().ToUpper(),
        //                ULDsReceived = e["ULDsReceived"].ToString().ToUpper(),
        //                ULDsIssued = e["ULDsIssued"].ToString().ToUpper(),

        //            });
        //            ULDOutInReportds.Dispose();
        //        }

        //        //foreach (DataRow e in ds.Tables[0].Rows)
        //        //{
        //        //    ULDDamage ar = new ULDDamage();

        //        //       ar.ULDNo = e["ULDNo"].ToString();
        //        //       ar.ULDType = e["ULDType"].ToString();
        //        //       ar.MaintenanceType = e["MaintenanceType"].ToString();
        //        //       ar.AMaintenanceType = e["AMaintenanceType"].ToString();
        //        //       ar.Ownership = e["Ownership"].ToString();
        //        //       ar.DamageDate = e["DamageDate"].ToString();
        //        //       ar.Station = e["Station"].ToString();

        //        //}

        //        return Json(new DataSourceResult
        //        {
        //            Data = DataSet.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<ULDUCMReport>().ToList<ULDUCMReport>(),
        //            Total = ULDOutInReportds.Tables.Count > 1 ? Convert.ToInt32(ULDOutInReportds.Tables[1].Rows[0][0].ToString()) : 0
        //        }, JsonRequestBehavior.AllowGet);

        //        var jsonResult = Json(new { key = ds.Tables[1].Rows[0][0].ToString(), value = DamageReportList.AsQueryable().ToList() }, JsonRequestBehavior.AllowGet);
        //        jsonResult.MaxJsonLength = int.MaxValue;
        //        return jsonResult;
        //    }
        //    catch (Exception ex)
        //    {
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                            new System.Data.SqlClient.SqlParameter("@ProcName","spAuditLog_Search"),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                      };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;
        //    }
        //}
    }
}