using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Schedule;

namespace CargoFlash.Cargo.DataService.Schedule
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IScheduleTransService" in both code and config file together.
    [ServiceContract]
    public interface IScheduleTransService
    {
        //[OperationContract]//?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ScheduleTrans>> GetScheduleTransRecord(int recid, int pageNo, int pageSize, GetScheduleTrans model, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/createUpdateScheduleTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> createUpdateScheduleTrans(string strData);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteScheduleTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteScheduleTrans(string recordID);
    }
}
