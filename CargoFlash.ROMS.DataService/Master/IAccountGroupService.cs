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
    #region Account Group interface Description
    /*
	*****************************************************************************
	interface Name:		IAccountGroupService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    21 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IAccountGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAccountGroupRecord?recid={RecordID}&UserID={UserID}")]
        AccountGroup GetAccountGroupRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAccountGroup")]
        List<string> SaveAccountGroup(List<AccountGroup> AccountGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAccountGroup")]
        List<string> UpdateAccountGroup(List<AccountGroup> AccountGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAccountGroup")]
        List<string> DeleteAccountGroup(List<string> ids);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAccountGroupTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AccountGroupTrans>> GetAccountGroupTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAccountGroupTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAccountGroupTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAccountGroupTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAccountGroupTrans(string recordID);
    }
}
