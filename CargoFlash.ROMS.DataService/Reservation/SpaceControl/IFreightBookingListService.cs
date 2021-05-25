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
using CargoFlash.Cargo.Model.SpaceControl;


namespace CargoFlash.Cargo.DataService.SpaceControl
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IFreightBookingListService" in both code and config file together.
    [ServiceContract]
    public interface IFreightBookingListService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);
        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{OriginCity}/{DestinationCity}/{FlightNo}/{FlightDate}/{LoggedInCity}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string LoggedInCity);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetWMSWaybillGridDataFBL(string OriginCity, String DestinationCity, String FlightNo, string FlightDateSearch, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SendFreightBookingDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SendFreightBookingDetails(int DailyFlightSNo, string FlightNo, string FlightOrigin, string FlightDestination, string FlightDate, string FlightEtd);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/PrintFreightBookingDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string PrintFreightBookingDetails(int DailyFlightSNo, string FlightNo, string FlightOrigin, string FlightDate, string FlightEtd);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/FreightBookingVersionDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string FreightBookingVersionDetails(int DailyFlightSNo, string FlightNo, string FlightDate, string FlightOrigin, string FlightDestination, int FBLVersion);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFBLShipmentDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //[WebInvoke(Method = "POST", UriTemplate = "/CreateStock")]
        string SaveFBLShipmentDetails(List<FBLShipmentDetailsList> ShipmentDetails);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/ExcelShipmentDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        ////[WebInvoke(Method = "POST", UriTemplate = "/CreateStock")]
        //void ExcelShipmentDetails(List<FBLShipmentDetailsList> ExcelShipmentDetails);
    }
}
