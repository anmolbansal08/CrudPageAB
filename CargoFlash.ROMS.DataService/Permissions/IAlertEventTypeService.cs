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
    public interface IAlertEventTypeService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAlertEventTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AlertEventType GetAlertEventTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAlertEventType")]
        List<string> SaveAlertEventType(AlertEventType alertEvents);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAlertEventType")]
        List<string> UpdateAlertEventType(AlertEventType alertEvents);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAlertEventType")]
        List<string> DeleteAlertEventType(List<string> RecordID);



    }
}
