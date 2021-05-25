using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Rate;
namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IExchangeRateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetExchangeRateRecord?recid={RecordID}&UserID={UserID}")]
        ExchangeRate GetExchangeRateRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveExchangeRate")]
        List<string> SaveExchangeRate(List<ExchangeRate> ExchangeRate);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateExchangeRate")]
        List<string> UpdateExchangeRate(List<ExchangeRate> ExchangeRate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteExchangeRate")]
        List<string> DeleteExchangeRate(List<string> RecordID);
    }
}
