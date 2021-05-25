using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ITaxLogsService" in both code and config file together.
    [ServiceContract]
    public interface ITaxLogsService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string TaxLogsTable(int AirlineSNo, int Type, int TaxType, int Status, DateTime StartDate, DateTime EndDate, int OriginLevel, int OriginSNo, int DestinationLevel, int DestinationSNo, string ReferenceNo);
    }
}
