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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [ServiceContract]
    public interface IPermissionService
    {

        [OperationContract]  //By Akash Update Session
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSession", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        UserLogin UpdateSession(string AirportSNo, string AirportCode, string UserSNo);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetData", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void GetData(int UserSNo, int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.PagesPermissionCollection> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "DeletePermission", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void DeletePermission(int PageSNo, List<CargoFlash.Cargo.Model.Permissions.DeletePermission> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "AddUserPermission", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void AddUserPermission(int PageSNo, List<CargoFlash.Cargo.Model.Permissions.DeletePermission> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "AddGroupUser", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void AddGroupUser(int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.GroupUsers> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "DeleteGroupUser", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void DeleteGroupUser(int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.GroupUsers> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "AddUserGroup", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void AddUserGroup(int UserSNo, List<CargoFlash.Cargo.Model.Permissions.UserGroups> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "DeleteUserGroup", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void DeleteUserGroup(int UserSNo, List<CargoFlash.Cargo.Model.Permissions.UserGroups> PageAccessibilityList);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetVersionNo();

        [OperationContract]
       
        [WebInvoke(Method = "GET", UriTemplate = "UpdateRateDownload?FilePath={FilePath}&UserSNo={UserSNo}",  RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        void UpdateRateDownload(string FilePath,  int UserSNo);
    }
}
