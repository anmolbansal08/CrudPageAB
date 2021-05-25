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
    public interface IAWBStockService
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

        //[WebInvoke(UriTemplate = "CreateStock?NoOfAWB={NoOfAWB}&StartRange={StartRange}&AWBPrefix={AWBPrefix}&AWBType={AWBType}&IsAutoAWB={IsAutoAWB}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> CreateStock(int NoOfAWB, string StartRange, string AWBPrefix, int AWBType, int IsAutoAWB);

        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBStock")]
        List<string> SaveAWBStock(List<AWBStock> AWBStock);
    }
}
