using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data.SqlClient;
using System.IO;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Stock;
namespace CargoFlashCargoWebApps.Controllers
{
    public class ShortAdhocController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        // GET: ShortAdhoc
        public ActionResult Index()
        {
            return View();
        }


        
        // public string GetSpecialCargoDetail(SpecialCargoDetail model)
        public ActionResult GetShortAdhocRequest([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, ShortAdhocDetail model)
        {
            try
            {
                List<ShortAdhocReportResponse> obj = new List<ShortAdhocReportResponse>();

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new SqlParameter("@From",model.FromDate),
                                                                    new SqlParameter("@To",model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Dest",model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AwbSNo",model.AWBSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",model.AirlineSNo),                                  
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                                     new System.Data.SqlClient.SqlParameter("@PageSize",request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                   };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_GetShortAdhoc", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var RequestedShortAdhocList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.ShortAdhocReportResponse
                    {

                        SNo = Convert.ToString(e["SNo"]).ToUpper(),
                        RASNo = Convert.ToString(e["RASNo"]).ToUpper(),
                        AWBNo = Convert.ToString(e["AWBNo"]).ToUpper(),
                        AirlineName = Convert.ToString(e["AirlineName"]).ToUpper(),
                        ReqType = Convert.ToString(e["ReqType"]).ToUpper(),                     
                        Origin = Convert.ToString(e["Origin"]).ToUpper(),
                        Destination = Convert.ToString(e["Destination"]).ToUpper(),
                        AgentName = Convert.ToString(e["AgentName"]).ToUpper(),
                        Commodity = Convert.ToString(e["Commodity"]).ToUpper(),
                        ChargeableWeight = Convert.ToString(e["ChargeableWeight"]).ToUpper(),
                        VolumeWeight = Convert.ToString(e["VolumeWeight"]).ToUpper(),
                        Currency = Convert.ToString(e["Currency"]).ToUpper(),
                        Rate= Convert.ToString(e["Rate"]).ToUpper(),
                        RequestedRate = Convert.ToString(e["RequestedRate"]).ToUpper(),
                        ApprovedRate = Convert.ToString(e["ApprovedRate"]).ToUpper(),
                        ApprovedStatus =   Convert.ToString(e["ApprovedStatus"]).ToUpper(),
                        RequestedBy = Convert.ToString(e["RequestedBy"]).ToUpper(),

                        RequestedOn = Convert.ToString(e["RequestedOn"]).ToUpper()

                        



                    });
                    ds.Dispose();
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = RequestedShortAdhocList.AsQueryable().ToList(),
                        Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                    }, JsonRequestBehavior.AllowGet);
                }

                else
                {
                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = obj,
                        Total = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_GetShortAdhoc"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }



        public string Approve(List<ShortAdhocApproval> AwbNoList)
        {

            DataSet ds = null;
            try
            {
                if (AwbNoList != null)
                {
                    DataTable DtRateTypePriority = CollectionHelper.ConvertTo(AwbNoList, "");
                    SqlParameter[] Parameters = {
                                            new SqlParameter("@RASNoList", SqlDbType.Structured){Value=DtRateTypePriority},
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "UpdateShortAdhocApproval", Parameters);
                }

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UpdateShortAdhocApproval"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }



    }
}