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
    public interface IRateTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        RateType GetRateTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateType")]
        List<string> SaveRateType(List<RateType> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateType")]
        List<string> UpdateRateType(List<RateType> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateType")]
        List<string> DeleteRateType(List<string> RecordID);
    }
}
