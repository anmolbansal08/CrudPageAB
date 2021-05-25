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

namespace CargoFlash.Cargo.DataService.GatePass
{
     [ServiceContract]
    public interface IGatePassService
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
         [WebGet(UriTemplate = "GetFlightGridData/{processName}/{moduleName}/{appName}/{BoardingPoint}/{EndPoint}/{FlightNo}/{SearchAirlineCarrierCode1}/{FromFlightDate}/{ToFlightDate}/{LoggedInCity}/{FlightStatus}", BodyStyle = WebMessageBodyStyle.Bare)]
         System.IO.Stream GetFlightGridData(string processName, string moduleName, string appName, string BoardingPoint, string EndPoint, string FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string LoggedInCity, string FlightStatus);


         [OperationContract]
         [WebGet(UriTemplate = "GetFlightTransGridData/{processName}/{moduleName}/{appName}/{FlightSNo}/{ProcessStatus}/{OriginCity}/{DestinationCity}/{FlightDate}/{GatePassSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
         System.IO.Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo, string ProcessStatus, string OriginCity, string DestinationCity, string FlightDate, string GatePassSNo = "");

         [OperationContract]
         [WebGet(UriTemplate = "GetFlightManifestTransGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{ULDStockSNo}/{CarrierCode}/{FlightRoute}/{OffloadType}/{AWBNo}", BodyStyle = WebMessageBodyStyle.Bare)]
         System.IO.Stream GetFlightManifestTransGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string ULDStockSNo, string CarrierCode, string FlightRoute, string OffloadType, string AWBNo);


         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetFlightControlGridData(string OriginCity, String DestinationCity, String FlightNo, string SearchAirlineCarrierCode1, string FromFlightDate, string ToFlightDate, string FlightStatus, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter, string CurrentFlightSno);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetOSCLyingListGridData(string OriginCity, String DestinationCity, String FlightNo, string AWBNo, string CarrierCode, string FlightRoute, string OffloadType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetWMSFlightAWBGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);


         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetStackULDGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetManifestULDGridData(string FlightNo, string ProcessStatus, string OriginCity, string DestinationCity, string FlightDate, int GatePassSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetStackChildGridData(string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetMULDShipmentGridData(string FlightNo, string ProcessStatus, string OriginCity, string DestinationCity, string FlightDate, int GatePassSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

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
         string SaveNILMenifest(string GroupFlightSNo, string FlightOrigin, string FlightDestination, string FlightStatus, string RegistrationNo);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/UpdateTransferFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         // string UpdateTransferFlight(string OLDGroupFlightSNo, string NewDailyFlightSno);
         string UpdateTransferFlight(string OLDGroupFlightSNo, string NewDailyFlightSno, string OFLD_AWBSNo,
             string TR_AWBSNo, string TR_UldStockSNo, string OFLD_UldStockSNo, int ProcessType);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/SaveMenifestInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string SaveMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode, string ATDDate, string ATDTime, bool IsExcludeFromFFM);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/SavePMenifestInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string SavePMenifestInformation(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, List<BulkShipment> LyingBulkShipmentInfo, List<IntectShipment> LyingIntectShipmentInfo, List<BulkShipment> OSCLyingBulkShipmentInfo, List<IntectShipment> OSCLyingIntectShipmentInfo, int FlightType, Int64 FlightSNo, string RegistrationNo, string mode);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/SaveLyingInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string SaveLyingInformation(List<LyingInformation> LyingListInfo);

         [OperationContract]
         [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
         System.IO.Stream GetPreReport(string DailyFlightSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetManifestReport(string DailyFlightSNo, string Type, int GatePassSNo);

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
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetManifestOSIDetails(string DFGroupSNo);

         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetManifestRemarks(string DFGroupSNo);

         [OperationContract]
         [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
         System.IO.Stream GetLIReport(string DailyFlightSNo);

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
         string SaveGatePass(List<BulkShipment> BulkShipmentInfo, List<IntectShipment> IntectShipmentInfo, int FlightSNo, int GatePassSNo);
     }
}
