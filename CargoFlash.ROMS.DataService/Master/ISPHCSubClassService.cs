using CargoFlash.Cargo.Model.Master;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ISPHCSubClassService
    {
        //InterFace for SPHCSubClass

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetSPHCSubClassRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<SPHCSubClass> GetSPHCSubClassRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetSPHCSubClassRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SPHCSubClass>> GetSPHCSubClassRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateSPHCSubClass", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateSPHCSubClass(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "CreateSPHCSubClass?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> CreateSPHCSubClass(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteSPHCSubClass?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteSPHCSubClass(string recordID);

    }
}
