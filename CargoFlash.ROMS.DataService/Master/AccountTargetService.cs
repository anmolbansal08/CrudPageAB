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
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region AccountService Class Description

    /*
	*****************************************************************************
	Class Name:		AccountService      
	Purpose:		This class used to Extend Interface IAccountService. This Class Communicate with SQL Server for CRUD Operation.
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AccountTargetService : SignatureAuthenticate, IAccountTargetService
    {
        /// <summary>
        /// Retrieve Airline infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        //public List<AccountTarget> GetAccountTargetRecord(string recordID)
        //{
        //    AccountTarget AccountTarget = new AccountTarget();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountTarget", Parameters);
        //    // return resultData.Tables[0].AsEnumerable().ToList();
        //    var AccountTargetList = ds.Tables[0].AsEnumerable().Select(e => new AccountTarget
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        AccountSNo = Convert.ToInt32(e["AccountSNo"]),
        //        ProductSNo = Convert.ToInt32(e["ProductSNo"].ToString()),
        //        HdnProductName = Convert.ToInt32(e["ProductSNo"].ToString()),
        //        ProductName = e["ProductName"].ToString().ToUpper(),
        //        TargetName = e["TargetName"].ToString(),
        //        TargetType = Convert.ToInt32(e["TargetType"].ToString()),
        //        NoOfFlight = Convert.ToInt32(e["NoOfFlight"].ToString()),
        //        CurrencySNo = Convert.ToInt32(e["CurrencySNo"].ToString()),
        //        HdnCurrencyCode = Convert.ToInt32(e["CurrencySNo"].ToString()),
        //        CurrencyCode = e["CurrencyCode"].ToString(),
        //        CreatedUser = e["CreatedUser"].ToString(),
        //        UpdatedUser = e["CreatedUser"].ToString(),
        //        IsActive = Convert.ToInt32(e["IsActive"])
        //    });
        //    return AccountTargetList.AsQueryable().ToList();

        //}



        //public KeyValuePair<string, List<AccountTarget>> GetAccountTargetRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        //{
        //    AccountTarget AccountTarget = new AccountTarget();
        //    SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountTarget", Parameters);
        //    var AccountTargetList = ds.Tables[0].AsEnumerable().Select(e => new AccountTarget
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        AccountSNo = Convert.ToInt32(e["AccountSNo"]),
        //        HdnProductName = Convert.ToInt32(e["HdnProductName"].ToString()),
        //        ProductName = e["ProductName"].ToString().ToUpper(),
        //        TargetName = e["TargetName"].ToString(),
        //        TargetType = Convert.ToInt32(e["TargetType"].ToString()),
        //        NoOfFlight = Convert.ToInt32(e["NoOfFlight"].ToString()),
        //        HdnCurrencyCode = Convert.ToInt32(e["HdnCurrencyCode"].ToString()),
        //        CurrencyCode = e["CurrencyCode"].ToString(),
        //        //CreatedUser = e["CreatedUser"].ToString(),
        //        //UpdatedUser = e["CreatedUser"].ToString(),
        //        IsActive = Convert.ToInt32(e["IsActive"])
        //    });
        //    return new KeyValuePair<string, List<AccountTarget>>(ds.Tables[1].Rows[0][0].ToString(), AccountTargetList.AsQueryable().ToList());
        //}

        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="AccountTarget">object of the Entity</param>

        public List<string> createUpdateAccountTarget(string strData)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
              
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAccountTarget = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtAccountTarget.Columns["HdnProductName"].ColumnName = "ProductSNo";
                dtAccountTarget.Columns["HdnCurrencyCode"].ColumnName = "CurrencySNo";
                //DataColumn dcCreatedBy = new DataColumn();
                //dcCreatedBy.ColumnName = "CreatedBy";
                //dcCreatedBy.Caption = "CreatedBy";
                //dcCreatedBy.DataType = System.Type.GetType("System.String");
                //dtAccountTarget.Columns.Add(dcCreatedBy);
                //DataColumn dcUpdateBy = new DataColumn();
                //dcUpdateBy.ColumnName = "UpdateBy";
                //dcUpdateBy.Caption = "UpdateBy";
                //dcUpdateBy.DataType = System.Type.GetType("System.String");
                //dtAccountTarget.Columns.Add(dcUpdateBy);
                //dtAccountTarget.AcceptChanges();
                dtAccountTarget.AcceptChanges();

                var dtCreateAccountTarget = (new DataView(dtAccountTarget, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAccountTarget = (new DataView(dtAccountTarget, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTargetTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAccountTarget.Rows.Count > 0)
                {
                    param.Value = dtCreateAccountTarget;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountTarget", Parameters);
                }
                // for update existing record
                if (dtUpdateAccountTarget.Rows.Count > 0)
                {
                    param.Value = dtUpdateAccountTarget;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountTarget", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        /// <summary>
        /// delete the perticular AccountTarget touple
        /// </summary>
        /// <param name="RecordID">Id of that AccountTarget touple</param>
        public List<string> deleteAccountTarget(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                int userSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", userSNo) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountTarget", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        //public List<string> DeleteAccountTarget(List<string> listID)
        //{
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    if (listID.Count > 0)
        //    {
        //        string RecordId = listID[0].ToString();
        //        string UserId = listID[1].ToString();
        //        SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId) };
        //        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountTarget", Parameters);

        //        if (ret > 0)
        //        {
        //            if (ret > 1000)
        //            {
        //                string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);

        //            }
        //            else
        //            {

        //                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                    ErrorMessage.Add(dataBaseExceptionMessage);
        //            }

        //        }
        //    }
        //    else
        //    {
        //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
        //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //            ErrorMessage.Add(dataBaseExceptionMessage);
        //        //Error
        //    }
        //    return ErrorMessage;
        //}


        //Make Method for Display Data In Grid View

        /// <summary>
        /// Get the list of records to be shown in the database
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
                string filters = GridFilter.ProcessFilters<AccountTarget>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountTargetALL", Parameters);

                var AccountTargetList = ds.Tables[0].AsEnumerable().Select(e => new AccountTarget
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirportName = Convert.ToString(e["AirportName"]).ToUpper(),
                    //AirportSNo = Convert.ToInt32(e["AirportSNO"]),
                    //AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    Name = Convert.ToString(e["Name"]).ToUpper(),
                    //ProductSNo = Convert.ToInt32(e["ProductSNo"].ToString()),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    TargetName = e["TargetName"].ToString().ToUpper(),
                    TargetTypeDisplay = e["TargetTypeDisplay"].ToString().ToUpper(),
                    //NoOfFlight = Convert.ToInt32(e["NoOfFlight"].ToString()),
                    //CurrencySNo = Convert.ToInt32(e["HdnCurrencyCode"].ToString()),
                    CurrencyCode = e["CurrencyCode"].ToString(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = (e["Active"].ToString())

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AccountTargetList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public AccountTarget GetAccountTargetRecord(string recordID, string UserID)
        {
            try
            {
                AccountTarget AccountTarget = new AccountTarget();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountTarget", Parameters);
                if (dr.Read())
                {
                    AccountTarget.SNo = Convert.ToInt32(recordID);

                    AccountTarget.AirportSNo = Convert.ToInt32(dr["AirportSNo"]);
                    AccountTarget.Text_AirportSNo = Convert.ToString(dr["AirportName"]);
                    AccountTarget.AirportName = Convert.ToString(dr["AirportName"]).ToUpper();

                    AccountTarget.AccountSNo = Convert.ToInt32(dr["AccountSNo"]);
                    AccountTarget.Text_AccountSNo = dr["Name"].ToString();
                    AccountTarget.Name = dr["Name"].ToString().ToUpper();

                    AccountTarget.ProductSNo = Convert.ToInt32(dr["ProductSNo"]);
                    AccountTarget.Text_ProductSNo = Convert.ToString(dr["ProductName"]);
                    AccountTarget.ProductName = dr["ProductName"].ToString().ToUpper();

                    AccountTarget.FlightTypeSNo = Convert.ToInt32(dr["FlightTypeSNo"].ToString());
                    AccountTarget.Text_FlightTypeSNo = Convert.ToString(dr["FlightTypeName"]);
                    AccountTarget.FlightType = dr["FlightTypeName"].ToString().ToUpper();

                    AccountTarget.TargetName = dr["TargetName"].ToString().ToUpper();
                    AccountTarget.TargetType = dr["TargetType"] == "0" ? 0 : 1;
                    AccountTarget.TargetTypeDisplay = dr["TargetTypeDisplay"].ToString().ToUpper();
                    AccountTarget.NoOfFlight = Convert.ToInt32(dr["NoOfFlight"]);
                    AccountTarget.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"]);
                    AccountTarget.Text_CurrencySNo = dr["CurrencyCode"].ToString();
                    AccountTarget.CurrencyCode = dr["CurrencyCode"].ToString();
                    AccountTarget.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    AccountTarget.Active = dr["Active"].ToString();
                    AccountTarget.UpdatedUser = dr["UpdatedUser"].ToString();
                    AccountTarget.CreatedUser = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return AccountTarget;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> SaveAccountTarget(List<AccountTarget> AccountTarget)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
              
                DataTable dtCreateAccount = CollectionHelper.ConvertTo(AccountTarget, "Text_AirportSNo,AirportName,Text_AccountSNo,Name,Text_ProductSNo,Text_CurrencySNo,Active,CreatedUser,UpdatedUser,TargetTypeDisplay,Text_FlightTypeSNo,FlightType");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AccountTarget", dtCreateAccount, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter paramAccount = new SqlParameter();
                paramAccount.ParameterName = "@AccountTargetNew";
                paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
                paramAccount.Value = dtCreateAccount;
                SqlParameter[] Parameters = { paramAccount };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountTargetNew", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        /// Update the AccountTarget Information into AccountTarget and Credit Limit Entity
        /// </summary>
        /// <param name="AccountTarget">list of AccountTarget to be updated</param>
        public List<string> UpdateAccountTarget(List<AccountTarget> AccountTarget)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                
                DataTable dtCreateAccountTarget = CollectionHelper.ConvertTo(AccountTarget, "Text_AirportSNo,AirportName,Text_AccountSNo,Name,Text_ProductSNo,Text_CurrencySNo,Active,CreatedUser,UpdatedUser,TargetTypeDisplay,Text_FlightTypeSNo,FlightType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AccountTarget", dtCreateAccountTarget, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTargetNew";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccountTarget;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountTargetNew", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        /// InActive the perticular AccountTarget information
        /// </summary>
        /// <param name="RecordID">Id of that AccountTarget </param>
        public List<string> DeleteAccountTarget(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountTargetNew", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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

        public DataSourceResult GetAccount(String AirlineCode)
        {
            try
            {
                List<String> Account = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", AirlineCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountAutoComplete", Parameters);
                if (dr.HasRows)
                {
                    if (dr.Read())
                    {
                        Account.Add(dr["SNo"].ToString());
                        Account.Add(dr["Name"].ToString());
                        Account.Add(dr["CitySNo"].ToString());
                    }
                }
                return new DataSourceResult
                {
                    Data = Account,
                    Total = Account.Count()
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        //Methods  Added For Tagert Commission and Target Penalty By Vikram 28/12/2016
        public KeyValuePair<string, List<AccountTargetCommTrans>> GetAccountTargetCommTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AccountTargetCommTrans officeCommision = new AccountTargetCommTrans();
                SqlParameter[] Parameters = { new SqlParameter("@AccountTargetSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAccountTargetCommTransRecord", Parameters);
                var AccountTargetCommTransList = ds.Tables[0].AsEnumerable().Select(e => new AccountTargetCommTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountTargetSNo = Convert.ToInt32(e["AccountTargetSNo"]),
                    CommisionType = Convert.ToInt32(e["CommisionType"].ToString()),
                    CommisionTypeAccount = e["CommisionType"].ToString() == "1" ? "Percentage" : e["CommisionType"].ToString() == "2" ? "Kg" : "Revenue",
                    CommisionValue = Convert.ToDecimal(e["CommisionValue"].ToString()),
                    TargetStartValue = Convert.ToDecimal(e["TargetStartValue"].ToString()),
                    TargetEndValue = Convert.ToDecimal(e["TargetEndValue"].ToString()),
                    ValidFrom = e["ValidFrom"].ToString() == "" ? "" : (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    //ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = e["ValidTo"].ToString() == "" ? "" : (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                });
                return new KeyValuePair<string, List<AccountTargetCommTrans>>(ds.Tables[1].Rows[0][0].ToString(), AccountTargetCommTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<AccountTargetPenaltyTrans>> GetAccountTargetPenaltyTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                OfficeTargetPenaltyTrans officeCommision = new OfficeTargetPenaltyTrans();
                SqlParameter[] Parameters = { new SqlParameter("@AccountTargetSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAccountTargetPenaltyTransRecord", Parameters);
                var accountTargetPenaltyTrans = ds.Tables[0].AsEnumerable().Select(e => new AccountTargetPenaltyTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountTargetSNo = Convert.ToInt32(e["AccountTargetSNo"]),
                    PenaltyType = Convert.ToInt32(e["PenaltyType"].ToString()),
                    PenaltyOfficeType = e["PenaltyOfficeType"].ToString(),
                    PenaltyValue = Convert.ToDecimal(e["PenaltyValue"].ToString()),
                    TargetStartValue = Convert.ToDecimal(e["TargetStartValue"].ToString()),
                    TargetEndValue = Convert.ToDecimal(e["TargetEndValue"].ToString()),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                });
                return new KeyValuePair<string, List<AccountTargetPenaltyTrans>>(ds.Tables[1].Rows[0][0].ToString(), accountTargetPenaltyTrans.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> CreateUpdateAccountTargetCommTrans(string strDate)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtAccountTargetCommTran = JsonConvert.DeserializeObject<DataTable>(strDate);
                var dtCreateTargetCommTran = (new DataView(dtAccountTargetCommTran, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdatedtTargetCommTran = (new DataView(dtAccountTargetCommTran, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTargetCommTrans";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateTargetCommTran.Rows.Count > 0)
                {
                    param.Value = dtCreateTargetCommTran;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "[CreateAccountTargetCommTrans]", Parameters);
                }
                // for update existing record
                if (dtUpdatedtTargetCommTran.Rows.Count > 0)
                {
                    param.Value = dtUpdatedtTargetCommTran;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountTargetCommision", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        public List<string> DeleteAccountTargetCommTrans(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountTargetCommTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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
        public List<string> CreateUpdateAccountTargetPenaltyTrans(string strDate)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtAccountTargetPenaltyTrans = JsonConvert.DeserializeObject<DataTable>(strDate);
                var dtCreateAccountTargetPenaltyTrans = (new DataView(dtAccountTargetPenaltyTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdatedtAccountTargetPenaltyTrans = (new DataView(dtAccountTargetPenaltyTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTargetPenaltyTrans";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtCreateAccountTargetPenaltyTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateAccountTargetPenaltyTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountTargetPenaltyTrans", Parameters);
                }
                // for update existing record
                if (dtUpdatedtAccountTargetPenaltyTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdatedtAccountTargetPenaltyTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountTargetPenaltyTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
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
        public List<string> DeleteAccountTargetPenaltyTrans(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountTargetPenaltyTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountTarget");
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
    }

}
