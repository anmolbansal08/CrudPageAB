using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Roster
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IManageRosterService" in both code and config file together.
    [ServiceContract]
    interface IManageRosterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRosterEmployee?recid={RecordID}&sort={sort}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RosterEmployeeGrid>> GetRosterEmployee(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveRoster")]
        //List<string> SaveRoster(List<ManageRoster> RosterEmployee);

   
        [OperationContract]
        [WebInvoke(UriTemplate = "/SaveRoster", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveRoster(List<ManageRoster> RosterEmployee);
    }
}
