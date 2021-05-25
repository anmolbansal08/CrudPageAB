using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDStockService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetMaxULDSerial?ULDTypeSNo={ULDTypeSNo}&AirlineCode={AirlineCode}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMaxULDSerial(int ULDTypeSNo, string AirlineCode);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "CheckCityCode?CityCode={CityCode}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult CheckCityCode(string CityCode);

        [WebInvoke(Method = "POST", UriTemplate = "SaveULDStock")]
        List<string> SaveULDStock(List<ULDStock> ULDStock);

        [WebInvoke(Method = "POST", UriTemplate = "UpdateULDStock")]
        List<string> UpdateULDStock(List<ULDStock> ULDStock);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDStockRecord?recid={RecordID}&UserID={UserID}")]
        ULDStock GetULDStockRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTareWeight(string ULDSNo);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteULDStock")]
        //List<string> DeleteULDStock(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportuldInformation(string Code);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetULDStockSpecialRights();


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string getavailableData(string UDlSno);
        //Added By Shivali Thakur on 27/04/2018
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Inventorymessage(string ID);

    }
}
