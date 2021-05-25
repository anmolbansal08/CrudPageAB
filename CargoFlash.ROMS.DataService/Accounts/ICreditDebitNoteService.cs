using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [ServiceContract]
    public interface ICreditDebitNoteService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCreditDebitNote")]
        List<string> UpdateCreditDebitNote(List<CreditDebitNote> lstCreditDebitNote);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCreditDebitNote")]
        List<string> SaveCreditDebitNote(List<CreditDebitNote> lstCreditDebitNote);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCNDNInvoice?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}&InvoiceNo={InvoiceNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCNDNInvoice(string recordID, int page, int pageSize, string whereCondition, string sort, string InvoiceNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCreditNotePrintRecord(int InvoiceSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCreditNoteType(int InvoiceSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateCashRefund(int InvoiceSNo, int UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCreditDebitNote")]
        List<string> DeleteCreditDebitNote(List<string> RecordID);


    }
}
