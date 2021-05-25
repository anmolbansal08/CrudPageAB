using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDStockNonInventoryService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetMaxULDSerial?ULDTypeSNo={ULDTypeSNo}&AirlineCode={AirlineCode}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMaxULDSerial(int ULDTypeSNo, string AirlineCode);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "CheckCityCode?CityCode={CityCode}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult CheckCityCode(string CityCode);

        [WebInvoke(Method = "POST", UriTemplate = "SaveULDStockNonInventory")]
        List<string> SaveULDStockNonInventory(List<ULDStockNonInventory> ULDStockNonInventory);

        [WebInvoke(Method = "POST", UriTemplate = "UpdateULDStockNonInventory")]
        List<string> UpdateULDStockNonInventory(List<ULDStockNonInventory> ULDStockNonInventory);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDStockNonInventoryRecord?recid={RecordID}&UserID={UserID}")]
        ULDStockNonInventory GetULDStockNonInventoryRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTareWeight(string ULDSNo);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteULDStockNonInventory")]
        //List<string> DeleteULDStockNonInventory(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportuldInformation(string Code);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDStockNonInventorySpecialRights();


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getavailableData(string UDlSno);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Inventorymessage(string ID);

    }
}
