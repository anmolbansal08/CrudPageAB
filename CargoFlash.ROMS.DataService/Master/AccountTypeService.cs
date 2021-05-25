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
    public class AccountTypeService : SignatureAuthenticate, IAccountTypeService
    {/// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AccountType>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountType", Parameters);
                var AccountTypeList = ds.Tables[0].AsEnumerable().Select(e => new AccountType
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AccountTypeName = e["AccountTypeName"].ToString().ToUpper(),
                    //PrefixCode=e["PrefixCode"].ToString().ToUpper(),
                    Text_ProductSNo = e["Text_ProductSNo"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),//foriegn key
                    Airline = e["Airline"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedUser"].ToString().ToUpper(),
                    CreatedBy = e["CreatedUser"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AccountTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /// <summary>
        /// Get Record on the basis of recordID from AccountType
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public AccountType GetAccountTypeRecord(string recordID, string UserSNo)
        {
            try
            {
                AccountType AccountType = new AccountType();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountType", Parameters);
                if (dr.Read())
                {
                    AccountType.SNo = Convert.ToInt32(dr["SNo"]);
                    AccountType.AccountTypeName = Convert.ToString(dr["AccountTypeName"]).ToUpper();
                    AccountType.PrefixCode = Convert.ToString(dr["PrefixCode"]).ToUpper();
                    //AccountType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        AccountType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        AccountType.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsAirline"].ToString()))
                    {
                        AccountType.IsAirline = Convert.ToBoolean(dr["IsAirline"]);
                        AccountType.Airline = dr["Airline"].ToString().ToUpper();
                    }
                    AccountType.ProductSNo = (dr["ProductSNo"].ToString());
                    AccountType.Text_ProductSNo = dr["Text_ProductSNo"].ToString().ToUpper();
                    AccountType.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    AccountType.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
                dr.Close();
                return AccountType;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /// <summary>
        /// Save the AccountType Information into AccountType 
        /// </summary>
        /// <param name="AccountType"></param>
        /// <returns></returns>
        public List<string> SaveAccountType(List<AccountType> AccountType)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                
                DataTable dtCreateAccountType = CollectionHelper.ConvertTo(AccountType, "Active,Text_AccountTypeName,Airline,Text_ProductSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AccountType", dtCreateAccountType, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccountType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountType");
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
        /// Delete AccountType record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteAccountType(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountType", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountType");
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
        /// <summary>
        /// Update AccountType record on the basis of ID
        /// </summary>
        /// <param name="AccountType"></param>
        /// <returns></returns>
        public List<string> UpdateAccountType(List<AccountType> AccountType)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
              
                DataTable dtCreateAccountType = CollectionHelper.ConvertTo(AccountType, "Active,Text_AccountTypeName,Airline,Text_ProductSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AccountType", dtCreateAccountType, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccountType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountType");
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
    }
}
