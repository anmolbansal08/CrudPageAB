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
    public interface IOtherChargesHistoryService
    {
        [OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetOtherChargesHistoryData?AirlineSNo={AirlineSNo}&chargeTypeval={chargeTypeval}&DueCarrierCode={DueCarrierCode}&stausval={stausval}&OriginLev={OriginLev}&Origin={Origin}&DestLev={DestLev}&Destination={Destination}&vallidFrom={vallidFrom}&VallidTo={VallidTo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetOtherChargesHistoryData(int AirlineSNo, string chargeTypeval, string DueCarrierCode, string stausval, string OriginLev, string Origin, string DestLev, string Destination, string vallidFrom, string VallidTo);

        [WebInvoke(Method = "POST", BodyStyle=WebMessageBodyStyle.Bare,ResponseFormat=WebMessageFormat.Json,RequestFormat=WebMessageFormat.Json,
            UriTemplate = "/GetOtherChargesHistoryData")]
       // List<string> SaveCreditDebitNote(GetOtherChargesHistoryDataModel lstobj);
        string GetOtherChargesHistoryData(GetOtherChargesHistoryDataModel obj);
    }
}
