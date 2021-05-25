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
using System.IO;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IULDHistoryService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDHistory>> GetULDHistoryRecord(string recordID, int page, int pageSize, whereConditionULDHistory model, string sort);

        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        List<ULDHistory> SearchData(ULDHistory obj);
    }
}
