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
using CargoFlash.Cargo.Model.Reservation;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlashCargoWebApps.Controllers
{
    public class PerformanceRouteReportController : Controller
    {
        //
        // GET: /PerformanceRouteReport/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PerformanceRouteReportGetRecord(PerformanceRouteReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string fromDate, string toDate)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PerformanceRouteReport>(filter);

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize) 
                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spPerformanceRouteReport_getrecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new PerformanceRouteReport
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    Date = e["Date"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    AircraftType = e["AircraftType"].ToString().ToUpper(),
                    CapacityGross = e["CapacityGross"].ToString().ToUpper(),
                    CapacityVol = e["CapacityVol"].ToString().ToUpper(),

                    BookedShpts = e["BookedShpts"].ToString().ToUpper(),
                    BookedPcs = e["BookedPcs"].ToString().ToUpper(),
                    BookedGrWt = e["BookedGrWt"].ToString().ToUpper(),
                    BookedVol = e["BookedVol"].ToString().ToUpper(),
                    BookedChWt = e["BookedChWt"].ToString().ToUpper(),
                    BookedFreight = e["BookedFreight"].ToString().ToUpper(),
                    BookedRevenue = e["BookedRevenue"].ToString().ToUpper(),
                    BookedYield = e["BookedYield"].ToString().ToUpper(),

                    ExecutedShpts = e["ExecutedShpts"].ToString().ToUpper(),
                    ExecutedPcs = e["ExecutedPcs"].ToString().ToUpper(),
                    ExecutedGrWt = e["ExecutedGrWt"].ToString().ToUpper(),
                    ExecutedVol = e["ExecutedVol"].ToString().ToUpper(),
                    ExecutedChWt = e["ExecutedChWt"].ToString().ToUpper(),
                    ExecutedFreight = e["ExecutedFreight"].ToString().ToUpper(),
                    ExecutedRevenue = e["ExecutedRevenue"].ToString().ToUpper(),
                    ExecutedYield = e["ExecutedYield"].ToString().ToUpper(),

                    UpliftedShpts = e["UpliftedShpts"].ToString().ToUpper(),
                    UpliftedPcs = e["UpliftedPcs"].ToString().ToUpper(),
                    UpliftedGrWt = e["UpliftedGrWt"].ToString().ToUpper(),
                    UpliftedVol = e["UpliftedVol"].ToString().ToUpper(),
                    UpliftedChWt = e["UpliftedChWt"].ToString().ToUpper(),
                    UpliftedFreight = e["UpliftedFreight"].ToString().ToUpper(),
                    UpliftedRevenue = e["UpliftedRevenue"].ToString().ToUpper(),
                    UpliftedYield = e["UpliftedYield"].ToString().ToUpper()

                });
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPerformanceRouteReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
        }


	}
}