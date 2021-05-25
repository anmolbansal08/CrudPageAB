using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.Model.Rate;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Short Acceptance interface Description
    /*
	*****************************************************************************
	interface Name:		IShortAcceptanceService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    04 July 2017
    Updated By:    
	Updated On: 
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [ServiceContract]
    public interface IShortAcceptanceService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSearchResultData(int AcceptanceType, Int64 AWBSNo, string FlightNo, Int64 FlightOrigin, Int64 FlightDestination, string FlightDate,int AirlineSno);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveResult", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveResult(string AWBSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveShortAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveShortAcceptance(List<ShortAcceptanceData> ShortAcceptanceDataArray);
    }
}
