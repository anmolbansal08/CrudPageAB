using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Accounts
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "VerifyPaymentService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class VerifyPaymentService : SignatureAuthenticate, IVerifyPaymentService
    {
        public VerifyPayment GetVerifyPaymentRecord(int recordID, string UserID)
        {           
            try
            {
                string proc = "";
                VerifyPayment dp = new VerifyPayment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                 if (System.Web.HttpContext.Current.Request.QueryString.ToString().Split('=')[4] == "O")
                {
                    proc = "GetRecordDirectPayment_Office";
                }
                else
                    proc = "GetRecordDirectPayment";

                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, proc, Parameters);
                if (dr.Read())         
                
                {
                    dp.AccountSNo = Convert.ToInt32(dr["SNo"]);
                    dp.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                    dp.Office = dr["Office"].ToString().ToUpper();
                    dp.Agent = dr["Agent"].ToString().ToUpper();
                    dp.Amount = Convert.ToString(dr["Amount"]);
                    dp.CreditLimit = Convert.ToString(dr["Credit"]);
                    dp.UpdateTypeText = dr["UpdateType"].ToString();
                    dp.TransactionType = dr["Transaction"].ToString();
                    if (dp.Agent != "")
                    {
                        dp.CreatedUser = dr["CreatedUser"].ToString();
                    }
                    if (dp.Office != "")
                    {
                        dp.CreatedUser = dr["OfficeCreatedUser"].ToString();
                    }
                    dp.UpdatedUser = dr["UpdatedUser"].ToString();
                    dp.Airline = dr["Airline"].ToString();
                    dp.City = dr["City"].ToString();
                    dp.AccountNo = dr["AccountNo"].ToString();
                    dp.ExistingCreditLimit = Convert.ToString(dr["ExistingCreditLimit"]);
                    dp.BankGaranteeValidFrom = dr["ValidFrom"].ToString();
                    dp.BankGaranteeValidTo = dr["validTo"].ToString();
                    dp.PaymentDate = dr["PaymentDate"].ToString();
                    dp.TransectionModeSNo = dr["Mode"].ToString();
                    dp.Remarks = dr["Remarks"].ToString();
                    dp.BankName = dr["BankName"].ToString();
                    dp.BranchName = dr["BranchName"].ToString();
                    dp.ChequeAccountName = dr["ChequeAccountName"].ToString();
                    dp.IsVerified = int.Parse(dr["IsVerified"].ToString());
                    dp.VerifiedRemarks = dr["VerifiedRemarks"].ToString();
                    dp.BankAccountNo = dr["BankAccountNo"].ToString();
                    if (dr["ChequeDate"].ToString() != "")
                    {
                        dp.ChequeDate = Convert.ToDateTime(dr["ChequeDate"].ToString());
                    }
                    if (dr["TransectionDate"].ToString() != "")
                    {
                        dp.ChequeDate = Convert.ToDateTime(dr["TransectionDate"].ToString());
                    }
                    dp.ReferenceNo = dr["ReferenceNo"].ToString();
                    dp.AwbNumber = dr["AwbNumber"].ToString(); // Add Awb Number by umar on 31-Aug-2018
                    dp.ChequeNo = dr["ChequeNo"].ToString();
                    dp.RefNo = dr["RefNo"].ToString();
                }
                dr.Close();
                return dp;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<VerifyPaymentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVerifyPaymentRecords", Parameters);
                var TaxRateList = ds.Tables[0].AsEnumerable().Select(e => new VerifyPaymentGridData
                {
                    SNo = Convert.ToString(e["SNo"]),
                    OfficeSNo = Convert.ToInt32(e["OfficeSNo"]),
                    Office = Convert.ToString(e["Office"]).ToUpper(),
                    Agent = Convert.ToString(e["Agent"]).ToUpper(),
                    Credit = Convert.ToString(e["Credit"]),
                    Amount = Convert.ToString(e["Amount"]),
                    UpdateType =Convert.ToString(e["UpdateType"]),
                    Transaction =Convert.ToString(e["Transaction"]),
                    RefNo = Convert.ToString(e["RefNo"]),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> SaveVerifyPayment(List<ISVerifyPayment> Payment)
        {
            try
            {
                
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreatePayment = CollectionHelper.ConvertTo(Payment, "RefNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                //if (!baseBusiness.ValidateBaseBusiness("ISVerifyPayment", dtCreatePayment, "SAVE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@VerifyPayment";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePayment;
                // int verify = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(ReadConnectionString.WebConfigConnectionString, "DP_VerifyPayment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "VerifyPayment");
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

        ////public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        ////{
        ////    string sorts = GridSort.ProcessSorting(sort);
        ////    string filters = GridFilter.ProcessFilters<VerifyPaymentGridData>(filter);
        ////    //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
        ////    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
        ////    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDirectPayment", Parameters);

        ////    //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
        ////    //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDirectPayment", Parameters);
        ////    var AirlineList = ds.Tables[0].AsEnumerable().Select(e => new VerifyPaymentGridData
        ////    {
        ////        SNo = Convert.ToInt32(e["SNo"]),
        ////        Office = e["Office"].ToString().ToUpper(),
        ////        Agent = e["Agent"].ToString().ToUpper(),
        ////        Credit = Convert.ToDecimal(e["Credit"]),
        ////        Amount = Convert.ToDecimal(e["Amount"]),
        ////        UpdateType = e["UpdateType"].ToString(),
        ////        Transaction = e["Transaction"].ToString()
        ////    });
        ////    ds.Dispose();
        ////    return new DataSourceResult
        ////    {
        ////        Data = AirlineList.AsQueryable().ToList(),
        ////        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
        ////    };
        ////}
    }
}
