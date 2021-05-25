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
    public interface ITimeZoneService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTimeZoneRecord?recid={RecordID}&UserID={UserID}")]
        Timezone GetTimeZoneRecord(int recordID, string UserID);


        [OperationContract]
        [WebGet(UriTemplate = "GetTimeZoneTransRecord?recid={RecordID}&UserID={UserID}")]
        List<TimeZoneTrans> GetTimeZoneTransRecord(int recordID, string UserID);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetTimeZoneRecord?recid={RecordID}&UserID={UserID}")]
        //AirlineTimeZone GetAirlineTimeZoneRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveAirlineTimeZone")]
        //List<string> SaveAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateAirlineTimeZone")]
        //List<string> UpdateAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/DeleteAirlineTimeZone")]
        //List<string> DeleteAirlineTimeZone(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateTimeZone", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateTimeZone(string strData);



        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTimeZoneTransRecordViewUpdate?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<TimeZoneTrans>> GetTimeZoneTransRecordViewUpdate(string recordID, int page, int pageSize, string whereCondition, string sort);
    }
}
