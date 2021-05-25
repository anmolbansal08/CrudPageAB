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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IVerifyPaymentService" in both code and config file together.
    [ServiceContract]
    public interface IVerifyPaymentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveVerifyPayment")]
        List<string> SaveVerifyPayment(List<ISVerifyPayment> Payment);

        [OperationContract]
        [WebGet(UriTemplate = "GetVerifyPaymentRecord?recid={recordID}&UserID={UserID}")]
        VerifyPayment GetVerifyPaymentRecord(int recordID, string UserID);
    }
}
