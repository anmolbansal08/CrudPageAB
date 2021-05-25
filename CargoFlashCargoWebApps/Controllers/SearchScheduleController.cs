/* Created By:Jitendra Kumar
 * Created Start Date:15Feb 2016
 * Description: Flight schedule and search rate
 * */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Data;
//using Kendo.Mvc.UI;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.Cargo.Model;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using ClosedXML.Excel;
using System.IO;
using System.ServiceModel.Web;
using System.Net;
using System.Text;
using System.Globalization;
using System.Net.Mail;

namespace CargoFlashCargoWebApps.Controllers
{
    public class SearchScheduleController : Controller
    {

        //
        // GET: /SearchSchedule/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString;
        Schedule objschedule = new Schedule();

        public ActionResult SearchScheduleView()
        {

            return View();
        }

        public ActionResult AllotmentReport()
        {
            return View();
        }

        /// <summary>
        /// Get Allotment Report Details
        /// </summary>
        /// <param name="airlineSno"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="flightNo"></param>
        /// <param name="Agentsno"></param>
        /// <returns></returns>
        public ActionResult GetAllotmentReport(string airlineSno, string fromdate, string todate, string flightNo, string Agentsno, int IsAutoProcess)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            Allotment_ objallotment;
            List<Allotment_> listAllotment = new List<Allotment_>();
            try
            {

                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@CarrierCode",airlineSno),
                                                                    new System.Data.SqlClient.SqlParameter("@fromdate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@flightNo",flightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "Usp_GetallotmentReport", Parameters);


                if (ds.Tables.Count > 0)
                {

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        objallotment = new Allotment_();
                        objallotment.FlightNo = dr["FlightNo"].ToString();
                        objallotment.Date = dr["FlightDate"].ToString();
                        objallotment.AircraftType = dr["AircraftType"].ToString();
                        objallotment.Origin = dr["OriginAirportCode"].ToString();
                        objallotment.Destination = dr["DestinationAirportCode"].ToString();

                        objallotment.Grosswight = dr["GrossWeight"].ToString();
                        objallotment.Volume = dr["Volume"].ToString();
                        objallotment.Hard = dr["TotalHardBlockGW"].ToString();
                        objallotment.Utilised = dr["TotalHardBlockUGW"].ToString();
                        objallotment.Soft = dr["TotalSoftBlockGW"].ToString();
                        objallotment.SoftUtilised = dr["TotalSoftBlockUGW"].ToString();
                        objallotment.Fixed = dr["TotalFixedBlockGW"].ToString();
                        objallotment.FixedUtilised = dr["TotalFixedBlockUGW"].ToString();
                        objallotment.Open = dr["TotalOpenBlockGW"].ToString();
                        objallotment.OpenUtilised = dr["TotalOpenBlockUGW"].ToString();
                        objallotment.Total = dr["TotalAllotmentGrossWt"].ToString();
                        objallotment.TotalUtilised = dr["TotalUsedAllotmentGrossWt"].ToString();

                        objallotment.Hardvolume = dr["TotalHardBlockVW"].ToString();
                        objallotment.hardUtilisedvolume = dr["TotalHardBlockUVG"].ToString();
                        objallotment.softvolume = dr["TotalSoftBlockVW"].ToString();
                        objallotment.softUtilisedvolume = dr["TotalSoftBlockUVG"].ToString();
                        objallotment.openvolume = dr["TotalOpenBlockVW"].ToString();
                        objallotment.openUtilisedvolume = dr["TotalOpenBlockUVG"].ToString();
                        objallotment.fixedvolume = dr["TotalFixedBlockVW"].ToString();
                        objallotment.fixedUtilisedvolume = dr["TotalFixedBlockUVG"].ToString();
                        objallotment.Totalvolume = dr["TotalAllotmentVolume"].ToString();
                        objallotment.TotalUtilisedvolume = dr["TotalUsedAllotmentVolume"].ToString();
                        objallotment.Dailyflightsno = Convert.ToInt32(dr["SNo"].ToString());
                        objallotment.Accountsno = Convert.ToInt32(Agentsno);
                        listAllotment.Add(objallotment);
                    }

                }

            }
            catch (Exception ex)
            {  // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Usp_GetallotmentReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = listAllotment.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            }, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// Get allotment shipmentat popup click
        /// </summary>
        /// <param name="SNo"></param>
        /// <param name="agentsno"></param>
        /// <returns></returns>
        public ActionResult GetAllotmentReport_Shipment(string SNo, string agentsno)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            Allotment_ objallotment;
            List<Allotment_> listAllotment = new List<Allotment_>();
            try
            {


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Flightsno",Convert.ToInt32(SNo)),
                                                                    new System.Data.SqlClient.SqlParameter("@Agentsno", Convert.ToInt32(agentsno))

                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "Usp_GetallotmentReport_shipment", Parameters);


                if (ds.Tables.Count > 0)
                {

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        objallotment = new Allotment_();
                        objallotment.AccountName = dr["AccountName"].ToString();
                        objallotment.AWBNO = dr["AWBNo"].ToString();
                        objallotment.AWBPCS = dr["Pieces"].ToString();
                        objallotment.AWBGRS = dr["Gross"].ToString();
                        objallotment.AWBVOLUME = dr["Volume"].ToString();
                        objallotment.Origin = dr["Origin"].ToString();
                        objallotment.Destination = dr["Destination"].ToString();
                        objallotment.AllocationType = dr["AllotmentType"].ToString();
                        objallotment.Allocationcode = dr["AllotmentCode"].ToString();

                        listAllotment.Add(objallotment);
                    }

                }

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Usp_GetallotmentReport_shipment"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = listAllotment.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult BookingProfileReport()
        {
            return View();
        }
        /// <summary>
        /// Get Booking Profile Report
        /// </summary>
        /// <param name="AWBSNO"></param>
        /// <param name="FlightNo"></param>
        /// <param name="Fromdate"></param>
        /// <param name="Todate"></param>
        /// <param name="OriginSno"></param>
        /// <param name="DestinationSno"></param>
        /// <param name="AgentSno"></param>
        /// <returns></returns>


        public ActionResult GetBookingProfileReport(GarudaBookingProfileReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineCode, string FlightNo, string Fromdate, string Todate, string OriginSno, string DestinationSno, string AgentSno, string DateType, string OfficeSNo, int IsAutoProcess)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<GarudaBookingProfileReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                            new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",airlineCode),
                                                                            new System.Data.SqlClient.SqlParameter("@FlightNo",FlightNo),
                                                                            new System.Data.SqlClient.SqlParameter("@Fromdate",Fromdate),
                                                                            new System.Data.SqlClient.SqlParameter("@Todate",Todate),
                                                                            new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@DestinationCitysno",Convert.ToInt32(DestinationSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@AgentSno",AgentSno),
                                                                            new System.Data.SqlClient.SqlParameter("@DateType",DateType),
                                                                             new System.Data.SqlClient.SqlParameter("@OfficeSNo", OfficeSNo),
                                                                             new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                              new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                              new System.Data.SqlClient.SqlParameter("@IsAutoProcess", IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_BookingProfile_Report", Parameters);
                if (ds.Tables != null && ds.Tables.Count > 0)
                {
                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new GarudaBookingProfileReport
                    {
                        AWBSNo = e["AWBSNo"].ToString(),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        Dom = e["Dom"].ToString().ToUpper(),
                        IssuePlace = e["IssuePlace"].ToString().ToUpper(),
                        IssueDate = e["IssueDate"].ToString().ToUpper(),
                        ProductName = e["ProductName"].ToString().ToUpper(),
                        SHC = e["SHC"].ToString().ToUpper(),
                        CommodityCode = e["CommodityCode"].ToString().ToUpper(),
                        NatureOfGoods = e["NatureOfGoods"].ToString().ToUpper(),
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        FlightNo2 = e["FlightNo2"].ToString().ToUpper(),
                        FlightNo3 = e["FlightNo3"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString().ToUpper(),
                        BookingDate = e["BookingDate"].ToString().ToUpper(),
                        AccountName = e["AccountName"].ToString().ToUpper(),
                        AccountNo = e["AccountNo"].ToString().ToUpper(),
                        GrWt = e["GrWt"].ToString().ToUpper(),
                        ChWt = e["ChWt"].ToString().ToUpper(),
                        CurrCode = e["CurrCode"].ToString().ToUpper(),
                        GrossCapacity = e["GrossCapacity"].ToString().ToUpper(),
                        NetAmount = e["NetAmount"].ToString().ToUpper(),
                        GrKG = e["GrKG"].ToString().ToUpper(),
                        NetKG = e["NetKG"].ToString().ToUpper(),
                        GrossFreight = e["GrossFreight"].ToString().ToUpper(),
                        CommissionAmount = e["CommissionAmount"].ToString().ToUpper(),
                        DiscountAmount = e["DiscountAmount"].ToString().ToUpper(),
                        NetFreight = e["NetFreight"].ToString().ToUpper(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString().ToUpper(),
                        RateType = e["RateType"].ToString().ToUpper(),
                        RefferenceCode = e["RefferenceCode"].ToString().ToUpper(),
                        Insurance = e["Insurance"].ToString().ToUpper(),
                        CCA = e["CCA"].ToString().ToUpper(),
                        OfficeName = e["Office"].ToString().ToUpper(),
                    });
                    ds.Dispose();
                }

                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<GarudaBookingProfileReport>().ToList<GarudaBookingProfileReport>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_BookingProfile_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        /// <summary>
        /// Get Search Schedule Details
        /// </summary>
        /// <param name="originCityname"></param>
        /// <param name="destinationcityname"></param>
        /// <param name="date"></param>
        /// <param name="leg"></param>
        /// <returns></returns>
        public ActionResult GetSearchSchedule(string originCityname, string destinationcityname, string date, string leg, string radiocheck, string UserSNo)
        {
            List<SceduleFlightClass> listschedule = new List<SceduleFlightClass>();
            List<Routepath> listRoutepath = new List<Routepath>();
            Routepath routepath;
            SceduleFlightClass objschedule;



            DataSet ds = new DataSet();
            try
            {

                string strOrigin = originCityname;
                int pos1 = strOrigin.IndexOf("-");

                string newstr_origin = strOrigin.Substring(0, pos1);

                string strdestinationcityname = destinationcityname;
                int destinationcityname1 = strdestinationcityname.IndexOf("-");
                string newstr_destinationcityname = strdestinationcityname.Substring(0, destinationcityname1);

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@_Origin",newstr_origin),
                                                                    new System.Data.SqlClient.SqlParameter("@_Destination",newstr_destinationcityname),
                                                                    new System.Data.SqlClient.SqlParameter("@_FlightDate",date),
                                                                    new System.Data.SqlClient.SqlParameter("@_Leg",leg),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo)//added by ankit

                                                                    //new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };
                if (radiocheck == "0")
                {
                    ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetDetails_ScheduleShipmentFlight_Route", Parameters);
                    if (ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            routepath = new Routepath();
                            routepath.id = Convert.ToInt32(dr["ID"].ToString());
                            routepath.ORIGINMAIN = dr["ORIGINMAIN"].ToString();
                            listRoutepath.Add(routepath);
                        }
                        foreach (DataRow dr in ds.Tables[1].Rows)
                        {
                            objschedule = new SceduleFlightClass();
                            objschedule.FlightNo = dr["FlightNo"].ToString();
                            objschedule.FlightOrigin = dr["FromOrigin"].ToString();
                            objschedule.FlightDestination = dr["ToDestination"].ToString();

                            DateTime dt = DateTime.ParseExact(dr["FlightDate"].ToString(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
                            var result = dt.ToString("dd-MMM-yyyy");
                            objschedule.FlightDate = result;
                            if (dr["ETD"].ToString() == "")
                            { objschedule.ETD = dr["ETD"].ToString(); }
                            else
                            {

                                objschedule.ETD = dr["ETD"].ToString().Remove(dr["ETD"].ToString().LastIndexOf(":")) + "/" + dr["ETA"].ToString().Remove(dr["ETD"].ToString().LastIndexOf(":"));
                            }
                            if (dr["ETDGMT"].ToString() == "")
                            {
                                objschedule.ETDGMT = dr["ETDGMT"].ToString();
                            }
                            else
                            {
                                objschedule.ETDGMT = dr["ETDGMT"].ToString().Remove(dr["ETDGMT"].ToString().Length - 3, 3) + "/" + dr["ETAGMT"].ToString().Remove(dr["ETDGMT"].ToString().Length - 3, 3);
                            }
                            objschedule.AircraftDescription = dr["AircraftDescription"].ToString().ToUpper();
                            objschedule.RoutePath = dr["RoutePath"].ToString();
                            if (dr["sno"].ToString() == "")
                            {
                                objschedule.sno = 1;
                            }
                            else
                            {
                                objschedule.sno = Convert.ToInt32(dr["sno"].ToString());

                            }

                            objschedule.Mode = dr["BodyType"].ToString().ToUpper();
                            objschedule.CargoClassification = (dr["CargoClassification"].ToString().ToUpper());

                            listschedule.Add(objschedule);
                        }


                    }
                }
                else
                {
                    ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetDetails_ScheduleShipmentFlight", Parameters);
                    if (ds.Tables.Count > 0)
                    {

                        foreach (DataRow dr in ds.Tables[1].Rows)
                        {
                            objschedule = new SceduleFlightClass();
                            objschedule.FlightNo = dr["FlightNo"].ToString();
                            objschedule.FlightOrigin = dr["FromOrigin"].ToString();
                            objschedule.FlightDestination = dr["ToDestination"].ToString();

                            DateTime dt = DateTime.ParseExact(dr["FlightDate"].ToString(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
                            var result = dt.ToString("dd-MMM-yyyy");
                            objschedule.FlightDate = result;
                            if (dr["ETD"].ToString() == "")
                            { objschedule.ETD = dr["ETD"].ToString(); }
                            else
                            {

                                objschedule.ETD = dr["ETD"].ToString().Remove(dr["ETD"].ToString().LastIndexOf(":")) + "/" + dr["ETA"].ToString().Remove(dr["ETD"].ToString().LastIndexOf(":"));
                            }
                            if (dr["ETDGMT"].ToString() == "")
                            {
                                objschedule.ETDGMT = dr["ETDGMT"].ToString();
                            }
                            else
                            {
                                objschedule.ETDGMT = dr["ETDGMT"].ToString().Remove(dr["ETDGMT"].ToString().Length - 3, 3) + "/" + dr["ETAGMT"].ToString().Remove(dr["ETDGMT"].ToString().Length - 3, 3);
                            }
                            objschedule.AircraftDescription = dr["AircraftDescription"].ToString().ToUpper();
                            objschedule.RoutePath = dr["RoutePath"].ToString();
                            if (dr["sno"].ToString() == "")
                            {
                                objschedule.sno = 1;
                            }
                            else
                            {
                                objschedule.sno = Convert.ToInt32(dr["sno"].ToString());

                            }

                            objschedule.Mode = dr["BodyType"].ToString().ToUpper();
                            objschedule.CargoClassification = (dr["CargoClassification"].ToString().ToUpper());

                            listschedule.Add(objschedule);
                        }


                    }
                }



            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetDetails_ScheduleShipmentFlight"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

            return Json(new
            {
                listschedule = listschedule,
                listRoutepath = listRoutepath,
                radiocheck = radiocheck

            }, JsonRequestBehavior.AllowGet);


            //return Json(new DataSourceResult
            //{
            //    Data =listschedule.AsQueryable().ToList(),
            //    Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            //}, JsonRequestBehavior.AllowGet);


        }

        /// <summary>
        /// Search rate
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult SearchrateView()
        {
            UserLogin userlogin = new UserLogin();
            string username = string.Empty;
            Session["Username"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName;
            Session["AgentSNo"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AgentSNo;

            ViewBag.Username = Session["Username"];
            ViewBag.AgentSNo = Session["AgentSNo"];



            return View();
        }

        /// <summary>
        /// Get Rate Details
        /// </summary>
        /// <param name="fromorigin"></param>
        /// <param name="todestination"></param>
        /// <param name="flightdate"></param>
        /// <param name="accountsno"></param>
        /// <param name="airlinecode"></param>
        /// <param name="commoditycode"></param>
        /// <param name="productname"></param>
        /// <param name="flightNumber"></param>
        /// <param name="rateType"></param>
        /// <returns></returns>
        public JsonResult GetRateDetails(string fromorigin, string todestination, string flightdate, string accountsno, string airlinecode, string commoditycode, string productname, string flightNumber, string rateType, string RateRefNumber, string SHCSNo, string TransitSno, int IsAgentLogin, int OriginLevelParam, int DestinationLevelParam, int AgentGroup)
        {
            DataSet ds = new DataSet();
            SchedulerateClass objscheduleRate;
            List<SchedulerateClass> listschedulerate = new List<SchedulerateClass>();
            string dsrowsvalue = string.Empty;
            try
            {
                int pos1;
                //    string strOrigin = "";
                string newstr_origin = "";
                string strdestinationcityname = "";
                int destinationcityname1 = 0;
                string newstr_destinationcityname = "";
                string strairlinecode = "";
                int strairlinecode1 = 0;
                string newstr_strairlinecode = "";
                //if (airlinecode != "")
                //    RateRefNumber = "";

                if (RateRefNumber == "")
                {
                    pos1 = fromorigin.IndexOf("-");

                    newstr_origin = fromorigin.Substring(0, pos1);


                    strdestinationcityname = todestination;
                    destinationcityname1 = strdestinationcityname.IndexOf("-");
                    newstr_destinationcityname = strdestinationcityname.Substring(0, destinationcityname1);

                    strairlinecode = airlinecode;
                    strairlinecode1 = strairlinecode.IndexOf("-");
                    newstr_strairlinecode = strairlinecode.Substring(0, strairlinecode1);
                }


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@OriginCityCode",newstr_origin),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationCityCode",newstr_destinationcityname),
                                                                    new System.Data.SqlClient.SqlParameter("@BFlightDate",flightdate),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",accountsno),
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",newstr_strairlinecode),
                                                                    new System.Data.SqlClient.SqlParameter("@CommodityCode",commoditycode),
                                                                    new System.Data.SqlClient.SqlParameter("@ProductName",productname),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",flightNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@RateType",rateType),
                                                                    new System.Data.SqlClient.SqlParameter("@ErrorMessage",""),
                                                                    new System.Data.SqlClient.SqlParameter("@RateRefNo",RateRefNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@SHCSNo",SHCSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@TransitSNo",TransitSno),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAgentLogin", IsAgentLogin),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginLevelParam",OriginLevelParam),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationLevelParam",DestinationLevelParam),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentGroup",AgentGroup)

                                                              };
                DataSet dsRate = new DataSet();

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spRate_GetRateAgentWise", Parameters);


                if (ds != null && ds.Tables.Count > 0)
                {
                    //if (ds.Tables[0].Columns.Contains("N"))
                    //    ds.Tables[0].Columns.Remove("N");
                    if (ds.Tables[0].Columns.Contains("11-45"))
                        ds.Tables[0].Columns.Remove("11-45");
                    if (ds.Tables[0].Columns.Contains("46-100"))
                        ds.Tables[0].Columns.Remove("46-100");
                    if (ds.Tables[0].Columns.Contains("101-500"))
                        ds.Tables[0].Columns.Remove("101-500");
                    if (ds.Tables[0].Columns.Contains("501-1000"))
                        ds.Tables[0].Columns.Remove("501-1000");
                    if (ds.Tables[0].Columns.Contains("1001-999999"))
                        ds.Tables[0].Columns.Remove("1001-999999");
                    //if (ds.Tables[0].Columns.Contains("Rates"))
                    //    ds.Tables[0].Columns.Remove("Rates");
                    //if (ds.Tables[0].Columns.Contains("RateSNo"))
                    //    ds.Tables[0].Columns.Remove("RateSNo");
                    dsrowsvalue = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                }

            }

            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spRate_GetRateAgentWise"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            var result = new { Result = dsrowsvalue, ID = ds.Tables[0].Columns.Count, ROWSID = ds.Tables[0].Rows.Count };
            return Json(result, JsonRequestBehavior.AllowGet);


        }


        public ActionResult AgentAnalysisReport()
        {
            return View();
        }

        /// <summary>
        /// Get AgentName according Citysno
        /// </summary>
        /// <param name="CitySNo"></param>
        /// <returns></returns>
        public JsonResult getAgentName(string CitySNo)
        {
            DataSet ds = new DataSet();

            Agent agent;
            List<Agent> listagent = new List<Agent>();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",CitySNo)
                                                                    };


            ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetAgentName", Parameters);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                agent = new Agent();
                agent.AgentCode = dr["accountcode"].ToString();
                // agent.AgentName = dr["name"].ToString();
                listagent.Add(agent);
            }

            return Json(listagent, JsonRequestBehavior.AllowGet);
        }

        public void GetAgentAnalysisReport_Toexcel(string careerCode, string Agentsno, string OriginCitySno, string fromdate, string todate, string flightNo, int IsAutoProcess)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;

            try
            {

                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                       new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                          new System.Data.SqlClient.SqlParameter("@AgentSno",Agentsno),
                                                                      new System.Data.SqlClient.SqlParameter("@FlightNo",flightNo),
                                                                      new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@Fromdate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@Todate",todate_result)
                                                                    
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetAgentAnalysisReport", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("AWBSNo");
                dt1.Columns.Remove("SplitBooking");
                var reportname = "AgentAnalysisReport";
                ConvertDSToExcel_BookingProfileReport(dt1, 0, reportname);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetAgentAnalysisReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }

        }
        public ActionResult GetAgentAnalysisReport(string careerCode, string Agentsno, string OriginCitySno, string fromdate, string todate, string flightNo, int IsAutoProcess)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            Agent objagentgent;
            List<Agent> listobjagentgent = new List<Agent>();
            try
            {

                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                       new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                          new System.Data.SqlClient.SqlParameter("@AgentSno",Agentsno),
                                                                      new System.Data.SqlClient.SqlParameter("@FlightNo",flightNo),
                                                                       new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@Fromdate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@Todate",todate_result),
                                                                     new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())


                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetAgentAnalysisReport", Parameters);


                if (ds.Tables.Count > 0)
                {

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        objagentgent = new Agent();
                        objagentgent.AgentName = dr["AgentName"].ToString();
                        objagentgent.AgentCode = dr["AccountCode"].ToString();
                        objagentgent.AWBNo = dr["AWBNo"].ToString();
                        objagentgent.FlightNo = dr["FlightNo"].ToString();
                        objagentgent.FlightDate = dr["FlightDate"].ToString();
                        objagentgent.BoardingPoint = dr["BoardingPoint"].ToString();

                        objagentgent.OffPoint = dr["OffPoint"].ToString();
                        objagentgent.ORIGIN = dr["BoardingPoint"].ToString();

                        objagentgent.DESTINATION = dr["OffPoint"].ToString();

                        objagentgent.ISUPlace = dr["ISUPlace"].ToString();
                        objagentgent.ISUDate = dr["ISUDate"].ToString();
                        objagentgent.ProductName = dr["ProductName"].ToString();
                        objagentgent.SHC = dr["SHC"].ToString();
                        objagentgent.COMMODITYCODE = dr["COMMODITYCODE"].ToString();
                        objagentgent.NATUREOFGOODS = dr["NATUREOFGOODS"].ToString();
                        objagentgent.Pieces = dr["Pieces"].ToString();
                        objagentgent.GrossWeight = dr["GrossWeight"].ToString();
                        objagentgent.Volume = dr["Volume"].ToString();
                        objagentgent.PiecesUplift = dr["PiecesUplift"].ToString();
                        objagentgent.GrossWeightUplift = dr["GrossWeightUplift"].ToString();
                        objagentgent.Volumelift = dr["Volumelift"].ToString();
                        objagentgent.SplitBooking = dr["SplitBooking"].ToString();

                        listobjagentgent.Add(objagentgent);
                    }

                }

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetAgentAnalysisReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = listobjagentgent.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// vIEW Booking Report
        /// </summary>
        /// <returns></returns>
        public ActionResult BookingReport()
        {
            return View();
        }

        /// <summary>
        /// Get booking Report Details
        /// </summary>
        /// <param name="careerCode"></param>
        /// <param name="Agentsno"></param>
        /// <param name="productSno"></param>
        /// <param name="CommoditySno"></param>
        /// <param name="OriginCitySno"></param>
        /// <param name="DestinationCitySno"></param>
        /// <param name="fromdate"></param>
        /// <param name="todate"></param>
        /// <param name="flightNo"></param>
        /// <param name="CheckedStatus"></param>
        /// <param name="OfficeName"></param>
        /// <returns></returns>
        public ActionResult GetBookingReport([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string OfficeName, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string bookingFlightNo, string CheckedStatus,int IsAutoProcess,string ShipmentType)
        {
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;
            //List<BookingProfile> listBookProfile = new List<BookingProfile>();
            IEnumerable<BookingProfile> listBookProfile = null;
            try
            {

                DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Convert.ToInt32(Agentsno)),
                                                                    new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                    new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromdate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",bookingFlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@statusCheck",CheckedStatus),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Convert.ToInt32(OfficeName)),
                                                                    new System.Data.SqlClient.SqlParameter("@ShipmentType",ShipmentType),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetBookingReport", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    listBookProfile = ds.Tables[0].AsEnumerable().Select(e => new BookingProfile
                    {

                        AWBNo = e["AWBNo"].ToString(),
                        BookingType = e["BookingType"].ToString(),
                        AWBDATE = e["AWBDate"].ToString(),
                        FlightDate = e["FlightDate"].ToString(),
                        AccountName = e["AgentName"].ToString(),
                        ORIGIN = e["ORIGIN"].ToString(),
                        DESTINATION = e["DESTINATION"].ToString(),
                        COMMODITYCODE = e["COMMODITYCODE"].ToString(),
                        SHC = e["SHC"].ToString(),
                        ProductName = e["ProductName"].ToString(),
                        FlightNo = e["FlightNo"].ToString(),
                        Pieces = e["Pieces"].ToString(),
                        Vol = e["Vol"].ToString(),
                        VolWt = e["VolWt"].ToString(),
                        GrWt = e["GrWt"].ToString(),
                        ChWt = e["ChWt"].ToString(),
                        Rate = e["Rate"].ToString(),
                        Yield = e["yield"].ToString(),
                        Amount = e["Amount"].ToString(),
                        TotalOtherCharges = e["TotalOtherCharges"].ToString(),
                        OfficeName = e["OfficeName"].ToString()
                    });
                    ds.Dispose();
                }


                return Json(new DataSourceResult
                {
                    Data = ds.Tables.Count > 1 ? listBookProfile.AsQueryable().ToList() : Enumerable.Empty<BookingProfile>().ToList<BookingProfile>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spAwbStockStatus_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }



        //add by akash on 22 aug for booking report in excel
        public void GetBookingReportRecordInExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string careerCode, string OfficeName, string Agentsno, string productSno, string CommoditySno, string OriginCitySno, string DestinationCitySno, string fromdate, string todate, string BookingFlightNo, string CheckedStatus, int IsAutoProcess,string ShipmentType)
        {

            //DateTime fromdt = DateTime.ParseExact(fromdate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
            //var fromdate_result = fromdt.ToString("yyyy-MM-dd");

            //DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

            //var todate_result = todt.ToString("yyyy-MM-dd");
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",careerCode),
                                                                    new System.Data.SqlClient.SqlParameter("@AgentSno",Convert.ToInt32(Agentsno)),
                                                                    new System.Data.SqlClient.SqlParameter("@productSno",Convert.ToInt32(productSno)),
                                                                    new System.Data.SqlClient.SqlParameter("@CommoditySno",Convert.ToInt32(CommoditySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationCitySno",Convert.ToInt32(DestinationCitySno)),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromdate),
                                                                    new System.Data.SqlClient.SqlParameter("@todate",todate),
                                                                    new System.Data.SqlClient.SqlParameter("@FlightNo",BookingFlightNo),
                                                                    new System.Data.SqlClient.SqlParameter("@statusCheck",CheckedStatus),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048574),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo", Convert.ToInt32(OfficeName)),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@ShipmentType",ShipmentType),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };

            System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetBookingReport", Parameters);

            DataTable dt1 = ds.Tables[0];


            ConvertDSToExcel_Success(dt1, 0);


        }
        //add by akash on 22 aug for booking report in excel
        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=BookingReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }


        }

        public void GetBookingProfileReportInExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, string airlineCode, string FlightNo, string Fromdate, string Todate, string OriginSno, string DestinationSno, string AgentSno, string DateType, string OfficeSNo,int IsAutoProcess)
        {
            System.Data.DataSet ds = new DataSet();
            System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                            new System.Data.SqlClient.SqlParameter("@AirlineCarrierCode",airlineCode),
                                                                            new System.Data.SqlClient.SqlParameter("@FlightNo",FlightNo),
                                                                            new System.Data.SqlClient.SqlParameter("@Fromdate",Fromdate),
                                                                            new System.Data.SqlClient.SqlParameter("@Todate",Todate),
                                                                            new System.Data.SqlClient.SqlParameter("@OriginCitySno",Convert.ToInt32(OriginSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@DestinationCitysno",Convert.ToInt32(DestinationSno)),
                                                                            new System.Data.SqlClient.SqlParameter("@AgentSno",AgentSno),
                                                                            new System.Data.SqlClient.SqlParameter("@DateType",DateType),
                                                                             new System.Data.SqlClient.SqlParameter("@OfficeSNo", OfficeSNo),
                                                                             new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                              new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                              new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess),

                                                              };

            try
            {
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_BookingProfile_Report", Parameters);
                DataTable dt1 = ds.Tables[0];
                dt1.Columns.Remove("AWBSNo");
                var reportname = "BookingProfileReport";
                ConvertDSToExcel_BookingProfileReport(dt1, 0, reportname);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_BookingProfile_Report"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
            }
        }

        public void ConvertDSToExcel_BookingProfileReport(DataTable dt, int mode, string reportname)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename='" + reportname + "_" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }


        }

        [HttpGet]
        public ActionResult SearchOtherChargesView()
        {
            return View();
        }

        public string SearchOtherChargesDetails(int AirlineSNo, string Date, int OriginSNo, int DestinationSNo, int ChargeType)
        {
            DataSet ds = new DataSet();
            //    SchedulerateClass objscheduleRate;
            //    List<SchedulerateClass> listschedulerate = new List<SchedulerateClass>();
            //    string dsrowsvalue = string.Empty;
            try
            {
                SqlParameter[] Parameters = {
                                              new SqlParameter("@AirlineSNo", AirlineSNo),
                                              new SqlParameter("@BookingDate", Date) ,
                                              new SqlParameter("@OriginSNo", OriginSNo),
                                              new SqlParameter("@DestinationSNo", DestinationSNo),
                                              new SqlParameter("@ChargeType", ChargeType),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                            };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SendFreight_BookingDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SendFreight_BookingDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        [HttpGet]
        public ActionResult GetDailyProcessingReport()
        {
            return View();
        }
        public ActionResult PostDailyProcessingReport(string date, string topnumer)
        {
            DataSet ds = new DataSet();

            string dsrowsvalue = string.Empty;
            DailyProcessing dailyProcessing;
            List<DailyProcessing> listDailyProcessing = new List<DailyProcessing>();
            try
            {

                DateTime fromdt = DateTime.ParseExact(date, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                //DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                //var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Date ",fromdt),
                                                                      // new System.Data.SqlClient.SqlParameter("@CountOfRows ",Convert.ToInt32(topnumer)),
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_ReportForDailyprocessing", Parameters);

                if (ds.Tables.Count > 0)
                {

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        dailyProcessing = new DailyProcessing();
                        dailyProcessing.Staion = dr["Station"].ToString();
                        dailyProcessing.DomesticDeparture = dr["Domestic Departure"].ToString();
                        dailyProcessing.DomesticArrival = dr["Domestic Arrival"].ToString();
                        dailyProcessing.InternationalDeparture = dr["International Departure"].ToString();
                        dailyProcessing.InternationalArrival = dr["International Arrival"].ToString();
                        dailyProcessing.ManualBooking = dr["Manual Booking"].ToString();
                        dailyProcessing.ElectronicBooking = dr["Electronic Booking"].ToString();
                        dailyProcessing.AWBExecuted = dr["AWB Executed"].ToString();
                        dailyProcessing.FWBRecieved = dr["FWB Received"].ToString();

                        listDailyProcessing.Add(dailyProcessing);
                    }

                }


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_ReportForDailyprocessing"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Json(new DataSourceResult
            {
                Data = listDailyProcessing.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DailyProcessingReport_handlingcharges(string date, string topnumer)
        {
            DataSet ds = new DataSet();

            string dsrowsvalue = string.Empty;
            DailyProcessing_handlingcharegs dailyProcessing;
            List<DailyProcessing_handlingcharegs> listDailyProcessing = new List<DailyProcessing_handlingcharegs>();
            try
            {

                DateTime fromdt = DateTime.ParseExact(date, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //var fromdate_result = fromdt.ToString("yyyy-MM-dd");

                //DateTime todt = DateTime.ParseExact(todate, "dd-MMM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                //var todate_result = todt.ToString("yyyy-MM-dd");
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@Date ",fromdt),
                                                                      // new System.Data.SqlClient.SqlParameter("@CountOfRows ",Convert.ToInt32(topnumer)),
                                                              };



                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spReport_ReportForDailyProcesswithHandlingCharges", Parameters);

                if (ds.Tables.Count > 0)
                {

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        dailyProcessing = new DailyProcessing_handlingcharegs();
                        dailyProcessing.Staion = dr["Station"].ToString();
                        dailyProcessing.Warehouse = dr["Warehouse"].ToString();
                        dailyProcessing.TotalweightHandled = dr["TotalweightHandled"].ToString();
                        dailyProcessing.TotalhandlingCharge_export = dr["TotalhandlingCharge_export"].ToString();
                        dailyProcessing.TotalweightImport = dr["TotalweightImport"].ToString();
                        dailyProcessing.TotalhandlingCharge_import = dr["TotalhandlingCharge_import"].ToString();


                        listDailyProcessing.Add(dailyProcessing);
                    }

                }


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_ReportForDailyProcesswithHandlingCharges"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = listDailyProcessing.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[0].Rows.Count)
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GSACSRReport()
        {
            return View();
        }
        public ActionResult GetGSACSRReport(string careerCode, string Agentsno, string Year, string Month, string FortNightDate, int CurrencySNo, int BookingType, int CSRbtn)
        {
            int RowNo = 0;
            string startDate, endDate;
            StringBuilder strData = new StringBuilder("</br>");
            DateTime stdate, edate;
            DataSet ds = new DataSet();
            string dsrowsvalue = string.Empty;

            List<Agent> listobjagentgent = new List<Agent>();
            try
            {
                string cssClassRight = string.Empty, cssClassLeft = string.Empty, cssClassCenter = string.Empty;


                FortNightDate = ("0" + FortNightDate).Substring(("0" + FortNightDate).Length - 2);

                Month = ("0" + Month).Substring(("0" + Month).Length - 2);

                //startDate = ((FortNightDate == "01") ? "01" : "16") + "-" + Month + "-" +
                //               Year;

                startDate = ((FortNightDate == "01") || (FortNightDate == "03") ? "01" : "16") + "-" + Month + "-" + Year;


                var dateAdd1Month = DateTime.ParseExact("01-" + Month + "-" + Year, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                endDate = ((FortNightDate == "01") ? "15" : dateAdd1Month.AddMonths(1).AddDays(-1).Day.ToString()) + "-" + Month + "-" + Year;


                stdate = DateTime.ParseExact(startDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                edate = DateTime.ParseExact(endDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);


                var fromdate_result = stdate.ToString("yyyy-MM-dd");


                var todate_result = edate.ToString("yyyy-MM-dd");


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@_AirlineCode",careerCode),
                                                                       new System.Data.SqlClient.SqlParameter("@OfficeSNo",Agentsno),
                                                                          new System.Data.SqlClient.SqlParameter("@_StartDate",fromdate_result),
                                                                      new System.Data.SqlClient.SqlParameter("@_EndDate",todate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@_Currency",CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@_BookingType",BookingType)
                                                              };


                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetAWBWiseCSR", Parameters);
                //DataView dvData = new DataView(ds.Tables[0], "OfficeSNo !='" + 0 + "'", "OfficeSNo", DataViewRowState.CurrentRows);
                //DataTable DataView = ds.Tables[0].DefaultView.ToTable(true, "OfficeSNo");

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataView dvGSAData;
                    DataView dvCountDueCarrierData;
                    int srNo = 0, no = 0;
                    string fortNite = (stdate.Day == 1 ? "FIRST F/N" : "SECOND F/N");
                    //if (dvData.ToTable().Rows.Count > 0)
                    //{
                    DataTable dtDataRow = ds.Tables[0].DefaultView.ToTable(true, "OfficeSNo");
                    DataTable dataTable = ds.Tables[1];
                    foreach (DataRow drGSA in dtDataRow.Rows)
                    {
                        no += 1;
                        dvGSAData = new DataView(ds.Tables[0], "OfficeSNo='" + drGSA["OfficeSNo"] + "'", "Name", DataViewRowState.CurrentRows);
                        //<tr><td colspan='29' aling='center'><img src='Images/" + "LOGO" + "_Logo.gif' style='width:100px' /></td></tr>
                        strData.Append("<div class='k-grid-header-wrap' id='grid_bookingprofile' style='width: 100%; height: 100%; overflow-x: scroll; overflow-y: scroll;'><table class='dataTable' ></tr><tr><td colspan='29' style='background-color: #D5E1F0;border:1px solid;font-size: 12px;height: 20px;'><b>CSR</b></td></tr><tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>GSA/CSA</b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["Name"].ToString() + "</td><td rowspan='5' colspan='21' align='center' style='color:#FF0000;background-color:#FFFFFF;border:1px solid black'><b>CSR FOR THE  PERIOD " + fortNite + " " + CultureInfo.CurrentCulture.DateTimeFormat.MonthNames[stdate.Month - 1].ToUpper() + " " + stdate.Year + "</b></td></tr>");
                        strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>BILLING CURRENCY </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["CurrencyCode"].ToString() + "</td></tr>");
                        strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>PERIOD </b></td><td colspan='6' align='left'>: " + stdate.ToString("MMM-dd-yyyy") + " - " + edate.ToString("MMM-dd-yyyy") + "</td></tr>");
                        strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>INVOICE NO </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["CsrNumberprfix"].ToString() + "</td></tr>");
                        strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>AR-CODE </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["ERPCode"].ToString() + "</td></tr>");

                        strData.Append("<tr style='font-weight:bold'><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>AWB Date</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>AWB NO</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>CARRIER</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>ORIGIN</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Transit Point</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Interline Carrier</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>DESTN</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Flight date</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>COMMODITY</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>GR WGT</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>CHG WGT</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Base rate</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Flown Revenue</td><td colspan='" + ((dataTable.Columns.Count == 0 ? 1 : dataTable.Columns.Count) - 2) + "' align='center' style='color:#FFFFFF;background-color:#000000;border:1px solid'><b>Surcharges</b></td><td rowspan='2' style='background-color:#FF0000;border:1px solid'>" + dvGSAData.ToTable().Rows[0]["Carriercode"].ToString() + " TOTAL</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>INTERLINE RATE </td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Europe customs charges</td><td rowspan='2' style='background-color:#FF0000;border:1px solid'>INTERLINE TOTAL</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>NET TOTAL PAYABLE TO " + dvGSAData.ToTable().Rows[0]["Carriercode"].ToString() + "</td></tr>");
                        //strData.Append("<tr style='font-weight:bold'><td style='background-color:#B8CCE4;border:1px solid'>Others</td><td style='background-color:#B8CCE4;border:1px solid'>Transit Fees (MCT transit shipments)</td><td style='background-color:#B8CCE4;border:1px solid'>FW</td><td style='background-color:#B8CCE4;border:1px solid'>IC</td><td style='background-color:#B8CCE4;border:1px solid'>MO</td></tr>");
                        strData.Append("<tr style='font-weight:bold'>");

                        foreach (DataColumn col in dataTable.Columns)
                        {
                            if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
                                strData.Append("<td style='background-color:#B8CCE4;border:1px solid'>" + col.ColumnName + "</td>");
                        }
                        strData.Append("</tr>");
                        foreach (DataRow drData in dvGSAData.ToTable().Rows)
                        {
                            srNo += 1;
                            // set row CSS                       
                            cssClassRight = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
                            cssClassLeft = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
                            cssClassCenter = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
                            //Math.Round(Convert.ToDecimal(drData["GSARate"], 3));
                            strData.Append("<tr><td class='" + cssClassCenter + "'>" + DateTime.Parse(drData["AWBDate"].ToString()).ToString("dd-MM-yyyy") + "</td><td class='" + cssClassCenter + "'>" + drData["AWBNumber"] + "</td><td class='" + cssClassCenter + "'>" + drData["Carriercode"] + "</td><td class='" + cssClassCenter + "'>" + drData["Origin"] + "</td><td class='" + cssClassCenter + "'>" + drData["Transit"] + "</td><td class='" + cssClassCenter + "'>" + drData["ISInterLineCarrier"] + "</td><td class='" + cssClassCenter + "'>" + drData["Destination"] + "</td><td class='" + cssClassCenter + "'>" + DateTime.Parse(drData["FlightDate"].ToString()).ToString("dd-MM-yyyy") + "</td><td class='" + cssClassCenter + "'>" + drData["Commodity"] + "</td><td class='" + cssClassRight + "'>" + drData["GrossWeight"] + "</td><td class='" + cssClassRight + "'>" + drData["ChargeableWeight"] + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["BaseRate"]).ToString() + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FlownRevenue"]).ToString("N") + "</td>");

                            DataView dvDueCarrierData = new DataView(ds.Tables[1], "AWBSNO='" + drData["AWBSNO"] + "'", "AWBSNO", DataViewRowState.CurrentRows);
                            if (dvDueCarrierData.Count > 0)
                            {
                                foreach (DataRow drData1 in dvDueCarrierData.ToTable().Rows)
                                {
                                    foreach (DataColumn col in dataTable.Columns)
                                    {
                                        if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
                                            strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData1[col.ColumnName].ToString() == "" ? "0.00" : drData1[col.ColumnName].ToString()) + "</td>");
                                    }

                                }
                            }
                            else
                            {
                                foreach (DataColumn col in dataTable.Columns)
                                {
                                    if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
                                        strData.Append("<td class='" + cssClassRight + "'>" + "0.00" + "</td>");
                                }
                            }
                            //strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FSC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["SSC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["XRAY"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["CARTINGCHARGES"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["AwbFee"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["VoidCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["OC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["MctCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FW"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["IC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["MO"]).ToString("N") + "</td>");

                            strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["TotalAmlount"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["InterlineRate"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["EuropeCustomCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["InterlineTotal"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(decimal.Parse(drData["NetTotalPaybleAmount"].ToString()) + decimal.Parse(drData["InterlineTotal"].ToString())).ToString("N") + "</td></tr>");
                        }
                        // total
                        strData.Append("<tr style='color:#FFFFFF;background-color:#FF0000;border:1px solid black;font-weight:bold;text-align:right'><td colspan='9' style='border:1px solid black' ><b>TOTAL</b></td><td style='border:1px solid black'>" + dvGSAData.ToTable().Compute("SUM(GrossWeight)", "") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(ChargeableWeight)", "")).ToString("N") + "</td></td><td style='border:1px solid black'></td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FlownRevenue)", "")).ToString("N") + "</td>");

                        //  DataView dvCountDueCarrierData = new DataView(ds.Tables[1], "OfficeSNo='" + drGSA["OfficeSNo"] + "'", "OfficeSNo", DataViewRowState.CurrentRows);
                        dvCountDueCarrierData = new DataView(ds.Tables[1], "", "OfficeSNo", DataViewRowState.CurrentRows);
                        //  dvGSAData = new DataView(ds.Tables[0], "OfficeSNo='" + drGSA["OfficeSNo"] + "'", "Name", DataViewRowState.CurrentRows);
                        foreach (DataColumn col in dataTable.Columns)
                        {
                            if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
                                //strData.Append("<td class='" + cssClassRight + "'>" + drData2[col.ColumnName] + "</td>");
                                strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal((dvCountDueCarrierData.ToTable().Compute("SUM(" + col.ColumnName + ")", "")).ToString() == "" ? "0" : (dvCountDueCarrierData.ToTable().Compute("SUM(" + col.ColumnName + ")", ""))) + "</td>");
                        }


                        //strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FSC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(SSC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(XRAY)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(CARTINGCHARGES)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(AwbFee)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(VoidCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(OC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(MctCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FW)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(IC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(MO)", "")).ToString("N") + "</td>");

                        strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(TotalAmlount)", "")).ToString("N") + "</td><td style='border:1px solid black'></td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(EuropeCustomCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(InterlineTotal)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal((decimal.Parse(dvGSAData.ToTable().Compute("SUM(NetTotalPaybleAmount)", "").ToString()) + decimal.Parse(dvGSAData.ToTable().Compute("SUM(InterlineTotal)", "").ToString()))).ToString("N") + "</td></tr>");

                        strData.Append("</table></div><br/><br/>");
                        RowNo = 1;
                    }
                }
                else
                {
                    strData.Append("Data Not Found.");
                    RowNo = 0;

                }


            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAWBWiseCSRNew"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
            return Json(new DataSourceResult
            {
                Data = strData.ToString(),
                Total = RowNo,
            }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GenerateGSACSRReport(string careerCode, string Agentsno, string Year, string Month, string FortNightDate, int CurrencySNo, int BookingType, int CSRbtn)
        {

            try
            {

                string startDate, endDate;
                StringBuilder strData = new StringBuilder("</br>");
                DateTime stdate, edate;
                DataSet ds = new DataSet();
                string dsrowsvalue = string.Empty;
                string ProcName = string.Empty;

                string cssClassRight = string.Empty, cssClassLeft = string.Empty, cssClassCenter = string.Empty;


                FortNightDate = ("0" + FortNightDate).Substring(("0" + FortNightDate).Length - 2);

                Month = ("0" + Month).Substring(("0" + Month).Length - 2);
                
                startDate = ((FortNightDate == "01" ) || (FortNightDate == "03") ? "01" : "16") + "-" + Month + "-" + Year;               
              
                var dateAdd1Month = DateTime.ParseExact("01-" + Month + "-" + Year, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

                endDate = ((FortNightDate == "01") ? "15" : dateAdd1Month.AddMonths(1).AddDays(-1).Day.ToString()) + "-" + Month + "-" + Year;

                stdate = DateTime.ParseExact(startDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                edate = DateTime.ParseExact(endDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                var fromdate_result = stdate.ToString("yyyy-MM-dd");
                var todate_result = edate.ToString("yyyy-MM-dd");
                string FilePath = "";
                ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting.TryGetValue("EmailAttachmentWServicePath", out FilePath);              
                FilePath = FilePath + "\\csrgenerateRpt" + Convert.ToString(DateTime.Today.ToString("dd-MM-yyyy")).Trim()+".xlsx";


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",careerCode),
                                                                          new System.Data.SqlClient.SqlParameter("@FromDate",fromdate_result),
                                                                      new System.Data.SqlClient.SqlParameter("@ToDate",todate_result),
                                                                    new System.Data.SqlClient.SqlParameter("@bookingType",BookingType),
                                                                     new System.Data.SqlClient.SqlParameter("@OfficeSNo",Agentsno),
                                                                       new System.Data.SqlClient.SqlParameter("@AccountSNo",0),
                                                                         new System.Data.SqlClient.SqlParameter("@CurrencySNo",CurrencySNo)
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "usp_GetCSRReport", Parameters); DataTable dt = ds.Tables[0];
                DataTable dt1 = ds.Tables[1];
                DataTable dt2 = ds.Tables[2];
                //ConvertDSToExcel(dt1,FilePath,dt2);
                 string combinepath = FilePath;
                System.IO.File.WriteAllText(combinepath, dt1.ToString());
                SqlParameter[] commandParameters1 = { new SqlParameter("@ToEmail", dt2.Rows[0]["CSREmailID"].ToString()), new SqlParameter("@FilePath", "csrgenerateRpt" +Convert.ToString(DateTime.Today.ToString("dd-MM-yyyy")).Trim() + ".xlsx") };
                SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "InsertEmailLog_CSR", commandParameters1);

                return Json(new DataSourceResult
                {
                    Data = ds.Tables[0].Rows[0][0].ToString(),
                }, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)//
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","usp_GetCSRReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
        }
        [HttpGet]
        public ActionResult AirlineCurrencyCode(string AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AirlineSNo", AirlineSNo) ,
                                            
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineCurrencyCode", Parameters);


                return Json(new DataSourceResult
                {
                    Data = ds.Tables[0].Rows[0][0].ToString(),
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public void ConvertDSToExcel(DataTable dt1,string filepath, DataTable dt2)
        {
          
        }
       
        public class DailyProcessing
        {
            public string Staion { get; set; }
            public string DomesticDeparture { get; set; }
            public string DomesticArrival { get; set; }
            public string InternationalDeparture { get; set; }
            public string InternationalArrival { get; set; }
            public string ManualBooking { get; set; }
            public string ElectronicBooking { get; set; }
            public string AWBExecuted { get; set; }
            public string FWBRecieved { get; set; }

        }
        public class DailyProcessing_handlingcharegs
        {
            public string Staion { get; set; }
            public string Warehouse { get; set; }
            public string TotalweightHandled { get; set; }
            public string TotalhandlingCharge_export { get; set; }
            public string TotalweightImport { get; set; }
            public string TotalhandlingCharge_import { get; set; }

        }

        public class GarudaBookingProfileReport
        {

            //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
            //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
            //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges
            public string AWBSNo { get; set; }
            public string AWBNo { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public string Dom { get; set; }
            public string IssuePlace { get; set; }
            public string IssueDate { get; set; }
            public string ProductName { get; set; }
            public string SHC { get; set; }
            public string CommodityCode { get; set; }
            public string NatureOfGoods { get; set; }
            public string FlightNo { get; set; }
            public string FlightNo2 { get; set; }
            public string FlightNo3 { get; set; }
            public string FlightDate { get; set; }
            public string BookingDate { get; set; }
            public string AccountName { get; set; }
            public string AccountNo { get; set; }
            public string GrWt { get; set; }
            public string ChWt { get; set; }
            public string CurrCode { get; set; }
            public string GrossCapacity { get; set; }
            public string NetAmount { get; set; }
            public string GrKG { get; set; }
            public string NetKG { get; set; }


            public string GrossFreight { get; set; }
            public string CommissionAmount { get; set; }

            public string DiscountAmount { get; set; }
            public string NetFreight { get; set; }
            public string TotalOtherCharges { get; set; }


            public string RateType { get; set; }

            public string RefferenceCode { get; set; }
            public string Insurance { get; set; }
            public string CCA { get; set; }
            public string OfficeName { get; set; }


        }

        public class BookingProfile
        {
            //AWBSNo	AWBNo	Origin	Destination	IssuePlace	IssueDate	ProductName	
            //SHC	CommodityCode	NatureOfGoods	FlightNo	FlightDate	BookingDate	
            //AccountName	AccountNo	GrWt	ChWt	CurrCode	GrossCapacity	NetAmount	GrKG	NetKG	TotalOtherCharges

            public string AWBNo { get; set; }
            public string BookingType { get; set; }
            public string AWBDATE { get; set; }
            public string ORIGIN { get; set; }
            public string DESTINATION { get; set; }
            public string ISUPlace { get; set; }
            public string ISUDate { get; set; }
            public string ProductName { get; set; }
            public string SHC { get; set; }
            public string COMMODITYCODE { get; set; }
            public string NATUREOFGOODS { get; set; }
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }
            public string BookingDate { get; set; }
            public string NAME { get; set; }
            public string IATACCONTNO { get; set; }
            public string TotalGrossWeight { get; set; }
            public string TotalChargeableWeight { get; set; }
            public string CurrencyCode { get; set; }
            public string GrossWeight { get; set; }
            public string NET { get; set; }
            public string NETKG { get; set; }
            public string AccountName { get; set; }
            public string Rate { get; set; }
            public string Pieces { get; set; }


            public string Vol { get; set; }
            public string VolWt { get; set; }

            public string GrWt { get; set; }
            public string ChWt { get; set; }
            public string Amount { get; set; }
            public string TotalOtherCharges { get; set; }

            public string Yield { get; set; }
            public string OfficeName { get; set; }
        }

        public class Agent
        {
            public string AgentName { get; set; }
            public string AgentCode { get; set; }
            public string AWBNo { get; set; }
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }
            public string BoardingPoint { get; set; }

            public string OffPoint { get; set; }
            public string ORIGIN { get; set; }
            public string DESTINATION { get; set; }
            public string ISUPlace { get; set; }
            public string ISUDate { get; set; }
            public string ProductName { get; set; }
            public string SHC { get; set; }
            public string COMMODITYCODE { get; set; }
            public string NATUREOFGOODS { get; set; }
            public string Pieces { get; set; }
            public string GrossWeight { get; set; }
            public string Volume { get; set; }
            public string PiecesUplift { get; set; }
            public string GrossWeightUplift { get; set; }
            public string Volumelift { get; set; }

            public string SplitBooking { get; set; }

        }
        public class Allotment_
        {
            public string FlightNo { get; set; }
            public string Date { get; set; }

            public string AircraftType { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public int Capacity { get; set; }
            public string Grosswight { get; set; }
            public string Volume { get; set; }
            public string Hard { get; set; }
            public string Hardvolume { get; set; }
            public string hardUtilisedvolume { get; set; }
            public string Utilised { get; set; }
            public string Soft { get; set; }
            public string SoftUtilised { get; set; }
            public string Fixed { get; set; }
            public string FixedUtilised { get; set; }
            public string Open { get; set; }
            public string OpenUtilised { get; set; }
            public string Total { get; set; }
            public string TotalUtilised { get; set; }

            public string softvolume { get; set; }
            public string softUtilisedvolume { get; set; }
            public string openvolume { get; set; }
            public string openUtilisedvolume { get; set; }
            public string fixedvolume { get; set; }
            public string fixedUtilisedvolume { get; set; }
            public string Totalvolume { get; set; }
            public string TotalUtilisedvolume { get; set; }
            public int Dailyflightsno { get; set; }



            public string AccountName { get; set; }
            public string AWBNO { get; set; }
            public string AWBPCS { get; set; }
            public string AWBGRS { get; set; }
            public string AWBVOLUME { get; set; }
            public string AllocationType { get; set; }
            public string Allocationcode { get; set; }
            public int Accountsno { get; set; }

        }
        public class SchedulerateClass
        {

            public string Airlincode { get; set; }
            public string origincity { get; set; }
            public string destinationCity { get; set; }
            public string Agentname { get; set; }
            public string Products { get; set; }
            public string Commodity { get; set; }
            public string Flight { get; set; }
            public string RateTypeName { get; set; }
            public string Minium { get; set; }
            public string Normal { get; set; }
            public string Plus150 { get; set; }
            public string Plus250 { get; set; }
            public string Plus350 { get; set; }
            public string Plus45 { get; set; }
            public string Plus500 { get; set; }
            public string Plus90 { get; set; }

        }

        public class SceduleFlightClass
        {
            public string FlightNo { get; set; }
            public string FlightOrigin { get; set; }
            public string FlightDestination { get; set; }
            public string FlightDate { get; set; }
            public string ETD { get; set; }
            public string ETDGMT { get; set; }
            // public string ETA { get; set; }
            // public string ETAGMT { get; set; }
            public string Mode { get; set; }
            public string CargoClassification { get; set; }
            public string AircraftDescription { get; set; }
            public string RoutePath { get; set; }
            public int sno { get; set; }
            //public string GrossWeight { get; set; }
            //public string Volume { get; set; }
            //public string UsedGrossWeight { get; set; }
            //public string UsedVolume { get; set; }
            //public string RemainingGrossWeight { get; set; }
            //public string RemainingVolume { get; set; }
        }
        public class Routepath
        {
            public int id { get; set; }
            public string ORIGINMAIN { get; set; }
        }
        public class MergescheduleFlightclass
        {
            List<SceduleFlightClass> listItem { get; set; }
            List<Routepath> listItem2 { get; set; }
        }

        public class GSACSRModal
        {
            public string AWBDate { get; set; }
            public string GSACode { get; set; }
            public string GSAName { get; set; }
            public string currency { get; set; }
            public string FreightType { get; set; }
            public string Carriercode { get; set; }

            public string AWBNo { get; set; }
            public string BookingType { get; set; }
            public string Origin { get; set; }
            public string TransitStation { get; set; }
            public string Interline { get; set; }
            public string Destination { get; set; }
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }
            public string GrossWt { get; set; }
            public string ChargeableWt { get; set; }
            public string AWBRate { get; set; }
            public string SellingRate { get; set; }
            public string Revenue { get; set; }

            public string FSC { get; set; }
            public string MYC { get; set; }
            public string SSC { get; set; }
            public string OC { get; set; }
            public string XRAY { get; set; }
            public string FW { get; set; }
            public int CSRbtn { get; set; }


        }
    }
}