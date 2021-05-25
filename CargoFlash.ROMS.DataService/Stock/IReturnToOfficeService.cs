using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Stock
{
    [ServiceContract]
    public interface IReturnToOfficeService
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


        //[WebInvoke(UriTemplate = "IssueStocktoAgent?strData={strData}&AWBPrefix={AWBPrefix}&AccountSNo={AccountSNo}&OfficeSNo={OfficeSNo}&Remark={Remark}&NoOfAWB={NoOfAWB}&AutoRetrievalDate={AutoRetrievalDate}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<IssueStockOfficeCollection> IssueStocktoAgent(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate);

    }
}
