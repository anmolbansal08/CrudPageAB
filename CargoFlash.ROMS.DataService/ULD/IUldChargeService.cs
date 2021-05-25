using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.ULD
{
    [ServiceContract]
    public interface IUldChargeService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDChargeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ULD_Charge GetULDChargeRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDCharge")]
        List<string> SaveULDCharge(List<ULD_Charge> ULDCharge);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDCharge")]
        List<string> UpdateULDCharge(List<ULD_Charge> ULDCharge);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDCharge")]
        List<string> DeleteULDCharge(List<string> RecordID);

    }
}
