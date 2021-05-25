using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.EDI
{
    [ServiceContract]
    public interface IMessageTypeMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveMessageTypeMaster(List<MessageTypeMaster> MessageTypeMasterInfo, List<MessageTypeMaster> MessageTypeMasterParentInfo);

        [OperationContract]
        [WebGet(UriTemplate = "GetMessageTypeMasterRecord?recid={RecordID}&UserID={UserID}")]
        MessageTypeMaster GetMessageTypeMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebGet(UriTemplate = "GetMessageTypeMasterTransRecord?recid={RecordID}")]
        List<MessageTypeMasterTrans> GetMessageTypeMasterTransRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateMessageTypeMaster(List<MessageTypeMasterTrans> MessageTypeMasterInfoUpdate, string MessageDescription);
    }
}
