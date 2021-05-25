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

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IFWBService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{OutwardFlightNo}/{OutwardFlightDate}/{AWBPrefix}/{AWBNo}/{LoggedInCity}/{Arrived}/{DaysNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string OutwardFlightNo, string OutwardFlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string Arrived, string DaysNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetHouseAcceptanceGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{AWBPrefix}/{AWBNo}/{HAWBNo}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetHouseAcceptanceGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string HAWBNo, string LoggedInCity);

        [OperationContract]
        [WebGet(UriTemplate = "GetTransGridData/{processName}/{moduleName}/{appName}/{AWBSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);

        #region FlightOperation
        [OperationContract]
        [WebGet(UriTemplate = "GetFlightGridData/{processName}/{moduleName}/{appName}/{BoardingPoint}/{EndPoint}/{FlightNo}/{FlightDate}/{FlightStatus}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string FlightDate, string LoggedInCity, string FlightStatus);


        [OperationContract]
        [WebGet(UriTemplate = "GetFlightTransGridData/{processName}/{moduleName}/{appName}/{FlightSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo);


        #endregion
        // created By manoj Kumar on 2.7.2015
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string[] GetAWBProcess(Int32 AWBSNo, Int32 ProcessSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string[] GetFlightChartDetails(string DailyFlightSNo);
        //end

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAcceptance(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> AwbSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, Int32 UpdatedBy, string isAmmendment, string IsLateAccepTance, List<NOGArray> NOGArray, List<SHCSubGroupArray> SHCSubGroupArray, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, Int32 UpdatedBy);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateConsigneeInformation(Int32 AWBSNo, ConsigneeInformation ConsigneeInformation, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string isAmmendment, string isChargableAmendment, string CreateShipperParticipants, string CreateConsigneerParticipants);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBDimemsions", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBDimemsions(Int32 AWBSNo, List<Dimensions> Dimensions, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBDimemsionsULDInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBDimemsionsULDInfo(Int32 AWBSNo, List<AWBULDTrans> AWBULDTrans, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBDimemsionsULDDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBDimemsionsULDDetails(Int32 AWBSNo, List<AWBULDDetails> AWBULDDetails, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDGRDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDGRDetails(Int32 AWBSNo, List<DGRArraySeprate> AWBDGRTrans);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperAndConsigneeInformation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOSIInfoAndHandlingMessage(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FBLHandlingCharges(Int32 AWBSNO, string CityCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFBLHandlingCharges(Int32 TariffSNO, Int32 AWBSNO, string CityCode);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDimemsionsAndULD(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDDimensionInfo(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDDimensionDetails(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAcceptanceInformation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtWeighing", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtWeighing(Int32 AWBSNo, List<AWBGroup> lsAWBGroup, List<ULDWeightModel> lstUldWeigh, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtLocationXRay", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtLocationXRay(Int32 AWBSNo, List<AWBLocationXRay> lsAWBLocation, string operationType, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtXRay", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtXRay(Int32 AWBSNo, List<AWBXRay> lsAWBXRay, List<AWBULDXRay> lstULDXrayArray, List<ECSDArray> lstECSDArray, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtLocation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtLocation(Int32 AWBSNo, List<AWBLocation> lsAWBLocation, List<ULDLocation> lsULDLocation, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtXray(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtXrayBarcode(string AWBNO);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtLocation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtWeighing(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtPayment(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        // string SaveAtPayment(List<HandlingCharge> lstHandlingCharge, List<AgentBranchCheque> lstAgentBranchCheque, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy);
        string SaveAtPayment(string AWBSNo, string TotalCash, string TotalCredit, List<HandlingCharge> lstHandlingCharge, List<AWBCheque> lstAWBCheque, string CityCode, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCheckList(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        int GetAWBSNofromAWBNo(string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCheckList", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveCheckList(Int32 AWBSNo, List<CheckListTrans> CheckListTrans, bool XRay, string Remarks, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAWBEDoxDetail(Int32 AWBSNo, List<AWBEDoxDetail> AWBEDoxDetail, string AllEDoxReceived, string Remarks, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWBEDox(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "AcceptanceNoteData?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult AcceptanceNoteData(Int32 RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest, string GrossWeight, string VolumeWeight, string AWBSNo, string SPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDimemsionsAndULDNew?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetDimemsionsAndULDNew>> GetDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDimemsionsAndULDRate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetDimemsionsAndULDRate>> GetDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAWBOtherChargeData?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, Int32 UpdatedBy, string isAmmendment, string PrintRateCode, string PublishedRate, string UserRate, string RateDiffRemarks, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBSummary(Int32 AWBSNO, string OfficeSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBRateDetails(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetReadyToUnloadingRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ReadyToUnloading>> GetReadyToUnloadingRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateReadyToUnloading", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> UpdateReadyToUnloading(string strData);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckIsAWBUsable(string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateFlight(string AWBSNo);

        // Transit FWB Functions Starts

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTransitAcceptanceInformation(Int32 AWBSNO, string AWBReferenceNumber);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTransitShipperAndConsigneeInformation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTransitOSIInfoAndHandlingMessage(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTransitAWBSummary(Int32 AWBSNO, string OfficeSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTransitAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveTransitAcceptance(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> AwbSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, Int32 UpdatedBy, string isAmmendment, string IsLateAccepTance, List<NOGArray> NOGArray, List<SHCSubGroupArray> SHCSubGroupArray, string isChargableAmendment, List<SHCTemp> SHCTemp);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransitRateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateTransitRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, Int32 UpdatedBy, string isAmmendment, string PrintRateCode, string PublishedRate, string UserRate, string RateDiffRemarks, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransitShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateTransitShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, AgentInfo AgentInfo, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string isAmmendment, string isChargableAmendment, string CreateShipperParticipants, string CreateConsigneerParticipants);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransitOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateTransitOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransitAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateTransitAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, Int32 UpdatedBy, string isAmmendment, string isChargableAmendment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTransitDGRDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveTransitDGRDetails(Int32 AWBSNo, List<DGRArraySeprate> AWBDGRTrans);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFWBTransitGridData(BookingGetTranistFWBGrid model, string PageName, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
    }
}