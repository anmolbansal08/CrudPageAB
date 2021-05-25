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

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IAirlineService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCurrency?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCurrency(String RecordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirlineRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Airline GetAirlineRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirline")]
        List<string> SaveAirline(List<Airline> Airline);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirline")]
        List<string> UpdateAirline(List<Airline> Airline);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirline")]
        List<string> DeleteAirline(List<string> RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCreditLimit?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCreditLimit(String RecordID);

        #region Airline CC Trans AND Airline Part Trans Created By TARUN KUMAR ON 15th Dec 2015

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateAirlineCCTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> CreateUpdateAirlineCCTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirlineCCTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirlineCCTrans>> GetAirlineCCTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteAirlineCCTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAirlineCCTrans(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateAirlinePartTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> CreateUpdateAirlinePartTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirlinePartTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirlinePartTrans>> GetAirlinePartTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteAirlinePartTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAirlinePartTrans(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "RecipientMessageAppendGrid?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RecipientMessageTrnas>> RecipientMessageAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort);

        #endregion

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCountry", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCountry(int CitySNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCountryInformation(string SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateDays(string recordID,string DDays, string IDays, int User);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDays(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirlineParameterRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirlineParameterInformation>> GetAirlineParameterRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateAirlineParameter", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
      string CreateUpdateAirlineParameter(List<AirlineParameterInformation> AirlineParameterInformation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteAirlineParameter?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAirlineParameter(string recordID);
    }
}
