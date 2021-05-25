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
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IFBL" in both code and config file together.
    [ServiceContract]
    public interface IFBLService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);
        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{AWBPrefix}/{AWBNo}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity);
        [OperationContract]
        [WebGet(UriTemplate = "GetTransGridData/{processName}/{moduleName}/{appName}/{AWBSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetWMSWaybillGridDataFBL(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFBLInformation(Int32 AWBSNO);

        [OperationContract]
        [WebGet(UriTemplate = "GetDIMSFBLInformationGrid/{processName}/{moduleName}/{appName}/{AWBSNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetDIMSFBLInformationGrid(string processName, string moduleName, string appName, string AWBSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetDIMSGridDataFBL(string AWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "InitiateFBR?DailyFlightSNo={DailyFlightSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string InitiateFBR(string DailyFlightSNo);
    }
}
