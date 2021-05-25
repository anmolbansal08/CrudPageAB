using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Accounts
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IReversePaymentService" in both code and config file together.
    [ServiceContract]
    public interface IReversePaymentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveReversePayment")]
        List<string> SaveReversePayment(List<ISReversePayment> Payment);

        [OperationContract]
        [WebGet(UriTemplate = "GetReversePaymentRecord?recid={recordID}&UserID={UserID}")]
        ReversePayment GetReversePaymentRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSecurityDepositPrint(string SNo);
    }
}
