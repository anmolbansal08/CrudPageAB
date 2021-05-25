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
using CargoFlash.Cargo.Model;
namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ICreditLimitUpdateService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCreditLimitUpdateAgentDetailsRecord(string SNo,string Flag1);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCreditLimitUpdate")]
        List<string> SaveCreditLimitUpdate(List<CreditLimitUpdate> CreditLimitUpdate);
    }

}
