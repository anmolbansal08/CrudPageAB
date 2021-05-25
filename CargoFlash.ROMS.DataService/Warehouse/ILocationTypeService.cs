using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
 

namespace CargoFlash.Cargo.DataService.Warehouse
{
    #region Location Type interface Description
    /*
	*****************************************************************************
	interface Name:		ILocationTypeService
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Santosh Gupta.
	Created On:		    16 jan 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ILocationTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetLocationTypeRecord?recid={RecordID}&UserID={UserID}")]
        LocationType GetLocationTypeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLocationType")]
        List<string> SaveLocationType(List<LocationType> LocationType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateLocationType")]
        List<string> UpdateLocationType(List<LocationType> LocationType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteLocationType")]
        List<string> DeleteLocationType(List<string> RecordID);
    }
}
