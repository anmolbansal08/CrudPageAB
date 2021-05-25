using CargoFlash.Cargo.Model.Export.UldTransfer;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Export.UldTransfer
{
    [ServiceContract]
    public interface IUldOutService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetUldDetails/{id}", ResponseFormat = WebMessageFormat.Json)]
        string GetUldDetails(string id);

        //[OperationContract]
        //[WebInvoke(UriTemplate = "SaveDetails", BodyStyle = WebMessageBodyStyle.Bare, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string SaveDetails(UldOut obj, List<UldOutType> UldOutType);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDetails", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveDetails(List<UldOut> UldOut, List<UldOutType> UldOutType,string Process);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UpdateDetails/{id}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateDetails(List<UldOut> UldOut, List<UldOutType> UldOutType,string Process, string id);

        //[OperationContract]
        //[WebInvoke(UriTemplate = "UpdateDetails/{id}", BodyStyle = WebMessageBodyStyle.Bare, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string UpdateDetails(UldOut obj, string id);
        [OperationContract]
        [WebGet(UriTemplate = "EditData/{id}", ResponseFormat = WebMessageFormat.Json)]
        UldOut EditData(string id);

        [OperationContract]
        [WebGet(UriTemplate = "GetPageGrid", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetPageGrid();

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetConsumablesRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ConsumableOuterGrid>> GetConsumablesRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/CreateConsumablesRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateConsumablesRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> CreateConsumablesRecord(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteConsumablesRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteConsumablesRecord(string recordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetConsumableOuterGridProcess/{sno}", ResponseFormat = WebMessageFormat.Json)]
        List<ConsumableOuterGrid> GetConsumableOuterGridProcess(string sno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDImageFileName(String ULDSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetESSRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<EssOuterGrid>> GetESSRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/CreateESSRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        [WebInvoke(Method = "POST", UriTemplate = "CreateESSRecord?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> CreateESSRecord(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteESSRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteESSRecord(string recordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetESSOuterGridProcess/{sno}", ResponseFormat = WebMessageFormat.Json)]
        List<EssOuterGrid> GetESSOuterGridProcess(string sno);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDOutESSChargesTotal(int TariffSNo, decimal PrimaryValue, decimal SecondaryValue);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetUsedULDQuantity(int ConsumablesSNo, int Quantity, int OwnerSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string AddDamageDescription(string ULDNumber);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UldNumberCheck(string Ocode, string ULDNumber, string ULDType);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string DupicateCheckUCRUHFNumber(string UCRNumber, string Type);

    }
}
