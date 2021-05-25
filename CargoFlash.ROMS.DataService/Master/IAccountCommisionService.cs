using CargoFlash.Cargo.Model.Master;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IAccountCommisionService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAccountCommissionRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<AccountCommission> GetAccountCommissionRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAccountCommisionRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AccountCommission>> GetAccountCommisionRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "CreateUpdateAccountCommission?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> CreateUpdateAccountCommission(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAccountCommision", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAccountCommision(string strData);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAccountCommision?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAccountCommision(string recordID);

    }
}
