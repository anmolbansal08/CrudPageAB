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
    interface IIrregularityDisposalAdviceService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityDisposalAdviceRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityDisposalAdvice GetIrregularityDisposalAdviceRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityDisposalAdvice")]
        List<string> SaveIrregularityDisposalAdvice(List<IrregularityDisposalAdvice> IrregularityDisposalAdvice);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityDisposalAdvice")]
        List<string> UpdateIrregularityDisposalAdvice(List<IrregularityDisposalAdvice> IrregularityDisposalAdvice);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityDisposalAdvice")]
        List<string> DeleteIrregularityDisposalAdvice(List<string> RecordID);
    }
}
