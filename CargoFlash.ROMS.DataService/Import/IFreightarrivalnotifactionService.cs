using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Import
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IFreightarrivalnotifaction" in both code and config file together.
    [ServiceContract]
    public interface IFreightarrivalnotifactionService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFreightData(Int32 arrivedShipmentSNo, Int32 awbSNo);
    }
    
}
