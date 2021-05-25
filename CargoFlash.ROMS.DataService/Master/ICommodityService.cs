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
using WCF.Validation.Engine;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ICommodityService : IHasModelStateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCommodityRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Commodity GetCommodityRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCommodity")]
        List<string> SaveCommodity(List<Commodity> Commodity);


        [OperationContract]
        [FaultContract(typeof(ValidationFault))]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCommodity")]
        List<string> UpdateCommodity(List<Commodity> Commodity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCommodity")]
        List<string> DeleteCommodity(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCommoditySubGroupType", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCommoditySubGroupType(string Code);

    }
}
