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
    public class AirlineTimeZoneService : SignatureAuthenticate, IAirlineTimeZoneService
    {
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
        public DataSourceResult GetGridData(int skip, int take, int page, int pagesize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CityConnectionTime>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pagesize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineTimeZone", Parameters);
                var AirlineTimeZoneList = ds.Tables[0].AsEnumerable().Select(e => new AirlineTimeZone
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    TimeZoneName = e["TimeZoneName"].ToString().ToUpper(),
                    TimeDifference = Convert.ToInt32(e["TimeDifference"]),
                    prefix = Convert.ToString(e["Prefix"]),
                    Hour = Convert.ToInt32(e["Hour"]),
                    Minute = Convert.ToInt32(e["Minute"]),
                    UpdatedBy = e["UpdatedBy"].ToString()


                });
                ds.Dispose();
                return new DataSourceResult
                {

                    Data = AirlineTimeZoneList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())

                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }
        /// <summary>
        /// Get Record on the basis of recordID from AirlineTimeZone
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public AirlineTimeZone GetAirlineTimeZoneRecord(string recordID, string UserID)
        {
            try
            {
                AirlineTimeZone AirlinetimeZone = new AirlineTimeZone();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirlineTimeZone", Parameters);
                if (dr.Read())
                {
                    AirlinetimeZone.SNo = Convert.ToInt32(dr["SNo"]);
                    AirlinetimeZone.TimeZoneName = Convert.ToString(dr["TimeZoneName"]).ToUpper();
                    AirlinetimeZone.TimeDifference = Convert.ToInt32(dr["TimeDifference"]);
                    AirlinetimeZone.prefix = Convert.ToString(dr["Prefix"]).ToUpper();
                    AirlinetimeZone.Hour = Convert.ToInt32(dr["Hour"]);
                    AirlinetimeZone.Minute = Convert.ToInt32(dr["Minute"]);
                    AirlinetimeZone.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    AirlinetimeZone.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();

                }
                dr.Close();
                return AirlinetimeZone;
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }
        /// <summary>
        /// Save the AirlineTimeZone Information into AirlineTimeZone 
        /// </summary>
        /// <param name="AirlineTimeZone"></param>
        /// <returns></returns>
        public List<string> SaveAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone)
        {
            try
            {
                List<string> ErroMessage = new List<string>();
                DataTable dtCreateAirlineTimeZone = CollectionHelper.ConvertTo(AirlineTimeZone, "Text_TimeZoneName");
                BaseBusiness basebusiness = new BaseBusiness();
                if (!basebusiness.ValidateBaseBusiness("AirlineTimeZone", dtCreateAirlineTimeZone, "SAVE"))
                {
                    ErroMessage = basebusiness.ErrorMessage;
                    return ErroMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineTimeZoneTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirlineTimeZone;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlineTimeZone", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = basebusiness.ReadServerErrorMessages(ret, "AirlineTimeZone");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErroMessage.Add(serverErrorMessage);

                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = basebusiness.ReadServerErrorMessages(ret, basebusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErroMessage.Add(dataBaseExceptionMessage);

                    }

                }
                return ErroMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        /// <summary>
        /// Delete AirlineTimeZone record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteAirlineTimeZone(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineTimeZone", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirlineTimeZone");
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
        /// <summary>
        /// Update AirlineTimeZone record on the basis of ID
        /// </summary>
        /// <param name="AirlineTimeZone"></param>
        /// <returns></returns>
        public List<string> UpdateAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtAirlineTimeZone = CollectionHelper.ConvertTo(AirlineTimeZone, "Text_TimeZoneName");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AirlineTimeZone", dtAirlineTimeZone, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineTimeZoneTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtAirlineTimeZone;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlineTimeZone", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineTimeZone");
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
