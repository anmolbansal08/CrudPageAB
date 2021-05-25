using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IRateAirlineMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCurrency?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCurrency(String RecordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateAirlineMasterRecord?recid={RecordID}&UserID={UserID}")]
        RateAirlineMaster GetRateAirlineMasterRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetTariffSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<TariffSlab>> GetTariffSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateAirlineMaster")]
        List<string> SaveRateAirlineMaster(List<RateAirlineMasterCollection> RateAirlineMasterCollection);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateAirlineMaster")]
        List<string> UpdateRateAirlineMaster(List<RateAirlineMasterCollection> RateAirlineMasterCollection);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateAirlineMaster")]
        List<string> DeleteRateAirlineMaster(List<string> RecordID);






    }
}
