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
    public interface IUserPageRightTransService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetUserPageRightTransRecord?recid={RecordID}")]
        UserPageRightTrans GetUserPageRightTransRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveUserPageRightTrans")]
        void SaveUserPageRightTrans(List<UserPageRightTrans> userPageRightTrans);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateUserPageRightTrans", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void UpdateUserPageRightTrans(List<ChildPagesUserPermissionCollection> childPagesUserPermissionTrueCollection, List<ChildPagesUserPermissionCollection> childPagesUserPermissionFalseCollection);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUserPageRightTrans")]
        void DeleteUserPageRightTrans(int RecordID);
    }
}
