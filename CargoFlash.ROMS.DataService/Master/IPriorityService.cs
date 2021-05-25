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
    #region Priority interface Description
    /*
	*****************************************************************************
	interface Name:		IPriorityService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Shivang Srivastava.
	Created On:		    05 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IPriorityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetPriorityRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Priority GetPriorityRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SavePriority")]
        List<string> SavePriority(List<Priority> Priority);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePriority")]
        List<string> UpdatePriority(List<Priority> Priority);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeletePriority")]
        List<string> DeletePriority(List<string> RecordID);
    }
}
