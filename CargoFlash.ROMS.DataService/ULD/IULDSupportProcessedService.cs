using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.ULD;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDSupportProcessedService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDSupportProcessed>> GetULDSupportProcessedRecord(int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string UpdateULDSupportProcessed(Int32 ULDSupportRequestAssignTransSNo);
        string UpdateULDSupportProcessed(Int32 ULDSupportRequestAssignTransSNo, Int32 ULDSupportProcessedQTY, string ULDSupportProcessedRemarks, Int32 ULDSupportRequestSno);
       
    }
}

