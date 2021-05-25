using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Inventory
{
     [ServiceContract]
   public interface IInvVehicleServiceService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetInvVehicleServiceRecord?recid={RecordID}&UserID={UserID}")]
        CargoFlash.Cargo.Model.Inventory.InvVehicleService GetInvVehicleServiceRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveInvVehicleService")]
        List<string> SaveInvVehicleService(List<CargoFlash.Cargo.Model.Inventory.InvVehicleService> InvVehicleService);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateInvVehicleService")]
        List<string> UpdateInvVehicleService(List<CargoFlash.Cargo.Model.Inventory.InvVehicleService> InvVehicleService);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteInvVehicleService")]
        List<string> DeleteInvVehicleService(List<string> RecordID);
    }
}
