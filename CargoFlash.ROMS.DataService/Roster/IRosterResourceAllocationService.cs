using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Roster
{
    [ServiceContract]
    public interface IRosterResourceAllocationService
    {

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetEmployee?employee={employee}&designation={designation}&dutyArea={dutyArea}&start={start}&end={end}&staffStatus={staffStatus}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<RosterEmployeeAllocation> GetEmployee(string employee, string designation, string dutyArea, string start, string end, string staffStatus);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAllocatedDuty?employee={employee}&designation={designation}&dutyArea={dutyArea}&start={start}&end={end}&staffStatus={staffStatus}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<RosterResourceAllocation> GetAllocatedDuty(string employee, string designation, string dutyArea, string start, string end, string staffStatus);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAllocation", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<SchedulerMessage> SaveAllocation(RosterResourceAllocation models);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDutyAreaName();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetDutyArea", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<DutyArea> GetDutyArea();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAllocation", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        bool DeleteAllocation(RosterResourceAllocation models);       

    }
}
