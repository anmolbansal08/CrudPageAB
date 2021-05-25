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
    public interface IInventoryVehTypeService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetInventoryVehTypeRecord?recid={RecordID}&UserID={UserID}")]
        InventoryVehType GetInventoryVehTypeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveInventoryVehType")]
        List<string> SaveInventoryVehType(List<InventoryVehType> InventoryVehType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateInventoryVehType")]
        List<string> UpdateInventoryVehType(List<InventoryVehType> InventoryVehType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteInventoryVehType")]
        List<string> DeleteInventoryVehType(List<string> RecordID);
    }
}
