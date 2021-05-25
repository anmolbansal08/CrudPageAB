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
    #region Commodity Package interface Description
    /*
	*****************************************************************************
	interface Name:		ICommodityPackageService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    22 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ICommodityPackageService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCommodityPackageRecord?recid={RecordID}&UserID={UserID}")]
        CommodityPackage GetCommodityPackageRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCommodityPackage")]
        List<string> SaveCommodityPackage(List<CommodityPackage> CommodityPackage);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCommodityPackage")]
        List<string> UpdateCommodityPackage(List<CommodityPackage> CommodityPackage);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCommodityPackage")]
        List<string> DeleteCommodityPackage(List<string> ids);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCommodityPackageTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CommodityPackageTrans>> GetCommodityPackageTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateCommodityPackageTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateCommodityPackageTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteCommodityPackageTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteCommodityPackageTrans(string recordID);
    }
}
