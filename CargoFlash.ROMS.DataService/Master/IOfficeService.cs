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
{   // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IOfficeService" in both code and config file together.
    [ServiceContract]
    public interface IOfficeService
    {
   


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);
         
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Office"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveOffice")]
        List<string> SaveOffice(List<Office> Office);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
       
        [OperationContract]
        [WebGet(UriTemplate = "GetOfficeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Office GetRecordOffice(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOffice")]
        List<string> UpdateOffice(List<Office> office);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteOffice")]
        List<string> DeleteOffice(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateOfficeCommision", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateOfficeCommision(string strData);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateAcceptanceVariance", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateAcceptanceVariance(string strData);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetOfficeCommisionRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OfficeCommision>> GetOfficeCommisionRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetAcceptanceVarianceRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<AcceptanceVariance>> GetAcceptanceVarianceRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteOfficeCommision?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteOfficeCommision(string recordID);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="strData"></param>
        /// <returns></returns>
       
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateOfficeAirlineTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<Tuple<string, int>> CreateUpdateOfficeAirlineTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetOfficeAirlineTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OfficeAirlineTrans>> GetOfficeAirlineTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="recordID"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteOfficeAirline?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteOfficeAirline(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetContactInformationRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OfficeContactInformation>> GetContactInformationRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateOfficeContact", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateOfficeContact(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteOfficeContact?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteOfficeContact(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteAcceptanceVariance?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteAcceptanceVariance(string recordID);



        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportInformation(string SNo);


        /* Author : chandra prakash singh 
           Modification Date  : 27/12/2016
           desc : add function GetAssociatedAirlineCount for get return row number from database
        */
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAssociatedAirlineCount(string masterTableSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetIsdCode(string masterTableSNo);

        /* Author : shahbaz akhtar 
         Modification Date  : 12/01/2017
         desc : add function GetCurrencyInformation for get return currrency from database
      */
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetCurrencyInformation(string SNo);
        /* Author :    DEVENDRA SINGH SIKARWAR
           Added on  :  01 JAN 2018
           desc : add function GetOfficeBranchRecord for get return branch from database
         */
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetofficeBranchRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<Office>> GetofficeBranchRecord(string recordID, int page, int pageSize, string whereCondition, string sort);
 
    }
}
