using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Rate
{
    [ServiceContract]
    public interface IOtherChargesService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult DownloadExcelGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRemarks?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OtherChargesRemarks>> GetRemarks(int recordID, int page, int pageSize, string whereCondition, string sort);




        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OtherChargesSlabParameter>> GetRateSLAB(decimal recordID, int page, int pageSize, OtherChargesRequest model, string sort);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOtherCharges")]
        List<string> UpdateOtherCharges(List<OtherCharges> otherChargesList);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveOtherCharges")]
        List<string> SaveOtherCharges(List<OtherCharges> otherChargesList);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteOtherCharges")]
        List<string> DeleteOtherCharges(List<string> RecordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetOtherChargesRecord?recid={RecordID}&UserSNo={UserSNo}")]
        OtherCharges GetOtherChargesRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRateParameterDetails(int SNo);
    }
}
