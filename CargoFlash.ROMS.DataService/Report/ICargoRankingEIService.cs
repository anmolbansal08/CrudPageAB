using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface ICargoRankingEIService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCargoRankingRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCargoRankingAirlineRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingAirlineRecord(int recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCargoRankingAgentRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingAgentRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCargoRankingDestinationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingDestinationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);



        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        List<CargoRankingEI> SearchData(CargoRankingEI obj);


        [OperationContract]
        [WebInvoke(UriTemplate = "SearchDataAirline", ResponseFormat = WebMessageFormat.Json)]
        List<CargoRankingEI> SearchDataAirline(CargoRankingEI obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "SearchDataAgent", ResponseFormat = WebMessageFormat.Json)]
        List<CargoRankingEI> SearchDataAgent(CargoRankingEI obj);


        [OperationContract]
        [WebInvoke(UriTemplate = "SearchDataDestination", ResponseFormat = WebMessageFormat.Json)]
        List<CargoRankingEI> SearchDataDestination(CargoRankingEI obj);
    }
}
