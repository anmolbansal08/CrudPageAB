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
    public interface IUserGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridUserGroupData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetUserGroupRecord?recid={RecordID}")]
        UserGroup GetUserGroupRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveUserGroup")]
        void SaveUserGroup(List<GroupUsersCollection> groupUsersCollection);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateUserGroup")]
        void UpdateUserGroup(List<UserGroup> userGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUserGroup")]
        void DeleteUserGroup(List<GroupUsersCollection> groupUsersCollection);
    }
}
