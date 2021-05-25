using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Stock;

namespace CargoFlash.Cargo.DataService.Stock
{
    [ServiceContract]
    public interface IAWBReservedService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBReserved")]
        List<string> SaveAWBReserved(List<AWBReserved> AWBReserved);

        [OperationContract]
        [WebGet(UriTemplate = "GetAWBReservedRecord?recid={RecordID}&UserID={UserID}")]
        AWBReserved GetAWBReservedRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBReserved")]
        List<string> UpdateAWBReserved(List<AWBReserved> AWBReserved);
    }
}
