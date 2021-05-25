using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.ULD
{
    #region ULDRepairableItems interface Description
    /*
	*****************************************************************************
	interface Name:		IULDRepairableItemsService      
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
    public interface IULDRepairableItemsService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDRepairableItemsRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ULDRepairableItems GetULDRepairableItemsRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDRepairableItems")]
        List<string> SaveULDRepairableItems(List<ULDRepairableItems> ULDRepairableItems);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDRepairableItems")]
        List<string> UpdateULDRepairableItems(List<ULDRepairableItems> ULDRepairableItems);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDRepairableItems")]
        List<string> DeleteULDRepairableItems(List<string> RecordID);
    }
}
