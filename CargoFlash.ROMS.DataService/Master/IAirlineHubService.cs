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
    public interface IAirlineHubService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirlineHub")]
        List<string> SaveAirlineHub(List<AirlineHub> AirlineHub);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirlineHubRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AirlineHub GetAirlineHubRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirlineHub")]
        List<string> UpdateAirlineHub(List<AirlineHub> AirlineHub);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirlineHub")]
        List<string> DeleteAirlineHub(List<string> RecordID);
    }
}
