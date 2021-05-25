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
    public interface IConsumeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<Consume>> GetConsumeRecord(string recordID, int page, int pageSize, ConsumeRequest model, string sort);

        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        List<Consume> SearchData(Consume obj);


    }
}
