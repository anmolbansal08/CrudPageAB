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
using CargoFlash.Cargo.Model.RFS;

namespace CargoFlash.Cargo.DataService.RFS
{
    [ServiceContract]
    public interface IRFSService
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
        [WebGet(UriTemplate = "GetRFSDockingChargeData/{processName}/{moduleName}/{appName}/{RFSTruckDetailsSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetRFSDockingChargeData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSGridData(String TruckNo, String SearchFromFlightDate, String SearchToFlightDate, String SearchFlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSDockingChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightTransGridData/{processName}/{moduleName}/{appName}/{FlightSNo}/{ProcessStatus}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo, string ProcessStatus);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSManifestFlightULDGridData(string FlightSNo, string ProcessStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSManifestULDShipmentGridData(string FlightSNo, string ProcessStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTruckDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveTruckDetails(List<TruckDetails> TruckDetails, string AirportCode, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRFSHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRFSHistory(List<TruckRFSHistoryDetails> TruckRFSHistoryDetails, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAssignFlightDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAssignFlightDetails(List<AssignFlightDetails> AssignFlightDetails, string AirportCode, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDepartureDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveDepartureDetails(List<DepartureDetails> DepartureDetails, string AirportCode);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSTruckInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSHistory(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSAssignFlightInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSDepartureInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSOtherInfo(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSAssignFlightInformationOnTab(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetTruckDetails(string DailyFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string RemoveRFSAssignFlightDetails(string RFSTruckDetailsSNo);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, int PValue, int SValue, int HAWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetChargeValue", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetChargeValue(int TariffSNo, int AWBSNo, string CityCode, int PValue, int SValue, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSChargesInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRFSFreightChargesByPosition(string RateAirlineMasterSNo, string ChargeableUnit, string ObjVal, string Amount);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRFSCustomChargesByAmount(string RateAirlineMasterSNo, string RateAirlineCustomChargesSNo, string Amount);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindRFSChagesAmountInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetRFSCustomChargesData/{processName}/{moduleName}/{appName}/{RFSTruckDetailsSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetRFSCustomChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetRFSCustomChargesGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        /// <summary>
        /// Save RFS Charges Details
        /// </summary>
        /// <param name="RFSChargesDetails"></param>
        /// <param name="RFSCustomChargesDetails"></param>
        /// <param name="RFSHandlingCharges"></param>
        /// <param name="BillTo"></param>
        /// <param name="AirportCode"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRFSChargesDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRFSChargesDetails(List<RFSChargesDetails> RFSChargesDetails, List<RFSCustomChargesDetails> RFSCustomChargesDetails, List<RFSHandlingCharges> RFSHandlingCharges, string BillTo, string BillToSno, string AirportCode, string PaymentMode, string BillToDockingVendor);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAgentInformation(string RFSTruckDetailsSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string ValidateAssignFlightInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream PrintPreManifest(string DailyFlightSNo, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRFSHandlingDetails(string RFSTruckDetailsSNo, string SNo, string Type);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDCount(string DailyFlightSNo, string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string RFSSaveManifest(string RFSTruckDetailsSNo, string UWS);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string CheckManifestFlight(string RFSTruckDetailsSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string CheckDepartedFlight(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetRFSMendatoryCharges", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRFSMendatoryCharges(int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetBillingInformation(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetVendorApplicableForHiringCharges(int AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string RFSCheckCreditLimit(int AccountSNo, decimal @TotalAmount);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetVendorCreditLimitInformation(string AccountSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPettyCashVoucherPrint(string StartDate, string EndDate);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRFSChargeFinalized", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRFSChargeFinalized(string RFSTruckDetailsSNo, string Chargesfinalized, string ChargesRemarks);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetRFSBulkDockingChargesFlag", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRFSBulkDockingChargesFlag(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveOtherInfoDetails(String RFSTruckDetailsSNo, String InvoiceNo, double SealCharges);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string BindByDefaultBillToAgent(string TruckCarrierCode);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetRFSCancelledRemarks(string RFSTruckDetailsSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetDriverDetails(string DriverMasterSNo);

    }
}
