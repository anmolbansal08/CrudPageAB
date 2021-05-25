using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region DueCarrier interface Description
    /*
	*****************************************************************************
	interface Name:		IDueCarrierService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    26 Mar 2014
    Updated By:         Brajesh Kumar
	Updated On:         29 Feb 2016
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IDueCarrierService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDueCarrierRecord?recid={RecordID}&UserID={UserID}")]
        DueCarrier GetDueCarrierRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDueCarrier")]
        List<string> SaveDueCarrier(List<DueCarrier> DueCarrier);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDueCarrier")]
        List<string> UpdateDueCarrier(List<DueCarrier> DueCarrier);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDueCarrier")]
        List<string> DeleteDueCarrier(List<string> ids);
    }
}
