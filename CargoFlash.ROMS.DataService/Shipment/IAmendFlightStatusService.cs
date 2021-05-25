using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.FlightControl;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IAmendFlightStatusService
    {

        [OperationContract]
       // [WebInvoke(Method = "GET", UriTemplate = "GetFlightControlGridData?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", ResponseFormat = WebMessageFormat.Json)]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CargoFlash.Cargo.Model.FlightControl.WMSAmendFlightControlGridData>> GetFlightControlGridData(string recid, int pageNo, int pageSize, FlightCondition model, string sort);
        
       

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateAmendFlightStatus?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<AmendFlightStatus> createUpdateAmendFlightStatus(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAmendFlightStatus", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string createUpdateAmendFlightStatus(List<AmendFlightStatus> AmendFlightStatus);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightDetails(int DailyFlightSno, string AirlineName, string FlightNo, string BoardPoint, string EndPoint);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateFlightPlan", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateFlightPlan(int ExistingDailyFlightSNo, string ReferenceNumber, string FlightNumber, string FlightDate, int BoardingPoint, int EndPoint, string OriginFlightNo, string Pieces, string GrossWeight, string Volume, string TransferRemarks, bool IsReExecute, int TransferDailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/BreachFlightStatusUpdate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BreachFlightStatusUpdate(string ReferenceNo, string OldOriginAirportSNo, string OldDestinationAirportSNo, string FlightDate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/getFlightOrigin", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getFlightOrigin(string FlightNo, string FlightDate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/getFlightCapacity", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getFlightCapacity(string FlightNo, string FlightDate, int OriginSNo, int DestinationSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/getFlightDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getFlightDetails(string FlightNo, string FlightDate, string Source, string Destination,string CarrierCode);
    }
}
