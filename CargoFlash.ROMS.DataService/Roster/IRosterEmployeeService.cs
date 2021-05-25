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
    #region Employee interface Description
    /*
	*****************************************************************************
	interface Name:		IRosterEmployee   
	Purpose:		    This Service used to get details of Employee save update and delete
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Farogh Haider
	Created On:		    02 Nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [ServiceContract]
    public interface IRosterEmployeeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRosterEmployeeRecord?recid={RecordID}&UserID={UserID}")]
        RosterEmployee GetRosterEmployeeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRosterEmployee")]
        List<string> SaveRosterEmployee(List<RosterEmployee> RosterEmployee);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRosterEmployee")]
        List<string> UpdateRosterEmployee(List<RosterEmployee> RosterEmployee);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRosterEmployee")]
        List<string> DeleteRosterEmployee(List<string> RecordID);
    }
}
