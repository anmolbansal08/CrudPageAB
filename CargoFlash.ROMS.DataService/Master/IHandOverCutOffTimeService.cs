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
    public interface IHandOverCutOffTimeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetHandOverCutOffTimeRecord?recid={RecordID}&UserID={UserID}")]
        HandOverCutOffTime GetHandOverCutOffTimeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveHandOverCutOffTime")]
        List<string> SaveHandOverCutOffTime(List<HandOverCutOffTime> HandOverCutOffTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateHandOverCutOffTime")]
        List<string> UpdateHandOverCutOffTime(List<HandOverCutOffTime> HandOverCutOffTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteHandOverCutOffTime")]
        List<string> DeleteHandOverCutOffTime(List<string> RecordID);
    }
}
