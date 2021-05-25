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
    #region AirCraft interface Description
    /*
	*****************************************************************************
	interface Name:		IAirCraftService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    17 Apr 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IAirCraftService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirCraftRecord?recid={RecordID}&UserSNo={UserSNo}")]
        AirCraft GetAirCraftRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirCraft")]
        List<string> SaveAirCraft(List<AirCraft> AirCraft);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirCraft")]
        List<string> UpdateAirCraft(List<AirCraft> AirCraft);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirCraft")]
        List<string> DeleteAirCraft(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftInventoryRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftInventory>> GetAirCraftInventoryRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftInventory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftInventory(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftInventory?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> deleteAirCraftInventory(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftInventoryPaxFactorRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftInventoryPaxFactor>> GetAirCraftInventoryPaxFactorRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftInventoryPaxFactor", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateAirCraftInventoryPaxFactor(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftInventoryPaxFactor?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftInventoryPaxFactor(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftDoorRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftDoor>> GetAirCraftDoorRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftDoor", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftDoor(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftDoor?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftDoor(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftULDRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftULD>> GetAirCraftULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftULD(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftULD?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftULD(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAirCraftSPHCRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftSPHC>> GetAirCraftSPHCRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateAirCraftSPHC?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> createUpdateAirCraftSPHC(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftSPHC", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftSPHC(string strData);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAirCraftSPHC?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteAirCraftSPHC(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindPassengerCapacity(string AirCraftSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdatePassengerCapacity(int AirCraftSNo, int PassengerCapacity, String BaggageWeight, int AdultMale, int AdultFemale, int Child, int Infant, int NoofBaggageImperial, int NoofBaggageBusiness, int NoofBaggagePremiumEconomy, int NoofBaggageTouristEconomy, int NoofBaggageTotal, int NoofBaggageAllowanceImperial, int NoofBaggageAllowanceBusiness, int NoofBaggageAllowancePremiumEconomy, int NoofBaggageAllowanceTouristEconomy, int NoofBaggageAllowanceTotal, int CreatedBy);

       [WebGet(UriTemplate = "BindDimensionMatrix?RecordID={RecordID}&HoldType={HoldType}&Unit={Unit}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindDimensionMatrix(string RecordID, int HoldType, int Unit);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAircraftSectorWiseCapacityRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AirCraftSectorWiseCapacity>> GetAircraftSectorWiseCapacityRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateAirCraftSectorWiseCapacity", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateAirCraftSectorWiseCapacity(string strData);
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteAirCraftSectorWiseCapacity?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> DeleteAirCraftSectorWiseCapacity(string recordID);
    }
}
