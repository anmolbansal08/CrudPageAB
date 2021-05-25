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
    #region RateSurchargeCommodityService interface Description
    /*
	*****************************************************************************
	interface Name:		IRateSurchargeCommodityService      
	Purpose:		    This interface used to handle RateSurchargeCommodityService
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
    public interface IRateSurchargeCommodityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateSurchargeCommodityRecord?recid={RecordID}&UserID={UserID}")]
        RateSurchargeCommodity GetRateSurchargeCommodityRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCommodityBySubGroupSno?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCommodityBySubGroupSno(int RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateSurchargeCommodity")]
        List<string> SaveRateSurchargeCommodity(List<RateSurchargeCommodity> RateSurchargeCommodity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateSurchargeCommodity")]
        List<string> UpdateRateSurchargeCommodity(List<RateSurchargeCommodity> RateSurchargeCommodity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateSurchargeCommodity")]
        List<string> DeleteRateSurchargeCommodity(List<string> ids);

        //DataSourceResult GetCommodityBySubGroupSno(int SubGroupSno);
    }
}
