using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [ServiceContract]
    public interface IPagesService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridChildData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetPagesRecord?recid={RecordID}")]
        Pages GetPagesRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePages", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void SavePages(List<Pages> models);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePages", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void UpdatePages(List<PagesPermission> pages);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeletePages")]
        void DeletePages(int RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetModuleList", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSet GetModuleList();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetPageList", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSet GetPageList(List<ModulePage> modulePage);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePagesRightsCollection", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        void UpdatePagesRightsCollection(int GroupSNo, int UserSNo, List<PagesPermission> pagesPermission);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetModulePagesRecord", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        Pages GetModulePagesRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetProcessPermission", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ProcessPermissionList>> GetProcessPermission(string UserSNo, string GroupSNo, string PageSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveProcessPermission", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        string SaveProcessPermission(List<ProcessPermissionList> arr, string UserSNo, string GroupSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetSpecialPermission", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SpecialPermissionList>> GetSpecialPermission(int UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSpecialPermission", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveSpecialPermission(List<SpecialPermissionList> arry, int UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetPageStatusAccessibility", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<StatusAccessibilityList> GetPageStatusAccessibility(string GroupSNo, string PageSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveStatusAccessibility", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveStatusAccessibility(List<StatusAccessibilityList> arry, int GroupSNo);
    }
}
