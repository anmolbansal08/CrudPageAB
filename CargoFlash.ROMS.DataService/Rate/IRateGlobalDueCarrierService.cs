using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Tariff;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [ServiceContract]
    public interface IRateGlobalDueCarrierService 
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateGlobalDueCarrierRecord?recid={RecordID}&UserID={UserID}")]
        RateGlobalDueCarrier GetRateGlobalDueCarrierRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateGlobalDueCarrier")]
        List<string> SaveRateGlobalDueCarrier(List<RateGlobalDueCarrier> ExchangeRate);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateGlobalDueCarrier")]
        List<string> UpdateRateGlobalDueCarrier(List<RateGlobalDueCarrier> ExchangeRate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateGlobalDueCarrier")]
        List<string> DeleteRateGlobalDueCarrier(List<string> RecordID);
    }


}
