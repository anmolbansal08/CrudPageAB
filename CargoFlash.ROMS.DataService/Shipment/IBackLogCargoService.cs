using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IBackLogCargoService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetBackLogCargoRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BackLogCargo>> GetBackLogCargoRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        List<BackLogCargo> SearchData(BackLogCargo obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "SendData", ResponseFormat = WebMessageFormat.Json)]
        List<BackLogCargo> SendData(BackLogCargoMailModel obj);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string SendMail(string MailTo, string Cc, string Subject, string Content);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deletefromoffload?recid={RecordID}&Obj={AwbNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string deletefromoffload(string recordID,string AwbNo);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/deletefromoffload", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string deletefromoffload( List<deleteoffload> obj);
    }
}
