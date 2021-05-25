using CargoFlash.Cargo.Model.Master;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IEdiInboundAndOutboundService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<EdiInboundAndOutboundResult>> GetEdiInboundOutbound(string recid, int pageNo, int pageSize, GetEdiInboundOutbound model, string sort);//(DateTime FromDate, DateTime ToDate, string Carrier, string Type, string MessageType, string FlightNo, string AWbNo, string Airport, string Status);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<InvalidRecipient>> GetInvalidRecipient(string recid, int pageNo, int pageSize, GetInvalidRecipient model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ReExecutedMessage(string SNo, string EDIBoundType, string UpdatedMessage);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]//, 
        string GetMessageTrail(GetMessageTrail Model);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAllStatus(GetEdiInboundOutbound model);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetutcdateByAirportSno(GetutcdateByAirport Model);
    }
}
