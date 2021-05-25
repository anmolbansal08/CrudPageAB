using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.House;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.House
{
    [ServiceContract]
    public interface IHouseAcceptanceService
    {
        // created By manoj Kumar on 2.7.2015
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string[] GetHAWBProcess(Int32 HAWBSNo, Int32 ProcessSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string[] GetFlightChartDetails(string DailyFlightSNo);
        //end

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAcceptance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAcceptance(string HAWBNo, Int32 HAWBSNo, ShipmentInformation ShipmentInformation, List<HAWBSPHC> AwbSPHC, List<HAWBSPHCTrans> AWBSPHCTrans, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateShipperAndConsigneeInformation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateShipperAndConsigneeInformation(Int32 HAWBSNo, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOSIInfoAndHandlingMessage", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateOSIInfoAndHandlingMessage(Int32 HAWBSNo, HouseOSIInformation OSIInformation, List<HAWBHandlingMessage> HAWBHandlingMessage, List<HAWBOSIModel> HAWBOSIModel, List<HAWBOCIModel> HAWBOCIModel, Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDimemsionsAndULD", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateDimemsionsAndULD(Int32 HAWBSNo, List<Dimensions> Dimensions, List<HAWBULDTrans> AWBULDTrans,Int32 UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperAndConsigneeInformation(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetOSIInfoAndHandlingMessage(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDimemsionsAndULD(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAcceptanceInformation(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtWeighing", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtWeighing(Int32 HAWBSNo, List<HAWBGroup> lsAWBGroup, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtXRay", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtXRay(Int32 HAWBSNo, List<HAWBXRay> lsAWBXRay, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAtLocation", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAtLocation(Int32 HAWBSNo, List<HAWBLocation> lsAWBLocation,List<ULDLocation> lsULDLocation, bool ScanType, int UpdatedBy);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtXray(Int32 HAWBSNO);
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtLocation(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtWeighing(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCheckList(Int32 HAWBSNO);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCheckList", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveCheckList(Int32 HAWBSNo, List<CheckListTrans> CheckListTrans, bool XRay, string Remarks, Int32 UpdatedBy);

    
    }
}