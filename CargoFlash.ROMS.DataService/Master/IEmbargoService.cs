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
namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IEmbargoService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetEmbargoRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Embargo GetEmbargoRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEmbargo")]
        List<string> SaveEmbargo(List<Embargo> Embargo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEmbargo")]
        List<string> UpdateEmbargo(List<Embargo> Embargo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEmbargo")]
        List<string> DeleteEmbargo(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int AirportCitySNo(string OriginAirportSNo);
    }
}
