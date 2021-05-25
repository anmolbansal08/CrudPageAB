using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Common;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.DataService.Common
{
    [ServiceContract]
    public interface ICommonService
    {

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveROMSException")]
        void SaveROMSException(List<ROMSException> ROMSException);

        [OperationContract]
        //change by Shahbaz Akhtar
       // [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        PageRightsByAppName GetPageRightsByAppName(GetPageRightsByUser getPageRightsByUser);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAWBLockedEvent(string UserSNo, string AWBSNo, string DailyFlightSNo, string FlightNo, string FlightDate, string ULDNo);


        [OperationContract]
        // Changes by Vipin Kumar
        //[WebGet(UriTemplate = "GetAWBLockedEvent?UserSNo={UserSNo}&AWBSNo={AWBSNo}&DailyFlightSNo={DailyFlightSNo}&FlightNo={FlightNo}&FlightDate={FlightDate}&ULDNo={ULDNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string GetAWBLockedEvent(string UserSNo, string AWBSNo, string DailyFlightSNo, string FlightNo, string FlightDate, string ULDNo);
        string GetAWBLockedEvent(AWBLockedEvent awbLockedEvent);
        // Ends

        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUserLocalTime(string strDate, string Format, string UserSNo);


     
        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUserCurrentUTCTime(string Format, string UserSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetWeighingData/{mip}/{mport}", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string GetWeighingData(string mip, string mport);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json)]
        string GenerateCIMPMessage(string MessageType, string SerialNo, string SubType, string flightNumber, string flightDate, string OriginAirport, bool isDoubleSignature, string version, ref string nop, ref string grossWeight, ref string volumeWeight, ref string eventTimeStamp, ref string MsgSeqNo);
        // Add By Sushant 
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/InsertCIMPMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string InsertCIMPMessage(string MessageText, string ReceivedFrom, string MessageRecAddress);


        [OperationContract]
        [WebGet(UriTemplate = "GetWeighingDataByTerminalID/{terminalid}", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string GetWeighingDataByTerminalID(string terminalid);

        [OperationContract]
        [WebGet(UriTemplate = "GetWeighingDataByWeighingScaleID/{weighingid}", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string GetWeighingDataByWeighingScaleID(string weighingid);

        [OperationContract]
        [WebGet(UriTemplate = "CheckSession", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        bool CheckSession();


        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRateReferenceCode(string Keysno);



        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFlightNo(string FlightSNo);

        [OperationContract]
        [FaultContract(typeof(FaultException))]
        [WebGet(UriTemplate = "ReLogin?userId={UserID}&password={Password}&CaptchaCode={CaptchaCode}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ReLogin(string userID, string password, string CaptchaCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/InsertAjaxRequestError", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        bool InsertAjaxRequestError(AjaxRequestError ajaxRequestError);

        [OperationContract]
        [WebGet(UriTemplate = "ShowTickerOnPublish", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string ShowTickerOnPublish();

        [OperationContract]
        [WebGet(UriTemplate = "Logout?UserSNo={UserSNo}", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        bool Logout(string UserSNo);
        [OperationContract]
        [WebGet(UriTemplate = "CompareSession?userId={UserID}&CaptchaCode={CaptchaCode}", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CompareSession(string UserID, string CaptchaCode);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        bool CompareSessionAfterLogin();

        [WebGet(UriTemplate = "UpdateAirPort?AirportSNo={AirportSNo}&UserSNo={UserSNo}", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAirPort(string AirportSNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveUpdateLockedProcess", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveUpdateLockedProcess(string AWBSNo, string DailyFlightSNo, string FlightNo, string FlightDate, string UpdatedBy, string SubprocessSNo, string SUbprocess, string Event, string ULDNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAppendGridAuditLog?ModuleName={ModuleName}&AppsName={AppsName}&KeyColumn={KeyColumn}&KeyValue={KeyValue}&KeySNo={KeySNo}&FormAction={FormAction}&TerminalSNo={TerminalSNo}&TerminalName={TerminalName}", BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        void SaveAppendGridAuditLog(string data, string ModuleName, string AppsName, string KeyColumn, string KeyValue, string KeySNo, string FormAction, string TerminalSNo, string TerminalName);

        [OperationContract]
        [WebGet(UriTemplate = "CheckSessionforcra", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string CheckSessionforcra();

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        int GetServiceStatus();

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        string GetSchedulerStatusDetails();

        // Add By Pankaj Kumar Ishwar 
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ValidateCIMPMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        lstValidateDataRetun ValidateCIMPMessage(string MessageText);
    }
}