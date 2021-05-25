using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [ServiceContract]
    public interface IIssueConsumablesService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetIssueConsumablesRecord?recid={RecordID}")]
        IssueConsumables GetIssueConsumablesRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "ViewGrid?recid={RecordID}&sort={sort}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IssueConsumables>> ViewGrid(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIssueConsumables")]
        List<string> SaveIssueConsumables(List<IssueConsumablesList> IssueConsumables);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateIssueConsumables")]
        //List<string> UpdateIssueConsumables(List<IssueConsumables> IssueConsumables);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIssueConsumables")]
        List<string> DeleteIssueConsumables(List<string> RecordID);




        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetConsumableIssueStockRecord(int ConsumableSno, int NoOfItems);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateIssueConsumables", ResponseFormat = WebMessageFormat.Json)]
        string CreateIssueConsumables(List<IssueConsumablesList> lstConsumabIssue);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetIssueConsumablesTransRecord(int ConsumableSno);




    }
}
