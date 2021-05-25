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
    public interface ICityWiseULDAllocationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCityWiseULDAllocationRecordTrans?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CityWiseULDAllocationTrans>> GetCityWiseULDAllocationRecordTrans(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebGet(UriTemplate = "GetCityWiseULDAllocationRecord?recid={RecordID}")]
        CityWiseULDAllocation GetCityWiseULDAllocationRecord(string recordID);

        //[OperationContract]
        // [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Xml)]
        //List<string> SaveCityWiseULDAllocationTrans(List<CityWiseULDAllocationTransSave> data);

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Xml)]
        // [WebInvoke(Method = "POST")]
        // [WebGet(UriTemplate = "SaveCityWiseULDAllocation")]
        List<string> SaveCityWiseULDAllocation(CityWiseULDAllocationTransSave formData);

        //  [OperationContract]
        //  [WebGet(UriTemplate = "CityWiseULDAllocationTransSave")]
        //List<string> SaveCityWiseULDAllocation(CityWiseULDAllocationTransSave formData);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteCityWiseULDAllocationRecordTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteCityWiseULDAllocationRecordTrans(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //List<string> UpdateCityWiseULDAllocation(CityWiseULDAllocationTransSave formData);



        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCurrentStock(string UldSNo, string CarrierCode, string CityCode);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckAirlineExists(string CarrierCode, string AirportCode);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCity(string Key);


        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string GetCurrentStock(string K);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAgentName(string AWBSNo);





    }
}
