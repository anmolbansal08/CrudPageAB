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
    interface IDutyAreaService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDutyAreaRecord?recid={RecordID}&UserID={UserID}")]
        DutyArea GetDutyAreaRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDutyArea")]
        List<string> SaveDutyArea(List<DutyArea> DutyArea);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDutyArea")]
        List<string> UpdateDutyArea(List<DutyArea> DutyArea);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDutyArea")]
        List<string> DeleteDutyArea(List<string> RecordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetColorName/{HashColorCodeSno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        HashColorName GetColorName(string hashColorCodeSno);
    }
}
