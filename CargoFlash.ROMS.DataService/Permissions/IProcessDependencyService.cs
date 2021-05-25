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
    public interface IProcessDependencyService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportInformation(string SNo);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetProcessDependencyGridAppendGrid?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ProcessDependencyGridAppendGrid>> GetProcessDependencyGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveProcessDependency")]
        List<string> SaveProcessDependency(ProcessDependencyTransSave data);


        [OperationContract]
        [WebGet(UriTemplate = "GetProcessDependencyRecord?recid={RecordID}&UserID={UserID}")]
        ProcessDependency GetProcessDependencyRecord(string recordID, string UserID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateProcessDependency")]
        List<string> UpdateProcessDependency(ProcessDependencyTransSave data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteProcessDependency")]
        List<string> DeleteProcessDependency(List<string> RecordID);
       
    }
}
