using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IFlightTransferService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);



        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFlightTransfer1Record?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FTGridData>> GetFlightTransfer1Record(string recordID, int page, int pageSize, string whereCondition, string sort);
        
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFlightSummaryRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FlightGridData>> GetFlightSummaryRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFlightSearchRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FlightGridData>> GetFlightSearchRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightTransferRecord?recid={RecordID}")]
        CargoFlash.Cargo.Model.Shipment.FlightGridData GetFlightTransferRecord(string recordID);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "createUpdateFlightTransfer1?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         List<string> createUpdateFlightTransfer1(string strData);

         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetFlight(String FlightNo, String FlightDate);
    }
}
