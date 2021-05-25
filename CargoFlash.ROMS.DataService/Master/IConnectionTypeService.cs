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
    public interface IConnectionTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        
        [OperationContract]
        [WebGet(UriTemplate = "GetConnectionTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ConnectionType GetConnectionTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveConnectionType")]
        List<string> SaveConnectionType(List<ConnectionType> ConnectionType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteConnectionType")]
        List<string> DeleteConnectionType(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateConnectionType")]
        List<string> UpdateConnectionType(List<ConnectionType> ConnectionType);
    }
}
