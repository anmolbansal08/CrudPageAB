using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IULDMonitoringService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDArrivalShipmentGrid/{processName}/{moduleName}/{appName}/{ULDNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetULDArrivalShipmentGrid(string processName, string moduleName, string appName, string ULDNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetULDMonitoringULDGridData(string ULDNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetTransitMonitoringShipmentGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateAwbULDLocation?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateAwbULDLocation(string strData);

       
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAwbULDLocationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<AwbULDLocationTransitMonitoring>> GetAwbULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetFAULDLocationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<FAULDLocationTransitMonitoring>> GetFAULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateFAULDLocation?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateFAULDLocation(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteFAULDLocation?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteFAULDLocation(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetAWBXrayRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<AWBXray>> GetAWBXrayRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateAWBXray?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateAWBXray(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteAWBXray?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteAWBXray(string recordID);


        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetULDXrayRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ULDXray>> GetULDXrayRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateULDXray?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateULDXray(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteULDXray?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteULDXray(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetReBuildRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ReBuild>> GetReBuildRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateReBuild?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateReBuild(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteReBuild?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteReBuild(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetTerminateRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<Terminate>> GetTerminateRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateTerminate?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateTerminate(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteTerminate?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteTerminate(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetRebuildCharges(int ffmShipmentTransSNo);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRebuildProcess", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string SaveRebuildProcess(string DestCity, List<DOHandlingCharges> lstHandlingCharges);
    }
}
