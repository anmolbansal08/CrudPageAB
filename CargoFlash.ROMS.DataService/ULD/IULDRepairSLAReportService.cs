using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.ULD;
namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDRepairSLAReportService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ReportSLA(string FromDate, string ToDate, string ULDSNo, string AirlineName);
        //[OperationContract]
        //[WebInvoke(UriTemplate = "newFunc", ResponseFormat = WebMessageFormat.Json)]
        //List<ULDRepairSLAReport> newFunc(ULDRepairSLAReport obj);
    }
}
