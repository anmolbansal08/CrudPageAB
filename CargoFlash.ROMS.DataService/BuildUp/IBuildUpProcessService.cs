using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.BuildUp;

namespace CargoFlash.Cargo.DataService.BuildUp
{
    [ServiceContract]
    public interface IBuildUpProcessService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(GetGridDataModel model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetULDGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOffloadedULDGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetULDChildGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOffloadedULDChildGridData(string DailyFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightDetails(string flightDate, string City);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDDetails(string ULDStockSNo, string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetBuildUpFlightDetails", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetBuildUpFlightDetails(BuildUpFlightDetails Model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetLyingListGridData(GetLyingListGridDataModel model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetOffloadListFromProcessGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBuildUpPlan", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveBuildUpPlan(List<ProcessedULDInfo> ProcessedULDInfo, List<ProcessedULDShipment> ProcessedULDShipment, List<ProcessedAWB> ProcessedAWB, List<POMailDNDetails> POMailDNDetails, ProcessedFlightInfo ProcessedFlightInfo, Int32 UpdatedBy, string RemovedULD, string GroupFlightSNo, int AirportSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBuildOffloadedULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveBuildOffloadedULD(List<ProcessedOffLoadedULD> ProcessedULDInfo);

     
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveULDDetails(ULDDetails ULDDetails, List<ULDConsumables> ULDConsumables, Int32 ULDStockSNo, Int32 DailyFlightSNo, Int32 UpdatedBy, ULDBuildUpOverhangPallet ULDBuildUpOverhangPallet, List<ULDBuildUpOverhangTrans> ULDBuildUpOverhangTrans, string CityCode, decimal ULDGrWT, decimal ULDVolumeWeight, int AirportSNo, string ULDSHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDBuildUpDetails(Int32 ULDStockSNo, Int32 DailyFlightSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckForSPHCRestriction", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckForSPHCRestriction(List<ProcessedShipmentForBuildUp> ProcessedShipmentInfo, string ULDStockSNo, string AircraftTypeSNo, string CheckedAWBSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getAirlineULDDetails(string ULDType, string ULDCity);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDPrint(string DailyFlightSNo, string ULDStockSNo, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckForDGR(string SPHC);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAircraftCapacity(string AircraftNo, string CarrierCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckOnHoldShipment", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckOnHoldShipment(Int32 AWBSNo, int McBookingSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CheckFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckFlight(string FlightNo, string FlightDate, string OriginCity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetDestinationAgainstFPSNo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDestinationAgainstFPSNo(int FPSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string POMailDNInfo(string GroupFlightSNo, int ULDStockSNo, int MCBookingSNo, string Stage);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string IsInternationalOffpoint(string UldOffPoint, string ShipmentDestination);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/MoveToLyingList", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string MoveToLyingList(string DailyFlightSNo, string ShipmentType, int ShipmentNo, int recordSNo, int UldStockSNo, int Pieces, decimal GrossWeight, decimal Volume, decimal CBM, bool IsPlanned);
        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream BuildUPReport(string DailyFlightSNo);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetReportHTML(DataSet ds)", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetReportHTML(DataSet ds);


    }
}
