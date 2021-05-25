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

namespace CargoFlash.Cargo.DataService.Import
{
    [ServiceContract]
    public interface IFlightArrivalService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);
   
        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{SearchAirlineSNo}/{SearchFlightNo}/{SearchBoardingPoint}/{searchFromDate}/{searchToDate}/{StartTime}/{EndTime}/{FetchAWBList}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string SearchAirlineSNo,string SearchFlightNo, string SearchBoardingPoint, string searchFromDate, string searchToDate, string StartTime, string EndTime, string FetchAWBList);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightArrivalShipmentGrid/{processName}/{moduleName}/{appName}/{DailyFlightSno}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetFlightArrivalShipmentGrid(string processName, string moduleName, string appName, string DailyFlightSno);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetArrivalGridData(string SearchAirlineSNo,string SearchFlightNo, string SearchBoardingPoint, string searchFromDate, string searchToDate, string StartTime, string EndTime, string FetchAWBList,string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalShipmentGridData(string DailyFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetFlightArrivalULDGridData(string DailyFlightSno, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightArrivalFlightInformation(Int32 DailyFlightSno);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDLocation(Int32 DailyFlightSNo, Int32 ULDSNo);
    }
}
