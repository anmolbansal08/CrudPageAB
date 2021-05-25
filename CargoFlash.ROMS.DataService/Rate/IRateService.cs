using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IRateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateRecord?recid={RecordID}&UserID={UserID}")]
        RateDetailsER GetRateRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult DownloadExcelGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]//&AirlineSNo={AirlineSNo}&Origin={Origin}&OriginSNo={OriginSNo}, string AirlineSNo, string Origin, string OriginSNo
        [WebInvoke(Method = "GET", UriTemplate = "GetRateSLAB?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateAirlineSLAB>> GetRateSLAB(string recordID, int page, int pageSize, string whereCondition, string sort);

        //Edited
        [OperationContract]//&AirlineSNo={AirlineSNo}&Origin={Origin}&OriginSNo={OriginSNo}, string AirlineSNo, string Origin, string OriginSNo
        [WebInvoke(Method = "GET", UriTemplate = "GetRateSLAB_New?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateAirlineSLAB>> GetRateSLAB_New(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDRate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateULDAirlineSLAB>> GetULDRate(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRateParameter(Int32 RateSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirlineCurruncy(Int32 AirlineSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDClassMinimumCWt(Int32 ClassCodeSNo, int AirlineSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRemarks?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAllotmentType(Int32 AllotmentSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateDetais", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRateDetais(int RateSNo, string action, RateDetails RateInfo, List<RateRemarks> RateRemarks, List<RateAirlineSLAB> RateSLABInfoarray, List<RateULDAirlineSLAB> RateULDSLABInfoArray, RateParam RateParamList, int IsULDCheck);//, List<RateAirlineSLAB> RateSLABInfo, List<RateULDAirlineSLAB> RateULDSLABInfo, string RateBaseParam);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateDetais", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateRateDetais(int RateSNo, string action, RateDetails RateInfo, List<RateRemarks> RateRemarks, List<RateAirlineSLAB> RateSLABInfoarray, List<RateULDAirlineSLAB> RateULDSLABInfoArray, RateParam RateParamList, string ErrorMSG);//, List<RateAirlineSLAB> RateSLABInfo, List<RateULDAirlineSLAB> RateULDSLABInfo, string RateBaseParam);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateDownloadRequest", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRateDownloadRequest(int AirlineSno, string Status, string Message, int OriginSno = 0, int DestinationSno = 0, int OfficeSno = 0, int AgentSno = 0, string SHCSno = "");
    }
}
