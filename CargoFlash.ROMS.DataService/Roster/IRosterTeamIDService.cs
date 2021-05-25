using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Roster;

namespace CargoFlash.Cargo.DataService.Roster
{
    #region IrregularitySeverity interface Description
    /*
	*****************************************************************************
	interface Name:		IRosterTeamIDService   
	Purpose:		    This Service used to get details of TeamID save update and delete
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Farogh Haider
	Created On:		    27 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IRosterTeamIDService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRosterTeamIDRecord?recid={RecordID}&UserID={UserID}")]
        RosterTeamID GetRosterTeamIDRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRosterTeamID")]
        List<string> SaveRosterTeamID(List<RosterTeamID> RosterTeamID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRosterTeamID")]
        List<string> UpdateRosterTeamID(List<RosterTeamID> RosterTeamID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRosterTeamID")]
        List<string> DeleteRosterTeamID(List<string> RecordID);
    }
}
