using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using System.Data;

namespace CargoFlash.Cargo.DataService.Import
{
    [ServiceContract]
    public interface IInboundFlightService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetWebForm(GetWebForm model);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetGridData(GetGridData model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetInboundFlightGridData(GetInboundFlightGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetInboundFlightInformationGrid(GetFlightArrivalShipmentGrid model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetInboundFlightInformationGridData(GetInboundFlightULDInfoGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetInboundFlightULDInformationGrid(GetFlightArrivalShipmentGrid model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetInboundFlightULDInformationGridData(GetInboundFlightULDInformationGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetInboundFlightULDInfoGrid(GetFlightArrivalShipmentGrid model);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetInboundFlightULDInfoGridData(GetInboundFlightULDInfoGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        // Added flight service grid
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalULDGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalStopULDGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalShipmentGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalStopShipmentGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetFlightArrivalShipmentGrid(GetFlightArrivalShipmentGrid model);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightArrivalFlightInformation(Int32 DailyFlightSno);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFCReport(string DailyFlightSNo, string ClosedOn);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFlightCloseDetalil(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDReport(string FFMFlightMasterSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ShipmentFlightDetail>> GetShipmentFlightDetail(string recid, int page, int pageSize, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateShipmentFlightDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateShipmentFlightDetail(List<ShipmentDetail> FlightDetail);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteShipmentFlightRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteShipmentFlightRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFAULDLocationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FAULDLocation>> GetFAULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateFAULDLocation", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateFAULDLocation(List<FAULDLocation> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteFAULDLocation?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteFAULDLocation(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFAULDDamageRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FAULDDamage>> GetFAULDDamageRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateFAULDDamage", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateFAULDDamage(List<FAULDDamage> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteFAULDDamage?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteFAULDDamage(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFAConsumableRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<FAConsumable>> GetFAConsumableRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateFAConsumable", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateFAConsumable(List<FAConsumable> data);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAddShipmentRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AddShipment>> GetAddShipmentRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAddShipment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string createUpdateAddShipment(List<AddShipmentType> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAddShipment?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAddShipment(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAwbULDLocationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AwbULDLocation>> GetAwbULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAwbULDLocationRecord_Pomail?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AwbULDLocation>> GetAwbULDLocationRecord_Pomail(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAwbULDLocation", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateAwbULDLocation(List<AwbULDLocationType> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAwbULDLocation_pomail", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateAwbULDLocation_pomail(List<AwbULDLocationType> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAwbULDLocation?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAwbULDLocation(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAwbULDLocation_pomail?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAwbULDLocation_pomail(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAwbULDDamageRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AwbULDDamage>> GetAwbULDDamageRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAwbULDDamage", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> createUpdateAwbULDDamage(List<AwbULDDamageType> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAwbULDDamage?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAwbULDDamage(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveULDDetails(List<ULDDetails> UldData, List<ImportPOMDNDetail> POMailDetailsArray, int ArrivedShipmentSNo, int POMailSNo, int POMArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBUPULDDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveBUPULDDetails(List<BUPULDDetails> UldData, bool IsRushHandling);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFlightCheckInDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFlightCheckInDetails(List<FlightCheckInDetails> FlightCheckInDetails, int DailyFlightSNo, string CustomRefNo, string loginAirportSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFlightDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFlightDetails(string AirlineCarrierCode, string FlightNo, string FlightDate, string FlightOriginSNo, string FlightDestinationSNo, string ETATime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateBreakDownTime", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateBreakDownTime(string BreakdownStartTime, string BreakdownEndTime, Int64 FFMFlightMasterSNo, string ULDNo, int POMailSNo, int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string AddShipmentCheckAWBNoTotal(string FFMFlightMasterSNo, string AWBNo, string DescriptionType);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCCADetails(string AwbNo, int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetHousePieces(string AWBNo, string Hawbno, int ArrivedShipmentSno);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckHAWBNo(string AWBSNo, string FFMFlightMasterSNo, string HAWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveHAWBNo(string AWBSNo, string FFMFlightMasterSNo, string HAWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAircraftType(string AircraftTypeSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCurrentATATime();

        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportCurrentUTCTime(string Format, string AirportSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string OffloadedStopOverULDAndShipment(string DailyFlightSNo, string FFMFlightMasterSNo, string FFMShipmentTransSNo, string ULDStockSNo, int Pieces,
            decimal Grosswt, decimal Volwt, decimal CBM, int MoveToSegregation);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateThroughtULDStatus(string FFMShipmentTransSNo, string ThroughtULD, string ULDNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ChkAwbDetailsExistence(string CurrentAWBNo, string ffmflightMasterSno, string PartSplitTotal, string ULDNo, string DailyFlightSNo, string FoundAWB);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveExcludeRemarks(string FFMFlightMasterSNo, string FFMShipmentTransSNo, string ArrivedShipmentSNo, string awbSNo, string remark);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckAwbExistinExport(string CheckCurrentAWBNo, int Pieces, int DailyFlightSNo, string ULDType);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckHAwb(int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckAirlineExistsByPrefix(string Prefix, int DailyFlighSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFlighClosed", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFlighClosed(int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckRushHandling", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckRushHandling(int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/getstaartandendtime", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getstaartandendtime(int FFMShipmentTransSNo, int DailyFlightSno, int POMailSNo, int POMailArrivedShipmentSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAndDownloadCustomFile", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAndDownloadCustomFile(string FlightNo, string FlightDate, string FlightOriginSNo, string FlightDestinationSNo, string NoOfTransaction, string IsFlightStatus, string CreatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/POMailDNInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string POMailDNInfo(int MCBookingSNo, string ULDNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCOGACustomButton", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCOGACustomButton(string DailyFlightSNo, string FlightDestination);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetPOMailULDReport(string FFMFlightMasterSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtFlightEPouch(string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBInformation(string FFMFlightMasterSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveAllShipmentDetails(string FFMFlightMasterSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetPrintFFMDetails(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string IsFFMOrNot(string flightNo, string flightDate);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string IsAllShipmentArrived(string FFMFlightMasterSNo);
    }
}