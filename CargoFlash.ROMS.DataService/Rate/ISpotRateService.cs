using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Rate
{
    /*	*****************************************************************************
    Class Name:	    Spot Rate  
    Created On:	Vsingh 19 jan 2017
    *****************************************************************************
    */
    [ServiceContract]
    public interface ISpotRateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBData(String str);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ViewRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewRate(SpotRate spotRate, int ULDRate, string ULDNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAWbForSpotRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWbForSpotRate(SpotRate spotRate);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetGeneratedCode", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetGeneratedCode(SpotRate spotRate);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ViewGeneratedCode", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewGeneratedCode(SpotRate spotRate);

        [OperationContract]
        [WebGet(UriTemplate = "GetSpotRateRecord?recid={RecordID}&UserID={UserID}")]
        SpotRate GetSpotRateRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRemarks?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SpotRateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSpotRateDetais", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveSpotRateDetais(string SNo, SpotRate SpotRate, List<SpotRateRemarks> spotRateRemarks, List<SpotRateFlightInfo> SpotRateFlightInfo, List<SpotRateULDAirlineSLAB> SpotRateULDSLABInfoArray, string[] ApproveType,int IsAgentGroup, string AccountGroupSNo, decimal DiscountedPercentage, decimal SurchargePercentage, decimal ApprovedDiscountedPercentage, decimal ApprovedSurchargePercentage,decimal isFlatRate,decimal IsWeiveDueCarrierCharges);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDRate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SpotRateULDAirlineSLAB>> GetULDRate(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFlightInfo?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SpotRateFlightInfo>> GetFlightInfo(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSpotRate")]
        List<string> DeleteSpotRate(List<string> ids);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteUldTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteUldTrans(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteFlightTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteFlightTrans(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetSpotCode?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SpotRate>> GetSpotCode(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetDestination", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDestination(string CitySNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/BindProductOnAWBType", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindProductOnAWBType(string AWBTypeName);


        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteSpotRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string DeleteSpotRate(int SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSpotRateRequest", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DeleteSpotRateRequest(string SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/InActiveSpotRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string InActiveSpotRate(int id);
    }
}
