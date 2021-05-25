using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlash.Cargo.DataService.Stock
{
    
    [ServiceContract]
    public interface IIssueDistributedStocktoSubBranchService
    {
      

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);



        [WebInvoke(UriTemplate = "/ReturnStockFromOffice", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> ReturnStockFromOffice(string strData, string AWBPrefix, int NoOfAWB,int Type);

        [OperationContract]
        [WebGet(UriTemplate = "GetReturnToOfficeRecord?recid={RecordID}&UserID={UserID}")]
        StockManagement GetReturnToOfficeRecord(string recordID, string UserID);

        [WebInvoke(UriTemplate = "GetIssuedOfficeStock?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetIssuedOfficeStock(int StockSNo);

        [WebInvoke(UriTemplate = "IssueStocktoSubbranch?AWBPrefix={AWBPrefix}&AccountSNo={AccountSNo}&OfficeSNo={OfficeSNo}&CitySNo={CitySNo}&Remark={Remark}&NoOfAWB={NoOfAWB}&AutoRetrievalDate={AutoRetrievalDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> IssueStocktoSubbranch(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, int CitySNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate);

    }
}
