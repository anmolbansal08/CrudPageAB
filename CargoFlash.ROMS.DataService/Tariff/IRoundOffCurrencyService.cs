using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [ServiceContract]
    public interface IRoundOffCurrencyService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRoundOffCurrency")]
        List<string> SaveRoundOffCurrency(RoundOffCurrency RoundOffC);

        [OperationContract]
        [WebGet(UriTemplate = "GetRoundOffCurrencyRecord?recid={RecordID}&UserSNo={UserSNo}")]
        RoundOffCurrency GetRoundOffCurrencyRecord(string recordID, string UserSNo);



        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetRoundOffCurrencySlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RoundOffCharge>> GetRoundOffCurrencySlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRoundOffCurrency")]
        List<string> DeleteRoundOffCurrency(List<string> RecordID);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRoundOffCurrency")]
        List<string> UpdateRoundOffCurrency(RoundOffCurrency RoundOffC);


    }
}
