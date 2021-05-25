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
    public interface ISPHCDocumentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSPHCDocumentRecord?recid={RecordID}&UserSNo={UserSNo}")]
        SPHCDocument GetSPHCDocumentRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveSPHCDocument")]
        List<string> SaveSPHCDocument(List<SPHCDocument> DocumentMaster);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSPHCDocument")]
        List<string> UpdateSPHCDocument(List<SPHCDocument> SPHCDocument);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSPHCDocument")]
        List<string> DeleteSPHCDocument(List<string> listID);


        [OperationContract]
        [WebGet(UriTemplate = "GetDayLightSavingTime/{TimeZoneSno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DayLightSavingTime GetDayLightSavingTime(string TimeZoneSno);
    }
}
