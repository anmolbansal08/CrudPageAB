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
   public interface ITruckTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTruckTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        TruckType GetTruckTypeRecord(string recordID, string UserSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTruckType")]
        List<string> SaveTruckType(List<TruckType> TruckType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTruckType")]
        List<string> UpdateTruckType(List<TruckType> TruckType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteTruckType")]
        List<string> DeleteTruckType(List<string> RecordID);

    }
}
