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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Globalization;


using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TimeZoneService : SignatureAuthenticate, ITimeZoneService
    {
        // CargoFlash.DMS.DataService.SignatureAuthenticate,

        public Timezone GetTimeZoneRecord(int recordID, string UserID)
        {
            SqlDataReader dr = null;
            Timezone tz = new Timezone();
            try
            {
                

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTimeZone", Parameters);
                if (dr.Read())
                {
                    tz.SNo = Convert.ToInt32(dr["SNo"]);
                    tz.ZoneName = dr["ZoneName"].ToString();
                    tz.GMT = dr["GMT"].ToString();
                    //   tz.CreatedUser = dr["CreatedUser"].ToString();
                    //   tz.UpdatedUser = dr["UpdatedUser"].ToString();
                    //    tz.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //     tz.Active = dr["Active"].ToString();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return tz;
        }

        public List<TimeZoneTrans> GetTimeZoneTransRecord(int recordID, string userid)
        {
            try
            {
                List<TimeZoneTrans> listTimeZoneTrans = new List<TimeZoneTrans>();
                TimeZoneTrans ConsolidatorBranchContact = new TimeZoneTrans();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTimeZoneTransRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        listTimeZoneTrans.Add(new TimeZoneTrans
                        {
                            SNo = Convert.ToInt32(dr["SNo"]),
                            //   Prefix = dr["Prefix"].ToString(),
                            //   Text_Prefix = dr["PrefixName"].ToString(),
                            //     Hour = int.Parse(dr["Hour"].ToString()),
                            Minute = int.Parse(dr["Minute"].ToString()),
                            ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString()).ToString("dd-MMM-yyyy HH:mm", CultureInfo.InvariantCulture),
                            ValidTo = DateTime.Parse(dr["ValidTo"].ToString()).ToString("dd-MMM-yyyy HH:mm", CultureInfo.InvariantCulture),

                        }
                        );
                    }
                }
                return listTimeZoneTrans;
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<TimezoneGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
            new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters),
            new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTimeZone", Parameters);
                var timezoneList = ds.Tables[0].AsEnumerable().Select(e => new TimezoneGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    StandardName = e["StandardName"].ToString(),
                    GMT = e["GMT"].ToString()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = timezoneList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    //FilterCondition = filters,
                    //SortCondition = sorts,
                    //StoredProcedure = "GetListTimeZone"
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }


        /// <summary>
        /// Retrieve Open Door  infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <param name="page">page is the page number</param>
        /// <param name="pageSize">pageSize is the per page record</param>
        /// <param name="whereCondition">Where Condition according to which touple is to be retrieved</param>
        /// <param name="sort">Order by</param>
        /// <returns>total rows and record</returns>
        public KeyValuePair<string, List<TimeZoneTrans>> GetTimeZoneTransRecordViewUpdate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                List<TimeZoneTrans> listTimeZoneTrans = new List<TimeZoneTrans>();
                TimeZoneTrans ConsolidatorBranchContact = new TimeZoneTrans();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTimeZoneTransRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        listTimeZoneTrans.Add(new TimeZoneTrans
                        {
                            SNo = Convert.ToInt32(dr["SNo"]),
                            //   Prefix = dr["Prefix"].ToString(),
                            //   Text_Prefix = dr["PrefixName"].ToString(),
                            //     Hour = int.Parse(dr["Hour"].ToString()),
                            Minute = int.Parse(dr["Minute"].ToString()),
                            ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString()).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                            ValidTo = DateTime.Parse(dr["ValidTo"].ToString()).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                            ValidFromTime = DateTime.Parse(dr["ValidFrom"].ToString()).ToString("HH:mm:ss", CultureInfo.InvariantCulture),
                            ValidToTime = DateTime.Parse(dr["ValidTo"].ToString()).ToString("HH:mm:ss", CultureInfo.InvariantCulture),
                        }
                        );
                    }
                }

                return new KeyValuePair<string, List<TimeZoneTrans>>(ds.Tables[1].Rows[0][0].ToString(), listTimeZoneTrans.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        //public List<string> SaveTimeZone(List<TimeZomeMasterInfo> listTimeZomeMasterInfo)
        //{
        //    //validate Business Rule
        //    //int returnValue = 0;

        //    List<string> ErrorMessage = new List<string>();
        //    List<TimeZone> timeZonMaster = listTimeZomeMasterInfo[0].timeZoneMaster;
        //    List<TimeZoneTrans> timeZoneTransRecord = listTimeZomeMasterInfo[0].timeZoneTrans;


        //    DataTable dtCreateTimeZone = CollectionHelper.ConvertTo(timeZonMaster, "Active,CreatedOn,UpdatedOn,GMT");
        //    DataTable dttimeZoneTransRecord = CollectionHelper.ConvertTo(timeZoneTransRecord, "TimeZoneSNo,Text_Prefix");

        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    if (!baseBusiness.ValidateBaseBusiness("TimeZone", "Master", dtCreateTimeZone, "SAVE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }

        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@TimeZoneTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtCreateTimeZone;

        //    SqlParameter paramTrans = new SqlParameter();
        //    paramTrans.ParameterName = "@TimeZoneTransTable";
        //    paramTrans.SqlDbType = System.Data.SqlDbType.Structured;
        //    paramTrans.Value = dttimeZoneTransRecord;
        //    SqlParameter[] Parameters = { param, paramTrans };
        //    // SqlParameter[] Parameters = { param};
        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTimeZone", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TimeZone", "Master");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName, "Master");
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }
        //    return ErrorMessage;

        //}

        //public List<string> UpdateTimeZone(List<TimeZomeMasterInfo> listTimeZomeMasterInfo)
        //{
        //    //validate Business Rule
        //    List<string> ErrorMessage = new List<string>();

        //    List<TimeZone> timeZonMaster = listTimeZomeMasterInfo[0].timeZoneMaster;
        //    List<TimeZoneTrans> timeZoneTransRecord = listTimeZomeMasterInfo[0].timeZoneTrans;

        //    DataTable dtCreateTimeZone = CollectionHelper.ConvertTo(timeZonMaster, "Active,CreatedOn,UpdatedOn,GMT");
        //    DataTable dttimeZoneTransRecord = CollectionHelper.ConvertTo(timeZoneTransRecord, "TimeZoneSNo,Text_Prefix");

        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    if (!baseBusiness.ValidateBaseBusiness("TimeZone", "Master", dtCreateTimeZone, "UPDATE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }

        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@TimeZoneTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtCreateTimeZone;


        //    SqlParameter paramTrans = new SqlParameter();
        //    paramTrans.ParameterName = "@TimeZoneTransTable";
        //    paramTrans.SqlDbType = System.Data.SqlDbType.Structured;
        //    paramTrans.Value = dttimeZoneTransRecord;
        //    SqlParameter[] Parameters = { param, paramTrans };

        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateTimeZone", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TimeZone", "Master");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName, "Master");
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }
        //    return ErrorMessage;
        //}

        //public List<string> DeleteTimeZone(List<string> listID)
        //{
        //    //validate Business Rule

        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    if (listID.Count > 1)
        //    {
        //        string RecordID = listID[0].ToString();
        //        string UserID = listID[1].ToString();

        //        SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
        //                                     new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

        //        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTimeZone", Parameters);
        //        if (ret > 0)
        //        {
        //            if (ret > 1000)
        //            {
        //                //For Customised Validation Messages like 'Record Already Exists' etc
        //                string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TimeZone", "Master");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);
        //            }
        //            else
        //            {

        //                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName, "Master");
        //                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                    ErrorMessage.Add(dataBaseExceptionMessage);
        //            }

        //        }

        //    }
        //    else
        //    {
        //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName, "Master");
        //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //            ErrorMessage.Add(dataBaseExceptionMessage);
        //        //Error
        //    }
        //    return ErrorMessage;
        //}

        //public string GetSearchRecord(int City, int Timezone)
        //{

        //    SqlParameter[] Parameters = { 
        //                               new SqlParameter("@CitySNo", City),
        //                               new SqlParameter("@TZSNo", Timezone)};
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSearchRecord", Parameters);
        //    ds.Dispose();
        //    return Common.DStoJSON(ds);
        //}



        public List<string> createUpdateTimeZone(string strData)
        {
            try
            {
                string st = OperationContext.Current.SessionId;
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                // convert JSON string into datatable
                int NoOfItem = 0;
                int ConsumableStockSno = 0;
                string Citycode = string.Empty;
                var dtTimeZone = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));


                var dtCreateTimeZoneTrans = (new DataView(dtTimeZone, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateTimeZoneTrans = (new DataView(dtTimeZone, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();




                SqlParameter param = new SqlParameter();
                param.ParameterName = "@TimeZoneTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateTimeZoneTrans.Rows.Count > 0)
                {

                    SqlParameter[] Parameters = { new SqlParameter("@ItemList", dtCreateTimeZoneTrans), new SqlParameter("@ConsumableSno", ConsumableStockSno), new SqlParameter("@CityCode", Citycode), new SqlParameter("@NoOfItems", NoOfItem), new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveConsumableStock", Parameters);
                    ErrorMessage.Add("Record Save Successfully");
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConsumableStock");
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
                // for update existing record
                ret = 0;
                if (dtUpdateTimeZoneTrans.Rows.Count > 0)
                {



                    SqlParameter[] Parameters = { new SqlParameter("@TimeZoneTable", dtUpdateTimeZoneTrans) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateTimeZoneTrans", Parameters);
                    //param.Value = dtUpdateSlotBookingTrans;
                    //SqlParameter[] Parameters = { param };
                    //ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSlotBookingTrans", Parameters);
                    ErrorMessage.Add("Record Update Successfully");
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "TimeZone");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
    }
}
