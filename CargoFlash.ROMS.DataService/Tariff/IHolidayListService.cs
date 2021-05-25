using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Tariff;

namespace CargoFlash.Cargo.DataService.Tariff
{
     [ServiceContract]
    public interface IHolidayListService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetHolidayListRecord?recid={RecordID}")]
        HolidayList GetHolidayListRecord(int recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveHolidayList")]
        List<string> SaveHolidayList(List<HolidayList> HolidayList);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateHolidayList")]
        List<string> UpdateHolidayList(List<HolidayList> HolidayList);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteHolidayList")]
        List<string> DeleteHolidayList(List<string> RecordID);
    }
}
