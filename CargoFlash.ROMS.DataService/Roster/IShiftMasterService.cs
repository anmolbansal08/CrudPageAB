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
    interface IShiftMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetShiftMasterRecord?recid={RecordID}&UserID={UserID}")]
        ShiftMaster GetShiftMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveShiftMaster")]
        List<string> SaveShiftMaster(List<ShiftMaster> ShiftMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShiftMaster")]
        List<string> UpdateShiftMaster(List<ShiftMaster> ShiftMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteShiftMaster")]
        List<string> DeleteShiftMaster(List<string> RecordID);


    }
}
