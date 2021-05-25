using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [ServiceContract]
    public interface ILocationSearchService
    {
        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WarehouseLocationSearchResult>> SearchData(string recid, int pageNo, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(UriTemplate = "FindLocation", ResponseFormat = WebMessageFormat.Json)]
        string FindLocation(WarehouseLocationSearch obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateLocationSearch", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateLocationSearch(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateLocationDetails(string AWBNo, string MPIECE, string Location, string IsImport, string SLISNo, string UserSNo, bool AllPcs); 
        
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBNOLOCATionDetails(String AWBNo,  String Location, string IsImport, string ConsumableSNo, string SLISNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateMoveableLocationDetails(String ConsumablesName, String Location);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateULDLocationDetails(String ULDNo, String Location); 

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAllPieces(String AWBNo);
        
    }
}
