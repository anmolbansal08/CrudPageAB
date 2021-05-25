using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IUnclearedShipmentService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UnclearedShipment>> GetUnclearedShipmentRecord(int page, int pageSize, UnclearedShipmentRequestModel Model);







        //[OperationContract]
        //[WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        //List<UnclearedShipment> SearchData(UnclearedShipment obj);


    }
}
