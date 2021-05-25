using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Schedule;
using System.Web;
using System.Data;
namespace CargoFlash.Cargo.DataService.Schedule
{
    [ServiceContract]
    public interface ISASSSIMUploadService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSSIMUpload", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveSSIMUpload(List<SSIMUpload> ssimUpload);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSSIMData", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveSSIMData(string[] DiffBatchSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ValidateSSIM", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string ValidateSSIM(string[] DiffBatchSNo, string IsLastRequest);
    }
}
