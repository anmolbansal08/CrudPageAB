using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [ServiceContract]
    public interface ITransactionHistoryService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetTransactionHistoryRecord?pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<TransactionHistory>> GetTransactionHistoryRecord(int page, int pageSize, string whereCondition, string sort);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<TransactionHistory>> GetTransactionHistoryRecord(string recordID, int pageNo, int pageSize, TransactionHistoryRequest model, string sort);
        


    }
}
