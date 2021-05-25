using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [ServiceContract]
    public interface IRateExchangeDueCarrierService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateExchangeDueCarrierRecord?recid={RecordID}&UserID={UserID}")]
        RateExchangeDueCarrier GetRateExchangeDueCarrierRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateExchangeDueCarrier")]
        List<string> SaveRateExchangeDueCarrier(List<RateExchangeDueCarrier> ExchangeRate);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateExchangeDueCarrier")]
        List<string> UpdateRateExchangeDueCarrier(List<RateExchangeDueCarrier> ExchangeRate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateExchangeDueCarrier")]
        List<string> DeleteRateExchangeDueCarrier(List<string> RecordID);

    }
}
