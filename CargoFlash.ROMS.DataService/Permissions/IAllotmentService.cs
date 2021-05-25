using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Permissions
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAllotmentService" in both code and config file together.
    [ServiceContract]
    public interface IAllotmentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetFlightDetails(string SNo, int AllotmentBasedOn);

        [WebInvoke(Method = "POST", UriTemplate = "SaveAllotment")]
        List<string> SaveAllotment(List<Allotment> Allotment);

        [OperationContract]
        [WebGet(UriTemplate = "GetAllotmentRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Allotment GetAllotmentRecord(string recordID, string UserSNo);

        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateAllotment(List<AllotmentRecords> model);

        [OperationContract] 
        [WebInvoke(Method = "POST",UriTemplate = "DeleteAllotment?recid={RecordID}" , BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAllotment(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetSectorDetails(string OriginAirportSNo, string DestinationAirportSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ValidateData(string AirlineSNo, string AllotmentBasedOn, string AllotmentSNo, string IsSector, string OriginSNo, string DestinationSNo, string ScheduleTransSNo, string GrossWeight, string VolumeWeight, string ValidFrom, string ValidTo, string Days, string AllotmentTypeSNo, string AccountSNo, string ShipperAccountSNo, string OfficeSNo, string CommoditySNo, string CommotityExclude, string SHCSNo, string SHCExclude, string ProductSNo, string ProductExclude);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CheckAgentInternationalDomestic(int OriginAirportSNo, int DestinationAirportSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AllotmentRecords>> GetAllotmentAllRecord(int recid, int pageNo, int pageSize, AllotmentData model, string sort);
    }
}
