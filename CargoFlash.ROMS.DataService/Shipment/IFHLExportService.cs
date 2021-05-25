using CargoFlash.Cargo.Model.Import;
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
	interface IFHLExportService
	{

		[OperationContract]
		[WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
		Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

		[OperationContract]
		[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		DataSourceResult FHLGridData(string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string searchSPHC, string searchConsignee, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

		[OperationContract]
		[WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{searchAirline}/{searchFlightNo}/{searchAWBNo}/{searchFromDate}/{searchToDate}/{SearchIncludeTransitAWB}/{SearchExcludeDeliveredAWB}/{LoggedInCity}/{searchSPHC}/{searchConsignee}", BodyStyle = WebMessageBodyStyle.Bare)]
		Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string LoggedInCity, string searchSPHC, string searchConsignee);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string GetProcessSequence(string ProcessName);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string BindFHLSectionTable(int AWBSNO);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string BindFHLSectionPrintHouse(int AWBSNO);


		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string GetShipperAndConsigneeInformation(Int32 AWBSNO);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest);


		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, ImportAgentModelDetail AgentModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/UpdateModifyFHL", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string UpdateModifyFHL(Int32 AWBSNo, Int32 HAWBNOOfHouse, Int32 HAWBTotalPieces, decimal HAWBTotalGrossWeight, decimal HAWBTotalVolumeWeight);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/SaveFHLinfoImport", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string SaveFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/UpdateFHLinfoImport", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string UpdateFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/DeleteFHL", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string DeleteFHL(Int32 HAWBSNo);

		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string BindHAWBSectionData(int HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity);


		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string GetHAWBNoDetailsFromSLIDetails(string HAWBNo, string AWBSNo);



		[OperationContract]
		[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string GatValueOfAutocomplete(int SNo);


		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/SaveFHLhawbDescription", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string SaveFHLHAWBDescription(List<HawbDescription> HawbDescription, string HAWBNo, Int32 AWBSNo);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/SaveFHLHarmonizedCommodity", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string SaveFHLHarmonizedCommodity(List<HarmonizedCommodityCode> HarmonizedCommodityCode, string HAWBNo, Int32 AWBSNo);


		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/updateFHLHarmonizedCommodity", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		string updateFHLHarmonizedCommodity(string HarmonizedCommodityCode, string HAWBNo, string HawbDescription, Int32 AWBSNo);

		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		string FHLReservationBookingGetAWBPrintData(int? AwbNo, string ProcName, int? HAWBNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails_TaxID(string UserType, string Taxid);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckTaxId(string TaxId, string UserType,int CountrySno);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/updateFHLHAWBDescription", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string updateFHLHAWBDescription(string HawbDescription, string HAWBNo);





    }
}
