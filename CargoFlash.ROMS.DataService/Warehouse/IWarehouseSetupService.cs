using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [ServiceContract]
    public interface IWarehouseSetupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetWarehouseSetupRecord?recid={RecordID}&UserID={UserID}")]
        WarehouseSetup GetWarehouseSetupRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveWarehouseSetup")]
        List<string> SaveWarehouseSetup(List<WarehouseSetup> WarehouseSetup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateWarehouseSetup")]
        List<string> UpdateWarehouseSetup(List<WarehouseSetup> IrregularityPacking);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/WarehouseTypeCheck", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string WarehouseTypeCheck(string WarehouseName, string AirportName, string WarehouseCod);
    }
}
