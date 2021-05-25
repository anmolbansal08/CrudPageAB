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
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    #region LocationSubType interface Description
    /*
	*****************************************************************************
	interface Name:		ILocationSubTypeService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Swati Rastogi.
	Created On:		    08 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ILocationSubTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetLocationSubTypeRecord?recid={RecordID}&UserID={UserID}")]
        LocationSubType GetLocationSubTypeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLocationSubType")]
        List<string> SaveLocationSubType(List<LocationSubType> LocationSubType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateLocationSubType")]
        List<string> UpdateLocationSubType(List<LocationSubType> LocationSubType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteLocationSubType")]
        List<string> DeleteLocationSubType(List<string> RecordID);

    }
}
