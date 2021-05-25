using CargoFlash.Cargo.Model.EDI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.EDI
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ITelexTypeService" in both code and config file together.
    [ServiceContract]
    public interface ITelexTypeService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int SaveTelexType(string SitaAddress, string EmailAddress, string TeleTextMessage);
    }
}
