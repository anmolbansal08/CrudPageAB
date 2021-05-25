using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [ServiceContract]
    public interface IPageRightsService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetChildGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetPageRightsRecord?recid={RecordID}")]
        PageRights GetPageRightsRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePageRights")]
        void SavePageRights(List<PageRights> pageRights);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePageRights")]
        void UpdatePageRights(List<PageRights> pageRights);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeletePageRights")]
        void DeletePageRights(int RecordID);
    }
}
