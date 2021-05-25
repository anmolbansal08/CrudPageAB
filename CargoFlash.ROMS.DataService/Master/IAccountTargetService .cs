using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IAccountTargetService
    {
          //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAccountTargetRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<AccountTarget> GetAccountTargetRecord(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAccountTargetRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<AccountTarget>> GetAccountTargetRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveAccountTarget")]
        //List<string> SaveAccountTarget(List<AccountTarget> AccountTarget);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAccountTarget", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAccountTarget(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateAccountTarget")]
        //List<string> UpdateAccountTarget(List<AccountTarget> AccountTarget);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAccountTarget?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAccountTarget(string recordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAccountTargetRecord?recid={RecordID}&UserID={UserID}")]
        AccountTarget GetAccountTargetRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAccountTarget")]
        List<string> SaveAccountTarget(List<AccountTarget> AccountTarget);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAccountTarget")]
        List<string> UpdateAccountTarget(List<AccountTarget> AccountTarget);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAccountTarget")]
        List<string> DeleteAccountTarget(List<string> RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetAccount?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAccount(String RecordID);


    }
}
