// <copyright file="SpaceControlController.cs" company="Cargoflash">
//
// Created On: 06-Feb-2017
// Created By: Braj
// Description: Space Control controller
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>

namespace CargoFlashCargoWebApps.Controllers
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Data;
    using CargoFlash.Cargo.Model.Master;
    using CargoFlash.SoftwareFactory.WebUI.Controls;
    using CargoFlash.Cargo.Model.SpaceControl;
    using System.Data.SqlClient;
    using CargoFlash.Cargo.Model.Shipment;
    using CargoFlash.SoftwareFactory.Data;
    using System.ServiceModel.Web;
    using System.Net;
    #endregion

    public partial class SpaceControlController : Controller
    {
        #region Views Region

        /// <summary>
        /// This is parent view for spacecontrol 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult SpaceControlSearch(int? AWBSNo, int? status)
        {
            ViewBag.AWBSNo = AWBSNo;
            ViewBag.Status = status;
            return View();
        }

        public ActionResult AWBListDetails()
        {

            return PartialView("_AWBListDetails");
        }


        /// <summary>
        /// This view used for render replan offloded shipment UI
        /// </summary>
        /// <returns></returns>
        public ActionResult ReplanOffLoadShipment()
        {

            return View();
        }

        #endregion Views Region


        #region Partial views

        /// <summary>
        /// This partial view returns awb details 
        /// </summary>
        /// <param name="aWBNO"></param>
        /// <returns></returns>
        public PartialViewResult GetAWBDetails()
        {
            return PartialView("_GetAWBDetails");
        }

        /// <summary>
        /// This partial view fetch's html data for aircraft details pop up window
        /// </summary>
        /// <param name="airCraftSNo"></param>
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult GetAircraftDetails(int airCraftSNo)
        {
            try
            {
                string userId = (Session["UserDetail"] == null ? "0" : ((CargoFlash.Cargo.Model.UserLogin)(Session["UserDetail"])).UserSNo.ToString());
                System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@SNo", airCraftSNo), new System.Data.SqlClient.SqlParameter("@UserID", Convert.ToInt32(userId)) };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetRecordAirCraft ", Parameters);

                System.Data.SqlClient.SqlParameter[] Parameters1 = { new System.Data.SqlClient.SqlParameter("@AirCraftSNo", airCraftSNo), new System.Data.SqlClient.SqlParameter("@PageNo", 1), new System.Data.SqlClient.SqlParameter("@PageSize", 100), new System.Data.SqlClient.SqlParameter("@WhereCondition", ""), new System.Data.SqlClient.SqlParameter("@OrderBy", "") };
                DataSet ds1 = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetRecordAirCraftInventory", Parameters1);
                if (ds1.Tables.Count > 0)
                {
                    ds1.Tables[0].TableName = "Table2";
                    ds.Tables.Add(ds1.Tables[0].Copy());
                }
                return PartialView("_GetAircraftDetails", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// This partial view used for show aircraft or flight capacity details that is free sale, reserve, overbooked, used etc.
        /// </summary>
        /// <param name="dailyFlightSNo"></param>
        /// <param name="capacityType"></param>OtherChargesHistoryService
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult GetCapacity(CapacityRequest model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {   new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", model.DailyFlightSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@CapacityType", model.CapacityType)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spSpaceControl_GetCapacity ", Parameters);
                ViewBag.CapacityType = model.CapacityType;
                return PartialView("_GetCapacity", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// This partial view renders replan flight shipment details
        /// </summary>
        /// <param name="aWBSNo"></param>
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult ReplanFlight()
        {
            return PartialView("_ReplanFlight");
        }


        /// <summary>
        /// This partial view returns awb no details html
        /// </summary>
        /// <param name="AWBRefBookingSNo"></param>
        /// <param name="AWBNo"></param>
        /// <param name="IsTab"></param>
        /// <param name="bookedFrom"></param>
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult GetAWBNoDetails(AWBNoDetailsRequestModel model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@AWBRefBookingSNo", model.AWBRefBookingSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AWBNo", model.AWBNo) ,
                                                                  new System.Data.SqlClient.SqlParameter("@IsTab", model.IsTab) ,
                                                                  new System.Data.SqlClient.SqlParameter("@BookedFrom", model.bookedFrom)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spSpaceControl_AWBNo_Details ", Parameters);
                ViewBag.IsTab = model.IsTab;
                return PartialView("_GetAWBNoDetails", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// This partial view used for getting OSI remarks history details
        /// </summary>
        /// <param name="awbSNo"></param>
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult GetOSIRemarks(int? awbSNo)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@AWBSNo", awbSNo) };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spSpaceControl_OSIRemarks", Parameters);

                return PartialView("_GetOSIRemarks", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// This parial views fetch agent details
        /// </summary>
        /// <param name="AWBRefBookinSNo"></param>
        /// <param name="agentSNo"></param>
        /// <param name="bookedFrom"></param>
        /// <returns></returns>
        [HttpPost]
        public PartialViewResult GetAgentDetails(int? AWBRefBookinSNo, int? AgentSNo, string BookedFrom)
        {
            try
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@AWBRefBookinSNo",AWBRefBookinSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AgentSNo",AgentSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@BookedFrom",BookedFrom)

                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_AgentDetails", Parameters);

                return PartialView("_GetAgentDetails", ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        #endregion partial views


        #region Start JSON result Region

        /// <summary>
        /// This Json result return json data for offloded shipments grid data based on user input or filters
        /// </summary>
        /// <param name="model"></param>
        /// <param name="request"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult OffloadShipmentGridData(OffloadShipmentGridRequest model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<OffloadShipmentGridResponse>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@BookingRefNo", model.ReferenceNo),
                                                                  new System.Data.SqlClient.SqlParameter("@OriginSNo", model.Origin),
                                                                  new System.Data.SqlClient.SqlParameter("@DestinationSNo", model.Destination),
                                                                  new System.Data.SqlClient.SqlParameter("@AWBNo", model.AWBNo),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo", model.FlightNo),
                                                                  new System.Data.SqlClient.SqlParameter("@From", model.From),
                                                                  new System.Data.SqlClient.SqlParameter("@To", model.To),
                                                                  new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                  new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                  new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                  new System.Data.SqlClient.SqlParameter("@OrderBy", sorts)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_SearchOffloadShipment", Parameters);

                //string outPut = "{Data:" + CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0) + ",Total:" + CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 1) + "}";

                return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// This method is used for return replan flight details data 
        /// </summary>
        /// <param name="aWBRefBookingSNo"></param>
        /// <param name="dailyFlightSNo"></param>
        /// <param name="bookedFrom"></param>
        /// <returns></returns>
        [HttpPost]
        public string ReplanFlightDetails(ReplanFlightRequestModel model)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@AWBRefBookingSNo", model.AWBRefBookingSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", model.DailyFlightSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@BookedFrom",model.BookedFrom),
                                                                  new System.Data.SqlClient.SqlParameter("@AirportSNo",model.AirportSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AccountSNo",model.ACSNo),
                                                                  new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "dbo.spSpaceControl_Flight_Replan_Details ", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method used for submitting data for replan flight details
        /// </summary>
        /// <param name="BookingRefNo"></param>
        /// <param name="bookedFrom"></param>
        /// <param name="aWBDetails"></param>
        /// <param name="itineraryDetails"></param>
        /// <returns></returns>
        [HttpPost]
        public string SubmitReplan(SubmitReplanRequest model)
        {
            try
            {
                List<ReplanSubmitModel> lstaWBDetails = new List<ReplanSubmitModel>();
                lstaWBDetails.Add(model.AWBDetails);
                DataTable dtAWBDetails = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(lstaWBDetails, "");
                DataTable dtItineraryDetails = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(model.ItineraryDetails, "");


                SqlParameter paramAWBDetails = new SqlParameter();
                paramAWBDetails.ParameterName = "@AWBDetails";
                paramAWBDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramAWBDetails.Value = dtAWBDetails;

                SqlParameter paramItineraryDetails = new SqlParameter();
                paramItineraryDetails.ParameterName = "@ItineraryDetails";
                paramItineraryDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramItineraryDetails.Value = dtItineraryDetails;

                SqlParameter[] Parameters = {
                                            new SqlParameter("@BookingRefNo", model.BookingRefNo),
                                            paramAWBDetails,
                                            paramItineraryDetails,
                                            new SqlParameter("@ReplanStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@BookedFrom", model.BookedFrom),
                                            new SqlParameter("@ReplanFrom", model.ReplanFrom),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@AirportSNo", model.AirportSNo)
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSpaceControl_ReplanSubmit", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }



        /// <summary>
        /// This json results fetch space control search data for flights
        /// </summary>
        /// <param name="model"></param>
        /// <param name="request"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SpaceControlSearch(SpaceControlSearchModel model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                if (string.IsNullOrEmpty(model.FlightNo))
                    model.FlightNo = string.Empty;
                if (model.Origin == null)
                    model.Origin = 0;
                //if (string.IsNullOrEmpty(model.OrderBy))
                //    model.OrderBy = "QUEUE";
                if (model.Destination == null)
                    model.Destination = 0;
                if (string.IsNullOrEmpty(model.Zone))
                    model.Zone = "0";
                if (model.TimeToDep == null)
                    model.TimeToDep = 0;
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@SearchBy", model.SearchBy),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightDate", model.FlightDate),
                                                                  new System.Data.SqlClient.SqlParameter("@OriginAirportSNo", model.Origin),
                                                                  new System.Data.SqlClient.SqlParameter("@DestinationAirportSNo", model.Destination),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo", model.FlightNo),
                                                                  new System.Data.SqlClient.SqlParameter("@ZoneType", model.ZoneType),
                                                                  new System.Data.SqlClient.SqlParameter("@ZoneSNo", model.Zone),
                                                                  new System.Data.SqlClient.SqlParameter("@Hours", model.TimeToDep),
                                                                  new System.Data.SqlClient.SqlParameter("@CapUtilised", model.CapacityUtilized),
                                                                  new System.Data.SqlClient.SqlParameter("@OrderBy", model.OrderBy),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightType", model.FlightType),
                                                                  new System.Data.SqlClient.SqlParameter("@ProductSNo", model.ProductSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                  new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                  //new System.Data.SqlClient.SqlParameter("@WhereCondition", filters),
                                                                  
                                                              };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_SearchFlight", Parameters);

                int recordCount = 0;
                if (ds.Tables[0].Rows.Count > 0)
                    recordCount = (int)ds.Tables[0].Rows[0][1];

                return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = recordCount }, JsonRequestBehavior.AllowGet);


            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// This methos used for get flight route details 
        /// </summary>
        /// <param name="flightNo"></param>
        /// <param name="FlightDate"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetFlightRoute(string flightNo, DateTime FlightDate)
        {
            try
            {
                if (string.IsNullOrEmpty(flightNo))
                    flightNo = string.Empty;


                System.Data.SqlClient.SqlParameter[] Parameters = { new System.Data.SqlClient.SqlParameter("@FlightNo", flightNo), new System.Data.SqlClient.SqlParameter("@FlightDate", FlightDate) };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_GetFlightRoute", Parameters);

                return Json(CargoFlash.Cargo.Business.Common.DStoJSON(ds), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }


        /// <summary>
        /// This method used for updating shipment status KK, LL and UU
        /// </summary>
        /// <param name="models"></param>
        /// <param name="request"></param>
        /// <param name="DailyFlightSNo"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateAWBList(List<AdviceStatusCodeRequest> models, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string DailyFlightSNo)
        {
            try
            {
                int userId = (Session["UserDetail"] == null ? 0 : ((CargoFlash.Cargo.Model.UserLogin)(Session["UserDetail"])).UserSNo);

                DataTable dt = CargoFlashCargoWebApps.Common.Global.ToDataTable(models);
                System.Data.SqlClient.SqlParameter tblType = new System.Data.SqlClient.SqlParameter();
                tblType.ParameterName = "@SpaceAdviceStatusCode";
                tblType.SqlDbType = System.Data.SqlDbType.Structured;
                tblType.Value = dt;
                SqlParameter output = new SqlParameter("@Status", SqlDbType.VarChar);
                output.Size = 100;
                output.Direction = ParameterDirection.Output;

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo",DailyFlightSNo),
                                                                  tblType,
                                                                  new System.Data.SqlClient.SqlParameter("@UserSNo", userId),
                                                                  output
                                                                  //new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                  //new System.Data.SqlClient.SqlParameter("@OrderBy", sorts)                                                            
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "sp_SpaceControl_UpdateAdviceStatusCode", Parameters);

                string status = output.Value.ToString();

                return Json(status, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method used for searching awb list 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="request"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SearchAWBList(AWBGridRequest model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                if (string.IsNullOrEmpty(model.DailyFlightSNo) && string.IsNullOrEmpty(model.AWBRefSNo))
                    return Json(null, JsonRequestBehavior.AllowGet);

                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Master.Airline>(filter);

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", model.DailyFlightSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AWBRefSNo", model.AWBRefSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@BookedFrom", model.BookedFrom),
                                                                  new System.Data.SqlClient.SqlParameter("@AWBNo", model.AWBNo),
                                                                  new System.Data.SqlClient.SqlParameter("@SearchBy", model.SearchBy),
                                                                  new System.Data.SqlClient.SqlParameter("@ProductSNo", model.ProductSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                  new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                  new System.Data.SqlClient.SqlParameter("@OrderBy", sorts)
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_AWBList", Parameters);
                int recordCount = 0;
                if (ds.Tables[0].Rows.Count > 0)
                    recordCount = (int)ds.Tables[0].Rows[0][1];

                return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = recordCount }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        [HttpPost]
        public JsonResult ADDHDQRemarks(HDQRemarks model)
        {
            try
            {
                int userId = (Session["UserDetail"] == null ? 0 : ((CargoFlash.Cargo.Model.UserLogin)(Session["UserDetail"])).UserSNo);
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@FlightPlanSNo", model.FlightPlanSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", model.DailyFlightSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AWBSNo", model.AWBSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AirportSNo", model.AirportSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@Remarks", model.Remarks),
                                                                  new System.Data.SqlClient.SqlParameter("@UpdatedBy",userId)
                                                              };
                int output = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_AddHDQRemarks", Parameters);
                if (output >= 0)
                    return Json("Success", JsonRequestBehavior.AllowGet);
                else
                    return Json("Failed", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        #endregion End JSON Result Region

    }
}