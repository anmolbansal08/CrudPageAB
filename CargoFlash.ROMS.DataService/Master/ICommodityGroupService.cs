using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;
namespace CargoFlash.Cargo.DataService.Master
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ICommodityGroupService" in both code and config file together.
    [ServiceContract]
    public interface ICommodityGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        
        [OperationContract]
        [WebGet(UriTemplate = "GetCommodityGroupRecord?recid={RecordID}&UserSN={UserSNo}")]
        CommodityGroup GetCommodityGroupRecord(string recordID,string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCommodityGroup")]
        List<string> SaveCommodityGroup(List<CommodityGroup> CommodityGroup);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCommodityGroup")]
        List<string> UpdateCommodityGroup(List<CommodityGroup> CommodityGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCommodityGroup")]
        List<string> DeleteCommodityGroup(List<string> RecordID);
    }
}
