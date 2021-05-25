using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region ULD Breakdown interface Description
    /*
	*****************************************************************************
	interface Name:		IULDBreakdownService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    23 oct 2015
    Updated By:    
	Updated On: 
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IULDBreakdownService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDBreakdownRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDBreakdown>> GetULDBreakdownRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDBreakdownTransitRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDBreakdown>> GetULDBreakdownTransitRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CreateULDBreakdownTable(int DailyFlightSNo, String ULDNo, int Type);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDBreakdownTransitRecordMixtoCleanLoad(int DailyFlightSNo, String ULDNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateULDBreakdown(Int32 Action, Int32 DailFlightSNo, String MainULDNo, String TransferULDNo, string TransferDailFlightSNo, string ULDLocation, string ULDLocationSNo, string RequestedBy, string BilledTo, String Reason, string Remark, string createdBy, string DivData);

        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetLyingListGridData/{processName}/{moduleName}/{appName}/{Origin}/{Destination}/{FlightNo}/{FlightDate}/{AWBNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetLyingListGridData(string processName, string moduleName, string appName, string Origin, string Destination, string FlightNo, string FlightDate, string AWBNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetLyingListGridData1(string FlightNo, string FlightDate, string Origin, string Destination, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ADDTransitReBuildData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ADDTransitReBuildData(List<ULDBreakdownArray> ULDBreakdown, Int32 DailyFlightSNo, string ULDNo, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteOffloadedCargo", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string DeleteOffloadedCargo(Int32 OffloadedSNo, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveULDDetails(CargoFlash.Cargo.Model.BuildUp.ULDDetails ULDDetails, List<CargoFlash.Cargo.Model.BuildUp.ULDConsumables> ULDConsumables, Int32 ULDStockSNo, Int32 DailyFlightSNo, Int32 UpdatedBy, CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangPallet ULDBuildUpOverhangPallet, List<CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangTrans> ULDBuildUpOverhangTrans);
    }
}
