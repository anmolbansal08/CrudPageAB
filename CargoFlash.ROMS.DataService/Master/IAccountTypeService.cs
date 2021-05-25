using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IAccountTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAccountTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AccountType GetAccountTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAccountType")]
        List<string> SaveAccountType(List<AccountType> AccountType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAccountType")]
        List<string> DeleteAccountType(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAccountType")]
        List<string> UpdateAccountType(List<AccountType> AccountType);
    }
}
