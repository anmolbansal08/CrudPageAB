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
    interface IDesignationMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDesignationMasterRecord?recid={RecordID}&UserID={UserID}")]
        DesignationMaster GetDesignationMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDesignationMaster")]
        List<string> SaveDesignationMaster(List<DesignationMaster> DesignationMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDesignationMaster")]
        List<string> UpdateDesignationMaster(List<DesignationMaster> DesignationMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDesignationMaster")]
        List<string> DeleteDesignationMaster(List<string> RecordID);
    }
}
