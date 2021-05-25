using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Schedule;
using System.Data;

namespace CargoFlash.Cargo.DataService.Schedule
{
    [ServiceContract]
    public interface IViewEditFlightService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightDetail(FlightDetail model);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetFlight(String FlightNo, String FlightDate);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEditFlightDetail(int SNo);

        [OperationContract]
        [WebInvoke(UriTemplate = "/UpdateFlightDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateFlightDetail(List<ViewEditFlight> dailyFlightDetails);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DailyFlightAllotment>> GetDailyFlightAllotmentRecord(int recid,int pageNo, int pageSize, FlightAllotment model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/deleteDailyFlightAllotment?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteDailyFlightAllotment(int RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FlightPreviousRecord(int SNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string spGetFlightSIRemarks(int SNo);

        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateFlightDetail(String FlightNo, String FlightDate, String orgsno, String destsno, String ValidFrom, String ValidTo, String Mon, String Tue, String Wed, String Thu, String Fri, String Sat, String Sun, String FlightType, String AircraftType, String GrossWt, String VolueWt, String ETD, String ETA, String DFSNo, String Reason, String Active, String DDiff, String IsCAO, String Forwarder, String MovementNo, int UserSNo, String IsLoadedCancellation, String IsRFS);
    }
}
