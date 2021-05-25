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
    #region SlabMaster interface Description
    /*
	*****************************************************************************
	interface Name:		ISlabMasterService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    11 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ISlabMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSlabMasterRecord?recid={RecordID}&UserID={UserID}")]
        SlabMaster GetSlabMasterRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSlabMaster")]
        List<string> SaveSlabMaster(List<SlabMaster> SlabMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSlabMaster")]
        List<string> UpdateSlabMaster(List<SlabMaster> SlabMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSlabMaster")]
        List<string> DeleteSlabMaster(List<string> ids);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetDefault", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetDefault();
    }
}
