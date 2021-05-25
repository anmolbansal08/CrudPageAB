using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.BuildUp;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.BuildUp
{
    [ServiceContract]
    public interface IBuildUpService
    {

        #region BuildUp
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        Stream GetWebForm(WebFormBuildUpRequest model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        System.IO.Stream GetBuildupGridData(WebFormBuildWebFormRequest model);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetBuildupULDGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetBuildupULDGridData(WebFormBuildWebFormRequest model);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        //System.IO.Stream GetBuildupULDGridData(WebFormBuildWebFormRequest model);

        [OperationContract]
        [WebInvoke( BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        System.IO.Stream GetLyingListGridData(WebFormBuildUpRequestLyingListGrid model);

        // Added for AssignEquipmentBulk
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetBulkRecordForAssignEquipmentBuildUp?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BuildUpBulkAssignEquipment>> GetBulkRecordForAssignEquipmentBuildUp(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetViewBulkRecordForAssignEquipmentBuildUp?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<BuildUpViewBulkAssignEquipment>> GetViewBulkRecordForAssignEquipmentBuildUp(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ValidateBulkRecordForAssignEquipmentBuildUp(List<BuildUpBulkAssignEquipment> dataDetails);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveBulkRecordForAssignEquipmentBuildUp(List<BuildUpBulkAssignEquipment> dataDetails, List<BuildUpBulkAssignEquipmentScaleWeight> ScaleWeightData, string dailyFlightSNo, int AirportSNo, int UserSNo);


        #endregion

    }
}
