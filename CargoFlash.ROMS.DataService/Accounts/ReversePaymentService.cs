using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "ReversePaymentService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReversePaymentService : SignatureAuthenticate, IReversePaymentService
    {
        
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ReversePaymentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListApprovePayment", Parameters);
                var TaxRateList = ds.Tables[0].AsEnumerable().Select(e => new ReversePaymentGridData
                {
                    SNo = Convert.ToString(e["SNo"]),
                    OfficeSNo = Convert.ToInt32(e["OfficeSNo"]),
                    Office = Convert.ToString(e["Office"]).ToUpper(),
                    Agent = Convert.ToString(e["Agent"]).ToUpper(),
                    Credit = Convert.ToString(e["Credit"]),
                    Amount = Convert.ToString(e["Amount"]),
                    UpdateType = Convert.ToString(e["UpdateType"]),
                    Transaction = Convert.ToString(e["Transaction"]),
                    CityCode = Convert.ToString(e["CityCode"]), //DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),// e["ValidTo"].ToString().ToUpper(),
                    Currency = Convert.ToString(e["Currency"]),
                    ReferenceNo = Convert.ToString(e["ReferenceNo"]),
                    PaymentMode = Convert.ToString(e["PaymentMode"]),
                    PaymentRefNumber = Convert.ToString(e["PaymentRefNumber"]),
                    TransactionDate = Convert.ToString(e["TransactionDate"]), //e["TransactionDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["TransactionDate"]), DateTimeKind.Utc),// e["ValidTo"].ToString().ToUpper(),
                    ReceiptDate = Convert.ToString(e["ReceiptDate"]), //e["ReceiptDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ReceiptDate"]), DateTimeKind.Utc),// e["ValidTo"].ToString().ToUpper(),
                    ApprovedOn = Convert.ToString(e["ApprovedOn"]), //e["ApprovedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ApprovedOn"]), DateTimeKind.Utc),// e["ValidTo"].ToString().ToUpper(),
                  ApprovedRemarks = Convert.ToString(e["ApprovedRemarks"]),
                IsExcludeBankGuarantee =Convert.ToString(e["IsExcludeBankGuarantee"])               
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
               {
                   throw ex;
               }
        }

        public ReversePayment GetReversePaymentRecord(int recordID, string UserID)
        {
            try
            {
                string type = System.Web.HttpContext.Current.Request.QueryString.ToString().Split('=')[4];
                ReversePayment dp = new ReversePayment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID)),
                                          new SqlParameter("@PaymentType",type)};             

                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordApprovePayment", Parameters);
                if (dr.Read())
                {
                    dp.AccountSNo = Convert.ToInt32(dr["SNo"]);
                    dp.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                    dp.Office = dr["Office"].ToString();
                    dp.Agent = dr["Agent"].ToString();
                    dp.Amount = Convert.ToString(dr["Amount"]);
                    dp.CreditLimit = Convert.ToString(dr["Credit"]);
                    dp.UpdateTypeText = dr["UpdateType"].ToString();
                    dp.TransactionType = dr["Transaction"].ToString();
                    dp.CreatedUser = dr["CreatedUser"].ToString();
                    dp.UpdatedUser = dr["UpdatedUser"].ToString();
                    dp.VerifiedBy = dr["VerifiedBy"].ToString();
                    dp.Airline = dr["Airline"].ToString();
                    dp.City = dr["City"].ToString();
                    dp.AccountNo = dr["AccountNo"].ToString();
                    dp.ExistingCreditLimit = Convert.ToString(dr["ExistingCreditLimit"]);
                    dp.PaymentDate = dr["PaymentDate"].ToString();
                    dp.TransectionModeSNo = dr["Mode"].ToString();
                    dp.Remarks = dr["Remarks"].ToString();
                    dp.IsVerified = dr["IsVerified"].ToString();
                    dp.VerifiedRemarks = dr["VerifiedRemarks"].ToString();
                    dp.BankName = dr["BankName"].ToString();
                    dp.BranchName = dr["BranchName"].ToString();
                    dp.ChequeAccountName = dr["ChequeAccountName"].ToString();
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
                    dp.ChequeNo = dr["ChequeNo"].ToString();
                    dp.IsApproved = dr["IsApproved"].ToString();
                    dp.ApprovedRemarks = dr["ApprovedRemarks"].ToString();
                    dp.ApprovedBy = dr["ApprovedBy"].ToString();
                    dp.AwbNumber = dr["AwbNumber"].ToString();
                    dp.PaymentRefNumber = dr["PaymentRefNumber"].ToString();
                }
                dr.Close();
                return dp;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
       public List<string> SaveReversePayment(List<ISReversePayment> Payment)       
        {
            try
            {
                List<string> ErrorMessage = new List<string>();             
                DataTable dtCreatePayment = CollectionHelper.ConvertTo(Payment, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                //if (!baseBusiness.ValidateBaseBusiness("ISVerifyPayment", dtCreatePayment, "SAVE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ReversePayment";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePayment;
                // int verify = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                SqlParameter[] Parameters = { param };
                //int ret = 0;
                string proc = string.Empty;
                int OfficeSNo = int.Parse(dtCreatePayment.Rows[0]["OfficeSNo"].ToString());
                if (OfficeSNo > 0)
                {
                    proc = "DP_ReversePayment_Office";
                }
                else
                {
                    proc = "DP_ReversePayment";
                }
              //  DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, proc, Parameters);
              //  return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                int ret = (int)SqlHelper.ExecuteScalar(ReadConnectionString.WebConfigConnectionString, proc, Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ReversePayment");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSecurityDepositPrint(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] parameter = {new SqlParameter("@SNo",SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Sp_GetSecurityDepositAgent", parameter);
            }
            catch (Exception ex)// (Exception ex)
            {             
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Sp_GetSecurityDepositAgent"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
