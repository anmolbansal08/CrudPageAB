using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IVehicleService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(VehicleGridDataModel model, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetVehicleRecord?recid={RecordID}&UserID={UserID}")]
        Vehicle GetVehicleRecord(int recordID,string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCapacityTransvehicle(int VehicleTypeSNo, int VehicleMakeSNo);
    

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveVehicle")]
        List<string> SaveVehicle(List<VehicleRecords> Vehicle);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateVehicle")]
        List<string> UpdateVehicle(List<VehicleRecordstrans> Vehicle);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteVehicle")]
        List<string> DeleteVehicle(List<string> listID);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetHHTTruckingPrint(string TruckSNo, string IsTruckingLoadPrint);



    }
}
