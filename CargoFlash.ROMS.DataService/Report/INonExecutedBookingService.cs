using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Report;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface INonExecutedBookingService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);
        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{AWBNumber}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string AWBNumber, string OriginCity, string DestinationCity, string FlightNo, string FlightDate);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetWMSWaybillGridDataFBL(string AWBNumber, string OriginCity, String DestinationCity, String FlightNo, string FlightDateSearch, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCompleteReservationData(string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SelectdRoute(string DailFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETCitySNofromItinerary(int ItineraryOriginSNo, int ItineraryDestinationSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewRoute(Int32 ItineraryOrigin, Int32 ItineraryDestination, string AWBPrefix);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SearchFlightResult(string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, Int32 Product, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETD, string SearchFrom, string BookingNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewFlightDetail(Int64 DailyFlightSNo, Int64 OriginSNo, Int64 DestSNo, int Pcs, decimal Gwt, decimal Vol, decimal Chwt, int productSNo, Int64 CommoSNo, Int64 SHCSNo, Int64 AgentSNo, int pom, int NOH, string FlightDate, string FlightNo, string ETD, string ETA, string AllotmentCode, string FlightType, string CarrierCode, Int64 OriginAirportSNo, Int64 DestAirportSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindMinimumChWt(int CommoditySNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/AddBookingShipperandConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string AddBookingShipperandConsigneeInformation(Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, string CallerCode, string HSCode);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAgentMultiOriginPermission(Int64 AgentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GenerateAndGetReferenceNumber(string BookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetItineraryCarrierCode(string AWBCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsItineraryCarrierCodeInterline(string ItineraryCarrierCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FillCommoditySHC(Int32 CommoditySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckValidAWBNumber(int BookingType, string AWBPrefix, string AWBNumber, Int64 OriginCitySNo, Int64 AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string AutoStockAgentOrNot(int BookingType, Int64 AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ManualStockAgentOrNot(int BookingType, Int64 AccountSNo, string AWBPrefix);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirportofSelectedAWBOriginDestination(Int32 CitySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FillProductForAgent(Int32 AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSHCForPerPiecesGrossWt(string SPHC, string HEASPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ULDCheck(int DailFlightSNo, Int64 BookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsInternationalBookingAgent(int OriginCitySNo, int DestinationCitySNo, int AccountSNo, int ItineraryOrigin, int ItineraryDestination);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ISSecondLegORNot(string ItineraryOrigin, string ItineraryDestination);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string RateAvailableOrNotNEW(int BookingType, int AWBStock, string AWBPrefix, int PaymentType, int IsBUP, int BupPieces, int ProductSNo, string OriginCity, string DestinationCity, int AccountSNo, int AWBPieces, decimal GrossWeight, decimal VolumeWeight, decimal ChargeableWeight, decimal Volume, string UM, int CommoditySNo, string NOG, string SPHC, string FlightDate, string FlightNo, string BookingReferenceNo, string AllotmentCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProductAsPerAgent(Int64 AgentSNo);
    }
}
