// <copyright file="SpaceControlController.cs" company="Cargoflash">
//
// Created On: 20-March-2017
// Created By: Vipin Kumar
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
    using Kendo.Mvc.UI;
    using Kendo.Mvc.Extensions;
    using CargoFlash.Cargo.Model.Master;
    using CargoFlash.SoftwareFactory.WebUI.Controls;
    using CargoFlash.Cargo.Model.SpaceControl;
    #endregion

    public partial class SpaceControlController : Controller
    {
        [HttpGet]
        public ActionResult FlightDetails(int DailyFlightSNo, string flightNo, DateTime flightDate, string airPort, bool? IsSpace)
        {
            FlightSearchModel fSModel = new FlightSearchModel();
            if (!string.IsNullOrEmpty(flightNo) && !string.IsNullOrEmpty(airPort))
            {
                fSModel.FlightDetailsFlightNo = flightNo;
                fSModel.FlightDetailsFlightDate = flightDate;
                fSModel.FlightDetailsAirport = airPort;
                fSModel.FlightDetailsDailyFlightSNo = DailyFlightSNo;
                ViewBag.IsSpace = IsSpace;
            }


            return View(fSModel);
        }
        [HttpPost]
        public JsonResult FlightDetails(string FlightNo, DateTime FlightDate)
        {
         
            System.Data.SqlClient.SqlParameter[] Parameters = {    
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNumber", FlightNo), 
                                                                  new System.Data.SqlClient.SqlParameter("@FlightDate", FlightDate), 
                                                              };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSpaceControl_FlightList", Parameters);

            return Json(CargoFlashCargoWebApps.Common.Global.DStoJSON(ds), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public string SpaceControlFlightDetails(int DailyFlightSNo, string FlightNo, DateTime FlightDate, int OriginAirportSNo)
        {
           
            System.Data.SqlClient.SqlParameter[] Parameters = {  
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo), 
                                                                  new System.Data.SqlClient.SqlParameter("@FlightDate", FlightDate),
                                                                  new System.Data.SqlClient.SqlParameter("@OriginAirportSNo", OriginAirportSNo)
                                                              };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetSpaceControlFlightDetails", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            //return Json(ds, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public string SpaceControlGetLists(int DailyFlightSNo,string FlightNo, DateTime FlightDate, int OriginAirportSNo, int status, int IsFlightDetails)
        {
          
            System.Data.SqlClient.SqlParameter[] Parameters = {    
                                                                  new System.Data.SqlClient.SqlParameter("@DailyFlightSNo", DailyFlightSNo), 
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo", FlightNo), 
                                                                  new System.Data.SqlClient.SqlParameter("@FlightDate", FlightDate),
                                                                  new System.Data.SqlClient.SqlParameter("@OriginAirportSNo", OriginAirportSNo),
                                                                  new System.Data.SqlClient.SqlParameter("@Status", status),
                                                                  new System.Data.SqlClient.SqlParameter("@IsFlightDetails", IsFlightDetails)
                                                              };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetSpaceControlGetLists", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            //return Json(ds, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult FlightPlan()
        {
            return View();
        }
    }
}