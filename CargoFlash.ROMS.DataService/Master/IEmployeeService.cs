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
    /*
	*****************************************************************************
	Class Name:		IEmployeeService
	Purpose:		This interface used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Krishan Kant Agarwal
	Created On:		19 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    [ServiceContract]
    public interface IEmployeeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetEmployeeRecord?recid={RecordID}&UserID={UserID}")]
        Employee GetEmployeeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveEmployee")]
        List<string> SaveEmployee(List<Employee> Employee);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEmployee")]
        List<string> UpdateEmployee(List<Employee> Employee);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEmployee")]
        List<string> DeleteEmployee(List<string> RecordID);
    }
}

