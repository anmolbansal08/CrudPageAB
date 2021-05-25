using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [ServiceContract]
    public interface IDirectPaymentService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetOffice(int AirlineSNo,int CitySNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDirectPayment")]
        List<string> SaveDirectPayment(List<DirectPayment> Payment);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirlineCurrency(int AirlineSNo);


        [OperationContract]
        [WebGet(UriTemplate = "GetDirectPaymentRecord?recid={recordID}&UserID={UserID}")]
        DirectPayment GetDirectPaymentRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCreditLimitOffice(string SNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getAgentBankGurantee(string AccountSNo, string Flag);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDirectPayment")]
        List<string> UpdateDirectPayment(List<DirectPayment> Payment);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetExchangeRate(int Currency, int Mode, int AirlineSNo, int AccountSNo = 0);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckRefNo(string RefNo);

        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDirectPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DeleteDirectPayment(int SNo ,int AccountSNo, int OfficeSNo);  
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFPRExchangeRate(int Currency, int Mode, int AirlineSNo);

        // For NTA Amount Awb
        [WebInvoke(Method = "POST", UriTemplate = "/NtaAmountDirectPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string NtaAmountDirectPayment(int AwbSNo);
    }
}
