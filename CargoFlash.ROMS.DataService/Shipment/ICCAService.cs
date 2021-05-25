using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;
using System.IO;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface ICCAService
    {

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetWebForm", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetWebForm(AcceptanceGetWebForm model);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCCAData(string AwbSno);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDepartedAWb(string GroupName);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateCCAAWbRecord(string SNo);



        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetChargeCodeOnAwbSno?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AWBOtherCharges>> GetChargeCodeOnAwbSno(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCCAOtherChargesRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}&AwbSNo={AwbSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AWBOtherCharges>> GetCCAOtherChargesRecord(string recordID, int page, int pageSize, string whereCondition, string sort, string AwbSNo);




        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveCCA(int SNo, List<SaveCCA> SaveCCA, string ActionType, List<SaveFlightRequestModel> SaveFlightRequestModel, List<CCACustomerTrans> CCACustomerTrans, int IsRepriceAWB, int IsUpdateAWB, int isTerminateShipment, int TerminateStation, int DestinationChange, List<DueCarrierOtherChargeCCA> dueCarrierOtherChargeCCA, List<DueAgentOtherChargeCCA> dueAgentOtherChargeCCA, int IsDueCarrierChange, int IsDueAgentChange);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAWBEDoxDetail(Int32 CCSNO, List<AWBEDoxDetail> AWBEDoxDetail, string AllEDoxReceived, string Remarks, string PriorApproval, Int32 UpdatedBy, string isFOC, string FOCTypeSNo, string FocRemarks);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAtAWBEDox(Int32 CCSNO);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFlightPlanData(int AWBSNo, int SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCharges(int SNo, List<SaveCCA> SaveCCA);

    }
}
