using CargoFlash.Cargo.Model.Mail;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Mail
{
    [ServiceContract]
    public interface IAirMailManifestService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirMailGridData/{processName}/{moduleName}/{appName}/{FlightNo}/{FlightDate}/{Origin}/{Destination}/{OffPoint}/{FlightStatus}/{GroupFlightSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetAirMailGridData(string processName, string moduleName, string appName, string FlightNo, string FlightDate, string Origin, string Destination, string OffPoint, string FlightStatus, string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailDetailsGridData(string FlightNo, string FlightDate, string Origin, string Destination, string OffPoint, string FlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);   

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailDetailsRecord(string GroupFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailChildRecord(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePreManifest", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SavePreManifest(List<PoMailPreManifest> PoMailPreManifest, List<PoMailPreManifestTrans> PoMailPreManifestTrans, string DutyOfficer, string PlannedBy, int UpdatedBy, string GroupFlightSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailDetailsLyingListRecord(string GroupFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirMailChildLyingListRecord(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetManifestDetails(string GroupFlightSNo);
    }
}
