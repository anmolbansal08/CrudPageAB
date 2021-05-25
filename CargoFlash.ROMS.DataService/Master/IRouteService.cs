using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;
namespace CargoFlash.Cargo.DataService.Master
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRouteService" in both code and config file together.
    [ServiceContract]
    public interface IRouteService
    {
        [OperationContract]

      
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

          [OperationContract]
        [WebGet(UriTemplate = "GetRouteRecord?recid={RecordID}&UserID={UserID}")]
        Route GetRouteRecord(string recordID, string UserID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRoute")]
        List<string> SaveRoute(List<Route> Route);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRoute")]
        List<string> UpdateRoute(List<Route> Route);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRoute")]
        List<string> DeleteRoute(List<string> listID);
    }
}
