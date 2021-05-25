using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Schedule;

namespace CargoFlash.Cargo.DataService.Schedule
{ // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IScheduleService" in both code and config file together.
    [ServiceContract]
    public interface IScheduleService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        [OperationContract]
        [WebGet(UriTemplate = "GetScheduleRecord?recid={RecordID}")]
        CargoFlash.Cargo.Model.Schedule.Schedule GetScheduleRecord(string recordID);

        [OperationContract]//?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ScheduleTrans>> GetScheduleTransRecord(int recid, int pageNo, int pageSize, GetScheduleTrans model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSchedule")]
        List<string> SaveSchedule(List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> ScheduleDetail);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ValidateSchedule", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ValidateSchedule(CargoFlash.Cargo.Model.Schedule.ValidateSchedule ScheduleDetail, int IsValidSchedule);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSchedule")]
        List<string> UpdateSchedule(List<CargoFlash.Cargo.Model.Schedule.ScheduleDetails> ScheduleDetail);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSchedule")]
        List<string> DeleteSchedule(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirCraftWeight(String AirCraftSno, int Ori, int Dest, int AirlineSNo);
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string Getcheck_Z_Code(String str);
    }
}
