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


namespace CargoFlash.Cargo.DataService.ULD
{
     [ServiceContract]
    public interface IULDInvoiceService
    {
         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


         [OperationContract]
         [WebInvoke(Method = "GET", UriTemplate = "ULDInvoiceGridAppendGrid?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGrid(string recordID);

         [OperationContract]
         [WebInvoke(Method = "GET", UriTemplate = "ULDInvoiceGridAppendGridForInvoice?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGridForInvoice(string recordID);

         //[OperationContract]
         //[WebInvoke(Method = "GET", UriTemplate = "ULDInvoiceGridAppendGridForInvoiceForPrint?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         //KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGridForInvoiceForPrint(string recordID);


         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string ULDInvoiceGridAppendGridForInvoiceForPrint(string recordID);
        // KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGridForInvoiceForPrint(string recordID);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string SaveULDInvoice(List<ULDInvoice> ULDInvoice);


         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string InvoiceGetAgreementNumber(string recordID);

    }    
}
