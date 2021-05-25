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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IUldHandOverService" in both code and config file together.
    [ServiceContract]
    public interface IUldHandOverService
    {       
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
          string GetUldHandOverRecord(String Sno);
    }
}
