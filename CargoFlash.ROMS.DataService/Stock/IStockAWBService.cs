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
    [ServiceContract]
    public interface IStockAWBService
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

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //[WebInvoke(Method = "POST", UriTemplate = "/CreateStock")]
        List<StockCollection> CreateStock(List<AwbNo> AwbList, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, string ExpiryDate);

        //[WebInvoke(UriTemplate = "CreateStock?strData={strData}&AWBPrefix={AWBPrefix}&AWBType={AWBType}&IsAutoAWB={IsAutoAWB}&CountryCode={CountryCode}&ExpiryDate={ExpiryDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<StockCollection> CreateStock(string strData, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate);

        [WebInvoke(UriTemplate = "/IssueStock", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssueStockOfficeCollection> IssueStock(string strData, string AWBPrefix, int CitySNo, int OfficeSNo, string Remark, int NoOfAWB);

        [WebInvoke(UriTemplate = "/IssueStocktoAgent?AWBPrefix={AWBPrefix}&AccountSNo={AccountSNo}&OfficeSNo={OfficeSNo}&Remark={Remark}&NoOfAWB={NoOfAWB}&AutoRetrievalDate={AutoRetrievalDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssueStockOfficeCollection> IssueStocktoAgent(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate);

        [OperationContract]
        [WebGet(UriTemplate = "GetStockManagementRecord?recid={RecordID}&UserID={UserID}")]
        StockManagement GetStockManagementRecord(string recordID, string UserID);

        [WebInvoke(UriTemplate = "GetReIssue?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssuedOfficeStock> GetReIssue(int StockSNo);

        [WebInvoke(UriTemplate = "GetIssuedOfficeStock?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssuedOfficeStock> GetIssuedOfficeStock(int StockSNo);

        [WebInvoke(Method = "POST", UriTemplate = "/GetIssueStock?AWBType={AWBType}&IsAutoAWB={IsAutoAWB}&CitySNo={CitySNo}&OfficeSNo={OfficeSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> GetIssueStock(string AWBPrefix, int AWBType, int IsAutoAWB, int CitySNo, int OfficeSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCityofficeInformation(string CitySNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Getofficelist(string OfficeSNo);

        //added for check stock by anmol
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCheckStockAwb(string AwbNo);
        //end

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CountAlreadyIssuedStock(string AWBPrefix, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string CountAlreadyIssuedStockForAccount(string AWBPrefix, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition);
       
    }
}
