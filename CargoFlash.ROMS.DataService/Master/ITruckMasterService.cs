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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ITruckMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTruckMasterRecord?recid={RecordID}&UserSNo={UserSNo}")]
        TruckMaster GetTruckMasterRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTruckMaster")]
        List<string> SaveTruckMaster(List<TruckMaster> TruckMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTruckMaster")]
        List<string> UpdateTruckMaster(List<TruckMaster> TruckMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteTruckMaster")]
        List<string> DeleteTruckMaster(List<string> RecordID);
    }
}
