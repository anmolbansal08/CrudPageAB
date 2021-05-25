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
    public interface IAirlineTimeZoneService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirlineTimeZoneRecord?recid={RecordID}&UserID={UserID}")]
        AirlineTimeZone GetAirlineTimeZoneRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirlineTimeZone")]
        List<string> SaveAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirlineTimeZone")]
        List<string> UpdateAirlineTimeZone(List<AirlineTimeZone> AirlineTimeZone);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirlineTimeZone")]
        List<string> DeleteAirlineTimeZone(List<string> RecordID);
    }
}
