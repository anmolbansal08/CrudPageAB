using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.ULD;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IUldStackService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "ValidateBaseUld?UldNo={UldNo}&AirlineCode={AirlineCode}&CityCode={CityCode}&AirportSno={AirportSno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateBaseUld(string UldNo, string AirlineCode, string CityCode, int AirportSno);



        [OperationContract]
        //[WebInvoke(Method = "POST",UriTemplate = "SaveAndUpdateUldStack", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveAndUpdateUldStack(List<UldStack> uldStackObj, List<UldStackTareWeight> objUldStackTareWeight, List<Consumables> objConsumables);

        [OperationContract]
        [WebGet(UriTemplate = "BaseUldData?lstUldStack={lstUldStack}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BaseUldData(string lstUldStack);
        [OperationContract]
        [WebGet(UriTemplate = "CheckBaseUldData?ChklstUldStack={ChklstUldStack}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckBaseUldData(string ChklstUldStack);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string assignFlightNo_FlightDate(string Airline, string FlightNo, string FlightDate, int UldStackSNo, string IsassignOrOffload, string OffPoint);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDStackRecord?recid={RecordID}&UserID={UserID}")]
        UldStack GetULDStackRecord(string recordID, string UserID);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDStackRecordJSONString?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDStackRecordJSONString(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetUldStackConsumblesRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<Consumables>> GetUldStackConsumblesRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUldStack")]
        List<string> DeleteUldStack(List<string> RecordID);


        [OperationContract]
        [WebGet(UriTemplate = "GetChildULDStackRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetChildULDStackRecord(string recordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDType?uldstockno={uldstockno}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDType(Int64 uldstockno);
    }
}
