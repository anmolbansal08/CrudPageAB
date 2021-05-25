using CargoFlash.Cargo.Model.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [ServiceContract]
    public interface IAlertEventsService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAlertEventsRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AlertEvents GetAlertEventsRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAlertEvents")]
        List<string> SaveAlertEvents(AlertEventsPost alertEvents);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAlertEvents")]
        List<string> UpdateAlertEvents(AlertEventsPost alertEvents);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAlertEvents")]
        List<string> DeleteAlertEvents(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetAlertEventsSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AlertEventsTrans>> GetAlertEventsSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAlertEventsSlabRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAlertEventsSlabRecord(string RecordID);

        
    }
}
