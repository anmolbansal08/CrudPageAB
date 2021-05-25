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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CreditDebitNoteService : SignatureAuthenticate, ICreditDebitNoteService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CreditDebitNoteGrid>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters.Replace("CreatedOn", "CreatedOnSearch")),
                                            new SqlParameter("@OrderBy", sorts), 
                                            /*For Multicity*/ 
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()),
                                            new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString() )
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCreditDebitNote", Parameters);
                var DutyAreaList = ds.Tables[0].AsEnumerable().Select(e => new CreditDebitNoteGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IssuedName = e["IssuedName"].ToString().ToUpper().ToUpper(),
                    Amount = e["Amount"].ToString().ToUpper(),
                    TransactionNo = e["TransactionNo"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    TransactionType = e["TransactionType"].ToString().ToUpper(),
                    InvoiceNo = e["InvoiceNo"].ToString().ToUpper(),
                    // CreatedOn =Convert.ToDateTime(e["CreatedOn"].ToString()),
                    CreatedOn = DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    IssuedTo = e["IssuedTo"].ToString().ToUpper(),
                    CreditNoteType = e["CreditNoteType"].ToString().ToUpper(),
                    ApprovedAmount = e["ApprovedAmount"].ToString().ToUpper(),
                    AWBno = e["awbno"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DutyAreaList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateCreditDebitNote(List<CreditDebitNote> lstCreditDebitNote)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstCreditDebitNote[0].LstCNDNChargesTrans, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("CreditDebitNote", dtCreateIrr, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CNDN";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrr;
                SqlParameter[] Parameters = {
                                            param ,
                                            new SqlParameter("@InvoiceSNo",lstCreditDebitNote[0].InvoiceSNo),
                                            new SqlParameter("@CreatedBy",lstCreditDebitNote[0].CreatedBy),
                                            new SqlParameter("@CreditNoteTpe",lstCreditDebitNote[0].CreditNoteType)
                                        };
                //   DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreditDebitNoteUpdate", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreditDebitNoteUpdate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CreditDebitNote");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
      //  CreditDebitNoteInsert
       
        public List<string> SaveCreditDebitNote(List<CreditDebitNote> lstCreditDebitNote)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                if (lstCreditDebitNote[0].LstCNDNChargesTrans != null)
                {
                   
                    DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstCreditDebitNote[0].LstCNDNChargesTrans, "");
                    BaseBusiness baseBusiness = new BaseBusiness();
                    if (!baseBusiness.ValidateBaseBusiness("CreditDebitNote", dtCreateIrr, "SAVE"))
                    {
                        ErrorMessage = baseBusiness.ErrorMessage;
                        return ErrorMessage;
                    }

                    // foreach (DataRow row in dtCreateIrr.Rows)
                    //{
                    //    if (row["InputAmount"].ToString() == "0")
                    //    {
                    //        ErrorMessage = baseBusiness.ErrorMessage;
                    //        return ErrorMessage;
                    //    }
                    //}
                    SqlParameter param = new SqlParameter();
                    param.ParameterName = "@CNDN";
                    param.SqlDbType = System.Data.SqlDbType.Structured;
                    param.Value = dtCreateIrr;
                    SqlParameter[] Parameters = {
                                            param ,
                                            new SqlParameter("@InvoiceSNo",lstCreditDebitNote[0].InvoiceSNo),
                                            new SqlParameter("@CreatedBy",lstCreditDebitNote[0].CreatedBy),
                                            new SqlParameter("@CreditNoteTpe",lstCreditDebitNote[0].CreditNoteType)
                                        };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreditDebitNoteUpdate", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CreditDebitNote");
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
                }
                else
                {
                    ErrorMessage.Add("Please enter atleast one amount.");
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCreditNotePrintRecord(int InvoiceSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", InvoiceSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditNotePrintRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetCreditNoteType(int InvoiceSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Recid", InvoiceSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditNoteType", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateCashRefund(int InvoiceSNo, int UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Recid", InvoiceSNo), new SqlParameter("@CreatedBy", UserSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateCashRefund", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteCreditDebitNote(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCreditDebitNote", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Delete");
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

                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string GetCNDNInvoice(string recordID, int page, int pageSize, string whereCondition, string sort, string InvoiceNo)
        {
            try
            {
                int InvoiceSNo, AWBSNo, AirlineSNo, AirlineInvoiceSNo, Recid;
                InvoiceSNo = Convert.ToInt32(whereCondition.Split('-')[0].ToString());
                AWBSNo = Convert.ToInt32(whereCondition.Split('-')[1].ToString());
                AirlineSNo = Convert.ToInt32(whereCondition.Split('-')[2].ToString());
                AirlineInvoiceSNo = Convert.ToInt32(whereCondition.Split('-')[3].ToString());
               
                Recid = Convert.ToInt32(whereCondition.Split('-')[5].ToString());
                DataSet ds = new DataSet();
                string CreditNoteType = whereCondition.Split('-')[4].ToString();
                //  string InvoiceNo = whereCondition.Split('_')[6].ToString(); 
                if (Recid == 0)
                {


                    SqlParameter[] Parameters = {
                                           new SqlParameter("@InvoiceSNo", InvoiceSNo),
                                           new SqlParameter("@AWBSNo", AWBSNo),
                                           new SqlParameter("@AirlineSNo", AirlineSNo),
                                           new SqlParameter("@AirlineInvoiceSNo", AirlineInvoiceSNo),
                                           new SqlParameter("@CreditNoteType",CreditNoteType)
                                        };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCNDNInvoice", Parameters);
                    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
                else
                {
                    SqlParameter[] Parameters = {
                                                     new SqlParameter("@InvoiceNo",InvoiceNo),
                                                     new SqlParameter("@CreditNoteType",CreditNoteType),
                                           new SqlParameter("@Recid", Recid),
                                          
                                        };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditDebitRecord", Parameters);
                    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
