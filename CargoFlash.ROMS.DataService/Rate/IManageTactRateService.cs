using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
      [ServiceContract]
  
   public interface  IManageTactRateService
    {
          
          [OperationContract]
          [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
          DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


          [OperationContract]
          [WebInvoke(Method = "POST", UriTemplate = "/SaveManageTactRate")]
          List<string> SaveManageTactRate(List<ManageTactRate> ManageTactRate);

          [OperationContract]
          [WebInvoke(Method = "GET", UriTemplate = "GetManageTactRateRecord?recid={RecordID}&UserSNo={UserSNo}")]
          ManageTactRate GetManageTactRateRecord(string recordID, string UserSNo);

          [OperationContract]
          [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
          string GetTactRate(Int32 RateSNo);

          [OperationContract]
          [WebInvoke(Method = "POST", UriTemplate = "/UpdateManageTactRate")]
          List<string> UpdateManageTactRate(List<ManageTactRate> ManageTactRate);

          [OperationContract]
          [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
          string GetWeightRecord(string SNo);

         
    }
}
