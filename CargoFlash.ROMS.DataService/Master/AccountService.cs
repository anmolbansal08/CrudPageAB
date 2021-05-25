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
    public class AccountService : SignatureAuthenticate, IAccountService
    {
        /// <summary>
        /// Retrieve Account infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public Account GetAccountRecord(string recordID, string UserSNo)
        {
            try
            {
                Account Account = new Account();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccount", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccount", Parameters);
                if (dr.Read())
                {
                    Account.SNo = Convert.ToInt32(recordID);
                    Account.ParentID = Convert.ToInt32(dr["ParentID"]);
                    //Account.ParentID = int.Parse(dr["ParentID"].ToString() == "" ? "0" : dr["ParentID"].ToString());
                    //if (dr["ParentID"].ToString() != "0")
                    //    Account.Text_ParentID = dr["Text_ParentID"].ToString().ToUpper();
                    //else
                    //    Account.Text_ParentID = "";
                    Account.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    Account.Text_AirlineSNo = Convert.ToString(dr["AirlineName"]).ToUpper();
                    Account.AirlineCode = dr["AirlineName"].ToString().ToUpper();
                    Account.AccountTypeSNo = Convert.ToInt32(dr["AccountTypeSNo"]);
                    Account.Text_AccountTypeSNo = Convert.ToString(dr["AccountTypeName"]).ToUpper();
                    Account.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                    Account.Text_OfficeSNo = Convert.ToString(dr["OfficeName"]).ToUpper();
                    Account.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    Account.Text_CitySNo = Convert.ToString(dr["CityCode"]).ToUpper();
                    Account.Name = Convert.ToString(dr["Name"]).ToUpper();
                    Account.Address = Convert.ToString(dr["Address"]).ToUpper();
                    Account.AgentAccountNo = Convert.ToString(dr["AgentAccountNo"]).ToUpper();
                    Account.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"]);
                    Account.Text_CurrencySNo = Convert.ToString(dr["CurrencyCode"]).ToUpper();
                    Account.IATANo = Convert.ToString(dr["IATANo"]).ToUpper();
                    //Account.vendorcode = Convert.ToString(dr["vendorcode"]).ToUpper();
                    Account.CASSNo = Convert.ToString(dr["CASSNo"]).ToUpper();
                   
                    Account.IsAllowedCL = Convert.ToBoolean(dr["IsAllowedCL"]);
                    Account.AllowedCL = Convert.ToString(dr["AllowedCL"]).ToUpper();
                    Account.IsAllowedConsolidatedCL = Convert.ToBoolean(dr["IsAllowedConsolidatedCL"]);
                    Account.AllowedConsolidatedCL = Convert.ToString(dr["AllowedConsolidatedCL"]).ToUpper();
                    Account.ValidFrom = (dr["ValidFrom"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["ValidFrom"].ToString());
                    Account.IsBlacklist = Convert.ToBoolean(dr["IsBlacklist"]);
                    Account.Blacklist = Convert.ToString(dr["Blacklist"]).ToUpper();
                    Account.ValidTo = (dr["ValidTo"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["ValidTo"].ToString());
                    Account.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    Account.Active = Convert.ToString(dr["Active"]).ToUpper();
                    Account.CreditLimit = Convert.ToDecimal(dr["CreditLimit"].ToString() == "" ? "0" : dr["CreditLimit"]);
                    Account.BankGuarantee = Convert.ToDecimal(dr["BankGuarantee"].ToString() == "" ? "0" : dr["BankGuarantee"]);
                    Account.Payment = Convert.ToDecimal(dr["Payment"].ToString() == "" ? "0" : dr["Payment"]);
                    Account.MinimumCL = Convert.ToDecimal(dr["MinimumCL"].ToString() == "" ? "0" : dr["MinimumCL"]);
                    Account.UsedCL = Convert.ToDecimal(dr["UsedCL"].ToString() == "" ? "0" : dr["UsedCL"]);
                    Account.AlertCLPercentage = Convert.ToDecimal(dr["AlertCLPercentage"].ToString() == "" ? "0" : dr["AlertCLPercentage"]);
                    Account.CreatedBy = Convert.ToString(dr["CreatedUser"]).ToUpper();
                    Account.UpdatedBy = Convert.ToString(dr["UpdatedUser"]).ToUpper();
                    Account.Branch = dr["BranchSNo"].ToString().ToUpper();
                    Account.Text_Branch = dr["Branch"].ToString().ToUpper();
                    Account.AccountNo = dr["AccountNo"].ToString().ToUpper();
                    Account.BillingCode = dr["BillingCode"].ToString().ToUpper();
                    Account.IsHeadAccount = Convert.ToBoolean(dr["IsHeadAccount"]);
                    Account.HeadAccount = dr["HeadAccount"].ToString().ToUpper();
                    Account.IsWarehouse = Convert.ToBoolean(dr["IsWarehouse"]);
                    Account.Warehouse = dr["Warehouse"].ToString().ToUpper();
                    Account.InvoicingCycle = Convert.ToInt32(dr["InvoicingCycle"]);
                    Account.Text_InvoicingCycle = dr["Text_InvoicingCycle"].ToString();
                    // add by Text_FreightInvoicingCycle umar 
                    Account.FreightInvoicingCycle = Convert.ToInt32(dr["FreightInvoicingCycle"]);
                    Account.Text_FreightInvoicingCycle = dr["Text_FreightInvoicingCycle"].ToString();
                    // Umar //
                    Account.Text_ForwarderAsConsignee = dr["Text_ForwarderAsConsignee"].ToString();
                    Account.ForwarderAsConsignee = Convert.ToBoolean(dr["ForwarderAsConsignee"].ToString());
                    //Tarun Kumar Singh
                    //Account.AccountCode =Convert.ToString(dr["Name"]).ToUpper()+" ["+dr["AccountCode"].ToString()+"]";
                    Account.AccountCode = Convert.ToString(dr["HeaderColumnName"]).ToUpper();
                    Account.VAccountNo = dr["VAccountNo"] == null ? "" : Convert.ToString(dr["VAccountNo"]);
                    //Tarun Kumar Singh

                    Account.SMS = Convert.ToBoolean(dr["SMS"]) == false ? false : true;
                    Account.Message = Convert.ToBoolean(dr["Message"]) == false ? false : true;
                    Account.Mobile = Convert.ToString(dr["Mobile"]).ToUpper();
                    Account.Email = Convert.ToString(dr["Email"]).ToUpper();

                    Account.isCL = Convert.ToInt32(dr["isCL"]);
                    Account.DisplayName = Convert.ToString(dr["DisplayName"]).ToUpper();
                    Account.IsVendorType = Convert.ToInt32(dr["IsVendorType"]);
                    Account.VendorType = dr["VendorType"].ToString().ToUpper();



                    Account.RegulatedAgentRegNo = dr["RegulatedAgentRegNo"].ToString().ToUpper();
                    Account.AgentRegExpirydate = dr["AgentRegExpirydate"].ToString() == "" ? (DateTime?)null : DateTime.Parse(dr["AgentRegExpirydate"].ToString());

                    ///SaCHIN 28-12-2016 

                    Account.CustomCode = "";
                    Account.CustomerTypeSNo = Convert.ToInt16(dr["CustomerTypeSNo"].ToString() == "" ? "0" : dr["CustomerTypeSNo"]);
                    Account.Text_CustomerTypeSNo = Convert.ToString(dr["Text_CustomerTypeSNo"]);
                    //Convert.ToInt32(dr["Text_CustomerTypeSNo"] == null ? 0 : Convert.ToInt32(dr["Text_CustomerTypeSNo"])); 
                    Account.TransactionTypeSNo = Convert.ToInt16(dr["TransactionTypeSNo"] == "" ? 0 : Convert.ToInt16(dr["TransactionTypeSNo"]));
                    Account.Text_TransactionTypeSNo = Convert.ToString(dr["Text_TransactionTypeSNo"]);

                    string a = string.Empty;
                    int Zero = 0;
                    //string b = dr["CountrySNo"].ToString();
                    //if(b == "")
                    //{
                    //    b = "0";
                    //}
                    Account.CountrySNo = Convert.ToInt32(dr["CountrySNo"]) == 0 ? 0 : Convert.ToInt32(dr["CountrySNo"]);
                    Account.Text_CountrySNo = Convert.ToString(dr["Text_CountrySNo"]);
                    ///Convert.ToInt32(FormElement["CountrySNo"] ==""?(int?)0: Convert.ToInt32(FormElement["CountrySNo"])),

                    Account.IndustryTypeSNO = Convert.ToInt32(dr["IndustryTypeSNO"] == "" ? (int?)0 : Convert.ToInt32(dr["IndustryTypeSNO"]));

                    Account.Text_IndustryTypeSNO = Convert.ToString(dr["Text_IndustryTypeSNO"]);

                    Account.RARegistrationNo = Convert.ToString(dr["RARegistrationNo"]);

                    Account.RARegistrationExpDate = (dr["RARegistrationExpDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["RARegistrationExpDate"].ToString());

                    Account.ConsolidateInvoicing = Convert.ToBoolean(dr["ConsolidateInvoicing"]);

                    Account.ConsolidateStock = Convert.ToBoolean(dr["ConsolidateStock"]);

                    Account.ParticipantID = Convert.ToString(dr["ParticipantID"]);

                    Account.ERPCode = Convert.ToString(dr["ERPCode"]);

                    Account.StockType = Convert.ToBoolean(dr["StockType"]);
                    Account.StockTypEActive = Convert.ToString(dr["StockTypEActive"]);
                    Account.ConsolidateInvoicingActive = Convert.ToString(dr["ConsolidateInvoicingActive"]);
                    Account.ConsolidateStockActive = Convert.ToString(dr["ConsolidateStockActive"]);

                    Account.GarudaMile = Convert.ToString(dr["GarudaMile"]);
                    Account.LoginColorCodeSno = Convert.ToInt32(dr["LoginColorCodeSno"]);
                    Account.Text_LoginColorCodeSno = Convert.ToString(dr["LoginColorCodeName"]);
                    Account.Text_BusinessTypeSno = Convert.ToString(dr["BusinessTypeSno"]);

                    // Account.RateMarkUp = (dr["RateMarkUp"].ToString() == string.Empty) ? (int?)null : Convert.ToInt32(dr["RateMarkUp"].ToString());


                    Account.IsAutoStock = Convert.ToInt16(dr["IsAutoStock"]);
                    Account.AutoStock = Convert.ToString(dr["AutoStock"]).ToUpper();
                    Account.NumOfDueDays = Convert.ToInt32(dr["NumOfDueDays"] == "" ? "0" : dr["NumOfDueDays"]);
                    Account.Remarks = Convert.ToString(dr["Remarks"]);
                    Account.Text_VatExempt = Convert.ToString(dr["Text_VatExempt"]);
                    Account.VatExempt = Convert.ToBoolean(dr["VatExempt"]);
                    Account.OtherAirlineSNo = "";//Convert.ToString(dr["OtherAirlineSNo"]);
                    Account.ORCPercentage = dr["ORCPercentage"] == DBNull.Value ? (Decimal?)null : Convert.ToDecimal(dr["ORCPercentage"]);
                    Account.NoofReplan = Convert.ToInt32(dr["NoofReplan"]);
                    Account.Text_OtherAirlineSNo = "";//Convert.ToString(dr["Text_OtherAirlineSNo"]);
                    Account.Text_IsAsAgreed = dr["Text_IsAsAgreed"].Equals(DBNull.Value) ? "" : Convert.ToString(dr["Text_IsAsAgreed"]);
                    //Account.IsAsAgreed = Convert.ToBoolean(dr["IsAsAgreed"]);
                    Account.IsAsAgreed = dr["IsAsAgreed"].Equals(DBNull.Value) ? false : Convert.ToBoolean(dr["IsAsAgreed"]);
                    // Added By Pankaj Kumar Ishwar
                    Account.GSTNumber = Convert.ToString(dr["GSTNumber"]);
                    Account.GSTBillingAddress = Convert.ToString(dr["GSTBILLINGADDRESS"]);
                    Account.DefaultGSTNumber = Convert.ToString(dr["DefaultGSTNumber"]);
                    Account.DefaultGSTBillingAddress = Convert.ToString(dr["DefaultGSTBillingAddress"]);
                    Account.RegisteredCompanyName = Convert.ToString(dr["RegisteredCompanyName"]);
                    if (!String.IsNullOrEmpty(dr["VisibilityofPriority"].ToString()))
                    {
                        Account.VisibilityofPriority = Convert.ToBoolean(dr["VisibilityofPriority"]);
                        Account.Text_VisibilityofPriority = dr["Text_VisibilityofPriority"].ToString().ToUpper();
                    }
                 Account.SplitShipmentAllowed = dr["SplitShipmentAllowed"].Equals(DBNull.Value) ? (int?)null : Convert.ToInt32(dr["SplitShipmentAllowed"]);
                 Account.Text_SplitShipmentAllowed = dr["SplitShipmentAllowed"].Equals(DBNull.Value) ? "" : Convert.ToInt32(dr["SplitShipmentAllowed"]) == 1 ? "Domestic" : (Convert.ToInt32(dr["SplitShipmentAllowed"]) == 2 ? "International" : (Convert.ToInt32(dr["SplitShipmentAllowed"]) == 3? "Both" : "None"));                 
                   
                    Account.AWBPrintAllowedHour = dr["AWBPrintAllowedHour"].Equals(DBNull.Value) ? (int?)null : Convert.ToInt32(dr["AWBPrintAllowedHour"]);
                    Account.AWBLabelAllowedHour = dr["AWBLabelAllowedHour"].Equals(DBNull.Value) ? (int?)null : Convert.ToInt32(dr["AWBLabelAllowedHour"]);
                    Account.IsExcludeBankGuarantee = Convert.ToBoolean(dr["IsExcludeBankGuarantee"]) == false ? false : true;

                    
                }
                dr.Close();
                return Account;

            }
            catch(Exception ex)//
            {
                throw ex;
            }
           
        }

        /// <summary>
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
                string filters = GridFilter.ProcessFilters<Account>(filter);
                SqlParameter[] Parameters = {new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccount", Parameters);
                var AccountList = ds.Tables[0].AsEnumerable().Select(e => new Account
                {
                    Text_AccountTypeSNo = e["Text_AccountTypeSNo"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    SNo = Convert.ToInt32(e["SNo"]),
                    //Text_CitySNo = e["CityCode"].ToString(),//foriegn key
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString().ToUpper(),
                    Blacklist = e["Blacklist"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    Text_ForwarderAsConsignee = e["Text_ForwarderAsConsignee"].ToString().ToUpper(),
                    Text_OfficeSNo = e["Text_OfficeSNo"].ToString().ToUpper(),
                    Text_CustomerTypeSNo = e["Text_CustomerTypeSNo"].ToString().ToUpper(),
                    Text_TransactionTypeSNo = e["Text_TransactionTypeSNo"].ToString().ToUpper(),
                    IATA=Convert.ToString(e["IATA"]).ToUpper(),// Add by Pankaj kumar ishwar
                    IATANo = e["IATANo"].ToString().ToUpper(),
                    CASSNo = e["CASSNo"].ToString().ToUpper(),
                    AccountNo = e["AccountNo"].ToString().ToUpper(),
                    //------------------ excel only------------------------------------
                    Text_InvoicingCycle = e["Text_InvoicingCycle"].ToString().ToUpper(),
                    Text_FreightInvoicingCycle=e["Text_FreightInvoicingCycle"].ToString().ToUpper(), // add by umar
                    Text_Branch = e["Text_Branch"].ToString().ToUpper(),//((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ICMSEnvironment"].ToUpper() == "GA" ? e["Text_Branch"].ToString().ToUpper() : e["Text_Branch"].ToString() != "" ? "NO" : "YES",
                    Branch = e["Branch"].ToString().ToUpper(),
                    //   Text_Branch = e["Text_Branch"].ToString().ToUpper(),
                    CurrencyCode = e["CurrencyCode"].ToString().ToUpper(),
                    GarudaMile = e["GarudaMile"].ToString().ToUpper(),
                   Text_LoginColorCodeSno = e["Text_LoginColorCodeSno"].ToString().ToUpper(),
                    ValidFrom = DateTime.Parse(e["ValidFrom"].ToString()),
                    ValidTo = DateTime.Parse(e["ValidTo"].ToString()),
                    Text_IndustryTypeSNO = e["Text_IndustryTypeSNO"].ToString().ToUpper(),
                    Text_CountrySNo = e["Text_CountrySNo"].ToString().ToUpper(),
                   CreditLimit = Convert.ToDecimal(e["CreditLimit"].ToString()),
                   VAccountNo = e["VAccountNo"].ToString().ToUpper(),
                   Address = e["Address"].ToString().ToUpper(),
                    ERPCode = e["VACode"].ToString().ToUpper(),
                    GSTNumber = e["GSTNumber"].ToString().ToUpper(),
            
                    GSTBillingAddress = e["GSTBILLINGADDRESS"].ToString().ToUpper(),
                    DefaultGSTNumber = e["DefaultGSTNumber"].ToString().ToUpper(),

                    DefaultGSTBillingAddress = e["DefaultGSTBillingAddress"].ToString().ToUpper(),
                    RegisteredCompanyName = e["RegisteredCompanyName"].ToString().ToUpper(),

                    //-------- contact info
                    Email = e["DesignationName"].ToString().ToUpper(),
                    CustomCode = e["Salutation"].ToString().ToUpper(),
                    AccountCode = e["FirstName"].ToString().ToUpper(),
                    DisplayName = e["LastName"].ToString().ToUpper(),
                    Mobile = e["Mobile"].ToString().ToUpper(),
                    BankIntegrate = e["BankIntegrate"].ToString().ToUpper(),
                    OfficeTypeName = e["OfficeTypeName"].ToString().ToUpper(),
                    //----------- end here-------------------
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AccountList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save the Account Information into Account and CreditLimit Entity 
        /// </summary>
        /// <param name="Account">object of the Entity</param>
        public List<string> SaveAccount(List<Account> account)      
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule

                DataTable dtCreateAccount = CollectionHelper.ConvertTo(account, "AccountCode,VAccountNo,Active,Text_CitySNo,Text_CurrencySNo,Text_AccountTypeSNo,Text_AirlineSNo,Text_OfficeSNo,Text_Branch,AllowedConsolidatedCL,AllowedCL,HeadAccount,Warehouse,Text_InvoicingCycle,Text_FreightInvoicingCycle,Blacklist,Text_ForwarderAsConsignee,isCL,VendorType,Text_CustomerTypeSNo,Text_TransactionTypeSNo,Text_CountrySNo,Text_IndustryTypeSNO,StockTypEActive,ConsolidateInvoicingActive,ConsolidateStockActive,Text_LoginColorCodeSno,Text_BusinessTypeSno,Text_RateMarkUp,AutoStock,Text_VatExempt,Text_OtherAirlineSNo,Text_IsAsAgreed,BankIntegrate,Text_VisibilityofPriority,Text_SplitShipmentAllowed,IATA,OtherAirlinesSlab,OfficeTypeName");
                DataTable dtCreditLimit = CollectionHelper.ConvertTo(account, "CreatedOn,UpdatedOn");
                DataTable dtOtherAirlines = CollectionHelper.ConvertTo(account[0].OtherAirlinesSlab, "AirlineName,AirlineSNo,OtherAirlinesSlab");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Account", dtCreateAccount, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter paramAccount = new SqlParameter();
                paramAccount.ParameterName = "@AccountTable";
                paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
                paramAccount.Value = dtCreateAccount;
                SqlParameter paramratedetails = new SqlParameter();
                paramratedetails.ParameterName = "@OtherAirlineAccess";
                paramratedetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramratedetails.Value = dtOtherAirlines;
                SqlParameter[] Parameters = { paramAccount, paramratedetails };
                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccount", Parameters);
                //try
                //{
                //}
                //catch(Exception ex)// (Exception e)
                //{
                //    string str = e.Message;
                //}
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Account");
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
        /// Update the Account Information into Account and Credit Limit Entity
        /// </summary>
        /// <param name="Account">list of Account to be updated</param>
        public List<string> UpdateAccount(List<Account> Account)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //validate Business Rule
                DataTable dtCreateAccount = CollectionHelper.ConvertTo(Account, "AccountCode,VAccountNo,Active,Text_CitySNo,Text_CurrencySNo,Text_AccountTypeSNo,Text_AirlineSNo,Text_OfficeSNo,Text_Branch,AllowedConsolidatedCL,AllowedCL,HeadAccount,Warehouse,Text_InvoicingCycle,Text_FreightInvoicingCycle,Blacklist,Text_ForwarderAsConsignee,isCL,VendorType,Text_CustomerTypeSNo,Text_TransactionTypeSNo,Text_CountrySNo,Text_IndustryTypeSNO,StockTypEActive,ConsolidateInvoicingActive,ConsolidateStockActive,Text_LoginColorCodeSno,Text_BusinessTypeSno,Text_RateMarkUp,AutoStock,Text_VatExempt,Text_OtherAirlineSNo,Text_IsAsAgreed,Text_GSTNumber,BankIntegrate,Text_VisibilityofPriority,Text_SplitShipmentAllowed,IATA,Text_AWBPrintAllowedHour,Text_AWBLabelAllowedHour,OtherAirlinesSlab,OfficeTypeName");
               
                DataTable dtOtherAirlines = CollectionHelper.ConvertTo(Account[0].OtherAirlinesSlab, "AirlineName,AirlineSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Account", dtCreateAccount, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAccount;
                SqlParameter paramratedetails = new SqlParameter();
                paramratedetails.ParameterName = "@OtherAirlineAccess";
                paramratedetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramratedetails.Value = dtOtherAirlines;
                SqlParameter[] Parameters = { param, paramratedetails };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccount", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Account");
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
        /// InActive the perticular Account information
        /// </summary>
        /// <param name="RecordID">Id of that Account </param>
        public List<string> DeleteAccount(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
               
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@AccountCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccount", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Account");
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

        public DataSourceResult GetCurrency(String CityCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCurrencyCity", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CurrencyCode"].ToString());
                    cur.Add(dr["CurrencyName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> GetRecordProduct(int recordID, string UserID)
        {
            try
            {
                List<String> product = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", UserID) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordProduct", Parameters);
                AccountTarget accountTarget = new AccountTarget();
                if (dr.Read())
                {
                    product.Add(dr["SNo"].ToString());
                    product.Add(dr["ProductName"].ToString());
                }
                //var ProductList = ds.Tables[0].AsEnumerable().Select(e => new AccountTarget
                //{
                //    ProductName = e["ProductName"].ToString().ToUpper(),
                //    ProductSNo = Convert.ToInt32(e["SNo"])

                //});

                dr.Close();
                dr.Dispose();
                return product; ;
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public DataSourceResult GetOffice(String CityCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordOfficeAutocomplete", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["SNo"].ToString());
                    cur.Add(dr["Name"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetOfficeType(String OfficeSno)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSno", OfficeSno) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeTypeName", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["OfficeTypeName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetCreditLimit(String AccountSNo)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditLimit", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CreditLimit"].ToString());
                    cur.Add(dr["MinimumCL"].ToString());
                    cur.Add(dr["AlertCLPercentage"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<ContactInformation>> GetContactInformationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ContactInformation contactInformation = new ContactInformation();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AccountSNo", recordID),
                                           new SqlParameter("@PageNo", page),
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@WhereCondition", whereCondition),
                                           new SqlParameter("@OrderBy", sort)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetContactInformationRecord", Parameters);

                var obj = ds.Tables[0].AsEnumerable().Select(e => new ContactInformation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    //   Name = e["Name"].ToString().ToUpper(),
                    //  Name2 = e["Name2"].ToString().ToUpper(),
                    Salutation = e["Salutation"].ToString().ToUpper(),
                    FirstName = e["FirstName"].ToString().ToUpper(),
                    LastName = e["LastName"].ToString().ToUpper(),
                    Designation = e["Designation"].ToString().ToUpper(),
                    Position = e["Position"].ToString().ToUpper(),
                    MobileNo = e["MobileNo"].ToString().ToUpper(),
                    EmailId = e["EmailId"].ToString().ToUpper(),
                    CountryName = e["CountryName"].ToString().ToUpper(),
                    HdnCountryName = e["CountryNameSNo"].ToString().ToUpper(),
                    //  FaxNumber = e["FaxNumber"].ToString().ToUpper(),

                    PhoneNo = e["PhoneNo"].ToString().ToUpper(),
                    Address = e["Address"].ToString().ToUpper(),
                    Address2 = e["Address2"].ToString().ToUpper(),
                    Telex = e["Telex"].ToString().ToUpper(),


                    PostalCode = e["PostalCode"].ToString().ToUpper(),
                    Town = e["Town"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    HdnCityName = e["CityNameSNo"].ToString().ToUpper(),
                    State = e["State"].ToString().ToUpper(),
                    District = e["District"].ToString().ToUpper(),
                    SubDistrict = e["SubDistrict"].ToString().ToUpper(),
                    Off_EmailId = e["Off_EmailId"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    IsActive = e["IsActive"].ToString().ToUpper()

                });

                if (obj.Any())
                    return new KeyValuePair<string, List<ContactInformation>>(ds.Tables[1].Rows[0][0].ToString(), obj.AsQueryable().ToList());
                else
                    return new KeyValuePair<string, List<ContactInformation>>("", obj.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> CreateUpdateAccountContact(string strData)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dt = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                DataTable dtAccountContact = new DataTable();
                dtAccountContact.Columns.Add("SNo");
                dtAccountContact.Columns.Add("AccountSNo");
                //  dtAccountContact.Columns.Add("Name");
                // dtAccountContact.Columns.Add("Name2");
                dtAccountContact.Columns.Add("Salutation");
                dtAccountContact.Columns.Add("FirstName");
                dtAccountContact.Columns.Add("LastName");
                dtAccountContact.Columns.Add("Designation");
                dtAccountContact.Columns.Add("Position");
                dtAccountContact.Columns.Add("Mobile");
                dtAccountContact.Columns.Add("Email");
                dtAccountContact.Columns.Add("CountryCode");
                dtAccountContact.Columns.Add("CitySNo");
                dtAccountContact.Columns.Add("State");
                dtAccountContact.Columns.Add("District");
                dtAccountContact.Columns.Add("SubDistrict");
                dtAccountContact.Columns.Add("Address");
                dtAccountContact.Columns.Add("Address2");
                dtAccountContact.Columns.Add("PostalCode");
                dtAccountContact.Columns.Add("Phone");
                dtAccountContact.Columns.Add("Off_EmailID");
             


                dtAccountContact.Columns.Add("Town");


                dtAccountContact.Columns.Add("Telex");
               

                dtAccountContact.Columns.Add("IsActive");
                dtAccountContact.Columns.Add("FaxNumber");
                dtAccountContact.Columns.Add("CreatedBy");
                dtAccountContact.Columns.Add("UpdatedBy");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtAccountContact.NewRow();
                    drRow["SNo"] = dr["SNo"];
                    drRow["AccountSNo"] = dr["AccountSNo"];
                    // drRow["Name"] = dr["Name"];
                    // drRow["Name2"] = dr["Name2"];

                    drRow["Salutation"] = dr["Salutation"];
                    drRow["FirstName"] = dr["FirstName"];
                    drRow["LastName"] = dr["LastName"];
                    drRow["Designation"] = dr["Designation"];
                    drRow["Position"] = dr["Position"];
                    drRow["Mobile"] = dr["MobileNo"];
                    drRow["Email"] = dr["EmailId"];
                    // drRow["FaxNumber"] = dr["FaxNumber"];
                    drRow["CountryCode"] = dr["HdnCountryName"];
                    drRow["CitySNo"] = dr["HdnCityName"];
                    drRow["State"] = dr["State"];
                    drRow["District"] = dr["District"];
                    drRow["SubDistrict"] = dr["SubDistrict"];
                    drRow["Address"] = dr["Address"];
                    drRow["Address2"] = dr["Address2"];
                    drRow["PostalCode"] = dr["PostalCode"];
                    drRow["Phone"] = dr["PhoneNo"];
                    drRow["Off_emailID"] = dr["Off_emailID"];
                    drRow["Town"] = dr["Town"];

                    drRow["Telex"] = dr["Telex"];

                    drRow["IsActive"] = dr["Active"];
                 //   drRow["Fax"] = "No";
                    drRow["CreatedBy"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    drRow["UpdatedBy"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    dtAccountContact.Rows.Add(drRow);
                }
                var dtCreateAccountContact = (new DataView(dtAccountContact, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAccountContact = (new DataView(dtAccountContact, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountContactType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAccountContact.Rows.Count > 0)
                {
                    param.Value = dtCreateAccountContact;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountContact", Parameters);
                }
                // for update existing record
                if (dtUpdateAccountContact.Rows.Count > 0)
                {
                    param.Value = dtUpdateAccountContact;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountContact", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountContactInformation");
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

        public List<string> DeleteAccountContact(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountContact", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountContactInformation");
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

        public KeyValuePair<string, List<Branch>> GetBranchRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                Branch branch = new Branch();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AccountSNo", recordID)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBranchRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    var branchList = ds.Tables[0].AsEnumerable().Select(e => new Branch
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        CityCode = e["CityCode"].ToString(),
                        CityName = e["CityName"].ToString(),
                        Name = e["Name"].ToString(),
                        Address = e["Address"].ToString(),
                        CreditLimit = Convert.ToDecimal(e["CreditLimit"]),
                        MasterCreditLimit  = Convert.ToDecimal(e["MasterCreditLimit"]),
                        TotalCreditLimit = Convert.ToDecimal(e["TotalCreditLimit"]),
                        RemainingCreditLimit = Convert.ToDecimal(e["RemainingCreditLimit"]),
                        MasterRCL = Convert.ToDecimal(e["MasterRCL"]),
                        UtilizedCL = Convert.ToDecimal(e["UtilizedCL"])


                    });
                    return new KeyValuePair<string, List<Branch>>(ds.Tables[0].Rows[0][0].ToString(), branchList.AsQueryable().ToList());
                }
                else
                    return new KeyValuePair<string, List<Branch>>(string.Empty, null);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetCityInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                
                
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityInformation", Parameters);
                    ds.Dispose();
                
               
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetCountryAndCity(string CitySNo)
        {
           DataSet ds = new DataSet();
                try
                {
                    SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCountryAndCity", Parameters);
                    ds.Dispose();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            
           
        }

     
        public string GetAccountCity(string CountrySNo)
        {
           
                DataSet ds = new DataSet();
                try
                {
                    SqlParameter[] Parameters = { new SqlParameter("@CountrySNo", CountrySNo) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAccountCity", Parameters);
                    ds.Dispose();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
           
        }

        public string GetGarudaMiles(string GarudaMile,int Sno)
        {
            
                DataSet ds = new DataSet();
                DataSet ds1 = new DataSet();
                try
                {
                    SqlParameter[] Parameters = { new SqlParameter("@GarudaMile", GarudaMile), new SqlParameter("@Sno", Sno) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGarudaMile", Parameters);
                    ds.Dispose();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
                //if(ds.Tables[0].Rows[0]["data"].ToString()=="0")
                //{
                //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds1);

                //}
                //else
                //{
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                //  }
           
            
            
        }

        public string GetLoginColorCode(string Sno)
        {
            
                DataSet ds = new DataSet();
                try
                {
                    SqlParameter[] Parameters = { new SqlParameter("@Sno", Convert.ToInt32(Sno)) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordLoginColorCode", Parameters);
                    ds.Dispose();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
           
            
        }

        public string ValidateBranch(string Branch, string recID) 
        {
            DataSet ds;
          try
                {
                    SqlParameter[] Parameters = { new SqlParameter("@Branch", Branch),
                                                  new SqlParameter("@recID", recID)
                                                };
                     ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateBranch", Parameters);
                    ds.Dispose();
                }
                catch(Exception ex)//
                {
                    throw ex;
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
       
        }

        public string UpdateBranchCreditLimit(List<BranchCreditLimit> BranchCreditLimit, int MasterSNo, decimal MasterAccountCL, int UserSNo) {
            DataTable dtBranchCL = CollectionHelper.ConvertTo(BranchCreditLimit, "");
            SqlParameter paramRateDetails = new SqlParameter();
            paramRateDetails.ParameterName = "@BranchCreditLimit";
            paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateDetails.Value = dtBranchCL;
            SqlParameter[] param = {
                                              new SqlParameter("@MasterSNo", MasterSNo),
                                              new SqlParameter("@MasterAccountCL", MasterAccountCL),
                                              paramRateDetails,
                                              new SqlParameter("@UserSNo", UserSNo)

            };
            DataSet ds = new DataSet();
             ds  = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_UpdateBranchCreditLimit", param);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            //   return (ds.Tables[0].Rows[0][0].ToString());
        }

        public string CreateUpdateOtherAirlineRecord(List<OtherAirlines> OtherAirlines)
        {
            DataTable dtOtherAirlines = CollectionHelper.ConvertTo(OtherAirlines, "AirlineName,HdnAirlineSNo");
            SqlParameter paramRateDetails = new SqlParameter();
            paramRateDetails.ParameterName = "@OtherAirlineAccess";
            paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateDetails.Value = dtOtherAirlines;
            DataSet ds;
            try
            {
                SqlParameter[] param = {
                                         
                                              paramRateDetails,
                                             
            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateUpdateOtherAirlineRecord", param);
                ds.Dispose();
            }
            catch (Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        public KeyValuePair<string, List<OtherAirlines>> GetOtherAirlinesRecord(string recordID)
        {
            try
            {
                OtherAirlines AirlineParameterInformation = new OtherAirlines();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AccountSNo", recordID)
                                          
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherAirlinesRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    var OtherAirlinesList = ds.Tables[0].AsEnumerable().Select(e => new OtherAirlines
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        HdnAirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                        AirlineSNo = e["AirlineName"].ToString(),
                        ReferenceNumber = e["ReferenceNumber"].ToString().ToUpper(),
                    });
                    return new KeyValuePair<string, List<OtherAirlines>>(ds.Tables[0].Rows[0][0].ToString(), OtherAirlinesList.AsQueryable().ToList());
                }
                else
                    return new KeyValuePair<string, List<OtherAirlines>>(string.Empty, null);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> DeleteOtherAirlinesRecord(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;

                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOtherAirlinesRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Account");
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
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
          
        }

        public string BranchAirline(int MasterAccount) {
            DataSet ds;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@MasterAccount", MasterAccount)
                                                  
                                                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBranchAirline", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }
    }
}
