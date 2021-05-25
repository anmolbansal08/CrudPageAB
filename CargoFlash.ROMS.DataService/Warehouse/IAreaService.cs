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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [ServiceContract]
    public interface IAreaService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAreaRecord?recid={RecordID}&UserID={UserID}")]
        Area GetAreaRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveArea")]
        List<string> SaveArea(List<Area> Area);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateArea")]
        List<string> UpdateArea(List<Area> Area);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteArea")]
        List<string> DeleteArea(List<string> RecordID);

    }
}
