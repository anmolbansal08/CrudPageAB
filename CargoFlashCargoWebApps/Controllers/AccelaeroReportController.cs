using CargoFlash.Cargo.Model.Report;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.UI;


namespace CargoFlashCargoWebApps.Controllers
{
    public class AccelaeroReportController : Controller
    {
        
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;

        // GET: AccelaeroReport
        public ActionResult AccelaeroReport()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetFlightDetail([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, ModelReport model)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Report.AccelaeroReport>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@From",model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@To",model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode",model.CarrierCode),
                                                                    new System.Data.SqlClient.SqlParameter("@Origin",model.Origin),
                                                                    new System.Data.SqlClient.SqlParameter("@Destination",model.Destination),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
  


            };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_AccelaeroReport ", Parameters);

                var AccelaeroReportList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Report.AccelaeroReport
                {
                    CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    EnteredDate = e["EnteredDate"].ToString().ToUpper(),
                    IsProcessed = e["IsProcessed"].ToString().ToUpper(),
                    ValidationMessage = e["ValidationMessage"].ToString().ToUpper(),
                    ProcessedAt = e["ProcessedAt"].ToString().ToUpper(),
                    MsgType=e["MsgType"].ToString().ToUpper(),
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AccelaeroReportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                        new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                        new System.Data.SqlClient.SqlParameter("@ProcName","spReport_AccelaeroReport"),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)
                                                                        (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                                        };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


    }
}
