using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [ServiceContract]
    public interface IComplaintService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}/{RecID}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule, string RecID);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetComplaintGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetComplaintGridData(GetComplaintGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Stream GetGridData(ComplainWhereConditionModel modal);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNewComplaint", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNewComplaint(ComplaintNew obj);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateComplaint", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateComplaint(ComplaintNew obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAction", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAction(ComplaintAction obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAssign", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAssign(ComplaintAssign obj);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEdoxAtComplaintSNo(Int32 CurrentComplaintSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveComplaintEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveComplaintEDoxDetail(int CurrentComplaintSNo, List<ComplaintEDoxDetail> ComplaintEDoxDetail);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAccountRecords(string AccountNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetActionHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetActionHistory(int CurrentComplaintSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAssignHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAssignHistory(int CurrentComplaintSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetIrregularityHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetIrregularityHistory(int CurrentComplaintSNo);
    }
}
