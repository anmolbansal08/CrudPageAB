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
    public interface IRateSurchargeService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateSurcharge")]
        List<string> SaveAndUpdateRateSurcharge(List<RateSurcharge> RateSurcharge);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateSurchargeRecord?recid={RecordID}&UserID={UserID}")]
        RateSurcharge GetRateSurchargeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRateSurchargeSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RateSurchargeSlab>> GetRateSurchargeSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateSurchargeSlab?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteRateSurchargeSlab(string RecordID);

    }
}
