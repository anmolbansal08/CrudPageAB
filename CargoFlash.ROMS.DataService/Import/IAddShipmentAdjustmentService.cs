using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Import
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAddShipmentAdjustmentService" in both code and config file together.
    [ServiceContract]
    public interface IAddShipmentAdjustmentService
    {
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);
        
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAddShipmentAdjustmentGridData(GetAddShipmentAdjustmentGridFilter model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        
        [WebInvoke(UriTemplate = "/GetGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        Stream GetGridData(AddShipmentAdjustmentSearch model);

        [WebInvoke(Method ="GET",BodyStyle =WebMessageBodyStyle.WrappedRequest,RequestFormat =WebMessageFormat.Json,ResponseFormat =WebMessageFormat.Json)]
        string GetWaybillCompleteDetail(string AWBSNo, string AWBNo, string StationSNo, string Station);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRevisedData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveRevisedData(string strData);

        [OperationContract]
        [WebGet(BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetAllStationwaybillDetails(string AWBSNo, string AWBNo);
    }
}
