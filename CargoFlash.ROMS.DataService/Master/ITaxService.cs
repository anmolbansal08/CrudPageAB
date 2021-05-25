using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ITaxService
    {
         
            [OperationContract]
            [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

            [OperationContract]
            [WebGet(UriTemplate = "GetTaxRecord?recid={RecordID}&UserSNo={UserSNo}")]
            Tax GetTaxRecord(string recordID, string UserSNo);

            [OperationContract]
            [WebInvoke(Method = "GET", UriTemplate = "GetTaxSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            KeyValuePair<string, List<TaxTrans>> GetTaxSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);



            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/DeleteTaxSlabRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            List<string> DeleteTaxSlabRecord(string RecordID);
         
            

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/SaveTax")]
            List<string> SaveTax(TaxPost tax);


            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/UpdateTax")]
            List<string> UpdateTax(TaxPost tax);


            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/GetCountry", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            string GetCountry(int CitySNo);


            [OperationContract]
            [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
            string GetCityInformation(string SNo);
    }
}
