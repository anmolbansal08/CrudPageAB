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
using System.Xml;
using System.Web.UI;
using System.IO;
using System.Web;
using ClosedXML.Excel;
using System.Runtime.InteropServices;
using System.Web.Hosting;
using CargoFlash.Cargo.DataService.Common;
using CargoFlash.Cargo.Model.Accounts;
using System.Runtime.Serialization.Formatters.Binary;
using CargoFlash.Cargo.Model.Report;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CreditLimitReportService : SignatureAuthenticate, ICreditLimitReportService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public KeyValuePair<string, List<CreditLimitReport>> GetCreditLimitReportRecord(string recordID, int page, int pageSize, CreditLimitReportRequest model, string sort)
        {
            try
            {
                CreditLimitReport creditLimitReport = new CreditLimitReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@OfficeSNo",model.OfficeSNo),
                new SqlParameter("@AccountSNo",model.AccountSNo),
                new SqlParameter("@ValidFrom",model.ValidFrom),
                new SqlParameter("@ValidTo",model.ValidTo),
                new SqlParameter("@OrderBy", sort),
                new SqlParameter("@CurrencySNo", model.CurrencySNo),
                new SqlParameter("@AirlineSNo", model.AirlineSNo),
                new SqlParameter("@TransactionMode", model.TransactionMode),
                new SqlParameter("@AwbRefType", model.AwbRefType),
                new SqlParameter("@AwbNumber",model.AwbNumber),
                new SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCreditLimitReport", Parameters);
                var CreditLimitReportList = ds.Tables[0].AsEnumerable().Select(e => new CreditLimitReport
                {

                    SNo = Convert.ToInt32(e["SNo"]),
                    Reference = e["Reference"].ToString(),
                    OfficeName = e["officename"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    Type = e["TYPE"].ToString(),
                    CreditLimit = (e["CreditLimit"]).ToString(),
                    RemainingCreditLimit = (e["RemainingCreditLimit"]).ToString(),
                    DebitAmount = (e["DebitAmount"]).ToString(),
                    CreditAmount = (e["CreditAmount"]).ToString(),
                    UPDATEDBY = e["UPDATEDBY"].ToString(),
                   // UPDATEDON = e["UPDATEDON"].ToString(),
                    TransactionDate = (DateTime.Parse(e["TransactionDate"].ToString()).Date).ToString("dd/MM/yyyy"),
                    Transaction_Mode = e["Transaction_Mode"].ToString(),
                    PenaltyCharges = e["PenaltyCharges"].ToString(),
                    Cancel = e["Cancel"].ToString(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                    BookingStatus = e["BookingStatus"].ToString().ToUpper(),
                    PaymentCurrency = e["PaymentCurrency"].ToString().ToUpper(),
                    TariffRate = e["TariffRate"].ToString().ToUpper(),
                    Product = e["Product"].ToString().ToUpper(),
                    Commodity = e["Commodity"].ToString().ToUpper(),
                    ExchangeCurrency=e["ExchangeCurrency"].ToString().ToUpper(),
                    //ExchangeRate = e["ExchangeRateNew"].ToString(),
                    ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                    Remarks=e["Remarks"].ToString().ToUpper(),
                    RequestedBy=e["RequestedBy"].ToString(),
                    RequestedOn=e["RequestedOn"].ToString(),
                    BankName=Convert.ToString(e["BankName"]),
                    ReferenceNo=Convert.ToString(e["ReferenceNo"]),
                    RefNumber=Convert.ToString(e["RefNumber"])

                });

                return new KeyValuePair<string, List<CreditLimitReport>>(
                ds.Tables[1].Rows[0][0].ToString(), CreditLimitReportList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<CreditLimitBGReport>> GetCreditLimitBGRecord(string recordID, int page, int pageSize, CreditLimitReportRequest model, string sort)
        {
            try
            {
                CreditLimitBGReport creditLimitReport = new CreditLimitBGReport();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@OfficeSNo",model.OfficeSNo),
                new SqlParameter("@AccountSNo",model.AccountSNo),
                new SqlParameter("@ValidFrom",model.ValidFrom),
                new SqlParameter("@ValidTo",model.ValidTo),
                new SqlParameter("@OrderBy", sort),
                new SqlParameter("@CurrencySNo", model.CurrencySNo),
                new SqlParameter("@AirlineSNo", model.AirlineSNo),
                new SqlParameter("@TransactionMode", model.TransactionMode),
                new SqlParameter("@BgType",model.BgType),
                new SqlParameter("@IsAutoProcess",model.IsAutoProcess),
                new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
              
            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreditLimitBGReport", Parameters);
                var CreditLimitReportList = ds.Tables[0].AsEnumerable().Select(e => new CreditLimitBGReport
                {
                    
                    SNo = Convert.ToInt32(e["SNo"]),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    Office = e["Office"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    ParticipantId = e["ParticipantId"].ToString(),
                    MaxCreditlimit = (e["MaxCreditlimit"]).ToString(),
                    BalanceCreditlimit = (e["BalanceCreditlimit"]).ToString(),
                    BGReferencenumber = (e["BGReferencenumber"]).ToString(),
                    Transactiontype = (e["Transactiontype"]).ToString(),
                    ValidFrom = e["ValidFrom"].ToString(),
                    ValidTo = e["ValidTo"].ToString(),
                 //   Status = (DateTime.Parse(e["TransactionDate"].ToString()).Date).ToString("dd/MM/yyyy"),
                    Status  = e["Status"].ToString(),
                    Amount = e["Amount"].ToString(),
                    CurrencyCode = e["CurrencyCode"].ToString(),
                    TransactionDate=e["TransactionDate"].ToString(),
                    ApprovedBy=e["ApprovedBy"].ToString(),
                    RequestedBy = e["RequestedBy"].ToString(),
                    RequestedOn = e["RequestedOn"].ToString(),
                    ApproveDate = e["ApproveDate"].ToString()
                });

                return new KeyValuePair<string, List<CreditLimitBGReport>>(
                ds.Tables[1].Rows[0][0].ToString(), CreditLimitReportList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
       
        public string refereshCreditLimit(int AccountSNo) {
            try {
                SqlParameter param = new SqlParameter("@AccountSNo", AccountSNo);
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "refereshCreditLimit", param);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && ds.Tables[0].Columns.Count > 0)
                    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                else
                    return "Error in data";
            }
            catch (Exception ex)//
            {
                throw ex;
            }


        }

        /* Author : MOHD UMAR
         Modification Date  : 13-Sep-2018
         Desc : Add function GetCurrencyInformation for get return currrency from database
      */
        public string GetCurrencyInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirLineInformation", Parameters);
                ds.Dispose();
                
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        // Add by umar on 20-Sep-2018
        public string GetFprCurrencyInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFPRLionCurrency", Parameters);
                ds.Dispose();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}



