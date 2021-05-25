using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface ISCMDiscrepancyService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ScmiscrepancyReportDetail(int scmdiscrepancysno);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ScmiCiscrepancytUpdate(string id, string Type);
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ScmUldDetail(string ULDnumber);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string reexecuteEdiScm(string EdiScmID);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetScmiscrepancyReportDetail?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SCMDiscrepancy>> GetScmiscrepancyReportDetail(string recordID, int page, int pageSize, string whereCondition, string sort);

         


    }
}
