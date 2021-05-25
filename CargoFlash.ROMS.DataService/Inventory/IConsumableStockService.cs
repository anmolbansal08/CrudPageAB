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
    public interface IConsumableStockService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetConsumableStockRecord(int recid,string UserID);


        //[OperationContract]
        //[WebGet(UriTemplate = "GetConsumableStockRecord?recid={RecordID}&UserID={UserID}")]
        //ConsumableStock GetConsumableStockRecord(int recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetConsumableStockRecord?recid={RecordID}&sort={sort}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ConsumableStock>> GetConsumableStockRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetConsumableStockRecord(int recid, int UserID, int ConsumableStockTransSno);


 


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveConsumableStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> SaveConsumableStock(string ConsumablePrefix, string ConsumableType, int ConsumableNo, int ConsumableSno, string CityCode, string NoOfItems, decimal TareWeight, int CitySno, int Airport, int Office, int Owner, int OwnerSno);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateConsumableStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateConsumableStock(int ConsumableStockTransSno, int ConsumableSno, decimal TareWeight, string IsActive, string EquipmentNbr);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteConsumableStock")]
        List<string> DeleteConsumableStock(List<string> RecordID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteConsumableStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //List<string> DeleteConsumableStock(int consumableStockSno);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateConsumableStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateConsumableStock(string strData);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportOfficeInformation(string CitySNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Getofficelist(string OfficeSNo);
    }
}
