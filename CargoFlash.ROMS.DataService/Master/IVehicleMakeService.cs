using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IVehicleMakeService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetVehicleMakeRecord?recid={RecordID}&UserID={UserID}")]
        VehicleMake GetVehicleMakeRecord(int recordID, string UserID);

       

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveVehicleMake")]
        List<string> SaveVehicleMake(List<VehicleMake> VehicleMake);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateVehicleMake")]
        List<string> UpdateVehicleMake(List<VehicleMake> VehicleMake);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteVehicleMake")]
        List<string> DeleteVehicleMake(List<string> listID);
       
    }
}
