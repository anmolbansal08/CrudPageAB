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
    public class CreditDebitNoteApprovalService : SignatureAuthenticate, ICreditDebitNoteApprovalService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CreditDebitNoteApprovalGrid>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters.Replace("CreatedOn", "CreatedOnSearch")),
                                            new SqlParameter("@OrderBy", sorts),
                                             /*For Multicity*/ 
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),
                                            new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCreditNoteApproval", Parameters);
                var DutyAreaList = ds.Tables[0].AsEnumerable().Select(e => new CreditDebitNoteApprovalGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IssuedName = e["IssuedName"].ToString().ToUpper().ToUpper(),
                    Amount = e["Amount"].ToString().ToUpper(),
                    TransactionNo = e["TransactionNo"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    TransactionType = e["TransactionType"].ToString().ToUpper(),
                    InvoiceNo = e["InvoiceNo"].ToString().ToUpper(),
                    // CreatedOn = Convert.ToDateTime(e["CreatedOn"].ToString()),
                    CreatedOn = DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    IssuedTo = e["IssuedTo"].ToString().ToUpper(),
                    TotalCharges = e["TotalCharges"].ToString().ToUpper(),
                    CreditNoteType = e["CreditNoteType"].ToString().ToUpper(),
                    ApprovedAmount = e["ApprovedAmount"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DutyAreaList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateCreditDebitNoteApproval(List<CreditDebitNoteApproval> lstCreditDebitNote)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstCreditDebitNote[0].LstCNDNChargesTrans, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("CreditDebitNoteApproval", dtCreateIrr, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@LstCharges";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrr;
                SqlParameter[] Parameters = {
                                            param ,
                                            new SqlParameter("@CNDNSNo",lstCreditDebitNote[0].CNDNSNo),
                                            new SqlParameter("@CreatedBy",lstCreditDebitNote[0].CreatedBy)
                                        };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreditNoteApproval", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CreditDebitNoteApproval");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

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

        public string GetCNDNInvoice(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                int InvoiceSNo, AWBSNo;
                InvoiceSNo = Convert.ToInt32(whereCondition.Split('-')[0].ToString());
                AWBSNo = Convert.ToInt32(whereCondition.Split('-')[1].ToString());
                SqlParameter[] Parameters = {
                                           new SqlParameter("@InvoiceSNo", InvoiceSNo),
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCNDNInvoicePending", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCNDNInvoiceRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                int CNDN_SNo;
                CNDN_SNo = Convert.ToInt32(whereCondition);
                SqlParameter[] Parameters = {
                                           new SqlParameter("@CNDN_SNo", CNDN_SNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCNDNInvoiceRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
