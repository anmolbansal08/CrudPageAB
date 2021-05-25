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
    #region AirCraftCapacity interface Description
    /*
	*****************************************************************************
	interface Name:		IAirCraftCapacityService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    06 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IAirCraftCapacityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirCraftCapacityRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AirCraftCapacity GetAirCraftCapacityRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirCraftCapacity")]
        List<string> SaveAirCraftCapacity(List<AirCraftCapacity> AirCraftCapacity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirCraftCapacity")]
        List<string> UpdateAirCraftCapacity(List<AirCraftCapacity> AirCraftCapacity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirCraftCapacity")]
        List<string> DeleteAirCraftCapacity(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftCapacityULDRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftCapacityULD>> GetAirCraftCapacityULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftCapacityULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftCapacityULD(string strData);
        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "CreateUpdateAirCraftcapacityULD?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> CreateUpdateAirCraftcapacityULD(string strData);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftCapacityULD?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftCapacityULD(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftCapacitySPHCRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftCapacitySPHC>> GetAirCraftCapacitySPHCRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftCapacitySPHC", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftCapacitySPHC(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftCapacitySPHC?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftCapacitySPHC(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftCapacityDoorRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftCapacityDoor>> GetAirCraftCapacityDoorRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftCapacityDoor", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftCapacityDoor(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftCapacityDoor?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftCapacityDoor(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindPassengerCapacity(string AirCraftCapacitySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdatePassengerCapacity(int AirCraftCapacitySNo, int PassengerCapacity, String BaggageWeight, int AdultMale, int AdultFemale, int Child, int Infant, int NoofBaggageImperial, int NoofBaggageBusiness, int NoofBaggagePremiumEconomy, int NoofBaggageTouristEconomy, int NoofBaggageTotal, int NoofBaggageAllowanceImperial, int NoofBaggageAllowanceBusiness, int NoofBaggageAllowancePremiumEconomy, int NoofBaggageAllowanceTouristEconomy, int NoofBaggageAllowanceTotal, int CreatedBy);
    }
}
