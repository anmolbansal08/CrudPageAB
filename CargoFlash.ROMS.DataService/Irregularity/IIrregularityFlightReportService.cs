using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Irregularity;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [ServiceContract]
    public interface IIrregularityFlightReportService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetIrregularityFlightReportRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IrregularityFlightReport>> GetIrregularityFlightReportRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebGet(UriTemplate = "GetPrintData?DailyFlightSNo={DailyFlightSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPrintData(int DailyFlightSNo);
    }
}
