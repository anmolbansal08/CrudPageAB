using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Accounts
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ICashRegisterService" in both code and config file together.
    [ServiceContract]
    public interface ICashRegisterService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCashRegisterRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&model={model}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CashRegisterdetail>> GetCashRegisterRecord(string recordID, int page, int pageSize, string whereCondition, string model, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCashRegisterRec", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCashRegisterRec(string CashierID, string GroupSNo, string FromDate, string ToDate, string StartTime, string EndTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCashierShiftTime", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCashierShiftTime(string CashierID, string GroupSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShiftRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        int UpdateShiftRecord(string CashierID, string GroupSNo, string StartDate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetLastLoggedOn", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetLastLoggedOn(string CashierID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetReceiveAmountRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetReceiveAmountRecord(string CashierID, string GroupSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetTotalAmount", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTotalAmount(string CashierID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CheckSession(string CashierID, string GroupSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveAmountDepositDetail(string CashierID, string GroupSNo, string CurrentSno, string StartDate, List<AmountDeposit> dataDetails);
      
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveReceiveStatus(string CashierID, string GroupSNo, string CurrentSno, List<ReceiveAmount> dataDetails);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> NewCashRegister(string CashierID, string GroupSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int ClosingAccount(string CashierID, string GroupSNo, string CurrentSNo, string StartDate);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCashierTransactionDetail(string CashierID, string GroupSNo, string CurrentSNo, string StartDate, string EndDate);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int CheckPending(string CashierID, string CurrentSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetLocalTime", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetLocalTime(string CashierID);

        [OperationContract]
        [WebGet(UriTemplate = "IsShiftClosed/{userSNo}", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        bool IsShiftClosed(string userSNo);
    }
}