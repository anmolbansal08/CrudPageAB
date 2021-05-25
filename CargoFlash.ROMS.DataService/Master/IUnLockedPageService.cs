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
    public interface IUnLockedPageService
    {


        [OperationContract] //// interface
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UnLockedPage>> GetUnLockedPageRecord(int recid, int pageNo, int pageSize, whereconditionmodel model, string sort);
        
        


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
       // string UpdateProcessGetLock(string AWBNo, string ULDNo, string FlightNo, DateTime FlightDate);
        string UpdateProcessGetLock(string AWBNo, string ULDNo, string FlightNo,string FlightDate);
     


    }
}
