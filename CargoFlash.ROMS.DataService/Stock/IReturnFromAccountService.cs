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
    public interface IReturnFromAccountService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [WebInvoke(UriTemplate = "/ReturnStockFromAccount", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<LeftStock> ReturnStockFromAccount(string strData, string AWBPrefix, int NoOfAWB, string StockType, int CitySNo, int OfficeSNo,int Type);

        [OperationContract]
        [WebGet(UriTemplate = "GetReturnFromAccountRecord?recid={RecordID}&UserID={UserID}")]
        StockManagement GetReturnFromAccountRecord(string recordID, string UserID);

        [WebInvoke(UriTemplate = "GetIssuedAccountStock?StockSNo={StockSNo}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetIssuedAccountStock(int StockSNo);

        [WebInvoke(UriTemplate = "/GetRecordOnReadOption", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<IssuedOfficeStock> GetRecordOnReadOption(int StockSNo); 
    }
}
