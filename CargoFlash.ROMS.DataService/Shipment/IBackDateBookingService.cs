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
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.Model.Rate;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Reservation interface Description
    /*
	*****************************************************************************
	interface Name:		IReservationService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Shahbaz Akhtar
	Created On:		    25 Jan 2018
    Updated By:    
	Updated On: 
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [ServiceContract]
    public interface IBackDateBookingService
    {
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetWebForm", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetWebForm(ReservationGetWebForm model);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{AWBPrefix}/{AWBNo}/{LoggedInCity}/{ReferenceNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        //Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string ReferenceNo);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetGridData(ReservationGetGridData model);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetReservationGridData(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string ReferenceNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetReservationGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetReservationGridData(GetReservationGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCompleteReservationData(Int64 AWBReferenceBookingSNo, string BookingRefNo, Int64 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewRoute(Int32 ItineraryOrigin, Int32 ItineraryDestination, string AWBPrefix);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SearchFlightResult(string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, Int32 Product, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETD, string SearchFrom, string BookingNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirportofSelectedAWBOriginDestination(Int32 CitySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FillProductForAgent(Int32 AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetItineraryCarrierCode(string AWBCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsPerPiecesCheckAllow(Int64 CommoditySNo, string SPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FillCommoditySHC(Int32 CommoditySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckITL(Int32 BookingSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckAWBRouteStatus(Int32 BookingSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSHCForPerPiecesGrossWt(string SPHC, string HEASPHC);

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
        string SelectdRoute(string DailFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETCitySNofromItinerary(int ItineraryOriginSNo, int ItineraryDestinationSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckEmbargoParam(int DailFlightSNo, int AgentSNo, int ProductSNo, int CommoditySNo, int ItineraryPieces, string ItineraryGrossWeight, string ItineraryVolumeWeight, int PaymentType, string SPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ULDCheck(int DailFlightSNo, Int64 BookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsItineraryCarrierCodeInterline(string ItineraryCarrierCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsInternationalBookingAgent(int OriginCitySNo, int DestinationCitySNo, int AccountSNo, int ItineraryOrigin, int ItineraryDestination);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string RateAvailableOrNot(int BookingType, int AWBStock, string AWBPrefix, int PaymentType, int IsBUP, int BupPieces, int ProductSNo, string OriginCity, string DestinationCity, int AccountSNo, int AWBPieces, decimal GrossWeight, decimal VolumeWeight, decimal ChargeableWeight, decimal Volume, string UM, int CommoditySNo, string NOG, string SPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string RateAvailableOrNotNEW(int BookingType, int AWBStock, string AWBPrefix, int PaymentType, int IsBUP, int BupPieces, int ProductSNo, string OriginCity, string DestinationCity, int AccountSNo, int AWBPieces, decimal GrossWeight, decimal VolumeWeight, decimal ChargeableWeight, decimal Volume, string UM, int CommoditySNo, string NOG, string SPHC, string FlightDate, string FlightNo, string BookingReferenceNo, string AllotmentCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GenerateAndGetReferenceNumber(string BookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckAndValidateCopyFlightData(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProductAsPerAgent(Int64 AgentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAgentMultiOriginPermission(Int64 AgentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAccountAirlineTransDetails(string AWBPrefix);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string InsertdataCopyBooking(string BookingMasterRefNo, Int64 PreviousBookingSNo, string PreviousBookingMasterRefNo, int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETProductASPerBookingType(string BookingType, string LoginType);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckDimensionOnExecution(string ReservationBookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckULDDimensionOnExecution(string ReservationBookingRefNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ISSecondLegORNot(string ItineraryOrigin, string ItineraryDestination);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindAllotmentArray(int DailyFlightSNo, int AccountSNo, int ShipperSNo, decimal GrossWt, decimal Volume, string ProductSNo, string CommoditySNo, string SHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/AddBookingShipperandConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string AddBookingShipperandConsigneeInformation(Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, string CallerCode, string BookingDate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateBookingShipperandConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string CallerCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ExecuteBookingShipperandConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ExecuteBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string HandlingInformation, string CallerCode);
        //string ExecuteBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, List<ReservationDGRArray> AWBDGRTrans, List<ReservationSHCSubGroupArray> SHCSubGroupArray, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAWBEDoxDetail(Int32 AWBSNo, List<ReservationAWBEDoxDetail> AWBEDoxDetail, List<ReservationSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, string PriorApproval, string BOEVerification, Int32 UpdatedBy, string BOENo, string BOEDate, string isFOC, string FOCTypeSNo, string FocRemarks);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWBEDox(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDGRInfo(string SPHCSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDGRInfoByID(string SNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetMaxQty(string UNNo, string PackGroup, string PackInst);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDimensionTabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DimensionTab>> GetDimensionTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateDimensionTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateDimensionTab(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteDimensionTab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteDimensionTab(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDimensionTabRecordAWB?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DimensionTab>> GetDimensionTabRecordAWB(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateDimensionTabAWB", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateDimensionTabAWB(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteDimensionTabAWB?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteDimensionTabAWB(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDimensionULDTabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DimensionULDTab>> GetDimensionULDTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateDimensionULDTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateDimensionULDTab(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteDimensionULDTab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteDimensionULDTab(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string RateDetailsTab(Int64 BookingRefNo, Int32 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveChargeDeclarationsRateData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveChargeDeclarationsRateData(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationChargeDeclarations ReservationChargeDeclarations);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DueCarrierOtherCharge>> GetDueCarrierOtherChargeTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AgentOtherCharge>> GetAgentOtherChargeTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAgentOtherChargeTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAgentOtherChargeTab(string strData);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<TaxChargeInformation>> GetTaxChargeInformationTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CustomsOtherInformationTab>> GetCustomsOtherInformationTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateCustomsOtherInformationTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateCustomsOtherInformationTab(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteCustomsOtherInformationTab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteCustomsOtherInformationTab(string recordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CustomsOCIInformationTab>> GetCustomsOCIInformationTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateCustomsOCIInformationTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateCustomsOCIInformationTab(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string NotifyDetailsTab(Int64 BookingRefNo, Int32 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNotifyData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNotifyData(Int32 AWBSNo, CustomNotifyDetails NotifyModel, CustomNominyDetails NominyModel);

        //--------------------------Appllied Spot Code By Akash

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAWbForSpotRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWbForSpotRate(SpotRate spotRate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SpotCodeApplied", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SpotCodeApplied(SpotCodeApplied spotCodeApplied);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindSpotCode(int AccountSNo, int OriginCitySNo, int DestinationCitySNo, int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOperationalDetail(Int64 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAgentOtherChargeTab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAgentOtherChargeTab(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCountNoOfReplan(Int64 BookingSNo, Int64 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ViewFlightDetail(Int64 DailyFlightSNo, Int64 OriginSNo, Int64 DestSNo, int Pcs, decimal Gwt, decimal Vol, decimal Chwt, int productSNo, Int64 CommoSNo, Int64 SHCSNo, Int64 AgentSNo, int pom, int NOH, string FlightDate, string FlightNo, string ETD, string ETA, string AllotmentCode, string FlightType, string CarrierCode, Int64 OriginAirportSNo, Int64 DestAirportSNo);
    }
}
