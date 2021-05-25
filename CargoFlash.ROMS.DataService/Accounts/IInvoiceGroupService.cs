using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.IO;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [ServiceContract]
    public interface IInvoiceGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);


        [OperationContract]
        [WebGet(UriTemplate = "GetInvoiceGroupRecord?recid={RecordID}&UserID={UserID}")]
        InvoiceGroup GetInvoiceGroupRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(UriTemplate = "CreateInvoiceGroup", ResponseFormat = WebMessageFormat.Json)]
        string CreateInvoiceGroup(InvoiceGroup InvoiceGroup);

        [OperationContract]
        [WebInvoke(UriTemplate = "UpdateInvoiceGroup", ResponseFormat = WebMessageFormat.Json)]
        string UpdateInvoiceGroup(InvoiceGroup InvoiceGroup);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordInvoiceGroupTrans(string SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteInvoiceGroup")]
        List<string> DeleteInvoiceGroup(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetInoviceDate_InvoiceGroup(int GroupType, int AgentAirlineSNo);
    }
}
