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
    public interface IStateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetStateRecord?recid={RecordID}&UserSNo={UserSNo}")]
        State GetStateRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveState")]
        List<string> SaveState(List<State> State);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateState")]
        List<string> UpdateState(List<State> State);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteState")]
        List<string> DeleteState(List<string> RecordID);


    }
}
