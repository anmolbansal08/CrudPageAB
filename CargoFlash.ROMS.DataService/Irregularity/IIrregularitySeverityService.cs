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
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    #region IrregularitySeverity interface Description
    /*
	*****************************************************************************
	interface Name:		IIrregularitySeverityService   
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
    public interface IIrregularitySeverityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularitySeverityRecord?recid={RecordID}&UserID={UserID}")]
        IrregularitySeverity GetIrregularitySeverityRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularitySeverity")]
        List<string> SaveIrregularitySeverity(List<IrregularitySeverity> IrregularitySeverity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularitySeverity")]
        List<string> UpdateIrregularitySeverity(List<IrregularitySeverity> IrregularitySeverity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularitySeverity")]
        List<string> DeleteIrregularitySeverity(List<string> RecordID);

    }
}
