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
    public interface ICommissionService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCommission")]
        List<string> SaveCommission(List<Commission> commissionList);

        [OperationContract]
        [WebGet(UriTemplate = "GetCommissionRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Commission GetCommissionRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCommission")]
        List<string> UpdateCommission(List<Commission> commission);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCommission")]
        List<string> DeleteCommission(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCommissionTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CommissionTrans>> GetCommissionTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

    }
}
