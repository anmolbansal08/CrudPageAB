using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region RateSurchargeSPHC interface Description
    /*
	*****************************************************************************
	interface Name:		IRateSurchargeSPHCServices      
	Purpose:		    This interface used to handle RateSurchargeSPHCServices
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Parvez KHan
	Created On:		    7 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IRateSurchargeSPHCServices
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateSurchargeSPHCRecord?recid={RecordID}&UserID={UserID}")]
        RateSurchargeSPHC GetRateSurchargeSPHCRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateSurchargeSPHC")]
        List<string> SaveRateSurchargeSPHC(List<RateSurchargeSPHC> RateSurchargeSPHC);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateSurchargeSPHC")]
        List<string> UpdateRateSurchargeSPHC(List<RateSurchargeSPHC> RateSurchargeSPHC);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateSurchargeSPHC")]
        List<string> DeleteRateSurchargeSPHC(List<string> ids);
    }
}
