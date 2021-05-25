using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Rate;
namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IAgentGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAgentGroupRecord?recid={RecordID}&UserID={UserID}")]
        AgentGroup GetAgentGroupRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAgentGroup")]
        List<string> SaveAgentGroup(List<AgentGroup> AgentGroup);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAgentGroup")]
        List<string> UpdateAgentGroup(List<AgentGroup> AgentGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAgentGroup")]
        List<string> DeleteAgentGroup(List<string> RecordID);
    }
}
