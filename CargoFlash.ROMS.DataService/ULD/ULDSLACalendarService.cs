using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;


namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDSLACalendarService : SignatureAuthenticate, IULDSLACalendarService
    {
        public ULDSLACalendar GetULDSLACalendarRecord(int RecordID, string UserSNo)
        {
            try
            {
                ULDSLACalendar ULDSLACalendar = new ULDSLACalendar();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDCalendar", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    ULDSLACalendar.SNo = Convert.ToInt32(ds.Tables[0].Rows[0]["SNo"]);
                    ULDSLACalendar.CalendarName = Convert.ToString(ds.Tables[0].Rows[0]["CalendarName"]);
                    ULDSLACalendar.CalendarDesc = Convert.ToString(ds.Tables[0].Rows[0]["CalendarDesc"]);
                    ULDSLACalendar.Year = Convert.ToString(ds.Tables[0].Rows[0]["Year"]);
                    ULDSLACalendar.countryname = Convert.ToInt32(ds.Tables[0].Rows[0]["countryname"]);
                    ULDSLACalendar.Cityname = Convert.ToString(ds.Tables[0].Rows[0]["Cityname"]);
                    ULDSLACalendar.Text_countryname = Convert.ToString(ds.Tables[0].Rows[0]["Text_countryname"]);
                    ULDSLACalendar.Text_Cityname = Convert.ToString(ds.Tables[0].Rows[0]["Text_Cityname"]);
                    ULDSLACalendar.StartDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["StartDate"]).ToString("dd-MMM-yyyy");
                    ULDSLACalendar.EndDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["EndDate"]).ToString("dd-MMM-yyyy");
                    ULDSLACalendar.IsActive = Convert.ToInt32(ds.Tables[0].Rows[0]["IsActive"]);
                    ULDSLACalendar.Active = Convert.ToString(ds.Tables[0].Rows[0]["IsActive"]);

                }
                return ULDSLACalendar;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDSLACalendar>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDCalendar", Parameters);

                var ULDSLACalendar = ds.Tables[0].AsEnumerable().Select(e => new ULDSLACalendar
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CalendarName = Convert.ToString(e["CalendarName"]).ToUpper(),
                    CalendarDesc = Convert.ToString(e["CalendarDesc"]),
                    Year = Convert.ToString(e["Year"]),
                    StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
                    EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy"),
                    Active = e["Active"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ULDSLACalendar.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> SaveULDSLACalendar(List<ULDSLACalendar> ULDSLACalendars)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDSLACalendar = CollectionHelper.ConvertTo(ULDSLACalendars, "SNo,Active,Year,Text_countryname,Text_Cityname,CreatedBy,UpdatedBy");
                BaseBusiness baseBusiness = new BaseBusiness();


                if (!baseBusiness.ValidateBaseBusiness("ULDSLACalendar", dtCreateULDSLACalendar, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDCalendar";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDSLACalendar;
                SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ULDSLACalendars[0].CreatedBy) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDCalendar", Parameters);
                if (ret > 0)
                {
                    return ErrorMessage;
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> UpdateULDSLACalendar(List<ULDSLACalendar> ULDSLACalendars)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtUpdateULDSLACalendar = CollectionHelper.ConvertTo(ULDSLACalendars, "SNo,Active,Year,Text_countryname,Text_Cityname,CreatedBy,UpdatedBy");
                BaseBusiness baseBusiness = new BaseBusiness();


                if (!baseBusiness.ValidateBaseBusiness("ULDSLACalendar", dtUpdateULDSLACalendar, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDCalendar";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateULDSLACalendar;
                SqlParameter[] Parameters = { param, new SqlParameter("@SNo", ULDSLACalendars[0].SNo), new SqlParameter("@UpdatedBy", ULDSLACalendars[0].UpdatedBy) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDCalendar", Parameters);
                if (ret > 0)
                {
                    return ErrorMessage;
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteULDSLACalendar(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDCalendar", Parameters);
                    if (ret > 0)
                    {
                        return ErrorMessage;
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<WeekOffHoliDatCustom>> GetULDSLACalendarInfomationWeekOff(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] WeekOff = whereCondition.Split('-');

                List<WeekOffHoliDatCustom> lst = new List<WeekOffHoliDatCustom>();

                SqlParameter[] Parameters = { new SqlParameter("@ULDCalendarSNo",  WeekOff[0])
                                            , new SqlParameter("@WeekOffs",  WeekOff[1].ToString())                                                          
                                           // , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", "")
                                           // , new SqlParameter("@OrderBy", "")
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDCalander_GetWeekOffDetails", Parameters);

                var WeekOffHoliDatCustoms = ds.Tables[0].AsEnumerable().Select(e => new WeekOffHoliDatCustom
                {

                    WeekSno = "1",
                    WeekoffDate = Convert.ToDateTime(e["tempDate"]).ToString("dd-MMM-yyyy"),
                    WeekoffDescription = Convert.ToString(e["WeekDayName"]).ToUpper(),
                    TabActive = Convert.ToBoolean(e["TabActive"])


                });
                return new KeyValuePair<string, List<WeekOffHoliDatCustom>>(ds.Tables[0].Rows[0][0].ToString(), WeekOffHoliDatCustoms.AsQueryable().ToList());

            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetULDSLACalendarInfomationHoliDays(string ULDCalendarSNo, string HolidayType)
        {
            try
            {
                SqlParameter[] Parameters = {   new SqlParameter("@ULDCalendarSNo",ULDCalendarSNo),
                                             new SqlParameter("@HolidayType",HolidayType),

                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDCalendar_GetHoliDays", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string UpdateWeekOffDays(string ULDCalendarSNo, string HolidayType, List<WeekOffDaysList> WeekOffDaysList)
        {
            try
            {
                DataTable _ULDCalendarWeekOff = CollectionHelper.ConvertTo(WeekOffDaysList, "");

                DataSet ds = new DataSet();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {   new SqlParameter("@ULDCalendarSNo",ULDCalendarSNo), 
                                            new SqlParameter("@HolidayType",HolidayType),
                                            new SqlParameter("@ULDCalendar",_ULDCalendarWeekOff),                                          
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDCalander_CreateWeekOffDays", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }
        public string GetWeek(string SNo)
        {
            SqlParameter[] Parameters = {  new SqlParameter("@SNo",SNo)};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllWeek", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }


}
