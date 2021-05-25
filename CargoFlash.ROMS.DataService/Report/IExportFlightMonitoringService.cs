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
using CargoFlash.Cargo.Model.Report;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IExportFlightMonitoringService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGrid/{processName}/{moduleName}/{appName}/{SearchFlightNo}/{FromDate}/{ToDate}/{SearchDestination}/{SearchAirline}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetGrid(string processName, string moduleName, string appName, string SearchFlightNo, string FromDate, string ToDate, string SearchDestination, string SearchAirline);

        [OperationContract]
        [WebGet(UriTemplate = "GetChartData/{StartDate}/{EndDate}/{DailyFlightSno}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<ExportFlightMonitoringChart> GetChartData(string StartDate, string EndDate, string DailyFlightSno);

        [OperationContract]
        [WebGet(UriTemplate = "GetNestedGrid/{SNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        System.IO.Stream GetNestedGrid(string SNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(string SearchFlightNo, string FromDate, string ToDate, string SearchDestination, string SearchAirline, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetNestedGridData(string SNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
    }
}