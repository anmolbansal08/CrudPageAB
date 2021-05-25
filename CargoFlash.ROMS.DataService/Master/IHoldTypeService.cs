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
    public interface IHoldTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetHoldTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        HoldType GetHoldTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveHoldType")]
        List<string> SaveHoldType(HoldTypeTransSave data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateHoldType")]
        List<string> UpdateHoldType(HoldTypeTransSave data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteHoldType")]
        List<string> DeleteHoldType(List<string> RecordID);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetHoldTypeGridAppendGrid?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<HoldTypeGridAppendGrid>> GetHoldTypeGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort);

    }
}
