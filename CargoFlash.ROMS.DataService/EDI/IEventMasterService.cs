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
    public interface IEventMasterService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetEventMasterRecord?recid={RecordID}&UserID={UserID}")]
        EventMaster GetEventMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEventMaster")]
        List<string> SaveEventMaster(List<EventMaster> EventMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEventMaster")]
        List<string> UpdateEventMaster(List<EventMaster> EventMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEventMaster")]
        List<string> DeleteEventMaster(List<string> RecordID);
    }
}
