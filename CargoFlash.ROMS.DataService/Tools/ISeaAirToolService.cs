using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tools;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Tools
{
    [ServiceContract]
    public interface ISeaAirToolService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSeaAirToolRecord(string SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateSeaAirTool(int AWBNo, int BookingType, string BOENo, string BOEDate, int UpdatedBy);

    }
}
