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
using CargoFlash.Cargo.DataService.Rate;
using CargoFlash.Cargo.Model.Rate;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AgentGroupService : SignatureAuthenticate, IAgentGroupService
    {
        /// <summary>
        /// Retrieve ExchangeRate information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public AgentGroup GetAgentGroupRecord(int recordID, string UserID)
        {
            try
            {
                AgentGroup agent = new AgentGroup();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAgentGroup", Parameters);
                if (dr.Read())
                {
                    agent.SNo = Convert.ToInt32(dr["SNo"]);
                    agent.AgentGroupName = Convert.ToString(dr["AgentGroupName"]).ToUpper();
                    agent.GroupLevel = Convert.ToInt32(dr["GroupLevel"]);
                    agent.Text_GroupLevel = Convert.ToString(dr["Text_GroupLevel"]).ToUpper();
                    agent.CountrySNo = Convert.ToInt32(dr["CountrySNo"]);
                    agent.Text_CountrySNo = Convert.ToString(dr["Text_CountrySNo"]).ToUpper();
                    agent.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    agent.Text_CitySNo = Convert.ToString(dr["Text_CitySNo"]).ToUpper();
                    agent.AccountSNo = Convert.ToString(dr["AccountSNo"]);
                    agent.Text_AccountSNo = Convert.ToString(dr["Text_AccountSNo"]).ToUpper();
                    agent.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    agent.Text_IsActive = Convert.ToBoolean(dr["IsActive"]) == true ? "YES" : "NO";
                    agent.UpdatedBy = dr["UpdatedUser"].ToString();
                    agent.CreatedBy = dr["CreatedUser"].ToString();

                }

                dr.Close();
                return agent;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
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
                string filters = GridFilter.ProcessFilters<AgentGroup>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAgentGroup", Parameters);

                var AgentGroupList = ds.Tables[0].AsEnumerable().Select(e => new AgentGroup
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AgentGroupName = Convert.ToString(e["AgentGroupName"]).ToUpper(),
                    GroupLevel = Convert.ToInt32(e["GroupLevel"]),
                    CountrySNo = Convert.ToInt32(e["CountrySNo"]),
                    CitySNo = Convert.ToInt32(e["CitySNo"]),
                    AccountSNo = Convert.ToString(e["AccountSNo"]),
                    Text_GroupLevel = Convert.ToString(e["Text_GroupLevel"]).ToUpper(),
                    Text_CountrySNo = Convert.ToString(e["Text_CountrySNo"]).ToUpper(),
                    Text_CitySNo = Convert.ToString(e["Text_CitySNo"]).ToUpper(),
                    Text_AccountSNo = Convert.ToString(e["Text_AccountSNo"]).ToUpper(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Text_IsActive = Convert.ToBoolean(e["IsActive"]) == true ? "YES" : "NO"

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AgentGroupList.AsQueryable().ToList(),
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
        /// <param name="ExchangeRate"></param>
        public List<string> SaveAgentGroup(List<AgentGroup> AgentGroup)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAgentGroup = CollectionHelper.ConvertTo(AgentGroup, "Text_GroupLevel,Text_CountrySNo,Text_CitySNo,Text_IsActive,Text_AccountSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AgentGroup", dtCreateAgentGroup, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AgentGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAgentGroup;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAgentGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AgentGroup");
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
        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name="ExchangeRate"></param>

        public List<string> UpdateAgentGroup(List<AgentGroup> AgentGroup)
        {
            try
            {

                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAgentGroup = CollectionHelper.ConvertTo(AgentGroup, "Text_GroupLevel,Text_CountrySNo,Text_CitySNo,Text_IsActive,Text_AccountSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AgentGroup", dtCreateAgentGroup, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AgentGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAgentGroup;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAgentGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AgentGroup");
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
        /// <summary>
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>

        public List<string> DeleteAgentGroup(List<string> listID)
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

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAgentGroup", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AgentGroup");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
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

    }
}
