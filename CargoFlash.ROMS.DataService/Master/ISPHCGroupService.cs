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
    #region SPHC Group interface Description
    /*
	*****************************************************************************
	interface Name:		ISPHCGroupService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    21 y 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ISPHCGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSPHCGroupRecord?recid={RecordID}&UserSNo={UserSNo}")]
        SPHCGroup GetSPHCGroupRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSPHCGroup")]
        List<string> SaveSPHCGroup(List<SPHCGroup> SPHCGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSPHCGroup")]
        List<string> UpdateSPHCGroup(List<SPHCGroup> SPHCGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSPHCGroup")]
        List<string> DeleteSPHCGroup(List<string> ids);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSPHCCodes(string Values);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetSPHCGroupTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<SPHCGroupTrans>> GetSPHCGroupTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateSPHCGroupTrans?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> createUpdateSPHCGroupTrans(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteSPHCGroupTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteSPHCGroupTrans(string recordID);
    }
}
