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
    public interface IDocumentMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDocumentMasterRecord?recid={RecordID}&UserSNo={UserSNo}")]
        DocumentMaster GetDocumentMasterRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveDocumentMaster")]
        List<string> SaveDocumentMaster(List<DocumentMaster> DocumentMaster);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDocumentMaster")]
        List<string> UpdateDocumentMaster(List<DocumentMaster> DocumentMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDocumentMaster")]
        List<string> DeleteDocumentMaster(List<string> RecordID);


        [OperationContract]
        [WebGet(UriTemplate = "GetDayLightSavingTime/{TimeZoneSno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DayLightSavingTime GetDayLightSavingTime(string TimeZoneSno);
    }
}
