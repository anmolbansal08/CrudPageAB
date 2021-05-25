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
    public interface IEDoxService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetEDoxRecord?recid={RecordID}&UserSNo={UserSNo}")]
        EDox GetEDoxRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveEDox")]
        List<string> SaveEDox(List<EDox> EDox);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEDox")]
        List<string> UpdateEDox(List<EDox> EDox);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEDox")]
        List<string> DeleteEDox(List<string> RecordID);

    }
}
