using CargoFlash.Cargo.Model.Mail;

using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Mail
{
    [ServiceContract]
    public interface IAirMailService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirMailGridData/{processName}/{moduleName}/{appName}/{CN38No}/{FlightNo}/{FlightDate}/{ShipmentOrigin}/{ShipmentDest}/{MailCategory}/{MailHCCode}/{MovementType}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetAirMailGridData(string processName, string moduleName, string appName, string CN38No, string FlightNo, string FlightDate, string ShipmentOrigin, string ShipmentDest, string MailCategory, string MailHCCode, string MovementType);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailDetailsGridData(string CN38No, string FlightNo, string FlightDate, string ShipmentOrigin, string ShipmentDest, string MailCategory, string MailHCCode, string MovementType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirMailDetails(Int32 AirMailSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirMailCustomerInformation(Int32 AirMailSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAirMailTrans(Int32 AirMailSNO);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirMailTransaction>> GetAirMailTrans(string SNO, int pageNo, int pageSize, string whereCondition, CreateAirMailWhereCondition model, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAirMailTrans?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<AirMailTransaction>> GetAirMailTrans(string recordID, int page, int pageSize, string whereCondition, string sort);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirmail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAirmail(Int32 AirMailSNo, AirMail ShipmentInformation, string MovementType, int AirlineCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirmailCustomer", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAirmailCustomer(Int32 AirMailSNo, AirMailCustomer Customer, string SHIPPER_AccountNo, string CONSIGNEE_AccountNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirmailTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAirmailTrans(Int32 AirMailSNo, List<AirMailTransaction> LstPieceTrans, string Value);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtPayment(Int32 AirMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FBLHandlingCharges(Int32 AirMailSNo, string CityCode);

        // Save Payment Invoice
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtPayment(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetMailSubCategory();

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetScannedDN(string StrData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SearchFlightResult(string airlinecode, string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETA, string SearchCarrierCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckEmbargoParam(int DailFlightSNo, int AgentSNo, int ProductSNo, int CommoditySNo, int ItineraryPieces, string ItineraryGrossWeight, string ItineraryVolumeWeight, int PaymentType, string SPHC);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckEmbargoParamAll", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckEmbargoParamAll(Int64 AirMailSNo, Int64 BookingSNo, Int64 BookingRefNo, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SelectdRoute(string DailFlightSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirportofSelectedAWBOriginDestination(Int32 CitySNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewRoute(Int32 ItineraryOrigin, Int32 ItineraryDestination);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveItinerary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveItinerary(Int32 AirMailSNo, AirMail ShipmentInformation, string MovementType, int AirlineCode, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ISSecondLegORNot(string ItineraryOrigin, string ItineraryDestination);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePomailItenaryInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdatePomailItenaryInformation(Int64 BookingRefNo, POMailInformation POMailInformation, List<POMailItineraryInformation> PoMailItineraryInformation);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSelectedAWBOriginDestination(string Citycode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindAllotmentArray(int DailyFlightSNo, int AccountSNo, int ShipperSNo, decimal GrossWt, decimal Volume, string ProductSNo, string CommoditySNo, string SHC);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetItineraryCarrierCode(string AWBCode);
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTaxChargeInformationTabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]

        KeyValuePair<string, List<TaxChargeInformation>> GetTaxChargeInformationTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetOtherchargeInformationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AgentOtherCharge>> GetOtherchargeInformationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsItineraryCarrierCodeInterline(string ItineraryCarrierCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETCitySNofromItinerary(int ItineraryOriginSNo, int ItineraryDestinationSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SearchFlightResultTest(string airlinecode, string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETA, string SearchCarrierCode, string SearchFrom, string BookingNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<ScannDn> GetScannedDNN(string StrData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeletePOMailTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DeletePOMailTrans(string recid, string PoMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightDetails(string PoMailSNo,string DNNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDNFlightDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDNFlightDetails(List<DNFlightTransaction> FlightDetails, string DNSNo);
    }
}
