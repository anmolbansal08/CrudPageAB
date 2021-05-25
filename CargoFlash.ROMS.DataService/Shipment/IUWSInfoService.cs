using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IUWSInfoService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetUWSGridData/{processName}/{moduleName}/{appName}/{AirlineSNo}/{ProcessSNo}/{FlightDate}/{FlightSNo}/{AWBNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetUWSGridData(string processName, string moduleName, string appName, string AirlineSNo, string ProcessSNo, string FlightDate, string FlightSNo, string AWBNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetUWSInfoGridData(string AirlineSNo, string ProcessSNo, string flightDate, string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTransGridData/{processName}/{moduleName}/{appName}/{AWBSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveUWSInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveUWSInfo(Int32 FlightSNo, Int32 ProcessSNo, Int32 AirlineSNo, string FlightDate, Int32 EquipmentSNo, Int32 UWSSNo, string EquipmentNo, UWSAWBInfo ShipmentInformation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAssignFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAssignFlight(Int32 FlightSNo, string EquipmentNo, int UWSSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRemovepieces", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRemovepieces(List<RemoveUWSDetails> UWSDataList, decimal NewScaleWeight, bool IsCart);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNewScaleWeight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNewScaleWeight(int UWSSNo, string EquipmentNo, decimal NewScaleWeight);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIAWBDetails(Int32 SLISNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEquipmentExist(string EquipmentNo, int FlightSNo, int ProcessSNo, int SpecialRights);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDDetails(string ULDNo, int UWSSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDOverhangData(Int64 ULDStockSNo, Int32 DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetGridWaybillDetails(int UWSSNo, string EquipmentNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetWaybillDetails(int EquipmentSNo, int UWSSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSPrint(string FlightNo, string FlightDate, string EquipmentNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSULDPrint(int UWSSNo, string EquipmentNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSEquipmentPrint(int UWSSNo, string EquipmentNo, bool IsULD, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUWSRemoveBulk(int UWSSNo, string EquipmentNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int SaveUWSPrintDetails(List<UWSPrintTableData> UWSModel);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetUnAssignFlightNReleaseEquipment(int UWSSNo, string EquipmentNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveUnAssignFlightNReleaseEquipment(List<UnAssignFlightNReleaseEquipment> Data, string OldEquipmentNo, int NewEquipmentSNo, int UWSSNo, int ShipmentType);

        //added for Release Equipment by Anmol
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ReleaseEquipment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ReleaseEquipment(string EquipmentNo, int UWSSNo);

        //end
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveChangeEquipment(int UWSSNo, string EquipmentNo, int NewEquipmentSNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckEquipmentNoOFLD_Status(int UWSSNo, string EquipmentNumber);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string OffloadCart(int UWSSNo, string EquipmentNumber);
    }
    [KnownType(typeof(UWSPrintTableData))]
    public class UWSPrintTableData
    {
        public string SNo { get; set; }
        public string Priority { get; set; }
        public string Remarks { get; set; }
    }
    [KnownType(typeof(UnAssignFlightNReleaseEquipment))]
    public class UnAssignFlightNReleaseEquipment
    {
        public string AWBSNo { get; set; }
        public string LocationSNo { get; set; }
        public string AWBPieces { get; set; }
    }
    [KnownType(typeof(RemoveUWSDetails))]
    public class RemoveUWSDetails
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public int RemovePieces { get; set; }
        public int TotalPieces { get; set; }
        public decimal GrossWeight { get; set; }
    }
}
