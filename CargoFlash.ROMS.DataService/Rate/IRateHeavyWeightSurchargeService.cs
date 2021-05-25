using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IRateHeavyWeightSurchargeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest,UriTemplate = "GetCurrency?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCurrency(String RecordID);
       
        [OperationContract]
        [WebGet(UriTemplate = "GetRateHeavyWeightSurchargeRecord?recid={RecordID}&UserID={UserID}")]
        RateHeavyWeightSurcharge GetRateHeavyWeightSurchargeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateHeavyWeightSurcharge")]
        List<string> SaveRateHeavyWeightSurcharge(List<RateHeavyWeightSurcharge> RateHeavyWeightSurcharge);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateHeavyWeightSurcharge")]
        List<string> UpdateRateHeavyWeightSurcharge(List<RateHeavyWeightSurcharge> RateHeavyWeightSurcharge);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateHeavyWeightSurcharge")]
        List<string> DeleteRateHeavyWeightSurcharge(List<string> RecordID);



    }
}
