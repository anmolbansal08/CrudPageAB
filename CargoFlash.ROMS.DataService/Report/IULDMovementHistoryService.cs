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
using System.IO;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IULDMovementHistoryService
    {
        // Changes by Vipin Kumar
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetULDMovementHistoryRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ULDMovementHistory>> GetULDMovementHistoryRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDMovementHistory>> GetULDMovementHistoryRecord(string recid, int pageNo, int pageSize, ULDMovement model, string sort);
        //Ends

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        // Changes by Vipin Kumar
        //string getULDDetails(string ULDSNo);
        string getULDDetails(int? ULDSNo);
        //Ends

        [OperationContract]
        // Changes by Vipin Kumar
        //[WebGet(UriTemplate = "SearchData?AirportSNo={AirportSNo}&ULDSNo={ULDSNo}&FromDate={FromDate}&ToDate={ToDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SearchData(string AirportSNo, string ULDSNo, string FromDate, string ToDate);
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SearchData(SearchData searchData);
        //Ends
    }
}
