using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Stock;

namespace CargoFlash.Cargo.DataService.Stock
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IStockManagementService" in both code and config file together.
    [ServiceContract]
    public interface IStockManagementService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetMaxAWBNumber?AWBPrefix={AWBPrefix}&AWBType={AWBType}&IsAutoAWB={IsAutoAWB}&CountryCode={CountryCode}&ExpiryDate={ExpiryDate}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetMaxAWBNumber(String AWBPrefix, String AWBType, String IsAutoAWB, string CountryCode, DateTime ExpiryDate);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GenerateStock?AWBPrefix={AWBPrefix}&AWBType={AWBType}&IsAutoAWB={IsAutoAWB}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GenerateStock(String AWBPrefix, String AWBType, String IsAutoAWB);

        [WebInvoke(UriTemplate = "CreateStock?AWBPrefix={AWBPrefix}&AWBType={AWBType}&IsAutoAWB={IsAutoAWB}&CountryCode={CountryCode}&ExpiryDate={ExpiryDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<StockCollection> CreateStock(string strData, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate);

        [WebInvoke(UriTemplate = "IssueStock?AWBPrefix={AWBPrefix}&CitySNo={CitySNo}&OfficeSNo={OfficeSNo}&Remark={Remark}&NoOfAWB={NoOfAWB}&AutoRetrievalDate={AutoRetrievalDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> IssueStock(string strData, string AWBPrefix, int CitySNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate);

        [WebInvoke(UriTemplate = "IssueStocktoAgent?AWBPrefix={AWBPrefix}&AccountSNo={AccountSNo}&OfficeSNo={OfficeSNo}&Remark={Remark}&NoOfAWB={NoOfAWB}&AutoRetrievalDate={AutoRetrievalDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> IssueStocktoAgent(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate);

        [OperationContract]
        [WebGet(UriTemplate = "GetStockManagementRecord?recid={RecordID}&UserID={UserID}")]
        StockManagement GetStockManagementRecord(string recordID, string UserID);

        [WebInvoke(UriTemplate = "GetReIssue?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> GetReIssue(int StockSNo);

        [WebInvoke(UriTemplate = "GetIssuedOfficeStock?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssuedOfficeStock> GetIssuedOfficeStock(int StockSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCityofficeInformation(string CitySNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CountAlreadyIssuedStock(string StockSNo, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Getofficelist(string OfficeSNo);


    }
}
