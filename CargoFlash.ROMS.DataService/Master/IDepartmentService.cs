using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Department interface Description
    /*
	*****************************************************************************
	interface Name:		IDepartmentService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    17 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IDepartmentService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDepartmentRecord?recid={RecordID}&UserID={UserID}")]
        Department GetDepartmentRecord(string recordID,string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDepartment")]
        List<string> SaveDepartment(List<Department> Department);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDepartment")]
        List<string> UpdateDepartment(List<Department> Department);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDepartment")]
        List<string> DeleteDepartment(List<string> RecordID);
    }
}
