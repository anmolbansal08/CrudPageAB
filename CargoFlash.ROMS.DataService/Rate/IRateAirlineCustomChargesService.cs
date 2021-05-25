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
    [ServiceContract]
    public interface IRateAirlineCustomChargesService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateAirlineCustomChargesRecord?rateAirlineMasterSNo={rateAirlineMasterSNo}&originCitySNo={originCitySNo}&originAirportSNo={originAirportSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateAirlineCustomCharges>> GetRateAirlineCustomChargesRecord(int rateAirlineMasterSNo, int originCitySNo, int originAirportSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRateAirlineTrans")]
        //List<string> SaveRateAirlineTrans(List<RateAirlineTrans> RateAirlineTrans);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateRateAirlineCustomCharges", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateRateAirlineCustomCharges(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateRateAirlineTrans")]
        //List<string> UpdateRateAirlineTrans(List<RateAirlineTrans> RateAirlineTrans);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteRateAirlineCustomCharges?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteRateAirlineCustomCharges(string recordID);
    }
}
