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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [ServiceContract]
    public interface IReturnConsumableService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetReturnConsumableRecord?recid={RecordID}")]
        ReturnConsumableTrans GetReturnConsumableRecord(string recordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetConsumableIssueStockRecord?ConsumableSno={ConsumableSno}&NoOfItems={NoOfItems}&IssuedType={IssuedType}&IssuedToSno={IssuedToSno}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetConsumableIssueStockRecord(int ConsumableSno, int NoOfItems, int IssuedType, int IssuedToSno);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetConsumableIssueStockRecord(int ConsumableSno, int NoOfItems,int IssuedType, int IssuedToSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveReturnConsumable")]
        List<string> SaveReturnConsumable(List<ReturnConsumable> ConnectionType);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetReturnConsumableTransRecord(int Sno);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetConsumableIssueRecordForRetun(int ConsumableSno, int NoOfItems, string ReturnType, string ReturnFrom);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateReturnConsumables",ResponseFormat = WebMessageFormat.Json)]
        string CreateReturnConsumables(List<ReturnConsumablesList> lstConsumabReturn);


    }
}
