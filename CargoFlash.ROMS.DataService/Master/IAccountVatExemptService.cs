using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IAccountVatExemptService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAccountVatExemptRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AccountVatExempt>> GetCountryVatRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAccountVatExempt", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAccountVatExempt(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAccountVatExempt?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAccountVatExempt(string recordID);

    }
}
