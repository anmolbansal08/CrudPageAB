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
using CargoFlash.Cargo.Model.Import;

namespace CargoFlash.Cargo.DataService.Import
{
    [ServiceContract]
    public interface IImportFWBService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetImportFWBGridData(string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{AWBPrefix}/{AWBNo}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity);

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
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFWB", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFWB(string AWBNo, Int32 AWBSNo, ShipmentInformation ShipmentInformation, List<AWBSPHC> lstAWBSPHC, List<ItineraryInformation> listItineraryInformation, List<DGRArray> AWBDGRTrans, string isAmmendment, string isAmmendmentCharges, string IsDocReceived, string IsLateAccepTance, string ArrivedShimentSNo, List<NOGArray> NOGArray, string Attachawbno, int Attachawbsno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, Int32 UpdatedBy);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateConsigneeInformation(Int32 AWBSNo, ConsigneeInformation ConsigneeInformation, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, NotifyDetails NotifyModel, NominyDetails NominyModel, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, string isAmmendment, string isAmmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, OSIInformation OSIInformation, List<AWBHandlingMessage> AWBHandlingMessage, List<AWBOSIModel> AWBOSIModel, List<AWBOCIModel> AWBOCIModel, string isAmmendment, string isAmmendmentCharges);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBDimemsions", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBDimemsions(Int32 AWBSNo, List<Dimensions> Dimensions, string isAmmendment, string isAmmendmentCharges);

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
        //added for getshipper based on taxid
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperAndConsigneeInformation_TaxId(Int32 AWBSNO, string UserType, string Taxid);

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
        string GetIFWBInformation(Int32 AWBSNO, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOriginDest(Int32 AttachAWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOriginDestAWBStock(string AWBNo);

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
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCheckList(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        int GetAWBSNofromAWBNo(string AWBNo);


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
        [WebInvoke(Method = "GET", UriTemplate = "GetFDimemsionsAndULDNew?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetFDimemsionsAndULDNew>> GetFDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFDimemsionsAndULDRate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetFDimemsionsAndULDRate>> GetFDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAWBOtherChargeData?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<DimensionsArray> Dimensions, List<ULDDimensionsArray> ULDDimension, List<AWBOtherChargeArray> OtherCharge, List<AWBRateArray> RateArray, List<TactRateArray> TactRateArray, string isAmmendment, string isAmmendmentCharges);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBSummary(Int32 AWBSNO, string OfficeSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBSummary(Int32 AWBSNo, List<SummaryArray> Summary, string isAmmendment, string isAmmendmentCharges);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBRateDetails(Int32 AWBSNO);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateReadyToUnloading", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> UpdateReadyToUnloading(string strData);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckIsAWBUsable(string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateFlight(string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFieldsFromTable(string Fields, string Table, string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetFWBType", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFWBType(int AWBSNo, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetExchangeRate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetExchangeRate(string FromCurrency, string ToCurrency);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckTaxId(string TaxId, string UserType, int CountrySno);
    }
}