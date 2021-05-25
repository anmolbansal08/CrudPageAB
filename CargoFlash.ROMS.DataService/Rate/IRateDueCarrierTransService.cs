using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Tariff;
namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRateDueCarrierTransService" in both code and config file together.
    [ServiceContract]
    public interface IRateDueCarrierTransService
    {
        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateDueCarrierTransRecord?rateAirlineMasterSNo={rateAirlineMasterSNo}&rateType={rateType}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateDueCarrierTrans>> GetRateDueCarrierTransRecord(int rateAirlineMasterSNo, int rateType);
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetFreightType?recid={recid}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetFreightType(int recid);
     
    }
}
