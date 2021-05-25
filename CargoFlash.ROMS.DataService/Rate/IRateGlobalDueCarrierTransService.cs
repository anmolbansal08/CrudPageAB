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
    public interface IRateGlobalDueCarrierTransService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateGlobalDueCarrierTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateGlobalDueCarrierTrans>> GetRateGlobalDueCarrierTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateRateGlobalDueCarrierTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateRateGlobalDueCarrierTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteRateGlobalDueCarrierTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteRateGlobalDueCarrierTrans(string recordID);

       [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetExchangeRate?OriginalValue={OriginalValue}&CurrencySNo={CurrencySNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetExchangeRate(String OriginalValue, String CurrencySNo);



    }
}
