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
    public interface IReceivedConsumableService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetReceivedConsumableGridData(string searchAirline, string searchFlightNo, string searchFlightDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);


     [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetReceivedConsumableGridDataForSelf(string searchAirline, string searchFlightNo, string searchFlightDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{searchAirline}/{searchFlightNo}/{FlightDate}/{LoggedInCity}/{Type}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string FlightDate,string LoggedInCity,string Type);

        
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateIssueConsumables/{type}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CreateIssueConsumables(List<ReceivedConsumableList> ReceivedConsumableList,string type);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetProcessSequence(string ProcessName);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetDeliveryOrderInformation(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string BindFADSection(int ArrivedShipmentSNo);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string BindFHLSectionTable(int AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAWBRateDetails(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetDimemsionsAndULDNew?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<GetDimemsionsAndULDNew>> GetDimemsionsAndULDNew(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetDimemsionsAndULDRate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<GetDimemsionsAndULDRate>> GetDimemsionsAndULDRate(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAWBOtherChargeData?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<GetAWBOtherChargeData>> GetAWBOtherChargeData(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetShipperAndConsigneeInformation(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetOSIInfoAndHandlingMessage(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAWBSummary(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetRecordAtAWBEDox(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveAcceptance(string AWBNo, Int32 AWBSNo, ImportShipmentInformation ShipmentInformation, List<ImportAWBSPHC> AwbSPHC, List<ImportItineraryInformation> listItineraryInformation, List<ImportAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateRateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateRateDimemsionsAndULD(Int32 AWBSNo, List<ImportDimensionsArray> Dimensions, List<ImportULDDimensionsArray> ULDDimension, List<GetAWBOtherChargeData> OtherCharge, List<ImportAWBRateArray> RateArray, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateOSIInfoAndHandlingMessage(Int32 AWBSNo, ImportOSIInformation OSIInformation, List<ImportAWBHandlingMessage> AWBHandlingMessage, List<ImportAWBOSIModel> AWBOSIModel, List<ImportAWBOCIModel> AWBOCIModel, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateAWBSummary(Int32 AWBSNo, List<ImportSummaryArray> Summary, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateFHLinfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateFHLinfo(Int32 AWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveFAD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveFAD(Int32 ArrivedShipmentSNo, Int32 AWBSNo, Int32 ReportingStation, Int32 DiscrepancyType, Int32 DiscrepancySubType, Int32 Discrepancypieces, string DiscrepancyGrossweight, string DiscrepancyVolwt, string Remarks, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "BindLocation?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<BindLocation>> BindLocation(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string BindFAASection(Int32 AWBSNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "BindFAASectionChargeDescription?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<BindFAASectionChargeDescription>> BindFAASectionChargeDescription(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "BindFAASectionAWBInformation?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<BindFAASectionAWBInformation>> BindFAASectionAWBInformation(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "BindFAASectionEmailHistory?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<BindFAASectionEmailHistory>> BindFAASectionEmailHistory(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveAWBEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveAWBEDoxDetail(Int32 AWBSNo, List<ImportAWBEDoxDetail> AWBEDoxDetail, List<ImportSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveFAA", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveFAA(Int32 AWBSNo, Int32 ArrivedShipmentSNo, string DeliveryOrderFee, string DeliveryHandlingCharge, string SitaEmailAddress, string Remarks, Int32 UpdatedBy);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string CheckWaybillDetail(string AWBNo);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetDeliveryOrderRecord(int AWBSNo, int ArrivedShipmentSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveDO", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveDO(int AWBSNo, DeliveryOrderInfo DeliveryOrderInfo, List<DOHandlingCharges> lstHandlingCharges, List<DOServiceCharges> lstServiceCharges);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveDOPayment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveDOPayment(List<ImportPayment> lstDOPayment);
    }
}
