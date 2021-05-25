using CargoFlash.Cargo.Model.Shipment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface ITrackingService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetTracking?recid={RecordID}&Type={Type}&TrackType={TrackType}&AWBSNo={AWBSNo}&TrackingType={TrackingType}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Tracking GetTracking(string recordID, int Type, int TrackType, int AWBSNo, string TrackingType);

        [OperationContract]
        [WebGet(UriTemplate = "GetHistoryTracking?recid={RecordID}&TrackType={TrackType}&AWBSNo={AWBSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Tracking GetHistoryTracking(string recordID, int TrackType, int AWBSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetConsolidateTracking?recordID={RecordID}&AWBPrefix={AWBPrefix}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Tracking GetConsolidateTracking(string recordID,string AWBPrefix);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAWBRecord(string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //Changes by Vipin Kumar
        //string GetFlightRecord(string FlightNo, string FlightDate, string Origin, string Destination, string TrackingType);
        FlightRecord GetFlightRecord(FlightRecord flightRecord);
        //Ends

        [OperationContract]
        [WebGet(UriTemplate = "GetMOPRecord?AWBNo={AWBNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetMOPRecord(string AWBNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetChoiceOfTracking?recordID={AWBNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetChoiceOfTracking(string AWBNo);

        [OperationContract]
        // Changes by Vipin Kumar
        //[WebGet(UriTemplate = "GetLocationDetails?recordId={AWBSNo}&IsImport={IsImport}&tstage={tstage}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetLocationDetails(string AWBSNo, string IsImport, int tstage);
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetLocationDetails(LocationRecord locationRecord);
        //Ends

        [OperationContract]
        [WebGet(UriTemplate = "GetAWBHoldDetails?recordId={AWBSNo}&IsImport={IsImport}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBHoldDetails(string AWBSNo, string IsImport);

        [OperationContract]
        [WebGet(UriTemplate = "GetHAWBDetails?recordId={AWBSNo}&IsImport={IsImport}&HAWBNo={HAWBNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHAWBDetails(string AWBSNo, string IsImport, string HAWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        // Changes by Vipin Kumar
        //string GetULDRecord(string uldStockSNo, string TrackingType);
        string GetULDRecord(ULDRecord uldRecord);

        [OperationContract]
        [WebGet(UriTemplate = "GetPOMailTracking?recordID={RecordID}&POMailPrefix={POMailPrefix}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Tracking GetPOMailTracking(string recordID, string POMailPrefix);
        // Ends
    }
}