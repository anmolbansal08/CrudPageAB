using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.FlightControl;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.FlightControl
{
    [ServiceContract]
    public interface IFlightControlService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{AWBPrefix}/{AWBNo}/{CarrierCode}/{FlightRoute}/{OffloadType}/{LoggedInCity}/{CurrentFlightSno}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, string LoggedInCity, string CurrentFlightSno);

        [OperationContract]
        [WebGet(UriTemplate = "GetTransGridData/{processName}/{moduleName}/{appName}/{AWBSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);


        [OperationContract]
        [WebGet(UriTemplate = "GetFlightGridData/{processName}/{moduleName}/{appName}/{BoardingPoint}/{EndPoint}/{FlightNo}/{SearchAirlineCarrierCode1}/{FromFlightDate}/{ToFlightDate}/{FlightStatus}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string LoggedInCity, string FlightStatus);


        [OperationContract]
        [WebGet(UriTemplate = "GetFlightTransGridData/{processName}/{moduleName}/{appName}/{FlightSNo}/{ProcessStatus}/{CurrentProcessSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo, string ProcessStatus, string CurrentProcessSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightManifestTransGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{ULDStockSNo}/{CarrierCode}/{FlightRoute}/{OffloadType}/{AWBNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightManifestTransGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightControlGridData(string OriginCity, String DestinationCity, String FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string FlightStatus, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, string CurrentFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOSCLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, string CurrentFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetWMSFlightAWBGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetStackULDGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetManifestULDGridData(string FlightSNo, string ProcessStatus, string CurrentProcessSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetStackChildGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMULDShipmentGridData(string FlightSNo, string ProcessStatus, string CurrentProcessSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMULDLyingGridData(string OriginCity, string DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string AWBNo, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOSCULDLyingGridData(string OriginCity, string DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string AWBNo, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetSOFlightULDGridData(String FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOSCULDLyingShipGridData(string DestinationCity, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMULDLyingShipGridData(string DestinationCity, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetSOFlightULDShipGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetULDType(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetPriorityType();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePreMenifestInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SavePreMenifestInformation(List<LIInfo> LIInfo, List<LyingInformation> LyingInfo, List<LyingInformation> OSCLyingInfo, Int64 FlightSNo, string RegistrationNo);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNILMenifest", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNILMenifest(string GroupFlightSNo, string FlightOrigin, string FlightDestination, string FlightStatus, string RegistrationNo, string OffloadRemarks);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransferFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        // string UpdateTransferFlight(string OLDGroupFlightSNo, string NewDailyFlightSno);
        string UpdateTransferFlight(string OLDGroupFlightSNo, string NewDailyFlightSno, string OFLD_AWBSNo,
            string TR_AWBSNo, string OFLD_MCBookingSNo, string TR_MCBookingSNo, string TR_UldStockSNo, string OFLD_UldStockSNo, int ProcessType, bool IsDataPushToPlan, bool IsStopOverCargo, bool IsULDOFLD, string OffloadRemarks);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveMenifestInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, List<POMailDNDetails> POMailDNDetailsInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode, string ATDDate, string ATDTime, bool IsExcludeFromFFM, List<OffloadRemarksDetails> OffloadRemarks);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePMenifestInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SavePMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, List<POMailDNDetails> POMailDNDetailsInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLyingInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveLyingInformation(List<LyingInformation> LyingListInfo);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetPreReport(string DailyFlightSNo);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetManifestReport(string DailyFlightSNo,string LogedInAirport, string Type, string IsCart);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string PrintManifestReport(string DailyFlightSNo, string LogedInAirport, string Type, string IsCart);

        ////
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBDetails(string AWBNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SetFinalizedPreManifest(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAWBDetails(string AWBSNo, string Remarks, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveOSIDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveOSIDetails(string DFGroupSNo, string OSI1, string OSI2);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateFlightStatus", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateFlightStatus(int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveManifestRemarksDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveManifestRemarksDetails(string DFGroupSNo, string Remarks);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirmailStatus", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAirmailStatus(string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateNotocStatus", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateNotocStatus(string GroupFlightSNo);



        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetManifestOSIDetails(string DFGroupSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHDQRemarks(string DFGroupSNo, int AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetManifestRemarks(string DFGroupSNo);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetLIReport(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetG9LIReport(string DailyFlightSNo);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetLIReportForLiversion(string DailyFlightSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetNotocRecord(string Sno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSDetails(string GroupFlightSno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void SendNTM(string Sno);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFlightData(string DailyFlightSno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRouteFlight(string DailyFlightSno);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetInboundManifestReport(string DailyFlightSNo, string Type, string IsCart);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirMailPrintData(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string fn_CheckOnHoldPcs(int AWBSNo, int ProcessedPcs, string ChkType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNotocRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNotocRecord(string Sno, string PreparedBy, List<SupplentaryInformation> SupplentaryInfo, string OtherInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/MoveToLyingList", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string MoveToLyingList(List<MoveToLying> LIInfo, Int64 FlightSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCBVPrintRecord(string DFGroupSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightEDIMSGGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFlightEDIMessageInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveFlightEDIMessageInformation(List<EDIMessageInfo> EDIMessageInfo, Int64 FlightSNo, bool IsFFM);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CancelLI", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CancelLI(Int64 FlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveGatePass", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveGatePass(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode, string ATDDate, string ATDTime, bool IsExcludeFromFFM);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getLIVersion(int DailyFlightSNo, int LiVersion);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getLatestLIVersion(int DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string QRTShipmentInfo(string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string POMailDNInfo(string GroupFlightSNo, int ULDStockSNo, int MCBookingSNo, string Stage);

        // Added By Vipin Kumar

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/getLIRemarks", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getLIRemarks(int DailyFlightSNo, string GroupFlightSNo, int RemarkType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLIRemarks", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveLIRemarks(int DailyFlightSNo, string GroupFlightSNo, int RemarkType, string Remarks);

        //Ends

        [OperationContract]   // ---------Created By Akash
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAndDownloadCustomFile", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAndDownloadCustomFile(string FlightNo, string FlightDate, string FlightOriginSNo, string FlightDestinationSNo, string NoOfTransaction, string IsFlightStatus, string CreatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/QRTShipmentSave", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string QRTShipmentSave(List<QRTShipmentobj> QRTShipmentobj, string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAircraftRegistrationNo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAircraftRegistrationNo(string GroupFlightSNo, string RegistrationNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCartManifestPrint(string DailyFlightSNo, string LogedInAirport, string IsCart);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void GetAWBLabelPrint(Int64 AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEPouchDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveEPouchDetail(string GroupFlightSNo, List<FlightEPouchDetails> FlightEPouchDetails);

        //[OperationContract]

        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<FlightEPouch>> GetRecordAtFlightEPouch(string SNO, int pageNo, int pageSize, string whereCondition, CreateFlightEPouchWhereCondition model, string sort);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtFlightEPouch(string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetFCULDGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetFCULDGridData(WebFormBuildWebFormRequest model);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLIOffloadedULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveLIOffloadedULD(List<ProcessedOffLoadedULD> ProcessedULDInfo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string AWBList(int DailyFlightSNo, string Process);
        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetHHTManifestReport(string DailyFlightSNo, string LogedInAirport, string ICMSEnvironment, string ClientEnvironment, string FC_AirlineName, string FC_AllowedCity, string IsManifestFooterForAirAsia, string NewManifestPrint, string Type, string IsCart);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetExpectedLoadDetails(string GroupFlightSNo);

    }
}
