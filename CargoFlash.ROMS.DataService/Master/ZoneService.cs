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
    public class ZoneService : SignatureAuthenticate, IZoneService
    {
        /// <summary>
        /// Retrieve Zone information from the database
        /// </summary>
        /// <param name="recordID"></param>
        /// <returns></returns>
        public Zone GetZoneRecord(string recordID, string UserSNo)
        {
            SqlDataReader dr = null;
            Zone Zone = new Zone();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordZone", Parameters);
                if (dr.Read())
                {
                    Zone.SNo = Convert.ToInt32(dr["SNo"]);
                    Zone.ZoneName = Convert.ToString(dr["ZoneName"]).ToUpper();
                    //AccountType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        Zone.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        Zone.Active = dr["Active"].ToString().ToUpper();
                    }
                    Zone.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    Zone.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    Zone.ZoneBasedOn = Convert.ToInt32(dr["ZoneBasedOn"]);
                    Zone.ZoneBasedOnSNo = dr["ZoneBasedOnSNo"].ToString().ToUpper();
                    Zone.Text_ZoneBasedOn = dr["Text_ZoneBasedOn"].ToString().ToUpper();
                    Zone.Text_ZoneBasedOnSNo = dr["Text_ZoneBasedOnSNo"].ToString().ToUpper();
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return Zone;
        }

        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Zone>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListZone", Parameters);
                var ZoneList = ds.Tables[0].AsEnumerable().Select(e => new Zone
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    ZoneName = e["ZoneName"].ToString().ToUpper(),
                    Text_ZoneBasedOn = e["Text_ZoneBasedOn"].ToString().ToUpper(),
                    Text_ZoneBasedOnSNo = e["Text_ZoneBasedOnSNo"].ToString().ToUpper().TrimEnd(','),
                    Active = e["Active"].ToString().ToUpper(),//foriegn key
                    UpdatedBy = e["UpdatedUser"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ZoneList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        /// <summary>
        ///Save the Zone Information into Zone 
        /// </summary>
        /// <param name="Zone"></param>
        public List<string> SaveZone(List<Zone> Zone)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateZone = CollectionHelper.ConvertTo(Zone, "Active,Text_ZoneName,Text_ZoneBasedOn,Text_ZoneBasedOnSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Zone", dtCreateZone, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ZoneTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateZone;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateZone", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Zone");
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
            catch(Exception ex)//(Exception ex)
            {
               
                throw ex;
            }
        }


        /// <summary>
        /// Update Zone record on the basis of ID
        /// </summary>
        /// <param name="Zone"></param>
        public List<string> UpdateZone(List<Zone> Zone)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateZone = CollectionHelper.ConvertTo(Zone, "Active,Text_ZoneName,Text_ZoneBasedOn,Text_ZoneBasedOnSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Zone", dtCreateZone, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ZoneTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateZone;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateZone", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Zone");
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
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        /// <summary>
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>
        public List<string> DeleteZone(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteZone", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Zone");
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
            catch(Exception ex)//(Exception ex)
            {
               
                throw ex;
            }
        }
          }
}
