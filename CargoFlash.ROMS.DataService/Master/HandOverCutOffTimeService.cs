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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HandOverCutOffTimeService : SignatureAuthenticate, IHandOverCutOffTimeService
    {
        /// <summary>
        /// Retrieve HandOverCutOffTime information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public HandOverCutOffTime GetHandOverCutOffTimeRecord(int recordID, string UserID)
        {
            HandOverCutOffTime h = new HandOverCutOffTime();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHandOverCutOffTime", Parameters);
                if (dr.Read())
                {
                    h.SNo = Convert.ToInt32(dr["SNo"]);
                    h.BucketClassSNo = dr["BucketClassSNo"].ToString();
                    h.Text_BucketClassSNo = dr["Name"].ToString();
                    h.CityCode = dr["CityCode"].ToString();
                    h.Text_CityCode = dr["CityCode"].ToString();
                    h.HandOverCutoffTime = Convert.ToInt32(dr["HandOverCutoffTime"]);
                    // string totalHandOverCutoffTime = dr["HandOverCutoffTime"].ToString();

                    h.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    h.ValidTo = Convert.ToDateTime(dr["validTo"]);
                    h.UpdatedBy = dr["UpdatedUser"].ToString();
                    h.CreatedBy = dr["CreatedUser"].ToString();

                    string totalHandOverCutoffTime = dr["CutoffTime"].ToString();
                    string[] CutoffTime = totalHandOverCutoffTime.Split(':');
                    if (CutoffTime.Length > 2)
                    {
                        h.DaysHandOverCutOffTime = Convert.ToInt32(CutoffTime[0]);
                        h.HoursHandOverCutOffTime = Convert.ToInt32(CutoffTime[1]);
                        h.MinsHandOverCutOffTime = Convert.ToInt32(CutoffTime[2]);
                    }
                }
                var check = dr;
                dr.Close();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return h;
        }

        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<HandOverCutOffTime>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListHandOverCutOffTime", Parameters);

                var HandOverCutOffTimeList = ds.Tables[0].AsEnumerable().Select(e => new HandOverCutOffTime
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    BucketClassSNo = e["BucketClassSNo"].ToString(),
                    Text_BucketClassSNo = e["Name"].ToString(),
                    CityCode = e["CityCode"].ToString(),
                    Text_CityCode = e["CityCode"].ToString(),
                    HandOverCutoffTime = Convert.ToInt32(e["HandOverCutoffTime"]),
                    Name = e["Name"].ToString()


                });
                ds.Dispose();
                return new DataSourceResult

                {
                    Data = HandOverCutOffTimeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save the entity into the database
        /// </summary>
        /// <param name="HandOverCutOffTime"></param>
        public List<string> SaveHandOverCutOffTime(List<HandOverCutOffTime> HandOverCutOffTime)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateHandOverCutOffTime = CollectionHelper.ConvertTo(HandOverCutOffTime, "DaysHandOverCutOffTime,HoursHandOverCutOffTime,MinsHandOverCutOffTime,Text_BucketClassSNo,Text_CityCode,Name");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("HandOverCutOffTime", dtCreateHandOverCutOffTime, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HandOverCutOffTimeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateHandOverCutOffTime;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateHandOverCutOffTime", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HandOverCutOffTime");
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
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name="HandOverCutOffTime"></param>

        public List<string> UpdateHandOverCutOffTime(List<HandOverCutOffTime> HandOverCutOffTime)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateHandOverCutOffTime = CollectionHelper.ConvertTo(HandOverCutOffTime, "HandOverCutOffTime0DD,HandOverCutOffTime0HH,HandOverCutOffTime0MM,Text_BucketClassSNo,Text_CityCode,Name,DaysHandOverCutOffTime,HoursHandOverCutOffTime,MinsHandOverCutOffTime");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("HandOverCutOffTime", dtCreateHandOverCutOffTime, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HandOverCutOffTimeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateHandOverCutOffTime;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateHandOverCutOffTime", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HandOverCutOffTime");
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
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        /// <summary>
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>

        public List<string> DeleteHandOverCutOffTime(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteHandOverCutOffTime", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "HandOverCutOffTime");
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
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;


        }
    }
}
