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
    #region IrregularityPacking interface Description
    /*
	*****************************************************************************
	interface Name:		IIrregularityPackingService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Santosh Gupta
	Created On:		    9 oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
   public interface IIrregularityRecuperationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityRecuperationRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityRecuperation GetIrregularityRecuperationRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityRecuperation")]
        List<string> SaveIrregularityRecuperation(List<IrregularityRecuperation> IrregularityPacking);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityRecuperation")]
        List<string> UpdateIrregularityRecuperation(List<IrregularityRecuperation> IrregularityPacking);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityRecuperation")]
        List<string> DeleteIrregularityRecuperation(List<string> RecordID);
    }
}
