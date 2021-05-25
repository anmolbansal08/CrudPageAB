using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IAWBTrackingService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBTrackingRecord(string AWBNo , int BasedOn, int AccountSNo, int flag, string CarrierCode);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveEmailId(string EmailAddress, string AWBNo, string MailSubject, string MailBody, string BodyFormat,int GenerateBy ,string GeneratedAt ,int IsSend);
    }
}
