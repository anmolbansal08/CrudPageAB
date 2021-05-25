using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceContract]
    public interface IUWSPendingService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetUWSPendingRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<UWSPending>> GetUWSPendingRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<UWSPending>> GetUWSPendingRecord(string recordID, int page, int pageSize, UWSPendingRequest model, string sort);



        [OperationContract]
        [WebInvoke(UriTemplate = "SearchData", ResponseFormat = WebMessageFormat.Json)]
        List<UWSPending> SearchData(UWSPending obj);


    }
}
