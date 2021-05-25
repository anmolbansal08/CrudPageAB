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
    interface IIrregularityEventService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
         
          //added
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetIrregularityIncidentRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}",
        BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SubCategoryTrans>> GetIrregularityIncidentRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityEventRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityEvent GetIrregularityEventRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityEvent")]
        List<string> SaveIrregularityEvent(List<IrregularityEvent> IrregularityEvent);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityEvent")]
        List<string> UpdateIrregularityEvent(List<IrregularityEvent> IrregularityEvent);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityEvent")]
        List<string> DeleteIrregularityEvent(List<string> RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityIncidentSubCategoryRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteIrregularityIncidentSubCategoryRecord(string RecordID);
    }
}
