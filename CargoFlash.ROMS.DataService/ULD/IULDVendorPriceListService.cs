using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IULDVendorPriceListService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDVendorPriceListRecord?recid={RecordID}")]
        VendorPriceList GetULDVendorPriceListRecord(string recordID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDVendorPriceList")]
        List<string> SaveULDVendorPriceList(List<VendorPriceList> VendorPriceList);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDVendorPriceList")]
        List<string> DeleteULDVendorPriceList(List<string> RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDVendorPriceList")]
        List<string> UpdateULDVendorPriceList(List<VendorPriceList> VendorPriceList);

        [OperationContract]
        [WebGet(UriTemplate = "SelectVendor/{CustomerSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        SelectVendor SelectVendor(string CustomerSNo);

    }
}
