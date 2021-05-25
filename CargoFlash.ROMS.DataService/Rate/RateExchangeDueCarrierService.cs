
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class RateExchangeDueCarrierService : SignatureAuthenticate, IRateExchangeDueCarrierService
    {
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
        /// 

        DateTime? D = null;
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateExchangeDueCarrier>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDueCarrierExchangeRate", Parameters);
                var RateExchangeDueCarrierList = ds.Tables[0].AsEnumerable().Select(e => new RateExchangeDueCarrier
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DueCarrier = Convert.ToString(e["DueCarrier"]),
                    Rate = Convert.ToDouble(e["Rate"]),
                    FromCurrencySNo = Convert.ToInt32(e["FromCurrencySNo"]),
                    Text_FromCurrencySNo = Convert.ToString(e["FromCurrencyCode"]),
                    FromCurrencyCode = Convert.ToString(e["FromCurrencyCode"]),
                    ToCurrencySNo = Convert.ToInt32(e["ToCurrencySNo"]),
                    Text_ToCurrencySNo = Convert.ToString(e["ToCurrencyCode"]),
                    ToCurrencyCode = Convert.ToString(e["ToCurrencyCode"]),
                    Active = Convert.ToString(e["Active"]),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"].ToString()),
                    ValidTo = Convert.IsDBNull(e["ValidTo"]) ? D : Convert.ToDateTime(e["ValidTo"].ToString()),
                    ValidtoDisplay = (e["ValidtoDisplay"].ToString() == string.Empty ? "" : (DateTime.Parse(e["ValidtoDisplay"].ToString()).ToString("dd-MMM-yyyy")))

                });
                ds.Dispose();
                return new DataSourceResult

                {
                    Data = RateExchangeDueCarrierList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        /// <summary>
        /// Retrieve ExchangeRate information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public RateExchangeDueCarrier GetRateExchangeDueCarrierRecord(int recordID, string UserID)
        {
            try
            {
                RateExchangeDueCarrier ExRate = new RateExchangeDueCarrier();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateExchangeDueCarrier", Parameters);
                if (dr.Read())
                {
                    ExRate.SNo = Convert.ToInt32(dr["SNo"]);
                    ExRate.DueCarrierSNo = Convert.ToInt32(dr["DueCarrierSNo"]);
                    ExRate.Text_DueCarrierSNo = Convert.ToString(dr["DueCarrier"]);
                    ExRate.DueCarrier = Convert.ToString(dr["DueCarrier"]);
                    ExRate.Rate = Convert.ToDouble(dr["Rate"]);
                    ExRate.FromCurrencySNo = Convert.ToInt32(dr["FromCurrencySNo"]);
                    ExRate.Text_FromCurrencySNo = Convert.ToString(dr["FromCurrencyCode"]);
                    ExRate.FromCurrencyCode = Convert.ToString(dr["FromCurrencyCode"]);
                    ExRate.ToCurrencySNo = Convert.ToInt32(dr["ToCurrencySNo"]);
                    ExRate.Text_ToCurrencySNo = Convert.ToString(dr["ToCurrencyCode"]);
                    ExRate.ToCurrencyCode = Convert.ToString(dr["ToCurrencyCode"]);
                    ExRate.ValidFrom = Convert.ToDateTime(dr["ValidFrom"].ToString());
                    ExRate.ValidTo = Convert.IsDBNull(dr["ValidTo"]) ? D : Convert.ToDateTime(dr["ValidTo"].ToString());
                    ExRate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    ExRate.Active = dr["Active"].ToString();
                    ExRate.UpdatedBy = dr["UpdatedUser"].ToString();
                    ExRate.CreatedBy = dr["CreatedUser"].ToString();
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
        /// Save the entity into the database
        /// </summary>
        /// <param name="ExchangeRate"></param>
        public List<string> SaveRateExchangeDueCarrier(List<RateExchangeDueCarrier> ExchangeRate)
        {
            try
            {

                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateExchangeRate = CollectionHelper.ConvertTo(ExchangeRate, "DueCarrier,Text_DueCarrierSNo,Text_FromCurrencySNo,Text_ToCurrencySNo,ValidtoDisplay,Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateExchangeDueCarrier", dtCreateExchangeRate, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateExchangeDueCarrierType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRate;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateExchangeDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateExchangeDueCarrier");
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
        /// <param name="RateExchangeDueCarrier"></param>

        public List<string> UpdateRateExchangeDueCarrier(List<RateExchangeDueCarrier> RateExchangeDueCarrier)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateExchangeRate = CollectionHelper.ConvertTo(RateExchangeDueCarrier, "DueCarrier,Text_DueCarrierSNo,Text_FromCurrencySNo,Text_ToCurrencySNo,ValidtoDisplay,Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateExchangeDueCarrier", dtCreateExchangeRate, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateExchangeDueCarrierType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateExchangeRate;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateExchangeDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateExchangeDueCarrier");
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

        public List<string> DeleteRateExchangeDueCarrier(List<string> listID)
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

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateExchangeDueCarrier", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateExchangeDueCarrier");
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
