using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ILoginColorCodeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLoginColorCode")]
        List<string> SaveLoginColorCode(List<LoginColorCode> LoginColorCode);

        [OperationContract]
        [WebGet(UriTemplate = "GetLoginColorCodeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        LoginColorCode GetLoginColorCodeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateLoginColorCode")]
        List<string> UpdateLoginColorCode(List<LoginColorCode> LoginColorCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteLoginColorCode")]
        List<string> DeleteLoginColorCode(List<string> RecordID);
    }
}
