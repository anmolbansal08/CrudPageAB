using CargoFlash.Cargo.Model.ImpOperation;
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
    public interface IImpOperationService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetFFMData/{from}/{to}/{citycode}/{type}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Data> GetFFMData(string from, string to, string citycode,string Type);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetData(String from, String to, String citycode, String Type);
       
        
    }
}
