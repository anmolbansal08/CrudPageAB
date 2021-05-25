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
using System.Xml.Serialization;
using System.Xml;
using System.IO;
using System.Net;


namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ExchangeRateConfigurationService : SignatureAuthenticate, IExchangeRateConfigurationService
    {
        public ExchangeRateConfiguration GetExchangeRateConfigurationRecord(string recordID, string UserID)
        {
            ExchangeRateConfiguration ERC = new ExchangeRateConfiguration();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordExchangeRateConfiguration", Parameters);
                if (dr.Read())
                {
                    ERC.SNo = Convert.ToInt32(dr["SNo"]);
                    ERC.ProcessName = dr["ProcessName"].ToString().ToUpper();
                    ERC.ExecutionOn = Convert.ToInt32(dr["ExecutionOn"]);
                    ERC.Text_ExecutionOn = dr["Text_ExecutionOn"].ToString();
                    ERC.RateTypeUse = dr["RateTypeUse"].ToString();
                    ERC.Text_RateTypeUse = dr["Text_RateTypeUse"].ToString();
                    ERC.RateTypeUseWithOR = dr["RateTypeUseWithOR"].ToString();
                }
            }
            catch(Exception ex)// //(Exception ex)
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
                string filters = GridFilter.ProcessFilters<ExchangeRateConfiguration>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListExchangeRateConfiguration", Parameters);
                var ExchangeRateConfigurationList = ds.Tables[0].AsEnumerable().Select(e => new ExchangeRateConfiguration
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ProcessName = e["ProcessName"].ToString().ToUpper(),
                    ExecutionOn = Convert.ToInt32(e["ExecutionOn"]),
                    RateTypeUse = e["RateTypeUse"].ToString(),
                    Text_RateTypeUse = e["Text_RateTypeUse"].ToString(),
                    Text_ExecutionOn = e["Text_ExecutionOn"].ToString(),
                    RateTypeUseWithOR = e["RateTypeUseWithOR"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ExchangeRateConfigurationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveExchangeRateConfiguration(List<ExchangeRateConfiguration> ExchangeRateConfiguration)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateExchangeRateConfiguration = CollectionHelper.ConvertTo(ExchangeRateConfiguration, "CreatedAt,UpdatedAt,Text_RateTypeUse,Text_ExecutionOn,RateTypeUseWithOR");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("ExchangeRateConfiguration", dtCreateExchangeRateConfiguration, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ExchangeRateConfigurationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRateConfiguration;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateExchangeRateConfiguration", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ExchangeRateConfiguration");
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
        public List<string> UpdateExchangeRateConfiguration(List<ExchangeRateConfiguration> ExchangeRateConfiguration)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateExchangeRateConfiguration = CollectionHelper.ConvertTo(ExchangeRateConfiguration, "CreatedAt,UpdatedAt,Text_RateTypeUse,Text_ExecutionOn,RateTypeUseWithOR");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ExchangeRateConfiguration", dtCreateExchangeRateConfiguration, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ExchangeRateConfigurationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRateConfiguration;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateExchangeRateConfiguration", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ExchangeRateConfiguration");
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
        public List<string> DeleteExchangeRateConfiguration(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteExchangeRateConfiguration", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ExchangeRateConfiguration");
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
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
            return ErrorMessage;
        }
      
    }

}
