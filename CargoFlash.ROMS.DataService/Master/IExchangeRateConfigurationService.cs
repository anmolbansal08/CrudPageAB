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
    public interface IExchangeRateConfigurationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveExchangeRateConfiguration")]
        List<string> SaveExchangeRateConfiguration(List<ExchangeRateConfiguration> ExchangeRateConfiguration);

        [OperationContract]
        [WebGet(UriTemplate = "GetExchangeRateConfigurationRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ExchangeRateConfiguration GetExchangeRateConfigurationRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateExchangeRateConfiguration")]
        List<string> UpdateExchangeRateConfiguration(List<ExchangeRateConfiguration> ExchangeRateConfiguration);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteExchangeRateConfiguration")]
        List<string> DeleteExchangeRateConfiguration(List<string> RecordID);

        
       
    }
}
