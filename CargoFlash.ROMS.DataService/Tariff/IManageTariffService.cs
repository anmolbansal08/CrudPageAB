using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using CargoFlash.Cargo.Model.Tariff;

namespace CargoFlash.Cargo.DataService.Tariff
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IManageTariffService" in both code and config file together.
    [ServiceContract]
    public interface IManageTariffService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTariffBasis/{TariffSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTariffBasis(string TariffSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateType/{TariffCodeSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRateNChargeType(string TariffCodeSNo);

        [OperationContract]
        [WebGet(UriTemplate = "GetManageTariffRecord?recid={RecordID}&UserID={UserID}")]
        ManageTariff GetManageTariffRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTariffSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<TariffSlab>> GetTariffSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRevenueSharingSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RevenueSharingSlab>> GetRevenueSharingSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(UriTemplate = "/SaveAndUpdateManageTariff", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveAndUpdateManageTariff(List<SaveManageTariff> ManageTariff);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteManageTariff")]
        List<string> DeleteManageTariff(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteManageTariffSlab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteManageTariffSlab(string RecordID);
        
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRevenueSharingSlab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteRevenueSharingSlab(string RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetSHCForShipmentType(string SHCValue);
    }
}
