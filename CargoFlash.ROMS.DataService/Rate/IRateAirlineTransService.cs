using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Tariff;
namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRateAirlineTransService" in both code and config file together.
    [ServiceContract]
    public interface IRateAirlineTransService
    {
        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateAirlineTransRecord?rateAirlineMasterSNo={rateAirlineMasterSNo}&originAirportSNo={originAirportSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateAirlineTrans>> GetRateAirlineTransRecord(int rateAirlineMasterSNo, int originAirportSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRateAirlineTrans")]
        //List<string> SaveRateAirlineTrans(List<RateAirlineTrans> RateAirlineTrans);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateRateAirlineTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateRateAirlineTrans(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateRateAirlineTrans")]
        //List<string> UpdateRateAirlineTrans(List<RateAirlineTrans> RateAirlineTrans);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteRateAirlineTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteRateAirlineTrans(string recordID);

      
    }
}
