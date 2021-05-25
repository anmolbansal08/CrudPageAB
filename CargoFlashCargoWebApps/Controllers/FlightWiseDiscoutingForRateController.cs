using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.Script.Serialization;
using CargoFlash.Cargo.Model.Rate;
namespace CargoFlashCargoWebApps.Controllers
{
    public class FlightWiseDiscoutingForRateController : Controller
    {
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        // GET: FlightWiseDiscoutingForRate
        public ActionResult FlightWiseDiscounting()
        {
            return View();
        }
        [HttpPost]
        public string GetSlabData(SlabSearch obj)
        {
            SqlParameter[] param = { new SqlParameter("@DailyFlightSNo", obj.FlightNo) };
            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spRate_GetSlabforFlightWiseDiscounting", param);
            var returndata = "";
            try
            {
                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables.Count > 1 && ds.Tables[0].Rows.Count > 0 && ds.Tables[1].Rows.Count > 0)
                    {
                        returndata = "{ \"Table0\" :  " + ds.Tables[0].Rows[0][0].ToString() + "  ,\"Table1\" :  " + ds.Tables[1].Rows[0][0].ToString() + "}";
                    }
                    else
                    {
                        returndata = "{ \"Table0\" :  " + ds.Tables[0].Rows[0][0].ToString() + "}";
                    }
                }
                else
                {
                    returndata = "{}";
                }
            }
            catch
            {
                returndata = "{\"error\" : \"Some error occured.\"}";
            }
            return returndata;
        }

        [HttpPost]
        public string GetFlights(FlightSearch obj)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@FlightNo", obj.FlightNo),
                                     new SqlParameter("@FlightDate", obj.FlightDate),
                                     new SqlParameter("@Origin", obj.Origin),
                                     new SqlParameter("@Destination", obj.Destination),
                                     new SqlParameter("@FlightType", obj.FlightType),
                                    // new SqlParameter("@CarrierCode", obj.FlightType),
                                     new SqlParameter("@Airline",obj.Airline)
            };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spRate_GetFlightsforFlightWiseDiscounting", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        [HttpPost]
        public string GetFlightInformation(FlightSearch obj)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@FlightNo", obj.FlightNo),
                                     new SqlParameter("@FlightDate", obj.FlightDate),
                                     new SqlParameter("@Origin", obj.Origin),
                                     new SqlParameter("@Destination", obj.Destination),
            };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spRate_GetFlightDetailsforFlightWiseDiscounting", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        [HttpPost]
        public string SaveDiscount(List<SaveDiscount> obj, string DailyFlightSNo, string FromDate, string ToDate, string AlReleaseTime, string Status, DiscountConditions DisObj)
        {

            try
            {
                var jsonSaveDiscount = new JavaScriptSerializer().Serialize(obj);
                var jsonDiscountConditions = new JavaScriptSerializer().Serialize(DisObj);
                string userId = (Session["UserDetail"] == null ? "0" : ((CargoFlash.Cargo.Model.UserLogin)(Session["UserDetail"])).UserSNo.ToString());
                SqlParameter[] param = { new SqlParameter("@JsonData", jsonSaveDiscount),
                                    new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                    new SqlParameter("@FromDate", FromDate),
                                    new SqlParameter("@ToDate", ToDate),
                                    new SqlParameter("@AlReleaseTime", AlReleaseTime),
                                    new SqlParameter("@Status", Status),
                                    new SqlParameter("@UserSNo", Convert.ToInt32(userId)),
                                    new SqlParameter("@JsonDisConditions",jsonDiscountConditions)

            };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spRate_SaveFlightWiseDiscounting", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch
            {
                return "{\"Error\" :\"Failed\"}";
            }
        }
    } }

