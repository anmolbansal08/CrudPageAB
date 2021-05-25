using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Rate;
namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRateHeavyWeightCommodityExemptionService" in both code and config file together.
    [ServiceContract]
    public interface IRateHeavyWeightCommodityExemptionService
    {
        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateHeavyWeightCommodityExemptionRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateHeavyWeightCommodityExemption>> GetRateHeavyWeightCommodityExemptionRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRateHeavyWeightCommodityExemption")]
        //List<string> SaveRateHeavyWeightCommodityExemption(List<RateHeavyWeightCommodityExemption> RateHeavyWeightCommodityExemption);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateRateHeavyWeightCommodityExemption", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateRateHeavyWeightCommodityExemption(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateRateHeavyWeightCommodityExemption")]
        //List<string> UpdateRateHeavyWeightCommodityExemption(List<RateHeavyWeightCommodityExemption> RateHeavyWeightCommodityExemption);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteRateHeavyWeightCommodityExemption?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteRateHeavyWeightCommodityExemption(string recordID);
    }
}
