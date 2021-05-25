using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.BuildUp;

namespace CargoFlash.Cargo.DataService.BuildUp
{
    [ServiceContract]
    public interface IAgentBuildUpWeighingService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDDetails(int AgentBuildUpSNo, int UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAgentBuildUpWeighing", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAgentBuildUpWeighing(List<AgentBuildUpWeighing> AgentBuildUpWeighing, int AgentBuildUpSNo, int UserSNo, int AirportSNo, string DailyFlightSNo, string WeighingBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAssignFlight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAssignFlight(int AgentBuildUpSNo, int UldStockSNo, int DailyFlightSNo, int UserSNo, int AirportSNo, string ULDOffPoint);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetChildULDAgentBuildUpRecord(string AgentBuildUpSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetBulkRecordForAssignEquipment?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AgentBuildUpBulkAssignEquipment>> GetBulkRecordForAssignEquipment(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetViewBulkRecordForAssignEquipment?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AgentBuildUpViewBulkAssignEquipment>> GetViewBulkRecordForAssignEquipment(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ValidateBulkRecordForAssignEquipment(List<AgentBuildUpBulkAssignEquipment> dataDetails);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveBulkRecordForAssignEquipment(List<AgentBuildUpBulkAssignEquipment> dataDetails, List<AgentBuildUpBulkAssignEquipmentScaleWeight> ScaleWeightData, int dailyFlightSNo, int AirportSNo, int UserSNo);
    }
}
