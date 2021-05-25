using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.DataService.Permissions
{
     [ServiceContract]
      public interface IWindowServicesReportService
      {
         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         KeyValuePair<string, List<WindowServicesReport>> GetWindowsServiceDetails(int page, int pageSize, string whereCondition, string sort);

         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string StopWindowService(Int32 SNo);

         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         KeyValuePair<string, List<WindowProcessStatus>> GetWindowsServiceStatus(int PageNo, int pageSize, string whereCondition, string sort);

         //[OperationContract]
         //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         //DataSourceResult GetWindowsServiceStatus(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

         [OperationContract]
         [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetCountServiceFail();

      }

}
