using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DirectPaymentService : SignatureAuthenticate, IDirectPaymentService
    {

        //public string GetOffice(int AirlineSNo,int CitySNo)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@CitySNo", CitySNo) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "DirectPay_GetOffice", Parameters);
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}

        public string GetCreditLimitOffice(string SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "DP_OfficeCreditLimit", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetAirlineCurrency(int AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Tax_spAirlineCurrency", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }
       
       
         // public string SaveDirectPayment(List<DirectPayment> Payment)
         public List<string> SaveDirectPayment(List<DirectPayment> Payment)

        {
            try
            {
                List<string> ErrorMessage = new List<string>();


                DataTable dtCreatePayment = CollectionHelper.ConvertTo(Payment, "RefNo,Office,Agent,UpdateTypeText,Credit,Transaction,CreatedUser,UpdatedUser,Text_City,Text_Agent,Text_AirlineSNo,Text_CurrencySNo,Text_Office,PaymentBy,ExistingCreditLimit,CreditLimit,TransactionType,AccountNo,Text_TransectionModeSNo,Text_UpdateType,Text_AWBSNo,TotalNtaAmount");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("DirectPayment", dtCreatePayment, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DirectPayment";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePayment;
                SqlParameter[] Parameters = { param };          

                int ret = 0;

                int OfficeSno = int.Parse(dtCreatePayment.Rows[0]["OfficeSNo"].ToString());
                int AccountSno=int.Parse(dtCreatePayment.Rows[0]["AccountSNo"].ToString());
                string proc = string.Empty;
                if(AccountSno==0 && OfficeSno > 0)
                {
                    proc = "Office_Savedirectpayment";
                }             
                else
                {
                    proc = "SaveDirectPayment";
                }
                //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, proc, Parameters);
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, proc, Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DirectPayment");
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
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }



        /*
         updated by Shahbaz Akhtar on 27-12-2016 for view and grid        */
        public DirectPayment GetDirectPaymentRecord(int recordID, string UserID)
        {
            string proc = string.Empty;
            try
            {
                DirectPayment dp = new DirectPayment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                if (System.Web.HttpContext.Current.Request.QueryString.ToString().Split('=')[4] == "O")
                {
                    proc = "GetRecordDirectPayment_Office";
                }
                else
                {
                    proc = "GetRecordDirectPayment";
                }

                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, proc, Parameters);
                if (dr.Read())     

               // SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDirectPayment", Parameters);
              //  if (dr.Read())
                {
                    dp.SNo = Convert.ToString(dr["SNo"]);
                    dp.AccountSNo = Convert.ToInt32(dr["SNo"]);
                    dp.RefNo = dr["RefNo"].ToString();
                    dp.Office = dr["Office"].ToString().ToUpper();
                    dp.Agent = dr["Agent"].ToString().ToUpper();
                    dp.Amount = Convert.ToString(dr["Amount"]);
                    dp.Credit = Convert.ToString(dr["Credit"]);
                    dp.UpdateTypeText = dr["UpdateType"].ToString();
                    dp.Transaction = dr["Transaction"].ToString();
                    dp.CreatedUser = dr["CreatedUser"].ToString();
                    dp.UpdatedUser = dr["UpdatedUser"].ToString();
                    dp.AccountSNo = Convert.ToInt32(dr["AccountSNo"]);
                    dp.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    dp.AirlineSNo = Convert.ToInt32(dr["AirlineSno"]);
                    dp.OfficeSNo = Convert.ToInt32(dr["officeSno"]);
                    dp.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"]);
                    dp.AirlineSNo = Convert.ToInt32(dr["Airlinesno"]);
                    dp.Text_AirlineSNo = dr["Airline"].ToString();
                    dp.Text_Agent = dr["Agent"].ToString();
                    dp.Text_City = dr["City"].ToString();
                    dp.Text_CurrencySNo = dr["Currency"].ToString();
                    dp.Text_Office = dr["Office"].ToString();
                    dp.PaymentBy = dr["Office"].ToString() == "0" || dr["Office"].ToString() == "" ? 1 : 0;
                    dp.TransactionType = dr["TransactionType"].ToString();
                    dp.CreditLimit = dr["CreditLimit"].ToString();
                    dp.ExistingCreditLimit = Convert.ToString(dr["ExistingCreditLimit"]);
                    dp.PaymentDate = Convert.ToString(dr["PaymentDate"]);
                    dp.PaymentDateCal = string.IsNullOrEmpty(dr["PaymentDate"].ToString()) == true ? (DateTime?)null : Convert.ToDateTime(dr["PaymentDate"].ToString());
                    dp.Remarks = Convert.ToString(dr["Remarks"]);
                    dp.TotalNtaAmount = Convert.ToString(dr["TotalNtaAmount"]);
                    dp.TransectionModeSNo = Convert.ToInt32(dr["TransectionModeSNo"]);
                    dp.Text_TransectionModeSNo = Convert.ToString(dr["Text_TransectionModeSNo"]);
                    dp.Text_UpdateType = Convert.ToString(dr["Text_UpdateType"]);
                    dp.BankAccountNo = Convert.ToString(dr["BankAccountNo"]);
                    dp.BankName = Convert.ToString(dr["BankName"]);
                    dp.BranchName = Convert.ToString(dr["BranchName"]);
                    dp.ChequeAccountName = Convert.ToString(dr["ChequeAccountName"]);
                    dp.ChequeDate = string.IsNullOrEmpty(dr["ChequeDate"].ToString()) == true ? (DateTime?)null : Convert.ToDateTime(dr["ChequeDate"].ToString());
                    dp.ValidFrom = string.IsNullOrEmpty(dr["ValidFrom"].ToString()) == true ? (DateTime?)null : Convert.ToDateTime(dr["ValidFrom"].ToString());
                    dp.ValidTo = string.IsNullOrEmpty(dr["ValidTo"].ToString()) == true ? (DateTime?)null : Convert.ToDateTime(dr["ValidTo"].ToString());
                    dp.ReferenceNo = Convert.ToString(dr["ReferenceNo"]);
                    dp.Text_AWBSNo = dr["AwbNumber"].ToString();
                    dp.ChequeNo = Convert.ToString(dr["ChequeNo"]);
                    dp.Description = Convert.ToString(dr["Description"]).ToUpper();
                }
                dr.Close();
                return dp;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<DirectPaymentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDirectPayment", Parameters);
                var AirlineList = ds.Tables[0].AsEnumerable().Select(e => new DirectPaymentGridData
                {
                    SNo = Convert.ToString(e["SNo"]),
                    OfficeSNo = Convert.ToInt32(e["OfficeSNo"]),
                    RefNo = e["RefNo"].ToString().ToUpper(),
                    Office = e["Office"].ToString().ToUpper(),
                    Agent = e["Agent"].ToString().ToUpper(),
                    Credit = Convert.ToString(e["Credit"]),
                    Amount = Convert.ToString(e["Amount"]),
                    UpdateType = e["UpdateType"].ToString(),
                    Transaction = e["Transaction"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirlineList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        public string getAgentBankGurantee(string AccountSNo, string Flag)
        {
            try {
                SqlParameter[] parameters = { new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@Flag", Flag) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_getAgentBankGurantee", parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateDirectPayment(List<DirectPayment> Payment)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreatePayment = CollectionHelper.ConvertTo(Payment, "RefNo,Office,Agent,UpdateTypeText,Credit,Transaction,CreatedUser,UpdatedUser,Text_City,Text_Agent,Text_AirlineSNo,Text_CurrencySNo,Text_Office,PaymentBy,ExistingCreditLimit,CreditLimit,TransactionType,AccountNo,Text_TransectionModeSNo,Text_UpdateType,Text_AWBSNo,TotalNtaAmount");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("DirectPayment", dtCreatePayment, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DirectPayment";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePayment;
                SqlParameter[] Parameters = { param };
                int ret = 0;
                //  DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, "SaveDirectPayment", Parameters);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDirectPayment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DirectPayment");
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
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }


        // Add Delete Payment Method by UMAR On 07-Aug-2018
        public string DeleteDirectPayment(int SNo, int AccountSNo, int OfficeSNo)
        {                            
            DataSet ds = new DataSet();
            SqlParameter[] param = { new SqlParameter("@SNo", SNo), new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@OfficeSNo", OfficeSNo) };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "DeleteDirectPayment", param);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);                           
        }  


        public string GetExchangeRate(int Currency , int Mode , int AirlineSNo, int AccountSNo = 0)
        {
            try
            
            {
                SqlParameter [] param = {new SqlParameter("@Currency", Currency), new SqlParameter("@Mode",Mode), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@AccountSNo", AccountSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_ValidateExchangeRate", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }


        public string CheckRefNo(string RefNo) {
            try
            {
                SqlParameter[] param = { new SqlParameter("@RefNo", RefNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_ValidateRefNo", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        // Add Currency Exchange Function for FPR Report on 25-Oct-2018
        public string GetFPRExchangeRate(int Currency, int Mode, int AirlineSNo)
        {
            try
            {
                SqlParameter[] param = { new SqlParameter("@Currency", Currency), new SqlParameter("@Mode", Mode), new SqlParameter("@AirlineSNo", AirlineSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_ValidateExchangeRateFprLionReport", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        // For NTA Amount Awb on 05-Dec-2018
        public string NtaAmountDirectPayment(int AwbSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] param = { new SqlParameter("@AwbSNo", AwbSNo) };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_NtaAmountDirectPayment", param);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
