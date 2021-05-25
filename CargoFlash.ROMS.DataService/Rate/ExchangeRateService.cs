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
    public class ExchangeRateService : SignatureAuthenticate, IExchangeRateService
    {
        /// <summary>
        /// Retrieve ExchangeRate information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public ExchangeRate GetExchangeRateRecord(int recordID, string UserID)
        {
            try
            {
                ExchangeRate ExRate = new ExchangeRate();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordExchangeRate", Parameters);
                if (dr.Read())
                {
                    ExRate.SNo = Convert.ToInt32(dr["SNo"]);
                    ExRate.Rate = Convert.ToString(dr["Rate"]);
                    ExRate.FromCurrencySNo = Convert.ToInt32(dr["FromCurrencySNo"]);

                    ExRate.Text_FromCurrencySNo = Convert.ToString(dr["FromCurrencyCode"]);
                    ExRate.FromCurrencyCode = Convert.ToString(dr["FromCurrencyCode"]);

                    ExRate.ToCurrencySNo = Convert.ToInt32(dr["ToCurrencySNo"]);
                    ExRate.Text_ToCurrencySNo = Convert.ToString(dr["ToCurrencyCode"]);
                    ExRate.ToCurrencyCode = Convert.ToString(dr["ToCurrencyCode"]);
                    ExRate.ValidFrom = dr["ValidFrom"].ToString() == string.Empty ? "" : DateTime.Parse(dr["ValidFrom"].ToString()).ToString("dd-MMM-yyyy");
                    ExRate.ValidTo = dr["ValidTo"].ToString() == string.Empty ? "31-Dec-9999" : DateTime.Parse(dr["ValidTo"].ToString()).ToString("dd-MMM-yyyy");
                    ExRate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    ExRate.Active = dr["Active"].ToString();
                    ExRate.UpdatedBy = dr["UpdatedUser"].ToString();
                    ExRate.CreatedBy = dr["CreatedUser"].ToString();
                    ExRate.IsIataApplicable = Convert.ToBoolean(dr["IsIataApplicable"]);
                    ExRate.Text_IsIataApplicable = Convert.ToString(dr["Text_IsIataApplicable"]);
                    ExRate.ApplicableCountrySNo = Convert.ToInt32(dr["ApplicableCountrySNo"]);
                    ExRate.Text_ApplicableCountrySNo = Convert.ToString(dr["Text_ApplicableCountrySNo"]);
                    ExRate.InverseApplicable = Convert.ToBoolean(dr["InverseApplicable"]);
                    ExRate.Text_InverseApplicable = Convert.ToString(dr["Text_InverseApplicable"]);
                    ExRate.ExchangeRateTypeSNo = Convert.ToInt32(dr["ExchangeRateTypeSNo"]);
                    ExRate.Text_ExchangeRateTypeSNo = Convert.ToString(dr["Text_ExchangeRateTypeSNo"]);
                }

                dr.Close();
                return ExRate;
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
                string filters = GridFilter.ProcessFilters<ExchangeRate>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListExchangeRate", Parameters);

                var ExchangeRateList = ds.Tables[0].AsEnumerable().Select(e => new ExchangeRate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Rate = Convert.ToString(e["Rate"]),
                    FromCurrencySNo = Convert.ToInt32(e["FromCurrencySNo"]),
                    Text_FromCurrencySNo = Convert.ToString(e["FromCurrencyCode"]),
                    FromCurrencyCode = Convert.ToString(e["FromCurrencyCode"]),
                    ToCurrencySNo = Convert.ToInt32(e["ToCurrencySNo"]),
                    Text_ToCurrencySNo = Convert.ToString(e["ToCurrencyCode"]),
                    ToCurrencyCode = Convert.ToString(e["ToCurrencyCode"]),
                    Active = Convert.ToString(e["Active"]),
                    IsIataApplicable = Convert.ToBoolean(e["IsIataApplicable"]),
                    Text_IsIataApplicable = Convert.ToString(e["Text_IsIataApplicable"]),
                    ApplicableCountrySNo = Convert.ToInt32(e["ApplicableCountrySNo"]),
                    Text_ApplicableCountrySNo = Convert.ToString(e["Text_ApplicableCountrySNo"]),
                    ExchangeRateTypeSNo = Convert.ToInt32(e["ExchangeRateTypeSNo"]) == null ? 0 : Convert.ToInt32(e["ExchangeRateTypeSNo"]),
                    Text_ExchangeRateTypeSNo = Convert.ToString(e["Text_ExchangeRateTypeSNo"]),
                    InverseApplicable = Convert.ToBoolean(e["InverseApplicable"]) == null ? false : Convert.ToBoolean(e["InverseApplicable"]),
                    Text_InverseApplicable = Convert.ToString(e["Text_InverseApplicable"]),
                    ValidFrom = e["ValidFrom"].ToString() == string.Empty ? "" : DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy"),
                    ValidTo = e["ValidTo"].ToString() == string.Empty ? "" : DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy"),
                    RefNo = Convert.ToString(e["RefNo"]),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ExchangeRateList.AsQueryable().ToList(),
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
        public List<string> SaveExchangeRate(List<ExchangeRate> ExchangeRate)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateExchangeRate = CollectionHelper.ConvertTo(ExchangeRate, "Text_IsIataApplicable,Text_FromCurrencySNo,Text_ToCurrencySNo,Active,Text_ApplicableCountrySNo,Text_ExchangeRateTypeSNo,Text_InverseApplicable,RefNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ExchangeRate", dtCreateExchangeRate, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ExchangeRateType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRate;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateExchangeRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ExchangeRate");
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

        public List<string> UpdateExchangeRate(List<ExchangeRate> ExchangeRate)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateExchangeRate = CollectionHelper.ConvertTo(ExchangeRate, "Text_IsIataApplicable,Text_FromCurrencySNo,Text_ToCurrencySNo,Active,Text_ApplicableCountrySNo,Text_ExchangeRateTypeSNo,Text_InverseApplicable,RefNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ExchangeRate", dtCreateExchangeRate, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ExchangeRateType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRate;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateExchangeRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ExchangeRate");
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

        public List<string> DeleteExchangeRate(List<string> listID)
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

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteExchangeRate", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ExchangeRate");
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
