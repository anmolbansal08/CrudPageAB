using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [ServiceContract]
    interface IHoldShptService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetHoldShptRecord?recid={RecordID}&UserID={UserID}")]
        HoldShpt GetHoldShptRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveHoldShpt")]
        //List<string> SaveHoldShpt(List<HoldShpt> HoldShpt);



        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveHoldShpt(List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid,string grosswt, string volwt, string AppRemarks, string FohCheck);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateHoldShptLateAcceptance( List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid, string grosswt, string volwt, string AppRemarks, double? UPenalityAmount, string Ispenalitycharge);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateHoldShpt(List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid, string grosswt, string volwt, string AppRemarks, string FohCheck);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteHoldShpt?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteHoldShpt(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //List<string> DeleteHoldShpt(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetHoldAwbDetails?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetHoldAwb>> GetHoldAwbDetails(string recordID, int page, int pageSize, string whereCondition, string sort);



        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetHoldPieces(string Sno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetDeliveryPcs(string Sno, string AwbSno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetDeliveryFlightDate(string AWBNo, string FlightNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetHWBFOHWeight(string AWBNo, string MovementType);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetpenalityAmount(string AWBNo, string HoldtypeSno);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdatedHoldShpt(string AWBNo, string MovementType, string grosswt, string volwt);

        //[OperationContract]
        //[WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        //System.IO.Stream GetManifestReport(string DailyFlightSNo, string Type);
    }
}
