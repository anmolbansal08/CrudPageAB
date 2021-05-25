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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAllocationTransService" in both code and config file together.
    [ServiceContract]
    public interface IAllocationTransService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAllocationTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AllocationTrans>> GetAllocationTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "createUpdateAllocationTrans?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAllocationTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAllocationTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAllocationTrans(string recordID);
    }
}
