using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlashCargoWebApps.App_Start;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel.Web;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml.Linq;
using ClosedXML.Excel;
using System.IO;
using System.Text;
using System.Web.UI;

namespace CargoFlashCargoWebApps.Controllers
{
    public class ScheduleController : Controller
    {
        //
        // GET: /Schedule/
        public ActionResult ViewEditFlight()
        {
            return View();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public string GetAirports()
        {
            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetUserAirports", Parameters);
            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
        }

        [HttpPost]
        public string SearchFlightDetails(ScheduleFlightSearchRequest model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request)
        {
            if (request == null)
                request = new Kendo.Mvc.UI.DataSourceRequest();
            //string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            //string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<object>(filter);

            int? UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])) == null ? 0 : ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo);

            if (UserSNo > 0)
            {

                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                  new System.Data.SqlClient.SqlParameter("@Date", model.FlightDate),
                                                                  new System.Data.SqlClient.SqlParameter("@FlightNo", model.FlightNo),
                                                                  new System.Data.SqlClient.SqlParameter("@Origin", model.Origin),
                                                                  new System.Data.SqlClient.SqlParameter("@Destination", model.Destination),
                                                                  new System.Data.SqlClient.SqlParameter("@ACRegYes", model.ACRegYes),
                                                                  new System.Data.SqlClient.SqlParameter("@ACRegNo", model.ACRegNo),
                                                                  new System.Data.SqlClient.SqlParameter("@AvlCap", model.AvlCap),
                                                                  new System.Data.SqlClient.SqlParameter("@UserSNo", UserSNo),
                                                                  //new System.Data.SqlClient.SqlParameter("@FlightDate", model.FlightDate),                                                                  
                                                                  new System.Data.SqlClient.SqlParameter("@PageNo", request.Page),
                                                                  new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize)
                                                                  //new System.Data.SqlClient.SqlParameter("@WhereCondition", filters), 
                                                                  //new System.Data.SqlClient.SqlParameter("@OrderBy", sorts) 
                                                              };
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spSchedule_GetViewEditFlightDetail", Parameters);
                //return Json(new { Data = CargoFlashCargoWebApps.Common.Global.DStoJSON(ds, 0), Total = ds.Tables[1].Rows[0][0].ToString() });
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            else
                return WebAppHelper.GetLoginPage();
        }

        [HttpPost]
        public JsonResult CreateAllotment(AllotmentGrid model)
        {

            return Json(model, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public string GetAllotment(List<int> dailyFlightSNo)
        {

            DailyFlightAllotment viewEditFlight = new DailyFlightAllotment();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", string.Join(",", dailyFlightSNo.ToArray())) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_GetAllotment", Parameters);
            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);

        }


        [HttpPost]
        public string GetAirCraftCapacity(int ACSNo, int DFSNo, string ACReg)
        {
            DailyFlightAllotment viewEditFlight = new DailyFlightAllotment();
            SqlParameter[] Parameters = { new SqlParameter("@AirCraftSno", ACSNo), new SqlParameter("@DFSNo", DFSNo), new SqlParameter("@ACReg", ACReg) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_AirCraftCapacity", Parameters);
            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);

        }


        [HttpPost]
        public string GetHistory(int SNo, string HistoryType)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", SNo),
                                          new SqlParameter("@HistoryType", HistoryType),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_GetHistory", Parameters);

            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
        }


        [HttpPost]
        public string UpdateFlightDetils(ScheduleUpdateFlight model, List<SectorCapacityDistribution> ModelSCD)
        {
            try
            {
                if (model.LegGrid == null)
                    model.LegGrid = new List<LegGridModel>();
                if (ModelSCD == null)
                    ModelSCD = new List<SectorCapacityDistribution>();

                //model.LegGrid.ForEach(s =>
                //{
                //    if (!s.ETD.Contains(":"))
                //    {
                //        s.ETD = s.ETD.Insert(2, ":");
                //    }
                //    if (!s.ETA.Contains(":"))
                //    {
                //        s.ETA = s.ETA.Insert(2, ":");
                //    }
                //});


                DataTable legGrid = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(model.LegGrid, "");
                DataTable SecCapGrid = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(ModelSCD, "");
                //DataTable dtItineraryDetails = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(itineraryDetails, "");


                SqlParameter paramLegGrid = new SqlParameter();
                paramLegGrid.ParameterName = "@LegGrid";
                paramLegGrid.SqlDbType = System.Data.SqlDbType.Structured;
                paramLegGrid.Value = legGrid;

                SqlParameter[] Parameters = {
                                                new SqlParameter("@Date", model.FlightDate),
                                                new SqlParameter("@FlightNo", model.FlightNo),
                                                paramLegGrid,
                                                new SqlParameter("@SecCapDist",System.Data.SqlDbType.Structured) {Value = SecCapGrid },
                                                new SqlParameter("@UpdatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                new SqlParameter("@Remarks", model.Remarks)
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSchedule_UpdateFlightDetail", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    return Convert.ToString(ds.Tables[0].Rows[0][0]);
                else
                    return "Failed";


            }
            catch (Exception ex)
            {
                return "Failed";
                //throw ex;
            }

        }

        [HttpPost]
        public string UpdateFilghtBookingOpenClose(List<SegmentFilghtBookingOpenClose> Model, string Remarks)
        {
            try
            {
                if (Model == null)
                    Model = new List<SegmentFilghtBookingOpenClose>();

                DataTable Grid = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(Model, "");

                SqlParameter paramLegGrid = new SqlParameter();
                paramLegGrid.ParameterName = "@SegmentDetails";
                paramLegGrid.SqlDbType = System.Data.SqlDbType.Structured;
                paramLegGrid.Value = Grid;

                SqlParameter[] Parameters = {
                                                new SqlParameter("@SegmentDetails",System.Data.SqlDbType.Structured) {Value = Grid },
                                                new SqlParameter("@UpdatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                                new SqlParameter("@Remarks", Remarks)
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSchedule_UpdateFlightBookingOpenClose", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    return Convert.ToString(ds.Tables[0].Rows[0][0]);
                else
                    return "Failed";


            }
            catch (Exception ex)
            {
                return "Failed";
                //throw ex;
            }

        }


        [HttpPost]
        public string ValidateAllotment(List<AllotmentMaster> AllotmentMaster)
        {

            try
            {

                DataTable AllotmentMasterDT = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(AllotmentMaster, "");

                SqlParameter[] Parameters = {
                                            new SqlParameter("@Allotment",SqlDbType.Structured){Value=AllotmentMasterDT},
                                            new SqlParameter("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spAllotment_Validate", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return "{\"Table0\":[{\"Error\":\"" + ex.Message.ToString() + "\"}],\"Table1\":[]}";
            }
        }

        [HttpPost]
        public string SaveAllotment(List<AllotmentMaster> AllotmentMaster, List<AllotmentValidGrid> AllotmentValidGrid)
        {

            try
            {

                DataTable AllotmentMasterDT = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(AllotmentMaster, "");
                DataTable AllotmentGridDT = new DataTable();
                if (AllotmentValidGrid != null)
                    AllotmentGridDT = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(AllotmentValidGrid, "");
                else
                {
                    AllotmentGridDT.Columns.Add("IsAllot");
                    AllotmentGridDT.Columns.Add("DailyFlightSNo");
                    AllotmentGridDT.Columns.Add("NewGrossWt");
                    AllotmentGridDT.Columns.Add("NewVolWt");
                    AllotmentGridDT.Columns.Add("IsValidationFaild");
                    AllotmentGridDT.Columns.Add("IsValidWT");
                }

                SqlParameter[] Parameters = {
                                            new SqlParameter("@Allotment",SqlDbType.Structured){Value=AllotmentMasterDT},
                                            new SqlParameter("@AllotmentGrid",SqlDbType.Structured){Value=AllotmentGridDT},
                                            new SqlParameter("@CreatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spAllotment_Create", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
                //throw ex;
            }
        }


        #region Re-Route Flight

        [HttpPost]
        public string GetSkipRouteShip(List<int> dfsno, bool isExpand, string uldSNo, DateTime? From, DateTime? To)
        {
            if (dfsno == null)
                dfsno = new List<int>();

            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", string.Join(",",dfsno.ToArray())),
                                          new SqlParameter("@IsExpand", isExpand),
                                          new SqlParameter("@ULDSNo", uldSNo),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                                          new SqlParameter("@From", From),
                                          new SqlParameter("@To", To),
            };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_GetSkipRouteShipments", Parameters);

            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);

        }

        [HttpPost]
        public string UpdateFlightRoute(List<BulkShipments> BulkShipments, List<BulkShipments> ULDShipments, List<RoutesDetails> RoutesDetails, List<string> SkipRoutes, List<Int64> ActiveRoutes, List<string> Routes, string Remarks, string FlightNo, DateTime? From, DateTime? To)
        {
            try
            {



                if (BulkShipments == null)
                    BulkShipments = new List<CargoFlash.Cargo.Model.Schedule.BulkShipments>();
                if (ULDShipments == null)
                    ULDShipments = new List<CargoFlash.Cargo.Model.Schedule.BulkShipments>();
                if (RoutesDetails == null)
                    RoutesDetails = new List<CargoFlash.Cargo.Model.Schedule.RoutesDetails>();

                RoutesDetails.ForEach(s =>
                {
                    if (!s.ETD.Contains(":"))
                    {
                        s.ETD = s.ETD.Insert(2, ":");
                    }
                    if (!s.ETA.Contains(":"))
                    {
                        s.ETA = s.ETA.Insert(2, ":");
                    }
                }

               );

                DataTable dtBulkShiments = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(BulkShipments, "");
                DataTable dtULDShipments = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(ULDShipments, "");
                DataTable dtRoutesDetails = CargoFlash.SoftwareFactory.Data.CollectionHelper.ConvertTo(RoutesDetails, "");

                SqlParameter BulkShip = new SqlParameter();
                BulkShip.ParameterName = "@BulkShiments";
                BulkShip.SqlDbType = System.Data.SqlDbType.Structured;
                BulkShip.Value = dtBulkShiments;

                SqlParameter ULDShip = new SqlParameter();
                ULDShip.ParameterName = "@ULDkShiments";
                ULDShip.SqlDbType = System.Data.SqlDbType.Structured;
                ULDShip.Value = dtULDShipments;


                SqlParameter routeDetails = new SqlParameter();
                routeDetails.ParameterName = "@RoutesDetails";
                routeDetails.SqlDbType = System.Data.SqlDbType.Structured;
                routeDetails.Value = dtRoutesDetails;

                if (SkipRoutes == null)
                    SkipRoutes = new List<string>();
                if (ActiveRoutes == null)
                    ActiveRoutes = new List<Int64>();

                SqlParameter[] Parameters = {
                                          new SqlParameter("@SkipRoutes", string.Join(",",SkipRoutes.ToArray())),
                                          new SqlParameter("@ActiveRoutes", string.Join(",",ActiveRoutes.ToArray())),
                                          new SqlParameter("@Routes", string.Join("-",Routes.ToArray())),
                                          BulkShip,
                                          ULDShip,
                                          routeDetails,
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                                          new SqlParameter("@Remarks", Remarks),
                                          new SqlParameter("@FlightNo", FlightNo),
                                          new SqlParameter("@From", From),
                                          new SqlParameter("@To", To)

                };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_UpdateRoutes", Parameters);

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    return Convert.ToString(ds.Tables[0].Rows[0][0]);
                else
                    return "Failed";
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        #endregion Re-Route Flight


        [HttpPost]
        public string ViewHistory(ViewHistory ViewHistory)
        {
            if (ViewHistory.dfSNo == null)
                ViewHistory.dfSNo = new List<Int64>();

            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightsSNo",  string.Join(",",ViewHistory.dfSNo.ToArray())),
                                          new SqlParameter("@FlightNo",  ViewHistory.FlightNo),
                                          new SqlParameter("@FlightDate", ViewHistory.FlightDate),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spFC_GetHistory", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public void ExportToExcel(string dfSNo, string FlightNo, string FlightDate)
        {
            try
            {

                //if (ViewHistory.dfSNo == null)
                //    ViewHistory.dfSNo = new List<Int64>();

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightsSNo",  dfSNo),
                                          new SqlParameter("@FlightNo",  FlightNo),
                                          new SqlParameter("@FlightDate", FlightDate),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};
                //System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "GetMarineCargoInsuranceReportExcel_New", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FlightHistory_ExporttoExcel", Parameters);

                ds.Dispose();
                Response.Clear();
                Response.AddHeader("content-disposition", "attachment;   filename=FlightHistory_Operation_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls");
                Response.Charset = "";
                Response.ContentType = "application/vnd.xls";
                System.IO.StringWriter stringWrite = new System.IO.StringWriter();
                System.Web.UI.HtmlTextWriter htmlWrite = new HtmlTextWriter(stringWrite);
                StringBuilder sbStrAll = new StringBuilder();
                StringBuilder sbStr0 = new StringBuilder();
                StringBuilder sbStr = new StringBuilder();
                StringBuilder sbStr1 = new StringBuilder();
                StringBuilder sbStr2 = new StringBuilder();
                StringBuilder sbStrcount = new StringBuilder();
                StringBuilder sbStrcount1 = new StringBuilder();
                StringBuilder sbStrcount2 = new StringBuilder();
                int count = 0;
                int count1 = 0;
                int count2 = 0;

                sbStr.Append("<table cellpadding = '0' cellspacing = '0' border = '1px' width = '100%' ><tr bgcolor='#33F6FF' style='font-size:20px; color:black'><td  >FlightDate</td><td  >" + ds.Tables[0].Rows[0]["FlightDate"].ToString()+ "</td><td>FlightNo.</td><td  >" + ds.Tables[0].Rows[0]["FlightNo"].ToString().Trim() + "</td></tr>");
                sbStr.Append("<tr bgcolor='#daecf4';><td style ='font-size:25px;color:#80391e; font-weight:bold;'>Operation</td> </tr> ");
                     // sbStr.Append("<table cellpadding = '0' cellspacing = '0' border = '0' width = '500px' ><tr>");
                     sbStr.Append("<tr bgcolor='#ebb734' style='font-size:20px'><td>Flight Stage</td><td>Flight Date</td><td>AWB Count </td><td>ULD Count </td><td>Message Type</td><td>ETD</td><td>ETA</td><td>Gross Wt.</td><td>Volume Wt.</td><td>CBM</td><td>Event Details</td><td>Event Date</td><td>Event Time</td><td>Updated By</ td></tr>");

                if (ds.Tables[2].Rows.Count > 0)
                {

                    for (int i = 0; i < ds.Tables[2].Rows.Count; i++)
                    {
                       
                        if (ds.Tables[2].Rows[i]["Sector"].ToString() == ds.Tables[1].Rows[0]["Sector"].ToString())
                        {
                            count = count + 1;
                            //sbStr.Append("<tr><td colspan=14 width=100%>Flight Station: " + ds.Tables[2].Rows[i]["Sector"].ToString() + " (Total: " + count + ")</td></tr>");
                            sbStr0.Append("<tr>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["StageName"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["FlightDate"].ToString() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["WaybillCount"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["ULDCount"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["MessageType"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["ETD"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["ETA"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["GrossWeight"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["VolumeWeight"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["CBM"].ToString().Trim() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["EventDetails"].ToString() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["EventDateTime"].ToString() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["EventTime"].ToString() + "</td>");
                            sbStr0.Append("<td>" + ds.Tables[2].Rows[i]["UserName"].ToString().Trim() + "</td>");
                            sbStr0.Append("</tr>");
                        }
                        else if (ds.Tables[1].Rows.Count > 1)
                        {
                            if (ds.Tables[2].Rows[i]["Sector"].ToString() == ds.Tables[1].Rows[1]["Sector"].ToString())
                            {
                                count1 = count1 + 1;
                                //sbStr1.Append("<tr><td colspan=14 width=100%>Flight Station: "+ ds.Tables[2].Rows[i]["Sector"].ToString() + " (Total: "+ count1 + ")</td></tr>");
                                sbStr1.Append("<tr>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["StageName"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["FlightDate"].ToString() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["WaybillCount"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["ULDCount"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["MessageType"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["ETD"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["ETA"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["GrossWeight"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["VolumeWeight"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["CBM"].ToString().Trim() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["EventDetails"].ToString() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["EventDateTime"].ToString() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["EventTime"].ToString() + "</td>");
                                sbStr1.Append("<td>" + ds.Tables[2].Rows[i]["UserName"].ToString().Trim() + "</td>");
                                sbStr1.Append("</tr>");
                            }
                            else if (ds.Tables[1].Rows.Count > 2)
                            {
                                if (ds.Tables[2].Rows[i]["Sector"].ToString() == ds.Tables[1].Rows[2]["Sector"].ToString())
                                {
                                    count2 = count2 + 1;
                                    //sbStr2.Append("<tr><td colspan=14 width=100%>Flight Station: " + ds.Tables[2].Rows[i]["Sector"].ToString() + " (Total: " + count2 + ")</td></tr>");
                                    sbStr2.Append("<tr>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["StageName"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["FlightDate"].ToString() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["WaybillCount"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["ULDCount"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["MessageType"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["ETD"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["ETA"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["GrossWeight"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["VolumeWeight"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["CBM"].ToString().Trim() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["EventDetails"].ToString() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["EventDateTime"].ToString() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["EventTime"].ToString() + "</td>");
                                    sbStr2.Append("<td>" + ds.Tables[2].Rows[i]["UserName"].ToString().Trim() + "</td>");
                                    sbStr2.Append("</tr>");
                                }
                            }
                        }


                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        sbStrcount.Append("<tr  style='font-size:15px'><td style ='color:#80391e;font-weight:bold;'  colspan=14 width=100%>Flight Station: " + ds.Tables[1].Rows[0]["Sector"].ToString() + " (Total: " + count + ")</td></tr>");
                    }
                    if (ds.Tables[1].Rows.Count > 1)
                    {
                        sbStrcount1.Append("<tr  style='font-size:15px'><td style ='color:#80391e;font-weight:bold;' colspan=14 width=100%>Flight Station: " + ds.Tables[1].Rows[1]["Sector"].ToString() + " (Total: " + count1 + ")</td></tr>");
                    }
                    if (ds.Tables[1].Rows.Count > 2)
                    {
                        sbStrcount2.Append("<tr  style='font-size:15px'><td style ='color:#80391e;font-weight:bold;' colspan=14 width=100%>Flight Station: " + ds.Tables[1].Rows[2]["Sector"].ToString() + " (Total: " + count2 + ")</td></tr>");
                    }

                }
                sbStrAll.Append(sbStr.ToString()).Append(sbStrcount.ToString()).Append(sbStr0.ToString()).Append(sbStrcount1.ToString()).Append(sbStr1.ToString()).Append(sbStrcount2.ToString()).Append(sbStr2.ToString());
                sbStrAll.Append("</table>");
                sbStr.Append(stringWrite.ToString());
                Response.Output.Write(sbStrAll);
                Response.Flush();
                Response.End();
                //DataTable dt1 = ds.Tables[0];
                // ConvertDSToExcel_Success(sbStr, 0);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                //return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                //{
                //    Data = FlightHistoryList.AsQueryable().ToList(),
                //}, JsonRequestBehavior.AllowGet);

                //HttpContext.Response.AddHeader("content-disposition", "attachment; filename=" + sFileName);
                //this.Response.ContentType = "application/vnd.ms-excel";
                //byte[] buffer = System.Text.Encoding.UTF8.GetBytes(sb.ToString());
                //return File(buffer, "application/vnd.ms-excel");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void ConvertDSToExcel_Success(StringBuilder sbStr, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                //wb.Worksheets.Add(ds.Tables[0]);

                wb.Worksheets.Add(sbStr.ToString());
                // wb.Worksheets.Add(ds.Tables[2]);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=FlightHistory_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }

        [HttpPost]
        public string ShipmentInfo(Int64 SNo, int Type)
        {

            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo",  SNo),
                                           new SqlParameter("@Type", Type),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spFC_FlightShipments", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        [HttpPost]
        public string ShipmentCapacityInfo(Int64 DailyFlightSNo, string AWBNo)
        {

            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo",  DailyFlightSNo),
                                          new SqlParameter("@AWBNo",  AWBNo),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())};

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spFC_FlightShipmentCapacityInfo", Parameters);

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        [HttpPost]
        public string CheckFlightDateRange(FlightInitDetails model)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@FlightNo",model.FlightNo),
                                                new SqlParameter("@ValidFrom", model.ValidFrom),
                                                new SqlParameter("@ValidTo", model.ValidTo),
                                                new SqlParameter("@Origin", model.Origin),
                                                new SqlParameter("@Destination", model.Destination)
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSchedule_CheckFlightDateRange", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    return Convert.ToString(ds.Tables[0].Rows[0][0]);
                else
                    return "Failed";
            }
            catch (Exception ex)
            {
                return "Failed";
            }

        }

        [HttpPost]
        public string GetEDIMessageDetails(string MesageType, Int64 MesageSNo)
        {


            SqlParameter[] Parameters = { new SqlParameter("@MesageType", MesageType),
                                          new SqlParameter("@MesageSNo", MesageSNo),
                                          new SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString())
            };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSchedule_GetEDIMessageDetails", Parameters);

            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
        }

        [HttpPost]
        public ActionResult flightSchedule(FlightSchedule flightSchedule)
        {
            string MSG = "";
            try
            {
                if (flightSchedule == null)
                    flightSchedule = new FlightSchedule();

                //var jsonSerialiser = new JavaScriptSerializer();
                //var json = jsonSerialiser.Serialize(flightSchedule);
                //Newtonsoft.Json.JsonConverter

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(flightSchedule);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@JSONData",json),
                                            new SqlParameter("@EnteredBy","ISA")
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSchedule_ClientUpdateSchedule", Parameters);


                Dictionary<string, ServiceResponse> myDictionary = new Dictionary<string, ServiceResponse>();
                if (ds.Tables[0].Rows.Count > 0)
                {
                    ServiceResponse serviceResponse = new ServiceResponse();
                    List<FlightResponse> successResponse = new List<FlightResponse>();

                    if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[1].Rows)
                            successResponse.Add(new FlightResponse() { Flightno = dr["FlightNo"].ToString(), FlightDate = DateTime.Parse(dr["FlightDate"].ToString()), Origin = dr["Origin"].ToString(), Destination = dr["Destination"].ToString() });

                        serviceResponse.flightResponse = successResponse.ToList<FlightResponse>();
                    }

                    myDictionary.Add(ds.Tables[0].Rows[0][0].ToString(), serviceResponse);
                }
                else
                {
                    myDictionary.Add("Failed", null);

                }
                var myJson = JsonConvert.SerializeObject(myDictionary);
                var myXml = JsonConvert.DeserializeXNode(myJson.ToString(), "KeyValuePairOfstringServiceResponsevj2aXkqx");

                MSG = myXml.ToString(); //ds.Tables[0].Rows[0][0].ToString();

                return this.Content(MSG, "text/xml");
            }
            catch (Exception ex)
            {
                throw ex;
                // return new KeyValuePair<string, ServiceResponse>(ex.Message, null);
            }
        }
    }
}