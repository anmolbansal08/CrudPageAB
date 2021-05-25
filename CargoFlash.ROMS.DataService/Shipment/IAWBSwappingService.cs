using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{


    [ServiceContract]
    public interface IAWBSwappingService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindAWBSwap(string AWBNO, string SwapAWBNO);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string AWBSwap(string AWBList, string SwapAWBList);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/AWBSwap", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
       
        string AWBSwap(string AWBList, string SwapAWBList);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetFlightRecord?recid={RecordID}&UserID={UserID}")]
        //FlightGridData GetFlightRecord(string recordID, string UserID);
    }
}
