using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Schedule;

namespace CargoFlash.Cargo.DataService.Schedule
{
    [ServiceContract]
    public interface IFlightOpenService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string OpenFlight(OpenFlight Model);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DownloadExcelFile",
            BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DownloadExcelFile(Int64[] Model);//(List<string> SNo);

        [OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetFlightCreatedRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<FlightOpen>> GetFlightCreatedRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FlightOpen>> GetFlightCreatedRecord(string recordID, int page, int pageSize, FlightCreatedRecord model, string sort);

        [OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetFlightAlreadyOpenedRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<FlightOpen>> GetFlightAlreadyOpenedRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FlightOpen>> GetFlightAlreadyOpenedRecord(string recordID, int page, int pageSize, FlightCreatedRecord model, string sort);

        //Getting Flight capacity by Vikram Singh 30/12/2016

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string FlightCapacity(String str);


        //Getting Flight capacity by Vikram Singh 30/12/2016
    }
}
