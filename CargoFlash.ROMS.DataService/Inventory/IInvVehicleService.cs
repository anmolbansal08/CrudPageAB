using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using CargoFlash.Cargo.Model.Inventory;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Inventory
{
   [ServiceContract]
   public interface IInvVehicleService
    {
       [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

       [OperationContract]
       [WebGet(UriTemplate = "GetInvVehicleRecord?recid={RecordID}&UserID={UserID}")]
       InvVehicle GetInvVehicleRecord(string recordID, string UserID);

       [OperationContract]
       [WebInvoke(Method = "POST", UriTemplate = "/SaveInvVehicle")]
       List<string> SaveInvVehicle(List<InvVehicle> InvVehicle);

       [OperationContract]
       [WebInvoke(Method = "POST", UriTemplate = "/UpdateInvVehicle")]
       List<string> UpdateInvVehicle(List<InvVehicle> InvVehicle);

       [OperationContract]
       [WebInvoke(Method = "POST", UriTemplate = "/DeleteInvVehicle")]
       List<string> DeleteInvVehicle(List<string> RecordID);
    }
}
