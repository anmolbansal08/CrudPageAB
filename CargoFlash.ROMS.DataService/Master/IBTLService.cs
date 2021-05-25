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
using CargoFlash.Cargo.Model;


namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IBTLService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBTL")]
        List<string> SaveBTL(List<BTL> BTL);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        
        //[OperationContract]
        //[WebGet(UriTemplate = "GetBTLRecord?recid={RecordID}&UserSNo={UserSNo}")]
        //string GetBTLRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetBTLRecord(string recordID);
    }
}
