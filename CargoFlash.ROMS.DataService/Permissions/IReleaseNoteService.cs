using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
   [ServiceContract]
   public interface IReleaseNoteService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetReleaseNoteRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ReleaseNote GetReleaseNoteRecord(int RecordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetReleaseNoteRecords?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ReleaseNote>> GetReleaseNoteRecords(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteReleaseNote")]
        List<string> DeleteReleaseNote(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteReleaseNoteTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteReleaseNoteTrans(string recordID);

    }
}
