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
using CargoFlash.Cargo.Model;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirlineHubService : SignatureAuthenticate, IAirlineHubService
    {
        public AirlineHub GetAirlineHubRecord(string recordID, string UserID)
        {
            AirlineHub ERC = new AirlineHub(); 
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirlineHub", Parameters);
                if (dr.Read())
                {
                    ERC.SNo = Convert.ToInt32(dr["SNo"]);
                    ERC.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    ERC.Text_AirlineSNo = dr["Text_AirlineSNo"].ToString();
                    ERC.OriginAirportSNo = Convert.ToInt32(dr["OriginAirportSNo"]);
                    ERC.Text_OriginAirportSNo = dr["Text_OriginAirportSNo"].ToString();
                    ERC.Transit1 = Convert.ToInt32(dr["Transit1"]);
                    ERC.Text_Transit1 = Convert.ToInt32(dr["Transit1"]) == 0 ? "NA" : dr["Text_Transit1"].ToString();
                    ERC.Transit2 = Convert.ToInt32(dr["Transit2"]);
                    ERC.Text_Transit2 = Convert.ToInt32(dr["Transit2"]) == 0 ? "NA" : dr["Text_Transit2"].ToString();
                    ERC.Hub = Convert.ToInt32(dr["Hub"]);
                    ERC.Text_Hub = dr["Text_Hub"].ToString();
                    ERC.IsExclude = Convert.ToBoolean(dr["IsExclude"])==true?false:true;
                    ERC.Text_IsExclude = dr["Text_IsExclude"].ToString();
                    ERC.DestinationAirportSNo = Convert.ToInt32(dr["DestinationAirportSNo"]);
                    ERC.Text_DestinationAirportSNo = dr["Text_DestinationAirportSNo"].ToString();
                }
            }
           
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return ERC;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AirlineHub>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineHub", Parameters);
                var AirlineHubList = ds.Tables[0].AsEnumerable().Select(e => new AirlineHub
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString(),
                    OriginAirportSNo = Convert.ToInt32(e["OriginAirportSNo"]),
                    Text_OriginAirportSNo = e["Text_OriginAirportSNo"].ToString(),
                    Transit1 = Convert.ToInt32(e["Transit1"]),
                    Text_Transit1 = e["Text_Transit1"].ToString(),
                    Transit2 = Convert.ToInt32(e["Transit2"]),
                    Text_Transit2 = e["Text_Transit2"].ToString(),
                    Hub = Convert.ToInt32(e["Hub"]),
                    Text_Hub = e["Text_Hub"].ToString(),
                    IsExclude = Convert.ToBoolean(e["IsExclude"]),
                    Text_IsExclude = e["Text_IsExclude"].ToString(),
                    DestinationAirportSNo = Convert.ToInt32(e["DestinationAirportSNo"]),
                    Text_DestinationAirportSNo = e["Text_DestinationAirportSNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirlineHubList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public List<string> SaveAirlineHub(List<AirlineHub> AirlineHub)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateAirlineHub = CollectionHelper.ConvertTo(AirlineHub, "CreatedAt,UpdatedAt,Text_AirlineSNo,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_Transit1,Text_Transit2,Text_Hub,Text_IsExclude");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirlineHub", dtCreateAirlineHub, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineHubTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirlineHub;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlineHub", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineHub");
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
        public List<string> UpdateAirlineHub(List<AirlineHub> AirlineHub)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirlineHub = CollectionHelper.ConvertTo(AirlineHub, "CreatedAt,UpdatedAt,Text_AirlineSNo,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_Transit1,Text_Transit2,Text_Hub,Text_IsExclude");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AirlineHub", dtCreateAirlineHub, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineHubTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirlineHub;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlineHub", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineHub");
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
        public List<string> DeleteAirlineHub(List<string> RecordID)
        {
           

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId))};
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineHub", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirlineHub");
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
