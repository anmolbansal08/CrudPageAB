using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.BudgetReport
{

    [ServiceContract]
    public interface IBudgetReport
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetTargetBudgetGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTargetBudgetGridDataService(TargetBudget Budget);
    }
}
