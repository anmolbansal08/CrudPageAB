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
    public interface IImportRFSService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{SearchFlightNo}/{SearchFromFlightDate}/{SearchToFlightDate}/{SearchFlightStatus}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string SearchFlightNo, string SearchFromFlightDate, string SearchToFlightDate, string SearchFlightStatus);

        [OperationContract]
        [WebGet(UriTemplate = "GetRFSChargesData/{processName}/{moduleName}/{appName}/{RFSTruckDetailsSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetRFSChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSGridData(String TruckNo, String SearchFromFlightDate, String SearchToFlightDate, String SearchFlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSTruckInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveImportTruckDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveImportTruckDetails(List<ImportTruckDetails> TruckDetails, string AirportCode, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindImportRFSAssignFlightInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetRFSMendatoryCharges", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRFSMendatoryCharges(int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<ImportRFSShipmentInfo> lstShipmentInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSChargesInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRFSCustomChargesData/{processName}/{moduleName}/{appName}/{RFSTruckDetailsSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetRFSCustomChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSCustomChargesGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRFSHandlingDetails(string RFSTruckDetailsSNo, string SNo, string Type);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetBillingInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAgentInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetTruckDetails(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetChargeValue", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetChargeValue(int TariffSNo, int AWBSNo, string CityCode, int PValue, int SValue, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRFSChargesDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRFSChargesDetails(List<RFSChargesDetails> RFSChargesDetails, List<RFSCustomChargesDetails> RFSCustomChargesDetails, List<RFSHandlingCharges> RFSHandlingCharges, string BillTo, string BillToSno, string AirportCode, string PaymentMode, string BillToDockingVendor);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveImportRFSAssignFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveImportRFSAssignFlight(List<AssignFlightDetails> AssignFlightDetails, string AirportCode, string RFSTruckDetailsSNo);
    }
}