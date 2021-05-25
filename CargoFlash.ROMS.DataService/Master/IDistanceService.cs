using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
//using KLAS.Business;
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
    [ServiceContract]
    public  interface IDistanceService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDistance")]
        List<string> SaveDistance(List<Distance> Distance);

        [OperationContract]
        [WebGet(UriTemplate = "GetDistanceRecord?recid={RecordID}&UserID={UserID}")]
        Distance GetDistanceRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDistance")]
        List<string> UpdateDistance(List<Distance> Distance);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDistance")]
        List<string> DeleteDistance(List<string> listID);
    }
}
