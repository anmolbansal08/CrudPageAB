using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Collections.Generic;

namespace CargoFlash.Cargo.DataService.Export.UWS.UWSPrint
{
    [ServiceContract]
    public interface IUWSPrintService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSPrintData(string FlightNo, string FlightDate, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int SaveUWSPrintDetails(List<UWSPrintTableData> UWSModel, string OtherInfo1, string OtherInfo2, string UserSNo, int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<UWSEDIMessageHistory> getUWSHistoryMessage(int DailyFlightSNo);

    }
    [KnownType(typeof(UWSPrintTableData))]
    public class UWSPrintTableData
    {
        public string SNo { get; set; }
        public string Priority { get; set; }
        public string Remarks { get; set; }
        public string IsBulk { get; set; }
    }
    [KnownType(typeof(UWSEDIMessageHistory))]
    public class UWSEDIMessageHistory
    {
        public string LBDSNo { get; set; }
        public string DailyMovementSNo { get; set; }
        public string SentAt { get; set; }
        public string UWSMessage { get; set; }
    }
}
