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
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TransactionHistoryService : SignatureAuthenticate, ITransactionHistoryService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        //public KeyValuePair<string, List<TransactionHistory>> GetTransactionHistoryRecord(int page, int pageSize, string whereCondition, string sort)
        //{

            
        //}

        public KeyValuePair<string, List<TransactionHistory>> GetTransactionHistoryRecord(string recordID, int page, int pageSize, TransactionHistoryRequest model, string sort)
        {
            try
            {
                TransactionHistory transactionHistory = new TransactionHistory();
                int airlinesno = model.AirlineSNo;
                int citysno = model.CitySNo;
                int officesno = model.OfficeSNo;
                int accountsno = model.AccountSNo;
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@airlinesno",airlinesno),
                new SqlParameter("@citysno",citysno),
                new SqlParameter("@officesno",officesno),
                new SqlParameter("@accountsno",accountsno),
                new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTransactionHistory", Parameters);
                var TransactionHistoryList = ds.Tables[0].AsEnumerable().Select(e => new TransactionHistory
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    AgentCode = e["AgentCode"].ToString(),
                    Text_CitySNo = e["Text_CitySNo"].ToString(),
                    Text_OfficeSNo = e["Text_OfficeSNo"].ToString(),
                    Text_CurrencySNo = e["Text_CurrencySNo"].ToString(),
                    Amount = Convert.ToDouble(e["Amount"]),
                    Text_TransactionType = e["Text_TransactionType"].ToString(),
                    TransactionDate = Convert.ToString(e["TransactionDate"] == null ? "" : e["TransactionDate"]),
                    AccountNo = e["AccountNo"].ToString(),
                });

                return new KeyValuePair<string, List<TransactionHistory>>(
                ds.Tables[1].Rows[0][0].ToString(), TransactionHistoryList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
