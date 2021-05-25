using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;

using CargoFlash.Cargo.Model.Accounts;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CashRegisterService : SignatureAuthenticate, ICashRegisterService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public KeyValuePair<string, List<CashRegisterdetail>> GetCashRegisterRecord(string recordID, int page, int pageSize, string whereCondition, string model, string sort)
        {
            try
            {

                string[] CASHDetails = whereCondition.Split('/');
                whereCondition = "";

                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CASHDetails[0])
                                            , new SqlParameter("@GroupSNo",  CASHDetails[1])
                                            , new SqlParameter("@FromDate",  CASHDetails[2])   
                                            , new SqlParameter("@ToDate",  CASHDetails[3]) 
                                            , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize)
                                            , new SqlParameter("@OrderBy", sort)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCashRegisterRecord_Receive", Parameters);

                var CashRegisterDetails = ds.Tables[0].AsEnumerable().Select(e => new CashRegisterdetail
                {
                     SNo = e["SNo"].ToString(),
                    // CashRegisterSno = e["CashRegisterSno"].ToString(),
                     Remarks = e["Remarks"].ToString(),
                     ServerUTC = e["ServerUTC"].ToString(),
                     ServerLocal = e["ServerLocal"].ToString(),
                   //  ServerTimeZone = e["ServerTimeZone"].ToString(),
                     CashierName = e["CashierName"].ToString(),
                     Date = e["Date"].ToString(),
                     TransferTime = e["TransferTime"].ToString(),
                     Currency = e["Currency"].ToString(),
                     AmountDeposited = e["AmountDeposited"].ToString(),
                     TotalCashReceivedAmount = e["TotalCashReceivedAmount"].ToString(),
                     TotalReceiveAmount = e["TotalReceiveAmount"].ToString().ToUpper(),
                     CashRefund = e["CashRefund"].ToString(),
                     Status = e["Status"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    InvoiceNo = e["InvoiceNo"].ToString(),
                     TYPE = e["TYPE"].ToString(),
                    //AddOncount = e["AddOncount"].ToString(),
                    //TypeCount = e["TypeCount"].ToString(),
                    //TotalULD = e["TotalULD"].ToString(),



                });
             //   return new KeyValuePair<string, List<CashRegister>>("SNo", CashRegisterDetails.AsQueryable().ToList());
                return new KeyValuePair<string, List<CashRegisterdetail>>(ds.Tables[2].Rows[0][0].ToString(), CashRegisterDetails.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetCashRegisterRec(string CashierID, string GroupSNo, string FromDate, string ToDate, string StartTime, string EndTime)
        {
            try
            {
                // , new SqlParameter("@StartTime", StartTime), new SqlParameter("@EndTime", EndTime)
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID), new SqlParameter("@GroupSNo", GroupSNo), new SqlParameter("@FromDate", FromDate), new SqlParameter("@ToDate", ToDate) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCashRegisterRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
   
       
        public string GetReceiveAmountRecord(string CashierID, string GroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID), new SqlParameter("@GroupSNo", GroupSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReceiveAmountRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetTotalAmount(string CashierID)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTotalAmount", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> CheckSession(string CashierID, string GroupSNo)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID", CashierID),
                                        new SqlParameter("@GroupSNo",GroupSNo)
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckSession", Parameters);
                ErrorMessage.Add(Convert.ToString(ret));
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveAmountDepositDetail(string CashierID, string GroupSNo, string CurrentSno, string StartDate, List<AmountDeposit> dataDetails)
        {
           // 
            try
            {
                int ret = 0;
                DataTable dtAmountDetail = CollectionHelper.ConvertTo(dataDetails, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID", CashierID),
                                        new SqlParameter("@GroupSNo",GroupSNo),
                                        new SqlParameter("@CurrentSno", CurrentSno),   
                                        new SqlParameter("@StartShift", StartDate), 
                                        new SqlParameter("@CashTransferTable",SqlDbType.Structured){Value=dtAmountDetail}

                                        };
                //  DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "SaveAmountDepositDetail", Parameters);
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAmountDepositDetail", Parameters);
                ErrorMessage.Add(Convert.ToString(ret));
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveReceiveStatus(string CashierID, string GroupSNo, string CurrentSno, List<ReceiveAmount> dataDetails)
        {
            try
            {
                int ret = 0;
                DataTable dtAmountDetail = CollectionHelper.ConvertTo(dataDetails, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID", CashierID),
                                        new SqlParameter("@GroupSNo",GroupSNo),
                                        new SqlParameter("@CurrentSno", CurrentSno),                                       
                                        new SqlParameter("@ReceiveAmountType",SqlDbType.Structured){Value=dtAmountDetail}

                                        };
               // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveReceiveStatus", Parameters);
               ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveReceiveStatus", Parameters);
                ErrorMessage.Add(Convert.ToString(ret));
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> NewCashRegister(string CashierID, string GroupSNo)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID", CashierID),
                                        new SqlParameter("@GroupSNo",GroupSNo)
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "NewCashRegister", Parameters);
                ErrorMessage.Add(Convert.ToString(ret));
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public int ClosingAccount(string CashierID, string GroupSNo, string CurrentSNo, string StartDate)
        {
            try
            {
                System.Web.HttpContext.Current.Session["IsAccountClosed"] = true;
                int ret = 0;
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID",Convert.ToInt32(CashierID)),
                                        new SqlParameter("@GroupSNo",GroupSNo),
                                        new SqlParameter("@CurrentSno",Convert.ToInt32(CurrentSNo)),
                                        new SqlParameter("@StartShift",StartDate),
                                        //new SqlParameter("@EndShift",EndDate)
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "ClosingAccount", Parameters);
                return ret;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCashierTransactionDetail(string CashierID, string GroupSNo, string CurrentSNo,string StartDate, string EndDate)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID), new SqlParameter("@GroupSNo", GroupSNo), new SqlParameter("@CurrentSNo", CurrentSNo), new SqlParameter("@FromDate", StartDate), new SqlParameter("@ToDate", EndDate) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCashierTransactionDetail", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public int CheckPending(string CashierID, string CurrentSNo)
        {
            try
            {
                int ret = 0;
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = {
                                            
                                        new SqlParameter("@CashierID", CashierID),
                                        new SqlParameter("@CurrentSno", CurrentSNo)
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CheckPending", Parameters);
                return ret;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetLocalTime(string CashierID)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetLocalTime", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //Added by Shivali Thakur
        public string GetCashierShiftTime(string CashierID, string GroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID), new SqlParameter("@GroupSNo", GroupSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCashierShiftTime", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetLastLoggedOn (string CashierID)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetLastLoggedOn", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public int UpdateShiftRecord(string CashierID, string GroupSNo, string StartDate)
        {
            try
            {
                int ret = 0;
                SqlParameter[] Parameters = { new SqlParameter("@StartDate", StartDate),
                                             new SqlParameter("@CashierID", CashierID)};
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateShiftRecord", Parameters);
                return ret;
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateShiftRecord", Parameters);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public bool IsShiftClosed(string userSNo)
        {
            bool ret = false;
            SqlParameter[] parameters =
            {
                new SqlParameter("@UserSNo",userSNo)
            };
            ret = (bool)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCashRegister_IsShiftClosed", parameters);
            return ret;
        }
    }
}
