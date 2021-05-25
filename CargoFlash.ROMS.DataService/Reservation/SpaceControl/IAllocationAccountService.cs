using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.SpaceControl;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.SpaceControl
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAllocationAccountService" in both code and config file together.
    [ServiceContract]
    public interface IAllocationAccountService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAllocationAccountRecord?recid={RecordID}&UserID={UserID}")]
        AllocationAccount GetAllocationAccountRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAllocationAccount")]
        List<string> SaveAllocationAccount(List<AllocationAccount> alloc);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAllocationAccount")]
        List<string> UpdateAllocationAccount(List<AllocationAccount> alloc);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAllocationAccount")]
        List<string> DeleteAllocationAccount(List<string> RecordID);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAllocationTransAccountRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AllocationAccount>> GetAllocationTransAccountRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAllocationTransAccount", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAllocationTransAccount(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteAllocationTransAccountULDTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteAllocationTransAccountULDTrans(string recordID); List<AllocationTransAccountULDTrans>> 

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetAccountAllocationCode?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAccountAllocationCode(String RecordID);

         [OperationContract]
         [WebInvoke(Method = "GET", UriTemplate = "GetAllocationTransAccountULDRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AllocationTransAccountULDTrans>> GetAllocationTransAccountULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        
        
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateAllocationTransAccount?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateAllocationTransAccount(string strData);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAllocationTransAccountULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAllocationTransAccountULD(string strData);

        
    }
}
