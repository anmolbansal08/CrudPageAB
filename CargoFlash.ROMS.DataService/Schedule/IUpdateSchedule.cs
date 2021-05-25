using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
namespace CargoFlash.Cargo.DataService.Schedule
{
    [ServiceContract]
    public interface IUpdateSchedule
    {
        //[OperationContract]
        //[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Xml, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "flightSchedule")]        KeyValuePair<string, ServiceResponse> updateFlightSchedule(UpdateFlightSchedule flightSchedule);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Xml, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "flightSchedule")]
        //[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Xml, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "flightSchedule")]

        KeyValuePair<string, ServiceResponse> updateFlightSchedule(FlightSchedule flightSchedule);
    }    
}


