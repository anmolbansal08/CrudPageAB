using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [ServiceContract]
    public interface IInventoryStockListService
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

        [WebInvoke(Method = "POST", UriTemplate = "SaveInventoryStockList")]
        List<string> SaveInventoryStockList(List<InventoryStockList> InventoryStockList);

        [WebInvoke(Method = "POST", UriTemplate = "UpdateInventoryStockList")]
        List<string> UpdateInventoryStockList(List<InventoryStockList> InventoryStockList);

        [OperationContract]
        [WebGet(UriTemplate = "GetInventoryStockListRecord?recid={RecordID}&UserSNo={UserSNo}")]
        InventoryStockList GetInventoryStockListRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTareWeight(string ULDSNo);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteInventoryStockList")]
        //List<string> DeleteInventoryStockList(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportuldInformation(string Code);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetInventoryStockListSpecialRights();


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getavailableData(string UDlSno);



    }
}
