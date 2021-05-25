using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.EDI
{
    [ServiceContract]
    public interface IRecipientMsgConfigService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveRecipientMsgConfig(List<RecipientMsgConfigSaveTrans> RecipientMsgConfigTransInfo,List<RecipientMsgConfigSave> RecipientMsgConfigInfo);

        [OperationContract]
        [WebGet(UriTemplate = "GetRecipientMsgConfigRecord?recid={RecordID}&UserID={UserID}")]
        RecipientMsgConfig GetRecipientMsgConfigRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebGet(UriTemplate = "GetRecipientMsgConfigTransRecord?recid={RecordID}")]
        ////List<RecipientMsgConfigUpdateTrans> GetRecipientMsgConfigTransRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRecipientMsgConfigTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<RecipientMsgConfigUpdateTrans>> GetRecipientMsgConfigTransRecord(string recordID,int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateRecipientMsgConfig(List<RecipientMsgConfigUpdateTrans> RecipientMsgConfigTransInfoUpdate, List<RecipientMsgConfigSave> RecipientMsgConfigInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRecipientMsgConfig")]
       // [WebInvoke(Method = "POST", UriTemplate = "/DeleteRecipientMsgConfig", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteRecipientMsgConfig(List<string> listID);
       



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetCountry", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCountry(int CitySNo);
      

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCityInformation(string SNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportInformation(string SNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteRecipientMsgConfigTransRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteRecipientMsgConfigTransRecord(string recordID);

        [OperationContract]
        [WebInvoke( UriTemplate = "GetRecipientMsgConfigExcel?recid={RecordID}&defaultPara={Defaultpara}", ResponseFormat = WebMessageFormat.Json)]
         string GetRecipientMsgConfigExcel(string recordID, string Defaultpara);
    }
}
