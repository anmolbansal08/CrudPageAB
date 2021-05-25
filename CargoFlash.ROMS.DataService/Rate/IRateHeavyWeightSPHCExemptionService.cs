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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRateHeavyWeightSPHCExemptionService" in both code and config file together.
    [ServiceContract]
    public interface IRateHeavyWeightSPHCExemptionService
    {
        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateHeavyWeightSPHCExemptionRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateHeavyWeightSPHCExemption>> GetRateHeavyWeightSPHCExemptionRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRateHeavyWeightSPHCExemption")]
        //List<string> SaveRateHeavyWeightSPHCExemption(List<RateHeavyWeightSPHCExemption> RateHeavyWeightSPHCExemption);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateRateHeavyWeightSPHCExemption", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateRateHeavyWeightSPHCExemption(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateRateHeavyWeightSPHCExemption")]
        //List<string> UpdateRateHeavyWeightSPHCExemption(List<RateHeavyWeightSPHCExemption> RateHeavyWeightSPHCExemption);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteRateHeavyWeightSPHCExemption?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteRateHeavyWeightSPHCExemption(string recordID);
    }
}
