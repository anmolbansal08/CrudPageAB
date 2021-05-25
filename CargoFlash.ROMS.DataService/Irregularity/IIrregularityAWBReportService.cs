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
    public interface IIrregularityAWBReportService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke( BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IrregularityAWBReport>> GetIrregularityAWBReportRecord(string recid, int pageNo, int pageSize, IrregularityBindAppendGrid model, string sort);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetIrregularityAWBReportRecordhtml(string FromDate, string ToDate, string Type);
    }
}
