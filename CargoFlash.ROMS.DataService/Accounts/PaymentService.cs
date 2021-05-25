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
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Accounts
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PaymentService : SignatureAuthenticate, IPaymentService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Payment>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPayment", Parameters);
                var PaymentList = ds.Tables[0].AsEnumerable().Select(e => new Payment
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ContactsTypeName = e["ContactsTypeName"].ToString(),
                    ContactsTypeDis = e["ContactsTypeDis"].ToString(),
                    PaymentdateDisplay = e["PaymentDate"].ToString() == string.Empty ? "" : DateTime.Parse(e["PaymentDate"].ToString()).ToString("dd-MM-yyyy"),
                    Amount = Convert.ToDecimal(e["Amount"].ToString()),
                    PaymentMode = e["PaymentMode"].ToString(),
                    //RequestedID = e["RequestedID"].ToString(),
                    CityName = e["CityName"].ToString(),
                    PaymentReferenceNo = e["PaymentReferenceNo"].ToString(),
                    RequestdateDisplay = e["RequestOn"].ToString() == "" ? "" : DateTime.Parse(e["RequestOn"].ToString()).ToString("dd-MM-yyyy"),
                    //InvoiceNo = e["InvoiceNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = PaymentList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public Payment GetPaymentRecord(string recordID)
        {
            try
            {
                Payment payment = new Payment();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordPayment", Parameters);
                if (dr.Read())
                {
                    payment.SNo = Convert.ToInt32(dr["SNo"]);
                    payment.PaymentReferenceNo = dr["PaymentReferenceNo"].ToString();
                    payment.CityName = dr["CityName"].ToString();
                    payment.ContactsTypeDis = dr["ContactsTypeDis"].ToString();
                    payment.ContactsTypeName = dr["ContactsTypeName"].ToString();
                    payment.Credit = dr["Credit"].ToString();
                    payment.Amount = Convert.ToDecimal(dr["Amount"]);
                    payment.PaymentdateDisplay = DateTime.Parse(dr["PaymentDate"].ToString()).ToString("dd-MMM-yyyy");
                    payment.PaymentMode = dr["PaymentMode"].ToString();
                    payment.Text_BankAccountSNo = dr["AccountNo"].ToString();
                    payment.ChequeNo = dr["ChequeNo"].ToString();
                    payment.ChequeDate = Convert.ToDateTime(dr["ChequeDate"]);
                    payment.BankName = dr["BankName"].ToString();
                    payment.BankCity = dr["BankCity"].ToString();
                    payment.DepositDateDisplay = DateTime.Parse(dr["DepositDate"].ToString()).ToString("dd-MMM-yyyy");
                    payment.OtherPaymentMode = dr["OtherPaymentMode"].ToString();
                    payment.Requested = dr["RequestUser"].ToString();
                    payment.RequestedRemarks = dr["RequestedRemarks"].ToString();

                }
                dr.Close();
                return payment;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save Payment Record 
        /// Created By : Amit Kumar Gupta
        /// Created On : 28 May 2014
        /// </summary>
        /// <param name="payment"></param>
        /// <returns></returns>
        public List<string> SavePayment(List<Payment> payment)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreatePayment = CollectionHelper.ConvertTo(payment, "Text_ContactTypeSNo,Text_CitySNo,Text_BankAccountSNo,RequestOn,VerifiedBy,VerifiedOn,VerifiedRemarks,ApprovedBy,ApprovedOn,ApprovedRemarks,IsRejected,IsReversed,ReversedBy,ReveresedOn,ReversedRemarks,BankPaymentRefID,BankGUID,BankPaymentRefDate,IsFPR,RequestedID,ContactsTypeName,ContactsTypeDis,PaymentMode,CityName,PaymentdateDisplay,DepositDateDisplay,RequestdateDisplay,Requested,Credit");
                //DataTable dtCreditLimit = CollectionHelper.ConvertTo(payment, "CreatedOn,UpdatedOn");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Payment", dtCreatePayment, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter paramAccount = new SqlParameter();
                paramAccount.ParameterName = "@PaymentTable";
                paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
                paramAccount.Value = dtCreatePayment;

                SqlParameter[] Parameters = { paramAccount };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreatePayment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Payment");
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
   }
}
