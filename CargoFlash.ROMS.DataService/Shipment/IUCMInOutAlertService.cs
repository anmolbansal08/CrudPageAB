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

namespace CargoFlash.Cargo.DataService.Shipment
{
  [ServiceContract]
  public interface IUCMInOutAlertService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UCMInOutAlert>> getUCMINOutAlertDetails(string recid, int pageNo, int pageSize, string whereCondition, string sort);
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getUCMINOutAlertULDDetails(Int32 DailyFlightSNO);
       
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SendUCMINOutAlertULDDetails(string MailTo,string MailBody, Int32 DailyFlightSNO);
      
    }
}
