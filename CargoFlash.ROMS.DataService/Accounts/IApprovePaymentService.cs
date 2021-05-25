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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IApprovePaymentService" in both code and config file together.
    [ServiceContract]
    public interface IApprovePaymentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveApprovePayment")]
        List<string> SaveApprovePayment(List<ISApprovePayment> Payment);

        [OperationContract]
        [WebGet(UriTemplate = "GetApprovePaymentRecord?recid={recordID}&UserID={UserID}")]
        ApprovePayment GetApprovePaymentRecord(int recordID, string UserID);
    }
}
