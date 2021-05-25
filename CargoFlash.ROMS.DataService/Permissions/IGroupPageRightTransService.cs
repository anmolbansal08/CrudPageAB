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
    public interface IGroupPageRightTransService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetGroupPageRightTransRecord?recid={RecordID}")]
        GroupPageRightTrans GetGroupPageRightTransRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveGroupPageRightTrans")]
        void SaveGroupPageRightTrans(List<GroupPageRightTrans> groupPageRightTrans);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateGroupPageRightTrans", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        void UpdateGroupPageRightTrans(List<ChildPagesPermissionCollection> childPagesPermissionTrueCollection, List<ChildPagesPermissionCollection> childPagesPermissionFalseCollection);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteGroupPageRightTrans")]
        void DeleteGroupPageRightTrans(int RecordID);
    }
}
