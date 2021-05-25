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
namespace CargoFlash.Cargo.DataService.Schedule
{
    [ServiceContract]
   public interface ISSIMUploadService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSSIMUpload", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveSSIMUpload(List<SSIMUpload> ssimUpload);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> Preview();
    }
}
