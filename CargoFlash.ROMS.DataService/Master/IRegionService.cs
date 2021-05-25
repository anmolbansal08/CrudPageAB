using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IRegionService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRegion")]
        List<string> SaveRegion(List<Region> regionList);

        [OperationContract]
        [WebGet(UriTemplate = "GetRegionRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Region GetRegionRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRegion")]
        List<string> UpdateRegion(List<Region> commission);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRegion")]
        List<string> DeleteRegion(List<string> RecordID);
    }
}
