using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    interface ISLInfoService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetSLIGridData/{processName}/{moduleName}/{appName}/{DestinationAirportSNo}/{AirlineSNo}/{RoutingCitySNo}/{AWBPrefix}/{AWBNo}/{LoggedInCity}/{AccountSNo}/{SLINo}/{SLIDate}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetSLIGridData(string processName, string moduleName, string appName, string DestinationAirportSNo, string AirlineSNo, string RoutingCitySNo, string AWBPrefix, string AWBNo, string LoggedInCity, string AccountSNo, string SLINo, string SLIDate);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetSLInfoGridData(string DestinationAirportSNo, string AirlineSNo, string RoutingCitySNo, string AWBPrefix, string AWBNo, string LoggedInCity, string AccountSNo, string SLINo, string SLIDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

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
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIChargeHeader();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperAndConsigneeInformation(Int32 SLISNo, SLIShipperInformation ShipperInformation, SLIConsigneeInformation ConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSLInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveSLInfo(string AWBNo, Int32 SLISNo, string SLINo, int SLIType, SLIAWBInfo ShipmentInformation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveULDInfo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveULDInfo(string ULDNo, Int32 SLISNo, ULDDetails ULDINFO, List<SLIOverhangTrans> SLIOverhangTrans, SLIOverhangPallet SLIOverhangPallet);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIAWBInformation(Int32 SLISNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIAWBDetails(Int32 SLISNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperAndConsigneeInformation(Int32 SLISNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIDimemsionsAndULD(Int32 SLISNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIChargesHeader(Int32 SLISNO);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIUnloadingDetails(Int32 SLISNO);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSliRecord(Int32 SLISNo);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIAWBExist(string AWBNo, string SLINo, string AccountSNo, string AirlineSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckFWBSHipmentonSLI(string SLINo, string SLISNo, string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETHAWBInfo(string SLINo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIAirlineCode(Int32 AirlineSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLICode();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSLIDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateSLIDimemsionsAndULD(Int32 SLISNo, List<SLIDimensions> Dimensions, List<SLIULDDimensions> ULDDimensions);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveSLIEquipment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveSLIEquipment(List<SLIEquipment> SLIEqDetailsTrans);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSLIChargesHeader", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateSLIChargesHeader(Int32 SLISNo, List<SLIChargesHeader> ChargesHeader);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSLIUnloading", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateSLIUnloading(Int32 SLISNo, List<SLIUnloading> UnloadingArray, int IsFinalize);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveSLITempDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveSLITempDetails(List<SLISHCTemp> SHCTempDetails);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveULDRemarks", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveULDRemarks(Int32 SLISNo, string ULDNo, string Remark);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveSLICANCELLATION", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveSLICANCELLATION(Int32 SLISNo, List<CancellationArray> CancellationArray);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveSLIFWBDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveSLIFWBDetails(string SLINo, string SLISNo, string AWBNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/saveSLIFWBDetailsWithAgent", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string saveSLIFWBDetailsWithAgent(string SLINo, string SLISNo, string AWBNo, int AgentSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLITemperature(string sphcCodeSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckSLIPriorApprovalForSHC(string SHCSNo, string SLISNo, string DestinationAirportSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtSubprocessSLIPayment(string CityCode, Int32 AWBSNO, Int32 SLISNo, Int32 SubprocessSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtLocation(Int32 SLISNo);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtLocation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtLocation(Int32 AWBSNo, List<SLIAWBLocation> lsAWBLocation, List<SLIULDLocation> lsULDLocation, bool ScanType, int UpdatedBy, int SLISNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateULD(string ULDType, string ULDNo, string OwnerCode, string SLISNo, string ULDSHCCode, string CitySNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string checkCCAirline(string AirlineSNo, string DestinationAirportSNo, string ChargeCode);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLIULDDetails(string ULDNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLISHCTempDetails(string SLISNo, string SLINo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckULDLWH(string ULDTypeSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckBOENoExist(string BOENo, string SLISNo, string SLINo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetequipmentDetails(string SLISNo, string SLINo, string ULDNo, string LooseSNo);
        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetWeighingScaleWeight(int UserSNo, int SLIAWBSNo, int Pieces, int SubProcessSNo, string UldNo);
        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetSLIEquipmentTareWt(string ConsumableName);
        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetBupDetails(string SLISNo);

        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Reserved(string AWBNo);
        
        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetSLICancellation(string SLISNo);

        [OperationContract]
        [WebGet(RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetSLICosumableTareWeight(string EqType, string Eq, string Count);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePrintCount", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdatePrintCount(Int32 SLISNo);
    }
}
