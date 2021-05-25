using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Accounts
{
     [ServiceContract]
    public interface IPaymentService
    {
         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetPaymentRecord?recid={RecordID}")]
        Payment GetPaymentRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePayment")]
        List<string> SavePayment(List<Payment> payment);

    }
}
