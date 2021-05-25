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
    #region SLA interface Description
    /*
	*****************************************************************************
	interface Name:		ISLAService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    23 Jan 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ISLAService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSLARecord?recid={RecordID}&UserSNo={UserSNo}")]
        SLA GetSLARecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSLA")]
        List<string> SaveSLA(List<SLA> SLA);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSLA")]
        List<string> UpdateSLA(List<SLA> SLA);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSLA")]
        List<string> DeleteSLA(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveSLAData(string itemlist, String SLAType, String AirportSNo, String TerminalSNo, String AirlineSNo, string StandardName, string MovementType, string Basis, string EventSNo, string DisplayOrder, string MinimumCutOffMins, string AircraftSNo, string SHCSNo, string UpdatedBy, string SLAAirlineSno, string MessageType,string TargetPercentage);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateSLAData(string itemlist, int SLASNo, String SLAType, String AirportSNo, String TerminalSNo, String AirlineSNo, string StandardName, string MovementType, string Basis, string EventSNo, string DisplayOrder, string MinimumCutOffMins, string AircraftSNo, string SHCSNo, string UpdatedBy, string SLAAirlineSno,string MessageType, string TargetPercentage);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetSLATransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SLATrans>> GetSLATransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteSLATrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteSLATrans(string recordID);
    }
}
