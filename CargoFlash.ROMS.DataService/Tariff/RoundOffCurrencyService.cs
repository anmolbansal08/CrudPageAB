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
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RoundOffCurrencyService : SignatureAuthenticate, IRoundOffCurrencyService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RoundOffCurrencyGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRoundOffCurrencyList", Parameters);
                var RoundOffCurrencyList = ds.Tables[0].AsEnumerable().Select(e => new RoundOffCurrencyGrid
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    CountryCode = e["CountryCode"].ToString().ToUpper(),
                    CurrencyCode = e["CurrencyCode"].ToString().ToUpper(),
                    InDecimal = Convert.ToInt32(e["InDecimal"]),
                    InAmount = Convert.ToInt32(e["InAmount"]),
                    Basis = e["Text_Basis"].ToString().ToUpper()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RoundOffCurrencyList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public RoundOffCurrency GetRoundOffCurrencyRecord(string recordID, string UserSNo)
        {
            RoundOffCurrency T = new RoundOffCurrency();
            SqlDataReader dr = null;
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                //dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTax_GetRecord", Parameters);
                //if (dr.Read())
                //{
                //    T.SNo = Convert.ToInt32(dr["SNo"]);
                //    T.TaxCode = Convert.ToString(dr["TaxCode"]);
                //    T.TaxType = Convert.ToInt32(dr["TaxType"]) == 0 ? "DOMESTIC" : "INTERNATIONAL";
                //    T.Description = Convert.ToString(dr["Description"]);
                //    T.Text_CountrySNo = Convert.ToString(dr["Text_CountrySNo"]);
                //    T.Text_CitySNo = Convert.ToString(dr["Text_CitySNo"]);
                //    T.Active = Convert.ToString(dr["Active"]);
                //    T.IsActive = Convert.ToBoolean(dr["IsActive"]);
                //    T.UpdatedBy = dr["UpdatedUser"].ToString();
                //    T.CreatedBy = dr["CreatedUser"].ToString();
                //}
            }
            catch (Exception ex)//(Exception ex)
            {
                
            }
            
            return T;
        }
        /// <summary>
        /// Get round off currency slab records GetRoundOffCurrencySlabRecord
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="whereCondition"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<RoundOffCharge>> GetRoundOffCurrencySlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "SNo=" + recordID;
                RoundOffCharge tax = new RoundOffCharge();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRoundOffCurrencySlabRecord", Parameters);
                var RoundOffCurrencySlabList = ds.Tables[0].AsEnumerable().Select(e => new RoundOffCharge
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    CountryCode = e["CountryCode"].ToString().ToUpper(),
                    HdnCountryCode = e["HdnCountryCode"].ToString(),
                    Currency = e["CurrencyCode"].ToString().ToUpper(),
                    InDecimal = Convert.ToInt32(e["InDecimal"]),
                    InAmount = Convert.ToInt32(e["InAmount"]),
                    Basis = Convert.ToInt32(e["Basis"].ToString())
                });
                return new KeyValuePair<string, List<RoundOffCharge>>("SNo", RoundOffCurrencySlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        // DeleteRoundOffCurrencySlabRecord
        public List<string> DeleteRoundOffCurrency(List<string> listID)
        {

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    //string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRoundOffCurrencySlabRecord", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RoundOffCurrency");
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
            catch (Exception ex)// (Exception e)
            {

            }
            return ErrorMessage;
        }

        public List<string> SaveRoundOffCurrency(RoundOffCurrency RoundOffC)
        {
            try
            {
                //validate Business Rule
                DataTable dtTaxTrans = CollectionHelper.ConvertTo(RoundOffC.TransData, "CountryCode,Currency,Text_Basis");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();

                SqlParameter[] Parameters = { new SqlParameter("@UpdatedBy",RoundOffC.UpdatedBy),
                                        new SqlParameter("@RoundOffCurrencyTrans",SqlDbType.Structured){Value=dtTaxTrans}};

                //DataSet ds = (DataSet)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "sp_CurrencyRoundOff", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_CurrencyRoundOff", Parameters);
                //int ret = 0;
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RoundOffCurrency");
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
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }

        public List<string> UpdateRoundOffCurrency(RoundOffCurrency RoundOffC)
        {
            try
            {
                int ret = 0;
                //validate Business Rule
                DataTable dtRoundOffCTrans = CollectionHelper.ConvertTo(RoundOffC.TransData, "CountryCode,Currency,Text_Basis");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                //if (!baseBusiness.ValidateBaseBusiness("Tax", dtUpdateTax, "UPDATE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter[] Parameters = { 
                                        new SqlParameter("@UpdatedBy",RoundOffC.UpdatedBy),
                                        new SqlParameter("@RoundOffCurrencyTrans",SqlDbType.Structured){Value=dtRoundOffCTrans}};


                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_CurrencyRoundOff_update", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RoundOffCurrency");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


    }
}
