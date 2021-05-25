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
    public interface IApplicationEntityValueListService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetApplicationEntityValueListRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ApplicationEntity>> GetApplicationEntityValueListRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteApplicationEntityValueListRecord?recid={RecordID}",BodyStyle=WebMessageBodyStyle.WrappedRequest,ResponseFormat=WebMessageFormat.Json,RequestFormat=WebMessageFormat.Json)]
        List<string> DeleteApplicationEntityValueListRecord(string RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateApplicationEntityValueListRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> createUpdateApplicationEntityValueListRecord(string strData);
    }
}
