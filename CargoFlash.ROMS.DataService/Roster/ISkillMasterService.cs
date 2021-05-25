using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.DataService.Roster
{
     [ServiceContract]
    interface ISkillMasterService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSkillMasterRecord?recid={RecordID}&UserID={UserID}")]
        SkillMaster GetSkillMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSkillMaster")]
        List<string> SaveSkillMaster(List<SkillMaster> SkillMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSkillMaster")]
        List<string> UpdateSkillMaster(List<SkillMaster> SkillMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSkillMaster")]
        List<string> DeleteSkillMaster(List<string> RecordID);
    }
}
