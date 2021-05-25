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

namespace CargoFlash.Cargo.DataService.Master
{
        [ServiceContract]
        public interface ICustomerBidService
        {
            [OperationContract]
            [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
            
            [OperationContract]
            [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest,UriTemplate="GetAuctionRecord?id={id}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            DataSourceResult GetAuctionRecord(String ID, string UserID);
            
            [OperationContract]
            [WebGet(UriTemplate = "GetCustomerBidRecord?recid={RecordID}&UserID={UserID}")]
            CustomerBid GetCustomerBidRecord(string recordID,string UserID);
            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/SaveCustomerBid")]
            List<string> SaveCustomerBid(List<CustomerBid> CustomerBid);
            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/UpdateCustomerBid")]
            List<string> UpdateCustomerBid(List<CustomerBid> CustomerBid);
            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/DeleteCustomerBid")]
            List<string> DeleteCustomerBid(List<string> listID);
        }
}
