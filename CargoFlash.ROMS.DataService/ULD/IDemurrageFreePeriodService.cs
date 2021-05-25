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
   public interface IDemurrageFreePeriodService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


        [OperationContract]
        [WebInvoke(UriTemplate = "SaveDetails", BodyStyle = WebMessageBodyStyle.Bare, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string SaveDetails(DemurrageFreePeriod obj);

        [OperationContract]
        [WebGet(UriTemplate = "GetDemurrageFreePeriodRecord?recid={RecordID}")]
        DemurrageFreePeriod GetDemurrageFreePeriodRecord(string recordID);

        [WebInvoke(Method = "POST", UriTemplate = "UpdateDemurrageFreePeriod")]
        List<string> UpdateDemurrageFreePeriod(List<DemurrageFreePeriod> DemurrageFreePeriod);

        //[OperationContract]
        //[WebInvoke(UriTemplate = "UpdateDetails", BodyStyle = WebMessageBodyStyle.Bare, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        //string UpdateDetails(DemurrageFreePeriod obj);


        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "DeleteDemurrageFreePeriod?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> DeleteDemurrageFreePeriod(List<string> recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDemurrageFreePeriod")]
        List<string> DeleteDemurrageFreePeriod(List<string> RecordID);

    }
}
