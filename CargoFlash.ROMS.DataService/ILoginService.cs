using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ILoginService" in both code and config file together.    
    [ServiceContract]
    public interface ILoginService
    {

        [OperationContract]
        [FaultContract(typeof(FaultReason))]
        [WebGet(UriTemplate = "GetAirline", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        string GetAirline();

        [OperationContract]
        [FaultContract(typeof(FaultReason))]
        [WebGet(UriTemplate = "GetLoginRecord?userId={UserID}&password={Password}&IP={ip}&HostName={hostname}&Browser={browser}&SessionID={SessionID}&CaptchaCode={CaptchaCode}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
         UserLogin GetLoginRecord(string userID, string password, string IP, string HostName, string Browser, string SessionID, string CaptchaCode);

        [OperationContract]
        [WebGet(UriTemplate = "GetTokenRecord?userId={UserID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        UserLogin GetTokenRecord(string userID);
        //[OperationContract]
        //[WebGet(UriTemplate = "UpdateCitySno", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        //string GetCitySNo(int Airportsno);
        //[OperationContract]
        //[WebGet(UriTemplate = "GetValidLoginMessage?userId={UserID}&password={Password}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        //string GetValidLoginMessage(string UserID, string Password); // Used For get proper login validation message :Created by : Parvez Khan ///Akash change datatype(30 may 2017)
    
        [OperationContract]
        [WebGet(UriTemplate = "GetValidLoginMessage?SNo={SNo}&TerminalSNo={TerminalSNo}&CitySNo={CitySNo}&AirportSNo={AirportSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        int UpdateUserInfoOnAirportChanges(int SNo, int TerminalSNo, int CitySNo, int AirportSNo); // Used For Update User info when user change default airport :Created by : Parvez Khan
       
        [OperationContract]
        [WebGet(UriTemplate = "RememberMe?rememberMe={rememberMe}&email={email}&password={password}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Xml, RequestFormat = WebMessageFormat.Xml)]
        void RememberMe(bool rememberMe, string email, string password); // Use
    }
}


