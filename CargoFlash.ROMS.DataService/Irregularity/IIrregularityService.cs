using System.Collections.Generic;
using System.Data;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.IO;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IIrregularityService" in both code and config file together.
    [ServiceContract]
    public interface IIrregularityService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAWBDetail?AWBNo={AWBNo}&Type={Type}&IrregularityType={IrregularityType}&DailyFlightSNo={DailyFlightSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBDetail(string AWBNo, int Type, string IrregularityType, int DailyFlightSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetAWBRoute/{IrregularitySNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBRoute(string IrregularitySNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityRecord?recid={RecordID}&UserID={UserID}")]
        CargoFlash.Cargo.Model.Irregularity.Irregularity GetIrregularityRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IrregularityTrans>> GetIrregularityTransRecord(string recid, int pageNo, int pageSize, IrregularityCreate model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> UpdateIrregularityTrans(string strData);
        /// <summary>
        /// added by tarun k singh
        /// 13-01-2018
        /// to update irregularity response record
        /// </summary>
        /// <param name="strData"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityResponseRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> UpdateIrregularityResponseRecord(string strData);

        /// <summary>
        /// Below Method used to Save Irregularity
        /// </summary>
        /// <param name="Irregularity"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularity", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveIrregularity(string ReportingStation, string IncidentCategory, string IsAWBLabel, string AWBNo, string POMailSNo, string strData, string Type, string strData1, string AirportSNo, string DailyFlightSNo, string IncidentSubCategorySNo);
        //?ReportingStation={ReportingStation}&IncidentCategory={IncidentCategory}&IsAWBLabel={IsAWBLabel}&AWBNo={AWBNo}&strData={strData}&Type={Type}

        /// <summary>
        /// Below Method used to Send Message
        /// </summary>
        /// <param name="Irregularity"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SendMessage?IrregularitySNo={IrregularitySNo}&Message={Message}&Email={Email}&AssignTo={AssignTo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SendMessage(string IrregularitySNo, string Message, string Email, string AssignTo);

        /// <summary>
        /// Below Method used to Update Status
        /// </summary>
        /// <param name="Irregularity"></param>
        /// <returns></returns>
        /// 

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SendMailNND?IrregularitySNo={IrregularitySNo}&TabCount={TabCount}&TableID={TableID}&Email={Email}&DeliveryOrderFee={DeliveryOrderFee}&HandlingCharges={HandlingCharges}&StorageCharges={StorageCharges}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SendMailNND(string IrregularitySNo, string TabCount, string TableID, string Email, Decimal DeliveryOrderFee, Decimal HandlingCharges, Decimal StorageCharges);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UpdateStatus?IrregularitySNo={IrregularitySNo}&Status={Status}&Remarks={Remarks}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateStatus(string IrregularitySNo, string Status, string Remarks);

        [OperationContract]
        [WebGet(UriTemplate = "GetTracingDetail/{IrregularitySNo}/{usersno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTracingDetail(string IrregularitySNo, string usersno);

        [OperationContract]
        [WebGet(UriTemplate = "GetHistory?IrregularitySNo={IrregularitySNo}&IrregularityType={IrregularityType}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHistory(int IrregularitySNo, string IrregularityType);

        [OperationContract]
        [WebGet(UriTemplate = "GetImageFromDB?IrregularitySNo={IrregularitySNo}&IrregularityTransSNo={IrregularityTransSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetImageFromDB(int IrregularitySNo, int IrregularityTransSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IrregularityTransDimension>> GetIrregularityTransDimensionRecord(string recordID, int page, int pageSize, IrregularityRequest model, string sort);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<IrregularityResponse>> GetIrregularityResponseRecord(string recordID, int page, int pageSize, IrregularityResponseRequest model, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityTransDimension", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateIrregularityTransDimension(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteIrregularityTransDimension?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteIrregularityTransDimension(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/Blank", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> Blank(string strData);

        [OperationContract]
        [WebGet(UriTemplate = "GetHistoryDetails?ISNo={ISNo}&ActionSNo={ActionSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHistoryDetails(int ISNo, int ActionSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetAWBDimDetails?AWBSNo={AWBSNo}&typeID={typeID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBDimDetails(int AWBSNo, int typeID);

        [OperationContract]
        [WebGet(UriTemplate = "CheckAWBInOFLD?IrregularitySNo={IrregularitySNo}&IrregularityTransSNo={IrregularityTransSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckAWBInOFLD(int IrregularitySNo, int IrregularityTransSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SaveAction?IrregularitySNo={IrregularitySNo}&IrregularityTransSNo={IrregularityTransSNo}&Action={Action}&PackageCondition={PackageCondition}&Remarks={Remarks}&AWBNo={AWBNo}&Type={Type}&CityCode={CityCode}&CitySNo={CitySNo}&UserSNo={UserSNo}&Pieces={Pieces}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveAction(int IrregularitySNo, int IrregularityTransSNo, int Action, string PackageCondition, string Remarks, string AWBNo, string Type, string CityCode, int CitySNo, int UserSNo, int Pieces);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "SaveUDLDAction?IrregularitySNo={IrregularitySNo}&IrregularityTransSNo={IrregularityTransSNo}&DisposalAdvice={DisposalAdvice}&DestructionDate={DestructionDate}&AuctionDate={AuctionDate}&Remarks={Remarks}&AWBNo={AWBNo}&Type={Type}&CityCode={CityCode}&CitySNo={CitySNo}&UserSNo={UserSNo}&Pieces={Pieces}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveUDLDAction(int IrregularitySNo, int IrregularityTransSNo, string DisposalAdvice, string DestructionDate, string AuctionDate, string Remarks, string AWBNo, string Type, string CityCode, int CitySNo, int UserSNo, int Pieces);

        [OperationContract]
        [WebGet(UriTemplate = "GetActionDetails?IrregularitySNo={IrregularitySNo}&IrregularityTransSNo={IrregularityTransSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetActionDetails(int IrregularitySNo, int IrregularityTransSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetNNDPrint?ISNo={ISNo}&AWBNo={AWBNo}&MovementType={MovementType}&CityCode={CityCode}&TerminalSNo={TerminalSNo}&TabCount={TabCount}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetNNDPrint(int ISNo, string AWBNo, int MovementType, string CityCode, int TerminalSNo, string TabCount);

        [OperationContract]
        [WebGet(UriTemplate = "GetHAWBPcs?SNo={SNo}&MovementTypeSNo={MovementTypeSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetHAWBPcs(int SNo, string MovementTypeSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveActionNew", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveActionNew(List<SaveActionNew> SaveData);

        [OperationContract]
        [WebGet(UriTemplate = "GetActionHistory/{IrregularitySNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetActionHistory(string IrregularitySNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetAwbNoForAction/{IrregularitySNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAwbNoForAction(string IrregularitySNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetSeggrigateOrNot/{AWBSNo}/{DailyFlightSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSeggrigateOrNot(string AWBSNo, string DailyFlightSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightDetailSSPD?AWBSNo={AWBSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightDetailSSPD(string AWBSNo);
        
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularity")]
        List<string> DeleteIrregularity(List<string> RecordID);
        
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCarrierSurveyReportFormPrintForIrrg(string IrregularitySNo,int incidentctg);
    }
}
