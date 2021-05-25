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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ICityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCityRecord?recid={RecordID}&UserSNo={UserSNo}")]
        City GetCityRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveCity")]
        List<string> SaveCity(List<City> City);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCity")]
        List<string> UpdateCity(List<City> City);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCity")]
        List<string> DeleteCity(List<string> RecordID);


        [OperationContract]
        [WebGet(UriTemplate = "GetDayLightSavingTime/{TimeZoneSno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DayLightSavingTime GetDayLightSavingTime(string TimeZoneSno);
    }
}
