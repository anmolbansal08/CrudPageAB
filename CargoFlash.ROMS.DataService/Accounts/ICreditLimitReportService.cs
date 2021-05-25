using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [ServiceContract]
    public interface ICreditLimitReportService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetTransactionHistoryRecord?pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<TransactionHistory>> GetTransactionHistoryRecord(int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CreditLimitReport>> GetCreditLimitReportRecord(string recid, int pageNo, int pageSize, CreditLimitReportRequest model, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CreditLimitBGReport>> GetCreditLimitBGRecord(string recid, int pageNo, int pageSize, CreditLimitReportRequest model, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //void DataSetToExcel();
     
        [OperationContract]
        [WebInvoke(Method = "GET" ,BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string refereshCreditLimit(int AccountSNo);

        // Add GetCurrencyInformation Interface by UMAR on 13-Sep-2018 

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCurrencyInformation(string SNo);

        // Add  Fpr CurrencyInformation Interface by UMAR on 10-Oct-2018 
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFprCurrencyInformation(string SNo);
        

    }
}
