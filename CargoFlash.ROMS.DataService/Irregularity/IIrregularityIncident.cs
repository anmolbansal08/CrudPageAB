using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [ServiceContract]
    public interface IIrregularityIncident
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetIrregularityIncidentRecord?recid={RecordID}&UserID={UserID}")]
        IrregularityIncident GetIrregularityIncidentRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIrregularityIncident")]
        List<string> SaveIrregularityIncident(List<IrregularityIncident> IrregularitySeverity);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIrregularityIncident")]
        List<string> UpdateIrregularityIncident(List<IrregularityIncident> IrregularityPacking);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIrregularityIncident")]
        List<string> DeleteIrregularityIncident(List<string> RecordID);


        [WebGet(UriTemplate = "/getlist/{AWBNo}", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetList(string AWBNo);
    }
}
