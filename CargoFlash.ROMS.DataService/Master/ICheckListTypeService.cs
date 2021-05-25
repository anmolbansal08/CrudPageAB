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

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ICheckListTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCheckListType")]
        List<string> SaveCheckListType(List<CheckListType> CheckListType);

        [OperationContract]
        [WebGet(UriTemplate = "GetCheckListTypeRecord?recid={RecordID}&UserID={UserID}")]
        CheckListType GetCheckListTypeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCheckListTypeAppendGrid?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CheckListTypeAppend>> GetCheckListTypeAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCheckListTypeHeader", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveCheckListTypeHeader(List<CheckListTypeAppend> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCheckListType", RequestFormat = WebMessageFormat.Xml, ResponseFormat = WebMessageFormat.Xml)]
        List<string> UpdateCheckListType(List<CheckListType> CheckListType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCheckListTypeHeader", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateCheckListTypeHeader(List<CheckListTypeAppend> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCheckListDetail", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveCheckListDetail(List<CheckListDetail> data);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCheckListDetail?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CheckListDetail>> GetCheckListDetail(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCheckListDetail", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateCheckListDetail(List<CheckListDetail> data);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCheckListTypeHeader?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteCheckListTypeHeader(string RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCheckListDetail?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteCheckListDetail(string RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCheckListType")]
        List<string> DeleteCheckListType(List<string> RecordID);


        [OperationContract]
        [WebInvoke(UriTemplate = "SaveCheckListTypenew", ResponseFormat = WebMessageFormat.Json)]
        string SaveCheckListTypenew(List<CheckListType> CheckListType);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetColumnName(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string getExistsRecord(string SphcSno, string SphcCode, string Name);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateCheckListHeader?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> createUpdateCheckListHeader(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteCheckListHeader?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> deleteCheckListHeader(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateCheckListDetail?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> createUpdateCheckListDetail(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteCheckListDetail?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<Tuple<string, int>> deleteCheckListDetail(string recordID);
    }
}
