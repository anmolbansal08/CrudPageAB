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
    public class PostFlightReportController : Controller
    {

        //
        // GET: /PostFlightReport/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult PostFlightReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, PostFlightReportRequest Model)
        {
            System.Data.DataSet dsPostFlight = new DataSet();
            IEnumerable<PostFlightReport> CommodityList = null;

            System.Data.SqlClient.SqlParameter[] ParametersPostFlight = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo ",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };

            try
            {
                dsPostFlight = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPostFlightReport_getrecord", ParametersPostFlight);

                if (dsPostFlight.Tables.Count > 1 && dsPostFlight.Tables != null)
                {
                    CommodityList = dsPostFlight.Tables[0].AsEnumerable().Select(e => new PostFlightReport
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
                    dsPostFlight.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = dsPostFlight.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PostFlightReport>().ToList<PostFlightReport>(),
                    Total = dsPostFlight.Tables.Count > 1 ? Convert.ToInt32(dsPostFlight.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPostFlightReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpPost]
        public string GetPostFlightReportDescription(PostFlightReportDescription model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, int sNo, string type)
        {

            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<PostFlightReportDescription>(filter);
            System.Data.DataSet ds = new DataSet();
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                     new System.Data.SqlClient.SqlParameter("@DailyFlightSNo",sNo),
                                                                     new System.Data.SqlClient.SqlParameter("@Type",type),
                                                                     new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPostFlightReport_GetPostFlightReportDescription", Parameters);

                if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    // do here any logic
                }

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPostFlightReport_GetPostFlightReportDescription"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        [HttpPost]
        public ActionResult ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, PostFlightReportRequest Model)
        {
            System.Data.DataSet dsPostFlight = new DataSet();
            IEnumerable<PostFlightReport> CommodityList = null;
            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] ParametersPostFlight = {
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginSNo ",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                                              };

            try
            {
                dsPostFlight = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spPostFlightReport_getrecord", ParametersPostFlight);
                if (dsPostFlight.Tables.Count > 1 && dsPostFlight.Tables != null)
                {

                    CommodityList = dsPostFlight.Tables[0].AsEnumerable().Select(e => new PostFlightReport
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
                    dsPostFlight.Dispose();
                }
                return Json(new DataSourceResult
                {
                    Data = dsPostFlight.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<PostFlightReport>().ToList<PostFlightReport>(),
                    Total = dsPostFlight.Tables.Count > 1 ? Convert.ToInt32(dsPostFlight.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spPostFlightReport_getrecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }


        }
    }
}