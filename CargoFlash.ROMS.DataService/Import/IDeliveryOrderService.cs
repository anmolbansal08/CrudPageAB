using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Import
{
    [ServiceContract]
    public interface IDeliveryOrderService
    {
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetWebForm", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetWebForm(DeliveryOrderGetWebForm model);



        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetDeliveryOrderGridData(GetDeliveryOrderGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{searchAirline}/{searchFlightNo}/{searchAWBNo}/{searchFromDate}/{searchToDate}/{SearchIncludeTransitAWB}/{SearchExcludeDeliveredAWB}/{LoggedInCity}/{searchSPHC}/{searchConsignee}", BodyStyle = WebMessageBodyStyle.Bare)]
        //Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string LoggedInCity, string searchSPHC, string searchConsignee);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetGridData(DeliveryOrderSearch model);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDeliveryOrderInformation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindFADSection(int ArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindFHLSectionTable(int AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBRateDetails(Int32 AWBSNO);

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
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperAndConsigneeInformation(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails_TaxId(string UserType, string TaxId, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOSIInfoAndHandlingMessage(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBSummary(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWBEDox(Int32 AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAcceptance(string AWBNo, Int32 AWBSNo, ImportShipmentInformation ShipmentInformation, List<ImportAWBSPHC> AwbSPHC, List<ImportItineraryInformation> listItineraryInformation, List<ImportAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<ImportDimensionsArray> Dimensions, List<ImportULDDimensionsArray> ULDDimension, List<GetAWBOtherChargeData> OtherCharge, List<ImportAWBRateArray> RateArray, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, ImportAgentModelDetail AgentModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, ImportOSIInformation OSIInformation, List<ImportAWBHandlingMessage> AWBHandlingMessage, List<ImportAWBOSIModel> AWBOSIModel, List<ImportAWBOCIModel> AWBOCIModel, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAWBSummary(Int32 AWBSNo, List<ImportSummaryArray> Summary, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFHLinfoImport", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, bool IsFHLSave, int IsFHLAmendment, bool IsFHLAmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateFHLinfoImport", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 ShipperSno, Int32 ConsigneeSno, int IsShipperEnable, int IsConsigneeEnable, bool IsFHLSave, int IsFHLAmendment, bool IsFHLAmendmentCharges, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteFHL", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DeleteFHL(Int32 HAWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindHAWBSectionData(Int32 HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFAD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFAD(Int32 ArrivedShipmentSNo, Int32 AWBSNo, Int32 ReportingStation, Int32 DiscrepancyType, Int32 DiscrepancySubType, Int32 Discrepancypieces, string DiscrepancyGrossweight, string DiscrepancyVolwt, string Remarks, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "BindLocation?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BindLocation>> BindLocation(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindFAASection(Int32 AWBSNO, Int32 ArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "BindFAASectionChargeDescription?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BindFAASectionChargeDescription>> BindFAASectionChargeDescription(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "BindFAASectionAWBInformation?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BindFAASectionAWBInformation>> BindFAASectionAWBInformation(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "BindFAASectionEmailHistory?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BindFAASectionEmailHistory>> BindFAASectionEmailHistory(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "BindFAASectionSMSHistory?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BindFAASectionSMSHistory>> BindFAASectionSMSHistory(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWDImport(Int32 AWBSNO, Int32 ArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEDoxListAWD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveEDoxListAWD(Int32 AWBSNo, Int32 ArrivedShipmentSNo, List<ImportEDoxDetailAWD> AWDEDoxDetail, string AllEDoxReceived, string Consignee, string AuthorizedPerson, int CustomerType, string AuthorizedPersoneId, string AuthorizedPersoneName, string AuthorizedPersonCompany);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAWBEDoxDetail(Int32 AWBSNo, Int32 ArrivedShipmentSNo, List<ImportAWBEDoxDetail> AWBEDoxDetail, List<ImportSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, List<EDoxCheckListDetail> EDoxCheckListDetail);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFAA", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFAA(Int32 AWBSNo, Int32 ArrivedShipmentSNo, string DeliveryOrderFee, string DeliveryHandlingCharge, string SitaEmailAddress, string Remarks, string FAX, string ConsigneeContact);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckWaybillDetail(string AWBNo, int ArrivedShipmentSNo, int ICNNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDeliveryOrderRecord(int AWBSNo, int ArrivedShipmentSNo, string DOType, string DestCity, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPhysicalDeliveryOrderRecord(int DOSNo, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDO", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDO(string strData, int POMailSNo, string GSTNo, string loginAirportSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtPayment(string strData);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetPaymentDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPaymentDetail(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDOPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDOPayment(List<ImportPayment> lstDOPayment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDLVInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDLVInfo(PhysicalDeliveryInfo PhysicalDeliveryInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveChargeNote", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveChargeNote(int PDSNo, List<DOHandlingCharges> lstHandlingCharges, List<DOServiceCharges> lstServiceCharges);
        //string SaveChargeNote(int PDSNo, int BillToSNo, string BillTo, List<DOHandlingCharges> lstHandlingCharges);
        string SaveChargeNote(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDeliveryOrderPrint(int DOSNo, string Type, int InvoiceSNo, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPhysicalDeliveryPrint(int PDSNo, int OFW, int Disable);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPhysicalDODetail(int AWBSNo, int ArrivedShipmentSNo, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckWarehousePDS", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckWarehousePDS(int DOSNo, int awbSNo, int OFW);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCancelDODetail(int AWBSNo, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetChargeNotePrintRecord(int InvoiceSNo, int PDSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetDeliveryOrderPaymentType", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDeliveryOrderPaymentType(int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, int PDSNo, int ProcessSNo, int SubProcessSNo, List<DOShipmentInfo> ShipmentDetailArray);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GatValueOfAutocomplete(int SNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, int PValue, int SValue, int HAWBSNo, int DOSNo = 0, int PDSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0);
        string GetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int DOSNo = 0, int PDSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CancelDO", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CancelDO(int DOSNo, List<DOHandlingCharges> lstHandlingCharges, string BillTo, string BillToText, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPaymentRecord(int AWBSNo, int POMailSNo, int dosno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFOCConsignee(int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetExchangeRate(int OrigCurr, int DestCurr, int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetHandlingChargesRecorde(int AWBSNo, int ArrivedShipmentSNo, string DOType, string DestCity, int HAWBSNo, int DOSNo, int PDSNo, int TariffSNo, decimal PValue, decimal SValue);
        string GetHandlingChargesRecorde(int AWBSNo, int ArrivedShipmentSNo, string DOType, string DestCity, int HAWBSNo, int DOSNo, int PDSNo, int TariffSNo, decimal PValue, decimal SValue, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int ProcessSNo = 0, int SubProcessSNo = 0);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckCreditLimit", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckCreditLimit(int BillTo, decimal TotalCredit);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetLocationData(int AWBSNo, int ArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckAgentCreditLimit(int AgentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetBillToForworderName(int AWBSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetBupDetails(int AWBSNo, int ULDStockSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCharges", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCharges(int TariffSNo, int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, decimal pValue, decimal sValue, int Pieces, int DOSNo, int PDSNo, List<DOShipmentInfo> lstShipmentInfo, String Remarks, int POMailSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetStorageCharge", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetStorageCharge(int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckPayment(int DOSNo, int PDSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckPaymentCharges", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckPaymentCharges(int DOSNo, int PDSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ESSGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int DOSNo = 0, int PDSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHouseWiseDetail(int HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAndCheckCompleteShipment(int AWBSNo, int HAWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDoSaveInfo(int AWBSNo, int DOSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFHLhawbDescription", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFHLHAWBDescription(List<HawbDescription> HawbDescription, string HAWBNo, string AwbSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFHLHarmonizedCommodity", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFHLHarmonizedCommodity(List<HarmonizedCommodityCode> HarmonizedCommodityCode, string HAWBNo, string AwbSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHAWBNoDetails(string HAWBNo, string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindShipmentDetail(int AWBSNo, int ArrivedShipmentSNo, string DOType);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCustomReference", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveCustomReference(string AWBSNo, string BOEVerification, string UpdatedBy, string BOENo, string BOEDate);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWBCustRef(Int32 AWBSNO);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCustomInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveCustomInfo(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordCustomInfo(string AWBSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetDelivered", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDelivered(string AWBSNo, int isDelivered, int DOsnoval);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetFADIrregurality", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFADIrregurality(string AWBSNO);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetInvoiceType", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetInvoiceType(string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPendingInvoice(string AWBSno, string DOSNo, string DLVSno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightArrivalFlightInformation(Int32 DailyFlightSno);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDetailsByAirlineAWB(string AWB, string Type);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveDOShipment(List<ConsignmentDetails> ConsignmentDetails, List<FlightCheckInDetails> FlightCheckInDetails, int DailyFlightSNo, int waybilltype, string wayBillNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getDailyFlightSnoByFilter(string origin, string destination, string flightDate, string flightNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getArrivedShipmentDetail(string wayBillNo);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ImportGetAWBPrintData(int? AwbNo);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getCustomerDetails(string customerNo);
    }
}
