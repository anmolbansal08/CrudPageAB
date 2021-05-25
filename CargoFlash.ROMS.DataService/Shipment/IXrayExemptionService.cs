using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;


namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IXrayExemptionService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetXrayExemptionRecord?recid={RecordID}&UserSNo={UserSNo}")]
        XrayExemptionGetRecord GetXrayExemptionRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveXrayExemption")]
        List<string> SaveXrayExemption(List<XrayExemption> XrayExemption);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateXrayExemption")]
        List<string> UpdateXrayExemption(List<XrayExemption> XrayExemption);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteXrayExemption")]
        List<string> DeleteXrayExemption(List<string> RecordID);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GETSPECIAL(string Values);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetXrayExemptionAirline(string Values);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetXrayExemptionCommodity(string Values);
        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string CheckVFVTExistence(DateTime VF,DateTime VT);
    }
}
