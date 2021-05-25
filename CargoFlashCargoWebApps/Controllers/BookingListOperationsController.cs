﻿using System.Data.SqlClient;
using System.Text;
using CargoFlash.Cargo.Model;
using System.ServiceModel.Web;
using System.Net;
using System;
using System.Web.Mvc;
using System.Data;

namespace CargoFlashCargoWebApps.Controllers
{
    public class BookingListOperationsController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: /MasterBookList/
        public ActionResult BookingListOperationsView()
        {
            return View();
        }

        [HttpGet]
        public string GetFlightData(string FlightNo, string FlightDate, string OriginSNo, string DestinationSNo)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                new System.Data.SqlClient.SqlParameter("@FlightNo",FlightNo),
                new System.Data.SqlClient.SqlParameter("@FlightDate",FlightDate),
                new System.Data.SqlClient.SqlParameter("@OriginAriportSNo",OriginSNo),
                new System.Data.SqlClient.SqlParameter("@DestinationAirportSNo",DestinationSNo),
                new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()) };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spMasterBookListFlightData", Parameters);
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


        [HttpGet]
        public string GetFlightShipments(string SNo, string IsConfirm)
        {
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
            new System.Data.SqlClient.SqlParameter("@SNo",SNo),
            new System.Data.SqlClient.SqlParameter("@IsConfirm",IsConfirm),
            new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()) };

                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spBookListOperationsFlightShipments", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spBookListOperationsFlightShipments"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


    }
}