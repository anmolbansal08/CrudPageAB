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
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Schedule
{ 
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ScheduleService : SignatureAuthenticate, IScheduleService
    {
        /// <summary>
        /// Retrieve Schedule infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public CargoFlash.Cargo.Model.Schedule.Schedule GetScheduleRecord(string recordID)
        {
            try { 
            CargoFlash.Cargo.Model.Schedule.Schedule schedule = new CargoFlash.Cargo.Model.Schedule.Schedule();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
           // DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetRecordSchedule", Parameters);
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSchedule", Parameters);
            if (dr.Read())
            {
                string str = dr["TextRouting"].ToString();
                schedule.Routing = str;
                if (str.Length > 0)
                {
                    str = str.Replace('-', ',').Remove(0, 4).ToString();
                    if (str.Length > 4)
                        str = str.Remove(str.Length - 4, 4);
                }
                schedule.SNo = Convert.ToInt32(dr["SNo"]);
                schedule.ScheduleType = Convert.ToInt32(dr["ScheduleType"]);
                schedule.ScheduleTypeName = Convert.ToString(dr["ScheduleTypeName"]);
                schedule.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                schedule.AWBCode = Convert.ToString(dr["AWBCode"]);
                schedule.CarrierCode = Convert.ToString(dr["AirlineSNo"]) + "-" + Convert.ToString(dr["AWBCode"]) + "-" + dr["CarrierCode"].ToString();
                schedule.Text_CarrierCode = dr["CarrierCode"].ToString();
                schedule.FlightNumber = Convert.ToString(dr["FlightNumber"]);
                schedule.FlightNo = Convert.ToString(dr["FlightNo"]);
                schedule.SingleAlpha = Convert.ToString(dr["SingleAlpha"]);
                //schedule.SingleAlpha = Convert.ToString(dr["SingleAlpha"]);
                // schedule.OperatedasTruck = (dr["IsOperatedasTrack"].ToString() == '0') ? false :true;
                schedule.OperatedasTruck = Convert.ToBoolean(dr["IsOperatedasTruck"]);
                // schedule.IsOperatedasTruck = (dr["IsOperatedasTrack"].ToString() = '0') ? false : true; ;  
                schedule.Origin = Convert.ToInt32(dr["OriginAirportSNo"]);
                schedule.Text_Origin = Convert.ToString(dr["OriginAirportCode"]);
                schedule.Destination = Convert.ToInt32(dr["DestinationAirPortSNo"]);
                schedule.ViaRoute = Convert.ToString(dr["Routing"]);
                schedule.Text_ViaRoute = str;
                schedule.Text_Destination = Convert.ToString(dr["DestinationAirportCode"]);
                schedule.IsCAO = Convert.ToBoolean(dr["IsCAO"]);
                schedule.CAO = Convert.ToString(dr["CAO"]);
                schedule.IsActive = Convert.ToBoolean(dr["IsActive"]);
                schedule.IsSch = Convert.ToBoolean(dr["IsSchedule"]);
                schedule.Sch = Convert.ToBoolean(dr["IsSchedule"]) == true ? "YES" : "NO";
                schedule.Active = Convert.ToString(dr["Active"]);
                schedule.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                schedule.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);
                schedule.FStartDate = Convert.ToDateTime(dr["StartDate"]);
                schedule.FEndDate = Convert.ToDateTime(dr["EndDate"]);
                schedule.PreAlertDate = dr["PreAlertDate"].ToString();
                schedule.PreAlertTime = Convert.ToString(dr["PreAlertTime"]);
                schedule.OpenedUpto = Convert.ToString(dr["OpenedUpto"]);
            }
            dr.Close();
            return schedule;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Retrieve ScheduleTrans infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <param name="page">page is the page number</param>
        /// <param name="pageSize">pageSize is the per page record</param>
        /// <param name="whereCondition">Where Condition according to which touple is to be retrieved</param>
        /// <param name="sort">Order by</param>
        /// <returns>total rows and record</returns>
        public KeyValuePair<string, List<ScheduleTrans>> GetScheduleTransRecord(int recid, int pageNo, int pageSize, GetScheduleTrans model, string sort)
        {
            try
            {
                ScheduleTrans CommoditySubGroup = new ScheduleTrans();
                SqlParameter[] Parameters = { new SqlParameter("@ScheduleSNo", model.RecordID), new SqlParameter("@PageNo", pageNo), new SqlParameter("@PageSize", pageSize), new SqlParameter("@PageType", model.PageType), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListScheduleTrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var ScheduleTransList = ds.Tables[0].AsEnumerable().Select(e => new ScheduleTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ScheduleSNo = Convert.ToInt32(e["ScheduleSNo"]),
                    ScheduleType = Convert.ToInt32(e["ScheduleType"]),
                    FlightNo = e["FlightNo"].ToString(),
                    HdnOrigin = Convert.ToInt32(e["OriginAirportSNo"]),
                    Origin = e["OriginAirportCode"].ToString(),
                    ETD = e["ETD"].ToString().Remove(2, 1),
                    HdnDestination = Convert.ToInt32(e["DestinationAirportSNo"]),
                    Destination = e["DestinationAirportCode"].ToString(),
                    ETA = e["ETA"].ToString().Remove(2, 1),
                    IsDayLightSaving = Convert.ToBoolean(e["IsDayLightSaving"]),
                    DayLightSaving = e["IsDayLightSaving"].ToString().Contains("True") ? "YES" : "NO",
                    DayDifference = Convert.ToInt32(e["DayDifference"]),
                    SDDifference = Convert.ToInt32(e["SDDifference"]),
                    StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
                    EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy"),
                    HdnAirCraft = Convert.ToInt32(e["AirCraftSNo"]),
                    AirCraft = e["AirCraft"].ToString(),
                    HdnFlightType = Convert.ToInt32(e["FlightTypeSNo"]),
                    FlightType = e["FlightType"].ToString(),
                    AllocatedGrossWeight = Convert.ToDecimal(e["AllocatedGrossWeight"]),
                    AllocatedVolumeWeight = Convert.ToDecimal(e["AllocatedVolumeWeight"]),
                    MaxGrossPerPcs = Convert.ToInt32(e["MaxGrossPerPcs"]),
                    MaxVolumePerPcs = Convert.ToDecimal(e["MaxVolumePerPcs"]),
                    AllDays = Convert.ToBoolean(e["AllDays"]),
                    lblAllDays = "Days",
                    AllDay = e["AllDays"].ToString() == "1" ? "YES" : "NO",
                    Day1 = Convert.ToBoolean(e["Day1"]),
                    lblDay1 = "Sun",
                    Sun = e["Day1"].ToString().Contains("True") ? "YES" : "NO",
                    Day2 = Convert.ToBoolean(e["Day2"]),
                    lblDay2 = "Mon",
                    Mon = e["Day2"].ToString().Contains("True") ? "YES" : "NO",
                    Day3 = Convert.ToBoolean(e["Day3"]),
                    lblDay3 = "Tue",
                    Tue = e["Day3"].ToString().Contains("True") ? "YES" : "NO",
                    Day4 = Convert.ToBoolean(e["Day4"]),
                    lblDay4 = "Wed",
                    Wed = e["Day4"].ToString().Contains("True") ? "YES" : "NO",
                    Day5 = Convert.ToBoolean(e["Day5"]),
                    lblDay5 = "Thu",
                    Thu = e["Day5"].ToString().Contains("True") ? "YES" : "NO",
                    Day6 = Convert.ToBoolean(e["Day6"]),
                    lblDay6 = "Fri",
                    Fri = e["Day6"].ToString().Contains("True") ? "YES" : "NO",
                    Day7 = Convert.ToBoolean(e["Day7"]),
                    lblDay7 = "Sat",
                    Sat = e["Day7"].ToString().Contains("True") ? "YES" : "NO",
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    lblIsActive = "Active",
                    Active = e["IsActive"].ToString().Contains("True") ? "YES" : "NO",
                    IsFirstLeg = Convert.ToBoolean(e["IsFirstLeg"]),
                    lblIsFirstLeg = "First Leg",
                    FirstLeg = e["IsFirstLeg"].ToString().Contains("True") ? "YES" : "NO",
                    IsCAO = Convert.ToBoolean(e["IsCAO"]),
                    lblIsCAO = "Freighter",
                    CAO = e["IsCAO"].ToString().Contains("True") ? "YES" : "NO",
                    NoOfStop = Convert.ToInt32(e["NoOfStop"]),
                    lblNoOfStop = "Stop",
                    Routing = e["Routing"].ToString(),
                    Addlegs = "Add Legs",
                    HdnALTCarrierCode = e["HdnALTCarrierCode"].ToString(),
                    ALTCarrierCode = e["ALTCarrierCode"].ToString(),
                    ALTFlightNumber = e["ALTFlightNumber"].ToString(),
                    IsCodeShare = Convert.ToBoolean(e["IsCodeShare"]),
                    CodeShare = e["IsCodeShare"].ToString() == "true" ? "Yes" : "No",
                    lblCodeShare = "Code Share",
                    CodeShareCarrierCode = e["CodeShareCarrierCode"].ToString(),
                    CodeShareFlightNumber = e["CodeShareFlightNumber"].ToString(),
                    CodeShareFlightNo = e["CodeShareFlightNo"].ToString(),
                    OverBookingCapacity = Convert.ToInt32(e["OverBookingCapacity"].ToString()),
                    FreeSaleCapacity = Convert.ToInt32(e["FreeSaleCapacity"].ToString()),
                    OverBookingCapacityVol = Convert.ToDecimal(e["OBV"].ToString()),
                    FreeSaleCapacityVol = Convert.ToDecimal(e["FSV"].ToString()),
                    UMG = e["UMG"].ToString(),
                    UMV = e["UMV"].ToString(),
                    HdnUMG = e["UMG"].ToString(),
                    HdnUMV = e["UMV"].ToString(),
                    ReservedCapacity= Convert.ToInt32(e["ReservedCapacity"].ToString()),
                    ReservedCapacityVol= Convert.ToDecimal(e["ReservedCapacityVol"].ToString()),
                    HdnLegId= Convert.ToInt32(e["LegId"].ToString()),
                    HdnIsLeg = e["IsLeg"].ToString()=="True"?1:0,
                    IsCharter = Convert.ToBoolean(e["IsCharter"]),
                    lblIsCharter = "Charter Flight",
                    Charter = e["IsCharter"].ToString().Contains("True") ? "YES" : "NO",
                    AddLegNo = Convert.ToInt32(e["AddLegNo"].ToString()),
                    RowID= Convert.ToInt32(e["RowID"].ToString())
                });
                return new KeyValuePair<string, List<ScheduleTrans>>(ds.Tables[1].Rows[0][0].ToString(), ScheduleTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Schedule.Schedule>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSchedule", Parameters);
            var ScheduleList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Schedule.Schedule
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ScheduleType = Convert.ToInt32(e["ScheduleType"]),
                ScheduleTypeName = e["ScheduleTypeName"].ToString().ToUpper(),
                AirlineSNo = Convert.ToInt32(Convert.ToString(e["AirlineSNo"])),
                AWBCode = Convert.ToString(e["AWBCode"]).ToUpper(),
                CarrierCode = Convert.ToString(e["AirlineSNo"]).ToUpper() + "-" + Convert.ToString(e["AWBCode"]).ToUpper() + "-" + e["CarrierCode"].ToString().ToUpper(),
                Text_CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                FlightNumber = Convert.ToString(e["FlightNumber"]).ToUpper(),
                FlightNo = Convert.ToString(e["FlightNo"]).ToUpper(),
                Origin = Convert.ToInt32(e["OriginAirportSNo"]),
                Text_Origin = Convert.ToString(e["OriginAirportCode"]),
                Destination = Convert.ToInt32(e["DestinationAirPortSNo"]),
                Text_Destination = Convert.ToString(e["DestinationAirportCode"]),
                Routing = Convert.ToString(e["Routing"]).ToUpper(),
                IsCAO = Convert.ToBoolean(e["IsCAO"]),
                CAO = Convert.ToString(e["CAO"]).ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"]),
                Active = Convert.ToString(e["Active"]).ToUpper(),
                ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                ISRfs = e["ISRFS"].ToString(),
                //CreatedBy = Convert.ToString(e["CreatedUser"]),
                //UpdatedBy = Convert.ToString(e["UpdatedUser"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ScheduleList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /// <summary>
        /// Save the Entity into the database
        /// </summary>
        /// <param name="Schedule">object of the Entity</param>
        public List<string> SaveSchedule(List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> ScheduleDetail)
        {
            try { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateSchedule = CollectionHelper.ConvertTo(ScheduleDetail, "dt,ScheduleTypeName, CarrierCode, CAO, Active, Sch, ViaRoute, Text_ViaRoute,IsOperatedasTruck,Charter");
            DataTable dt = ScheduleDetail[0].dt;
            dtCreateSchedule.Columns.Remove("Sch");
            dtCreateSchedule.Columns.Remove("ViaRoute");
            dtCreateSchedule.Columns.Remove("Text_ViaRoute");
            dtCreateSchedule.Columns.Remove("CAO");
            dtCreateSchedule.Columns.Remove("Active");
                BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Schedule", dtCreateSchedule, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            var dtCreateScheduleCheckDate = (new DataView(dt, "DAY1=1 OR DAY2=1 OR DAY3=1 OR DAY4=1 OR DAY5=1 OR DAY6=1 OR DAY7=1", "SNo", DataViewRowState.CurrentRows)).ToTable();

            var duplicate = dtCreateScheduleCheckDate.AsEnumerable().GroupBy(r => new
            {
                StartDate = r["StartDate"],
                EndDate = r["EndDate"],
                Origin = r["HdnOrigin"],
                Destination = r["HdnDestination"],
                DAY1 = r["DAY1"],
                DAY2 = r["DAY2"],
                DAY3 = r["DAY3"],
                DAY4 = r["DAY4"],
                DAY5 = r["DAY5"],
                DAY6 = r["DAY6"],
                DAY7 = r["DAY7"]
            }).Where(gr => gr.Count() > 1).ToList();

            if (duplicate.Any())
            {
                ErrorMessage.Add("Same Days are not allowed");
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@Schedule";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateSchedule;
            SqlParameter paraTrans = new SqlParameter();
            paraTrans.ParameterName = "@ScheduleTransType";
            paraTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paraTrans.Value = ScheduleDetail[0].dt;
            SqlParameter[] Parameters = { param, paraTrans};
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spCreateSchedule", Parameters);

            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Schedule");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            // ErrorMessage.Add(valuesno);
            return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name="Schedule">list of Schedule to be updated</param>
        public List<string> UpdateSchedule(List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> ScheduleDetail)
        {

            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateSchedule = CollectionHelper.ConvertTo(ScheduleDetail, "dt,ScheduleTypeName, CarrierCode, CAO, Active, Sch, ViaRoute, Text_ViaRoute,IsOperatedasTruck,Charter");
                DataTable dt = ScheduleDetail[0].dt;
                dtCreateSchedule.Columns.Remove("Sch");
                dtCreateSchedule.Columns.Remove("ViaRoute");
                dtCreateSchedule.Columns.Remove("Text_ViaRoute");
                dtCreateSchedule.Columns.Remove("CAO");
                dtCreateSchedule.Columns.Remove("Active");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Schedule", dtCreateSchedule, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                var dtCreateScheduleCheckDate = (new DataView(dt, "DAY1=1 OR DAY2=1 OR DAY3=1 OR DAY4=1 OR DAY5=1 OR DAY6=1 OR DAY7=1", "SNo", DataViewRowState.CurrentRows)).ToTable();

                var duplicate = dtCreateScheduleCheckDate.AsEnumerable().GroupBy(r => new
                {
                    StartDate = r["StartDate"],
                    EndDate = r["EndDate"],
                    Origin = r["HdnOrigin"],
                    Destination = r["HdnDestination"],
                    DAY1 = r["DAY1"],
                    DAY2 = r["DAY2"],
                    DAY3 = r["DAY3"],
                    DAY4 = r["DAY4"],
                    DAY5 = r["DAY5"],
                    DAY6 = r["DAY6"],
                    DAY7 = r["DAY7"]
                }).Where(gr => gr.Count() > 1).ToList();

                if (duplicate.Any())
                {
                    ErrorMessage.Add("Same Days are not allowed");
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Schedule";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSchedule;
                SqlParameter paraTrans = new SqlParameter();
                paraTrans.ParameterName = "@ScheduleTransType";
                paraTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paraTrans.Value = ScheduleDetail[0].dt;
                SqlParameter[] Parameters = { param, paraTrans };
               
                //DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spUpdateSchedule", Parameters);

                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUpdateSchedule", Parameters);

                if (ret!="")
                {
                    string serverErrorMessage =  ret;
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);

                    //if (ret > 1000)
                    //{
                    //    //For Customised Validation Messages like 'Record Already Exists' etc
                    //    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Schedule");
                    //    if (!string.IsNullOrEmpty(serverErrorMessage))
                    //        ErrorMessage.Add(serverErrorMessage);
                    //}
                    //else
                    //{
                    //    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    //    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    //    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    //        ErrorMessage.Add(dataBaseExceptionMessage);
                    //}
                }
                // ErrorMessage.Add(valuesno);
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //try { 
            ////validate Business Rule
            //List<string> ErrorMessage = new List<string>();
            //DataTable dtCreateSchedule = CollectionHelper.ConvertTo(Schedule, "");
            //dtCreateSchedule.Columns.Remove("Sch");
            //BaseBusiness baseBusiness = new BaseBusiness();

            //if (!baseBusiness.ValidateBaseBusiness("Schedule", dtCreateSchedule, "UPDATE"))
            //{
            //    ErrorMessage = baseBusiness.ErrorMessage;
            //    return ErrorMessage;
            //}
            //SqlParameter param = new SqlParameter();
            //param.ParameterName = "@ScheduleTable";
            //param.SqlDbType = System.Data.SqlDbType.Structured;
            //param.Value = dtCreateSchedule;
            //SqlParameter[] Parameters = { param };
            //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSchedule", Parameters);
            //if (ret > 0)
            //{
            //    if (ret > 1000)
            //    {
            //        //For Customised Validation Messages like 'Record Already Exists' etc
            //        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Schedule");
            //        if (!string.IsNullOrEmpty(serverErrorMessage))
            //            ErrorMessage.Add(serverErrorMessage);
            //    }
            //    else
            //    {

            //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
            //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
            //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
            //            ErrorMessage.Add(dataBaseExceptionMessage);
            //    }


            //}

            //return ErrorMessage;
            //}
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
        }
        /// <summary>
        /// delete the perticular Schedule touple
        /// </summary>
        /// <param name="RecordID">Id of that Schedule touple</param>
        public List<string> DeleteSchedule(List<string> listID)
        {
            try { 
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSchedule", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Schedule");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);

                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }
            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string ValidateSchedule(CargoFlash.Cargo.Model.Schedule.ValidateSchedule ScheduleDetail,int  IsValidSchedule)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable ScheduleTrans = CollectionHelper.ConvertTo(ScheduleDetail.ValidateScheduleTrans, "");                
                SqlParameter[] Parameters = {
                     new SqlParameter("@SNo", ScheduleDetail.SNo),
                     new SqlParameter("@FlightNo", ScheduleDetail.FlightNo),
                     new SqlParameter("@StartDate", ScheduleDetail.FromDate),
                     new SqlParameter("@EndDate", ScheduleDetail.ToDate),
                     new SqlParameter("@OperatedasTruck", ScheduleDetail.OperatedasTruck),
                     new SqlParameter("@TextRouting", ScheduleDetail.TextRouting),
                     new SqlParameter("@IsActive", ScheduleDetail.IsActive),
                     new SqlParameter("@ScheduleType", ScheduleDetail.ScheduleType),
                     new SqlParameter("@AirlineSNo", ScheduleDetail.AirlineSNo),
                     new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                     new SqlParameter("@IsValidSchedule", IsValidSchedule),
                     new SqlParameter("@ScheduleTransType", SqlDbType.Structured) { Value = ScheduleTrans }
                };

                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spValidateSchedule", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string GetAirCraftWeight(String AirCraftSno, int Ori, int Dest, int AirlineSNo)
        {
            try { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AirCraftSno", AirCraftSno),
                    new SqlParameter("@Ori", Ori),
                    new SqlParameter("@Dest", Dest),
                    new SqlParameter("@AirlineSNo", AirlineSNo)
                };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_AirCraftWeightDetail", Parameters);

            FlightOpenService fos = new FlightOpenService();
            return fos.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string Getcheck_Z_Code(string str)
        {
            try { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@Trucking", str) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "check_Z_Code", Parameters);

            FlightOpenService fos = new FlightOpenService();
            return fos.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
      //  To get Airline scheuled capacity
        public string ScheduleCapacity(string str)
        {
            try { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AIRCRAFTSNO", str) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getScheduleCapacity", Parameters);
            FlightOpenService fos = new FlightOpenService();
            return fos.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //To get Airline scheuled capacity By Vsingh
    }
}
