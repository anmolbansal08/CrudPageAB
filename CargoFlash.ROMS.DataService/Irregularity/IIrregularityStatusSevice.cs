using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Irregularity
{
     [ServiceContract]
    interface IIrregularityStatusSevice
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityStatusRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityStatus GetIrregularityStatusRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityStatus")]
        List<string> SaveIrregularityStatus(List<IrregularityStatus> IrregularityStatus);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityStatus")]
        List<string> UpdateIrregularityStatus(List<IrregularityStatus> IrregularityStatus);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityStatus")]
        List<string> DeleteIrregularityStatus(List<string> RecordID);
    }
}
