
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Permissions
{
    #region UserTypeService interface Description
    /************************************
	*/
    #endregion
    [ServiceContract]
    public interface IUserTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetUserTypeRecord?recid={RecordID}&UserID={UserID}")]
        UserType GetUserTypeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveUserType")]
        List<string> SaveUserType(List<UserType> ULDBag);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateUserType")]
        List<string> UpdateUserType(List<UserType> ULDBag);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteUserType")]
        List<string> DeleteUserType(List<string> RecordID);
    }
}