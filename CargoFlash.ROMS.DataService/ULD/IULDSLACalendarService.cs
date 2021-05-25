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
using System.IO;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDSLACalendarService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDSLACalendarRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ULDSLACalendar GetULDSLACalendarRecord(int RecordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDSLACalendar")]
        List<string> SaveULDSLACalendar(List<ULDSLACalendar> ULDSLACalendar);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDSLACalendar")]
        List<string> UpdateULDSLACalendar(List<ULDSLACalendar> ULDSLACalendar);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDSLACalendar")]
        List<string> DeleteULDSLACalendar(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDSLACalendarInfomationWeekOff?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<WeekOffHoliDatCustom>> GetULDSLACalendarInfomationWeekOff(string recordID, int page, int pageSize, string whereCondition, string sort);
            
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateWeekOffDays", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateWeekOffDays(string ULDCalendarSNo, string HolidayType, List<WeekOffDaysList> WeekOffDaysList);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDSLACalendarInfomationHoliDays(string ULDCalendarSNo, string HolidayType);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetWeek(string SNo);

    }
}
