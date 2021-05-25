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
    #region WarehouseLocation interface Description
    /*
	*****************************************************************************
	interface Name:		IWarehouseLocationService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Swati Rastogi.
	Created On:		    06 Nov 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IWarehouseLocationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetWarehouseLocationRecord?recid={RecordID}&UserID={UserID}")]
        WarehouseLocation GetWarehouseLocationRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveWarehouseLocation")]
        List<string> SaveWarehouseLocation(List<WarehouseLocation> WarehouseLocation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateWarehouseLocation")]
        List<string> UpdateWarehouseLocation(List<WarehouseLocation> WarehouseLocation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteWarehouseLocation")]
        List<string> DeleteWarehouseLocation(List<string> RecordID);

    }
}
