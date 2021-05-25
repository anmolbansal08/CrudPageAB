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
     [ServiceContract]
    interface IManageTeamService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTeamRecord?recid={RecordID}&sort={sort}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ManageTeam>> GetTeamRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebGet(UriTemplate = "GetManageTeamRecord?recid={RecordID}&UserID={UserID}")]
        CargoFlash.Cargo.Model.Roster.ManageTeam GetManageTeamRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveTeam/{ManageTeamInfo}/{ManageTeamTrans}")]
        //List<string> SaveTeam(List<ManageTeam> ManageTeamInfo, List<ManageTeamTrans> ManageTeamTrans);

        /// <summary>
        /// Below Method used to Save Irregularity
        /// </summary>
        /// <param name="Irregularity"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST",BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveTeam(List<ManageTeam> ManageTeamInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTeam")]
        List<string> UpdateTeam(List<ManageTeam> ManageTeam);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteTeam")]
        List<string> DeleteTeam(List<string> RecordID);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetEmployeeData?TeamIDSNO={TeamIDSNO}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetEmployeeData(int TeamIDSNO);
    }
}
