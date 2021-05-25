using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Account Group Service Description
    /*
	*****************************************************************************
	Service Name:	AccountGroupService      
	Purpose:		This Service used to get details of Account Group save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		21 May 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AccountGroupService : SignatureAuthenticate, IAccountGroupService
    {
        public AccountGroup GetAccountGroupRecord(string recordID, string UserID)
        {
            AccountGroup AccountGroup = new AccountGroup();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountGroup", Parameters);
                if (dr.Read())
                {
                    AccountGroup.SNo = Convert.ToInt32(dr["SNo"]);
                    AccountGroup.Name = dr["Name"].ToString();
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        AccountGroup.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        AccountGroup.Active = dr["Active"].ToString().ToUpper();
                    }
                    AccountGroup.UpdatedBy = dr["UpdatedUser"].ToString();
                    AccountGroup.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
           
            return AccountGroup;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AccountGroup>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountGroup", Parameters);
                var AccountGroupList = ds.Tables[0].AsEnumerable().Select(e => new AccountGroup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AccountGroupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveAccountGroup(List<AccountGroup> AccountGroup)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateAccountGroup = CollectionHelper.ConvertTo(AccountGroup, "Active");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AccountGroup", dtCreateAccountGroup, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccountGroup;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountGroup");
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

        public List<string> UpdateAccountGroup(List<AccountGroup> AccountGroup)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                DataTable dtCreateAccountGroup = CollectionHelper.ConvertTo(AccountGroup, "Active");
               
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AccountGroup", dtCreateAccountGroup, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccountGroup;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountGroup");
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

        public List<string> DeleteAccountGroup(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountGroup", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountGroup");
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

        #region Account Group Trans

        public KeyValuePair<string, List<AccountGroupTrans>> GetAccountGroupTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AccountGroupTrans AccountGroupTrans = new AccountGroupTrans();
                SqlParameter[] Parameters = { new SqlParameter("@AccountGroupSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountGroupTrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AccountGroupTransList = ds.Tables[0].AsEnumerable().Select(e => new AccountGroupTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountGroupSNo = Convert.ToInt32(e["AccountGroupSNo"]),
                    AccountSNo = e["Name"].ToString(),
                    HdnAccountSNo = e["AccountSNo"].ToString(),
                    Active = e["Active"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AccountGroupTrans>>(ds.Tables[1].Rows[0][0].ToString(), AccountGroupTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateAccountGroupTrans(string strData)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAccountGroupTrans = JsonConvert.DeserializeObject<DataTable>(strData);
                dtAccountGroupTrans.Columns.Remove("AccountSNo");
                var dtCreateAccountGroupTrans = (new DataView(dtAccountGroupTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAccountGroupTrans = (new DataView(dtAccountGroupTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountGroupTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAccountGroupTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateAccountGroupTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountGroupTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateAccountGroupTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateAccountGroupTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountGroupTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountGroupTrans");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> deleteAccountGroupTrans(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountGroupTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountGroupTrans");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        #endregion
    }
}
