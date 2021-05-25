using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IRateDetailsHistoryService
    {
        [OperationContract] 
        [WebInvoke(Method = "GET", UriTemplate = "GetRateDetailsHistoryData?AirlineSNo={AirlineSNo}&OfficeSNo={OfficeSNo}&RateTypeSNo={RateTypeSNo}&stausval={stausval}&OriginLev={OriginLev}&Origin={Origin}&DestLev={DestLev}&Destination={Destination}&vallidFrom={vallidFrom}&VallidTo={VallidTo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRateDetailsHistoryData(string AirlineSNo, string OfficeSNo, string RateTypeSNo, string stausval, string OriginLev, string Origin, string DestLev, string Destination, string vallidFrom, string VallidTo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetData();
    }
}
