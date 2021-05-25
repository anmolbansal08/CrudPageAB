using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IUCMService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetUCMDetailRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetUCMDetailRecord(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUCM(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, List<UCMDetail> dataDetails, List<UCMDetailTrans> data1);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CheckULDNo(string ULDType, string Serial, string Owner, string UCMtype, string FlightNo, string flightdate, string origincity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetUCMPallet", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetUCMPallet(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GenerateANDSaveCIMPMessage(string FlightDate, string FlightNo, string UCMType, string SI1, string SI2);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //List<string> createUCMPallet(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, string ULDType, string SerialNo, string OwnerCode, string Destination, List<UCMDetail> dataDetails);
        List<string> createUCMPallet(string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, string ULDType, string SerialNo, string OwnerCode, string Destination, int ContentType);


        [OperationContract]
        [WebGet(UriTemplate = "GetUCMRecord?recid={RecordID}&UserID={UserID}&Text_UCMType={Text_UCMType}")]
        UCM GetUCMRecord(string recordID, string UserID, string Text_UCMType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateUCM", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateUCM(string SNo, string AirlineSNo, string FlightDate, string FlightNo, string UCMType, string origincity, List<UCMDetail> dataDetails, List<UCMDetailTrans> data1);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUCM")]
        List<string> DeleteUCM(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetUCMSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UCMDetail>> GetUCMSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetUCMattachdSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UCMDetailTrans>> GetUCMattachdSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUCMSlabRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteUCMSlabRecord(string RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUCMattachdRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteUCMattachdRecord(string RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int SaveUCM(string SitaAddress, string EmailAddress, string SCMMessage, string FlightNo, string FlightDate, string origincity);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRecipientEmail(string AirlineSNo, string UCMType);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CreateOwnerCode(string NewOwnerCode, string AirlineSno);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetUCMDefaultOutInRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UCMDetail>> GetUCMDefaultOutInRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

   

    }
}
