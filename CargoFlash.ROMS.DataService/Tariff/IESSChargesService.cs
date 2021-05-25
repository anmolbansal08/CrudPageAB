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
using System.IO;
//using CargoFlash.Cargo.Model.Import;

namespace CargoFlash.Cargo.DataService.Tariff
{

    [ServiceContract]
    public interface IESSChargesService
    {


        [OperationContract]
        [WebInvoke(UriTemplate = "CreateESSCharges", ResponseFormat = WebMessageFormat.Json)]
        string CreateESSCharges(ESSCharges obj);

        [OperationContract]
      
        [WebInvoke(Method = "POST", UriTemplate = "/SaveHawbEssAWBNo_Information", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]

        string SaveHawbEssAWBNo_Information(string strData);
        [OperationContract]
        [WebInvoke(UriTemplate = "GetESSChargesTotal", ResponseFormat = WebMessageFormat.Json)]
        string GetESSChargesTotal(ESSCharges obj);

        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke(UriTemplate = "CheckCreditLimit", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckCreditLimit(string BillToSNo, string total);

        [OperationContract]
        [WebInvoke(UriTemplate = "CheckWalkIn", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckWalkIn(string Sno, string type);

        [OperationContract]
        [WebInvoke(UriTemplate = "CreateCTMCharges", ResponseFormat = WebMessageFormat.Json)]
        string CreateCTMCharges(CTMCharges obj);

        [OperationContract]
        [WebInvoke(UriTemplate = "GetAWBWeight", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBWeight(string Sno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CTMGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int FlightSNo = 0, int CTMSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCTMSMendatoryCharges(int AWBSNo, int FlightSNo, int CTMSNo, string CityCode, int ProcessSNo, int SubProcessSNo, int ArrivedShipmentSNo, int RateType, decimal GrWt, decimal ChWt, int Pieces);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCTMSMendatoryChargesForFC(int AWBSNo, int CTMSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetExportESSHandlingCharges(Int32 AWBSNO, Int32 HAWBSNo, decimal GrWT,  decimal ChWt, int Pieces);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCharges_Ess_Import", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCharges_Ess_Import(int TariffSNo, int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, decimal pValue, decimal sValue, int Pieces, int DOSNo, int PDSNo, List<DOShipmentInfo> lstShipmentInfo, String Remarks, int POMailSNo);
        

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetLUCSMendatoryCharges(int SNo, string CityCode, int ProcessSNo, int SubProcessSNo, int ArrivedShipmentSNo, int RateType, decimal GrWt, decimal ChWt, int Pieces);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string LUCGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int FlightSNo = 0, int CTMSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0);

        [OperationContract]
        [WebInvoke(UriTemplate = "CreateLUCESSCharges", ResponseFormat = WebMessageFormat.Json)]
        string CreateLUCESSCharges(LUCCharges obj);



        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetMISCChargeSNo(int SNo);


        [OperationContract]
        [WebGet(UriTemplate = "GetULDCharges/{SNo}", BodyStyle = WebMessageBodyStyle.Bare, ResponseFormat = WebMessageFormat.Json)]
        string GetULDCharges(string SNo);


        [OperationContract]
        [WebInvoke(UriTemplate = "GetEssAWBNo_Information", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEssAWBNo_Information(string AWBNo, string FlightNO, string movetype);


        [OperationContract]
        [WebInvoke(UriTemplate = "GetEssHouseAWBNo_Information", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEssHouseAWBNo_Information(string AWBNo, string FlightNO, string movetype);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateAWBSummary", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CreateAWBSummary(List<AWBSummaryArray> Summary, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, string shipperconsignee);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckIsAWBUsable(string AWBNo, string Mtype);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHouseAWB(string AWBNo, string Mtype);

    }
}