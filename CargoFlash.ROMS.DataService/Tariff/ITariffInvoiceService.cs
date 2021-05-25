using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [ServiceContract]
    public interface ITariffInvoiceService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{IssueType}/{IssueSNo}/{CurrentAirportCode}/{Period}/{CurrentDate}/{AirlineAccountSNo}/{ToDate}/{InvoiceType}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string ToDate, string InvoiceType);

        [OperationContract]
        [WebGet(UriTemplate = "GetInvoiceGridData/{processName}/{moduleName}/{appName}/{IssueType}/{IssueSNo}/{CurrentAirportCode}/{Period}/{CurrentDate}/{InvoiceType}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetInvoiceGridData(string processName, string moduleName, string appName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string InvoiceType);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetTariffInvoiceAirlineGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetTariffInvoiceAgentGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string ToDate, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAirlineInvoiceGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAgentInvoiceGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ApproveInvoiceDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ApproveInvoiceDetails(int SNo);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAgentwiselastApproveDate", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]

        string GetAgentwiselastApproveDate(string AgentSno);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetInvoiceReport(string AirlineInvoiceSNo, string ProcedureName);

        //Added by deepak sharma

        [OperationContract]
        [WebGet(UriTemplate = "GetSummaryCreditInvoiceGrid/{processName}/{moduleName}/{appName}/{IssueType}/{AirlineInvoiceSNo}/{InvoiceType}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetSummaryCreditInvoiceGrid(string processName, string moduleName, string appName, string IssueType, string AirlineInvoiceSNo, string InvoiceType);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetSummaryCreditInvoiceGridData(string IssueType, string AirlineInvoiceSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetDetailsCreditInvoiceGridData(string IssueType, string AirlineInvoiceSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/CreateInvoiceData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string CreateInvoiceData(string CurrentIssueType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/ApproveInvoiceData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ApproveInvoiceData(string CurrentAirlineInvoiceSNo);

        [WebInvoke(Method = "POST", UriTemplate = "/ReGenerateInvoice", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ReGenerateInvoice(string CurrentIssueSNo, string CurrentAirlineInvoiceSNo, string Period);

        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPrintInvoice(int AirlineInvoiceSNo);
    }
}