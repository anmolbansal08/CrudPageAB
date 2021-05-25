using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.DataService.Irregularity
{
    #region IrregularitNonDeliveryReason interface Description
    /*
	*****************************************************************************
	interface Name:		IIrregularityNonDeliveryReasonService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Swati Rastogi.
	Created On:		    12 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IIrregularityNonDeliveryReasonService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityNonDeliveryReasonRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityNonDeliveryReason GetIrregularityNonDeliveryReasonRecord(int recordID, string UserID);
        
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityNonDeliveryReason")]
        List<string> SaveIrregularityNonDeliveryReason(List<IrregularityNonDeliveryReason> IrregularityNonDeliveryReason);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityNonDeliveryReason")]
        List<string> UpdateIrregularityNonDeliveryReason(List<IrregularityNonDeliveryReason> IrregularityNonDeliveryReason);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityNonDeliveryReason")]
        List<string> DeleteIrregularityNonDeliveryReason(List<string> RecordID);

    }
}
