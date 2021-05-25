using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
using System.ServiceModel.Web;
namespace CargoFlash.Cargo.DataService.Schedule
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ScheduleTransService : SignatureAuthenticate, IScheduleTransService
    {
        /// <summary>
        /// Retrieve ScheduleTrans infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <param name="page">page is the page number</param>
        /// <param name="pageSize">pageSize is the per page record</param>
        /// <param name="whereCondition">Where Condition according to which touple is to be retrieved</param>
        /// <param name="sort">Order by</param>
        /// <returns>total rows and record</returns>
        //public KeyValuePair<string, List<ScheduleTrans>> GetScheduleTransRecord(int recid, int pageNo, int pageSize, GetScheduleTrans model, string sort)
        //{
        //    try { 
        //    ScheduleTrans CommoditySubGroup = new ScheduleTrans();
        //    SqlParameter[] Parameters = { new SqlParameter("@ScheduleSNo", model.RecordID), new SqlParameter("@PageNo", pageNo), new SqlParameter("@PageSize", pageSize), new SqlParameter("@PageType", model.PageType), new SqlParameter("@OrderBy", sort) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListScheduleTrans", Parameters);
        //    // return resultData.Tables[0].AsEnumerable().ToList();
        //    var ScheduleTransList = ds.Tables[0].AsEnumerable().Select(e => new ScheduleTrans
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        ScheduleSNo = Convert.ToInt32(e["ScheduleSNo"]),
        //        ScheduleType = Convert.ToInt32(e["ScheduleType"]),
        //        FlightNo = e["FlightNo"].ToString(),
        //        HdnOrigin = Convert.ToInt32(e["OriginAirportSNo"]),
        //        Origin = e["OriginAirportCode"].ToString(),
        //        ETD = e["ETD"].ToString().Remove(2, 1),
        //        HdnDestination = Convert.ToInt32(e["DestinationAirportSNo"]),
        //        Destination = e["DestinationAirportCode"].ToString(),
        //        ETA = e["ETA"].ToString().Remove(2, 1),
        //        IsDayLightSaving = Convert.ToBoolean(e["IsDayLightSaving"]),
        //        DayLightSaving = e["IsDayLightSaving"].ToString().Contains("True") ? "YES" : "NO",
        //        DayDifference = Convert.ToInt32(e["DayDifference"]),
        //        SDDifference = Convert.ToInt32(e["SDDifference"]),
        //        StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
        //        EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy"),
        //        HdnAirCraft = Convert.ToInt32(e["AirCraftSNo"]),
        //        AirCraft = e["AirCraft"].ToString(),
        //        HdnFlightType = Convert.ToInt32(e["FlightTypeSNo"]),
        //        FlightType = e["FlightType"].ToString(),
        //        AllocatedGrossWeight = Convert.ToDecimal(e["AllocatedGrossWeight"]),
        //        AllocatedVolumeWeight = Convert.ToDecimal(e["AllocatedVolumeWeight"]),
        //        MaxGrossPerPcs = Convert.ToInt32(e["MaxGrossPerPcs"]),
        //        MaxVolumePerPcs = Convert.ToDecimal(e["MaxVolumePerPcs"]),
        //        AllDays = Convert.ToBoolean(e["AllDays"]),
        //        lblAllDays = "Days",
        //        AllDay = e["AllDays"].ToString() == "1" ? "YES" : "NO",
        //        Day1 = Convert.ToBoolean(e["Day1"]),
        //        lblDay1 = "Sun",
        //        Sun = e["Day1"].ToString().Contains("True") ? "YES" : "NO",
        //        Day2 = Convert.ToBoolean(e["Day2"]),
        //        lblDay2 = "Mon",
        //        Mon = e["Day2"].ToString().Contains("True") ? "YES" : "NO",
        //        Day3 = Convert.ToBoolean(e["Day3"]),
        //        lblDay3 = "Tue",
        //        Tue = e["Day3"].ToString().Contains("True") ? "YES" : "NO",
        //        Day4 = Convert.ToBoolean(e["Day4"]),
        //        lblDay4 = "Wed",
        //        Wed = e["Day4"].ToString().Contains("True") ? "YES" : "NO",
        //        Day5 = Convert.ToBoolean(e["Day5"]),
        //        lblDay5 = "Thu",
        //        Thu = e["Day5"].ToString().Contains("True") ? "YES" : "NO",
        //        Day6 = Convert.ToBoolean(e["Day6"]),
        //        lblDay6 = "Fri",
        //        Fri = e["Day6"].ToString().Contains("True") ? "YES" : "NO",
        //        Day7 = Convert.ToBoolean(e["Day7"]),
        //        lblDay7 = "Sat",
        //        Sat = e["Day7"].ToString().Contains("True") ? "YES" : "NO",
        //        IsActive = Convert.ToBoolean(e["IsActive"]),
        //        lblIsActive = "Active",
        //        Active = e["IsActive"].ToString().Contains("True") ? "YES" : "NO",
        //        IsFirstLeg = Convert.ToBoolean(e["IsFirstLeg"]),
        //        lblIsFirstLeg = "First Leg",
        //        FirstLeg = e["IsFirstLeg"].ToString().Contains("True") ? "YES" : "NO",
        //        IsCAO = Convert.ToBoolean(e["IsCAO"]),
        //        lblIsCAO = "Freighter",
        //        CAO = e["IsCAO"].ToString().Contains("True") ? "YES" : "NO",
        //        NoOfStop = Convert.ToInt32(e["NoOfStop"]),
        //        lblNoOfStop = "Stop",
        //        Routing = e["Routing"].ToString(),
        //        Addlegs = "Add Legs",
        //        HdnALTCarrierCode = e["HdnALTCarrierCode"].ToString(),
        //        ALTCarrierCode = e["ALTCarrierCode"].ToString(),
        //        ALTFlightNumber = e["ALTFlightNumber"].ToString(),
        //        IsCodeShare = Convert.ToBoolean(e["IsCodeShare"]),
        //        CodeShare = e["IsCodeShare"].ToString() == "true" ? "Yes" : "No",
        //        lblCodeShare="Code Share",
        //        CodeShareCarrierCode = e["CodeShareCarrierCode"].ToString(),
        //        CodeShareFlightNumber = e["CodeShareFlightNumber"].ToString(),
        //        CodeShareFlightNo = e["CodeShareFlightNo"].ToString(),
        //        OverBookingCapacity = Convert.ToInt32(e["OverBookingCapacity"].ToString()),
        //        FreeSaleCapacity = Convert.ToInt32(e["FreeSaleCapacity"].ToString()),
        //        OverBookingCapacityVol = Convert.ToDecimal(e["OBV"].ToString()),
        //        FreeSaleCapacityVol = Convert.ToDecimal(e["FSV"].ToString()),
        //        UMG = e["UMG"].ToString(),
        //        UMV = e["UMV"].ToString()
        //    });
        //    return new KeyValuePair<string, List<ScheduleTrans>>(ds.Tables[1].Rows[0][0].ToString(), ScheduleTransList.AsQueryable().ToList());
        //    }
        //    catch(Exception ex)//
        //    {
        //        throw ex;
        //    }
        //}

        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="ScheduleTrans">object of the Entity</param>

        //public List<Tuple<string, int>> createUpdateScheduleTrans(string strData)
        //{
        //    try { 
        //    int ret = 0;
        //    List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string into datatable
        //    var dtScheduleTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
        //    var dtCreateScheduleCheckDate = (new DataView(dtScheduleTrans, "DAY1=0 And DAY2=0 And DAY3=0 And DAY4=0 And DAY5=0 And DAY6=0 And DAY7=0", "SNo", DataViewRowState.CurrentRows)).ToTable();

        //    foreach (DataRow row in dtScheduleTrans.Rows)
        //    {
        //        row["ETA"] = row["ETA"].ToString().Insert(2, ":");
        //        row["ETD"] = row["ETD"].ToString().Insert(2, ":");
        //        row["UMG"] = Convert.ToString(row["UMG"]) == "L" ? 1 : 0;
        //        row["UMV"] = Convert.ToString(row["UMG"]) == "" ? 1 : 2;
        //    }

        //    if (dtCreateScheduleCheckDate.Rows.Count > 0)
        //    {
        //        ErrorMessage.Add(new Tuple<string, int>("At least one Days of Operation is required", 0));
        //        return ErrorMessage;
        //    }


        //    dtCreateScheduleCheckDate = (new DataView(dtScheduleTrans, "DAY1=1 OR DAY2=1 OR DAY3=1 OR DAY4=1 OR DAY5=1 OR DAY6=1 OR DAY7=1", "SNo", DataViewRowState.CurrentRows)).ToTable();

        //    var duplicate = dtCreateScheduleCheckDate.AsEnumerable().GroupBy(r => new
        //    {
        //        StartDate = r["StartDate"],
        //        EndDate = r["EndDate"],
        //        Origin = r["HdnOrigin"],
        //        Destination = r["HdnDestination"],
        //        DAY1 = r["DAY1"],
        //        DAY2 = r["DAY2"],
        //        DAY3 = r["DAY3"],
        //        DAY4 = r["DAY4"],
        //        DAY5 = r["DAY5"],
        //        DAY6 = r["DAY6"],
        //        DAY7 = r["DAY7"]
        //    }).Where(gr => gr.Count() > 1).ToList();

        //    if (duplicate.Any())
        //    {
        //        ErrorMessage.Add(new Tuple<string, int>("Same Days are not allowed", 1));
        //        //ErrorMessage.Add("Same Days are not allowed");
        //        return ErrorMessage;
        //    }

        //    dtScheduleTrans.Columns["SNo"].SetOrdinal(0);
        //    dtScheduleTrans.Columns["ScheduleSNo"].SetOrdinal(1);
        //    dtScheduleTrans.Columns["ScheduleType"].SetOrdinal(2);
        //    dtScheduleTrans.Columns["FlightNo"].SetOrdinal(3);
        //    dtScheduleTrans.Columns["HdnOrigin"].SetOrdinal(4);
        //    dtScheduleTrans.Columns["Origin"].SetOrdinal(5);
        //    dtScheduleTrans.Columns["ETD"].SetOrdinal(6);
        //    dtScheduleTrans.Columns["HdnDestination"].SetOrdinal(7);
        //    dtScheduleTrans.Columns["Destination"].SetOrdinal(8);
        //    dtScheduleTrans.Columns["ETA"].SetOrdinal(9);
        //    dtScheduleTrans.Columns["IsDayLightSaving"].SetOrdinal(10);
        //    dtScheduleTrans.Columns["DayDifference"].SetOrdinal(11);
        //    dtScheduleTrans.Columns["StartDate"].SetOrdinal(12);
        //    dtScheduleTrans.Columns["EndDate"].SetOrdinal(13);
        //    dtScheduleTrans.Columns["HdnAirCraft"].SetOrdinal(14);
        //    dtScheduleTrans.Columns["AirCraft"].SetOrdinal(15);
        //    dtScheduleTrans.Columns["HdnFlightType"].SetOrdinal(16);
        //    dtScheduleTrans.Columns["FlightType"].SetOrdinal(17);
        //    dtScheduleTrans.Columns["AllocatedGrossWeight"].SetOrdinal(18);
        //    dtScheduleTrans.Columns["AllocatedVolumeWeight"].SetOrdinal(19);
        //    dtScheduleTrans.Columns["MaxGrossPerPcs"].SetOrdinal(20);
        //    dtScheduleTrans.Columns["MaxVolumePerPcs"].SetOrdinal(21);
        //    dtScheduleTrans.Columns["AllDays"].SetOrdinal(22);
        //    dtScheduleTrans.Columns["Day1"].SetOrdinal(23);
        //    dtScheduleTrans.Columns["Day2"].SetOrdinal(24);
        //    dtScheduleTrans.Columns["Day3"].SetOrdinal(25);
        //    dtScheduleTrans.Columns["Day4"].SetOrdinal(26);
        //    dtScheduleTrans.Columns["Day5"].SetOrdinal(27);
        //    dtScheduleTrans.Columns["Day6"].SetOrdinal(28);
        //    dtScheduleTrans.Columns["Day7"].SetOrdinal(29);
        //    dtScheduleTrans.Columns["IsActive"].SetOrdinal(30);
        //    dtScheduleTrans.Columns["IsFirstLeg"].SetOrdinal(31);
        //    dtScheduleTrans.Columns["IsCAO"].SetOrdinal(32);
        //    dtScheduleTrans.Columns["NoOfStop"].SetOrdinal(33);
        //    dtScheduleTrans.Columns["Routing"].SetOrdinal(34);
        //    dtScheduleTrans.Columns["SDDifference"].SetOrdinal(35);
        //    dtScheduleTrans.Columns["ALTCarrierCode"].SetOrdinal(36);
        //    dtScheduleTrans.Columns["ALTFlightNumber"].SetOrdinal(37);
        //    dtScheduleTrans.Columns["HdnDepartureSequence"].SetOrdinal(38);


        //    dtScheduleTrans.Columns["IsCodeShare"].SetOrdinal(39);
        //    dtScheduleTrans.Columns["CodeShareFlightNumber"].SetOrdinal(40);
        //    dtScheduleTrans.Columns["CodeShareCarrierCode"].SetOrdinal(41);
        //    // dtScheduleTrans.Columns["CodeShareFlightNo"].SetOrdinal(42);
        //    dtScheduleTrans.Columns.Add("CodeShareFlightNo", typeof(string), string.Empty).SetOrdinal(42);
        //    dtScheduleTrans.Columns["OverBookingCapacity"].SetOrdinal(43);
        //    dtScheduleTrans.Columns["FreeSaleCapacity"].SetOrdinal(44);

        //    dtScheduleTrans.Columns["UMG"].SetOrdinal(45);
        //    dtScheduleTrans.Columns["OverBookingCapacityVol"].SetOrdinal(46);
        //    dtScheduleTrans.Columns["FreeSaleCapacityVol"].SetOrdinal(47);
        //    dtScheduleTrans.Columns["UMV"].SetOrdinal(48);
        //    //dtScheduleTrans.Columns.Remove("AddLegs");
        //    //dtScheduleTrans.Columns.Remove("DeleteLegs");
        //    dtScheduleTrans.Columns.Remove("HdnParentID");
        //    dtScheduleTrans.Columns.Remove("HdnAddLeg");
        //    dtScheduleTrans.Columns.Remove("HdnCodeShareCarrierCode");
        //    dtScheduleTrans.Columns.Remove("HdnUMG");
        //    dtScheduleTrans.Columns.Remove("HdnUMV");




        //    var dtCreateScheduleTrans = (new DataView(dtScheduleTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    var dtUpdateScheduleTrans = (new DataView(dtScheduleTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@ScheduleTransType";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    // for create new record
        //    if (dtCreateScheduleTrans.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateScheduleTrans;
        //        SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", "1")
        //                                    };//((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateScheduleTrans", Parameters);
        //    }
        //    // for update existing record
        //    if (dtUpdateScheduleTrans.Rows.Count > 0)
        //    {
        //        param.Value = dtUpdateScheduleTrans;
        //        SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", "1") };//((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUpdateSchedule", Parameters);
        //    }
        //    if (ret > 0)
        //    {
        //        if (ret > 1000 && ret < 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ScheduleTrans");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string,int>(serverErrorMessage,0));

        //        }
        //        else if (ret > 2000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ScheduleTrans");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(new Tuple<string,int>(serverErrorMessage,1));

        //        }
        //        else
        //        {

        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
        //        }

        //    }
        //    return ErrorMessage;
        //    }
        //    catch(Exception ex)//
        //    {
        //        throw ex;
        //    }
        //}


        ///// <summary>
        ///// delete the perticular ScheduleTrans touple
        ///// </summary>
        ///// <param name="RecordID">Id of that ScheduleTrans touple</param>
        //public List<string> deleteScheduleTrans(string recordID)
        //{
        //    try { 
        //    int ret = 0;
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteScheduleTrans", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ScheduleTrans");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);

        //        }
        //        else
        //        {

        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }

        //    }
        //    return ErrorMessage;
        //    }
        //    catch(Exception ex)//
        //    {
        //        throw ex;
        //    }
        //}
    }
}
