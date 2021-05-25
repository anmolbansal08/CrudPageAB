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
    public interface IInventoryItemService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetInventoryItemRecord?recid={RecordID}&UserID={UserID}")]
        InventoryItem GetInventoryItemRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveInventoryItem")]
        List<string> SaveInventoryItem(List<InventoryItem> InventoryItem);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateInventoryItem")]
        List<string> UpdateInventoryItem(List<InventoryItem> InventoryItem);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteInventoryItem")]
        List<string> DeleteInventoryItem(List<string> RecordID);
    }
}
