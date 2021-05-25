using CargoFlash.Cargo.Model.Operation;
using CargoFlash.Cargo.Model.Report;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data.SqlClient;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IOperationService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetRCSData/{from}/{to}/{citycode}/{type}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<RCSData> GetRCSData(string from, string to, string citycode,string Type);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetData(String from, String to, String citycode, String Type);
       
        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<ExportFlightMonitoringModel>> GetExportData(string recid, int pageNo, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "/GetULDData/{citycode}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<DashboardULDStock> GetULDData(string citycode);
    }
}
