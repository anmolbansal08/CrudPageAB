using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IPageCreationService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetPageCreationRecord?recid={RecordID}&UserID={UserID}")]
        PageCreation GetPageCreationRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SavePageCreation")]
        //List<string> SavePageCreation(List<PageCreation> PageCreation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdatePageCreation")]
        List<string> UpdatePageCreation(List<PageCreation> PageCreation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeletePageCreation")]
        List<string> DeletePageCreation(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTableDescRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<PageCreationTables>> GetTableDescRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetTableDescRecordEdit?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<PageCreationTables>> GetTableDescRecordEdit(string recordID, int page, int pageSize, string whereCondition, string sort);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "CreateUpdateTableDesc?App_Id={App_Id}&Name={Name}&Description={Description}&Heading={Heading}&Caption={Caption}&SubprocessSno={SubprocessSno}&ProcessSno={ProcessSno}&TableName={TableName}&SectionName={SectionName}&strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateTableDesc(string App_Id, string Name, string Description, string Heading, string Caption, string SubprocessSno, string ProcessSno, string TableName,string SectionName, string strData);

      


        [OperationContract]
        [WebGet(UriTemplate = "GetProcessTemplate/{AssemblyName}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetProcessTemplate(string AssemblyName);


    }
}
