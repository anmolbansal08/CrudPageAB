using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Shipment;
namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IReadyToUnloadService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetReadyToUnloadingRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ReadyToUnloading>> GetReadyToUnloadingRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST",BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateReadyToUnloading(List<ReadyToUnloading> ReadyToUnloading);
        //List<string> UpdateReadyToUnloading(string strData);
    }
}
