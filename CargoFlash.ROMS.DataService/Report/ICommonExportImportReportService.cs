using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface ICommonExportImportReportService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetRecord?recid={RecordID}&UserID={UserID}")]
        CommonExportImportReport GetRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ExportImportReport>> GetReport(string recid, int pageNo, int pageSize, CommonExportImportRequest model, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ExportImportDetails>> GetDetails(string recid, int pageNo, int pageSize, CommonExportImportRequest model, string sort);

    }
}
