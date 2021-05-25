using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Dashboard;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Dashboard
{
    [ServiceContract]
    public interface IMainDashboardService
    {
        [OperationContract]
        [WebInvoke(UriTemplate = "GetRecord", ResponseFormat = WebMessageFormat.Json)]
        string GetRecord(MainDashboard obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetLiData", ResponseFormat = WebMessageFormat.Json)]
        string GetLiData(MainDashboard obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetTOPAgents", ResponseFormat = WebMessageFormat.Json)]
        string GetTOPAgents(MainDashboard obj);
    }
}
