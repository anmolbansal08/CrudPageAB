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
    #region DueCarrierSpecialHandlingTrans interface Description
    /*
	*****************************************************************************
	interface Name:		IDueCarrierSpecialHandlingTransService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    27 Mar 2014
    Updated By:         Brajesh Kumar
	Updated On:         29 Feb 2016
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IDueCarrierSpecialHandlingTransService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetDueCarrierSpecialHandlingTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<DueCarrierSpecialHandlingTrans>> GetDueCarrierSpecialHandlingTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateDueCarrierSpecialHandlingTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateDueCarrierSpecialHandlingTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteDueCarrierSpecialHandlingTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteDueCarrierSpecialHandlingTrans(string recordID);
    }
}
