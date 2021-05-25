using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;



namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IVehicleTypeService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
            [WebGet(UriTemplate = "GetVehicleTypeRecord?recid={RecordID}&UserID={UserID}")]
            VehicleType GetVehicleTypeRecord(int recordID,string UserID);

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/SaveVehicleType")]
            List<string> SaveVehicleType(List<VehicleType> VehicleType);


            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/UpdateVehicleType")]
            List<string> UpdateVehicleType(List<VehicleType> VehicleType);

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/DeleteVehicleType")]
            List<string> DeleteVehicleType(List<string> listID);
       
    }
}
