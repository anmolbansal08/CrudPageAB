using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ICityConnectionTimeService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCityConnectionTimeRecord?recid={RecordID}&UserID={UserID}")]
        CityConnectionTime GetCityConnectionTimeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCityConnectionTime")]
        List<string> SaveCityConnectionTime(List<CityConnectionTime> CityConnectionTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCityConnectionTime")]
        List<string> UpdateCityConnectionTime(List<CityConnectionTime> CityConnectionTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCityConnectionTime")]
        List<string> DeleteCityConnectionTime(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDefault(int id);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateCityConnectionTimeSlab")]
        List<string> createUpdateCityConnectionTimeSlab(List<CityConnectionTimeSlab> CityConnectionTime);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/deleteCityConnectionTimeSlab")]
        List<string> deleteCityConnectionTimeSlab(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCityConnectionTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CityConnectionTimeSlab>> GetCityConnectionTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetCommissionTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<CommissionTrans>> GetCommissionTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


    }
}
