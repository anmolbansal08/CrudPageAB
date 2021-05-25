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
    #region RateServiceType interface Description
    /*
	*****************************************************************************
	interface Name:		RateServiceType      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Parvez Khan
	Created On:		    5 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IRateServiceTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateServiceTypeRecord?recid={RecordID}&UserID={UserID}")]
        RateServiceType GetRateServiceTypeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateServiceType")]
        List<string> SaveRateServiceType(List<RateServiceType> RateServiceType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateServiceType")]
        List<string> UpdateRateServiceType(List<RateServiceType> RateServiceType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateServiceType")]
        List<string> DeleteRateServiceType(List<string> ids);
    }
}
