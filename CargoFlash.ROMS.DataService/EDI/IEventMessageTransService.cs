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
    public interface IEventMessageTransService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEventMessageTrans")]
        List<string> SaveEventMessageTrans(EventMessageTransSave data);

        [OperationContract]
        [WebGet(UriTemplate = "GetEventMessageTransRecord?recid={RecordID}&UserID={UserID}")]
        EventMessageTrans GetEventMessageTransRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetEventMessageTransRecordAppendGrid?recid={RecordID}&whereCondition={whereCondition}")]
        //List<EventMessageGridAppendGrid> GetEventMessageTransRecordAppendGrid(string recordID, string whereCondition);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetEventMessageGridAppendGrid?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<EventMessageGridAppendGrid>> GetEventMessageGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEventMessageTrans")]
        List<string> UpdateEventMessageTrans(EventMessageTransSave data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEventMessageTrans")]
        List<string> DeleteEventMessageTrans(List<string> RecordID);
  

    }
}
