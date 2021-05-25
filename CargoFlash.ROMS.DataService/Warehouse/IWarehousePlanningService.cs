using CargoFlash.Cargo.Model.Warehouse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [ServiceContract]
    public interface IWarehousePlanningService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetPanningMatrix?recid={RecordID}&sltSNo={subLocationTypeSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        WarehousePlanning GetPanningMatrix(string recordID, string subLocationTypeSNo);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveArea", ResponseFormat = WebMessageFormat.Json)]
        string SaveArea(WarehousePlanningMatrix obj);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningSearchResultbtn>> SearchData(string recid, int pageNo, int pageSize, LocationSearch model, string sort);

        [OperationContract]
        [WebInvoke(UriTemplate = "PendingLocationSearchData", ResponseFormat = WebMessageFormat.Json)]
        List<WarehousePlanningSearchResultbtn> PendingLocationSearchData(WarehousePlanningSearch obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "CreateLocationSearchData", ResponseFormat = WebMessageFormat.Json)]
        List<WarehousePlanningSearchResultbtn> CreateLocationSearchData(WarehousePlanningSearch obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "FindLocation", ResponseFormat = WebMessageFormat.Json)]
        string FindLocation(WarehousePlanningSearch obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "FindNameLocation", ResponseFormat = WebMessageFormat.Json)]
        string FindNameLocation(WarehousePlanningSearch obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "SaveLocation", ResponseFormat = WebMessageFormat.Json)]
        string SaveLocation(WarehousePlanningLocation obj);


        [OperationContract]
        [WebInvoke(UriTemplate = "UpdateLocation", ResponseFormat = WebMessageFormat.Json)]
        string UpdateLocation(WarehousePlanningLocation obj);


        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteSubArea", ResponseFormat = WebMessageFormat.Json)]
        string DeleteSubArea(WarehousePlanningLocation obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteArea", ResponseFormat = WebMessageFormat.Json)]
        string DeleteArea(WarehousePlanningLocation obj);


        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteCagesRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json)]
        List<string> DeleteCagesRecord(string recordID);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteRackRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> DeleteRackRecord(string recordID);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteRoomRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> DeleteRoomRecord(string recordID);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteFloorRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> DeleteFloorRecord(string recordID);

        [OperationContract]
        [WebInvoke(UriTemplate = "DeleteDollyRecord?recid={RecordID}", ResponseFormat = WebMessageFormat.Json)]
        List<string> DeleteDollyRecord(string recordID);



        [OperationContract]
        [WebInvoke(UriTemplate = "GetSubAreaData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        WarehousePlanningLocation GetSubAreaData(WarehousePlanningMatrix obj);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDollyRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningLocationList>> GetDollyRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRackRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningLocationList>> GetRackRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCagesRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningLocationList>> GetCagesRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFloorRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningLocationList>> GetFloorRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRoomRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehousePlanningLocationList>> GetRoomRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
    }
}
