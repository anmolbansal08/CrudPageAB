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
using CargoFlash.Cargo.Model.ULD;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDRepairService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Stream GetGridData(ULDRepairConditionModel modal);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetULDRepairGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetULDRepairGridData(GetULDRepairGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessSequence(string ProcessName);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckContainer(string ULDSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDRepairableItem?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDRepairItem>> GetULDRepairableItem(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDRepair", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveULDRepair(string ULDSNo, string Repair, string MaintenanceType, string ULDVendor, string AuthorizedPerson, string AirportSNo, string strData, string TypeOfAdditionalMaintenance);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDRepairInformation(string ULDRepairSNo, string PageType);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFetchUldRepairableItem?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDRepairItem>> GetFetchUldRepairableItem(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDRepair", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateULDRepair(string ULDSNo, string Repair, string MaintenanceType, string ULDVendor, string AuthorizedPerson, string AirportSNo, string ULDRepairSNo, string strData, string TypeOfAdditionalMaintenance);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateQuoteULDRepair", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateQuoteULDRepair(string MaterialCost, string ManhoursCost, string AirportSNo, string ULDRepairSNo, string AlertMailCostApproval, List<ULDRepairItem> ULDRepairItem, string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateApprovedULDRepair", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateApprovedULDRepair(string Approved, string Remarks, string AirportSNo, string ULDRepairSNo,string AlertEmail, List<ULDRepairItem> ULDRepairItem, List<ULDRepairMainCostItem> ULDRepairMainHourItem);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateReturnULDRepair", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string UpdateReturnULDRepair(string Repaired, string ReturnRemarks, string Serviceable, string AirportSNo, string ULDRepairSNo, string ULDRepairReturnImage, string ULDRepairReturnInvoice, string Invoice, string Date);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetQuoteHistory(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDRepairPrintRecord(int ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDRepairVE(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetInvoiceCheck(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetApproveCheck(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetDescription(string PartNumber);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetPrice(string PartNumber);


        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetManHoursCost(string MaintenanceType, string VendorId);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetManHoursCost(int ULDRepairSNo);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFetchUldRepairableItemApproval?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDRepairItem>> GetFetchUldRepairableItemApproval(string recordID, int page, int pageSize, string whereCondition, string sort);
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDRepairableItemQuotation?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDRepairItem>> GetULDRepairableItemQuotation(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetULDRepairPrintRecordApproval(string ULDRepairSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ULDReapirScrapCheck(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]

        string ULDQuoteCheck(string ULDRepairSNo);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string InvoiceDateCheck(string Date);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetMainCostHistory(string ULDRepairSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFetchUldRepairMainCostApproval?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDRepairMainCost>> GetFetchUldRepairMainCostApproval(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteULDRepairableItemQuotation?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteULDRepairableItemQuotation(string recordID);
    }
}
