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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IOfficeTarget" in both code and config file together.
    [ServiceContract]
    public interface IOfficeTargetService
    {

        /// <summary>
        ///Below Method used for Get Record of Office target for main Grid 
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetOfficeTargetRecord?recid={RecordID}&UserID={UserID}")]
        OfficeTarget GetOfficeTargetRecord(string recordID, string UserID);

        /// <summary>
        /// Below Method used to Save Office Target
        /// </summary>
        /// <param name="OfficeTarget"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveOfficeTarget")]
        List<string> SaveOfficeTarget(List<OfficeTarget> OfficeTarget);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="officeTarget"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOfficeTarget")]
        List<string> UpdateOfficeTarget(List<OfficeTarget> officeTarget);
        
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateOfficeTargetCommTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateOfficeTargetCommTrans(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetOfficeTargetCommTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OfficeTargetCommTrans>> GetOfficeTargetCommTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteOfficeTargetCommTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteOfficeTargetCommTrans(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetOfficeTargetPenaltyTransRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<OfficeTargetPenaltyTrans>> GetOfficeTargetPenaltyTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/CreateUpdateOfficeTargetPenaltyTrans", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> CreateUpdateOfficeTargetPenaltyTrans(string strData);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DeleteOfficeTargetPenaltyTrans?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> DeleteOfficeTargetPenaltyTrans(string recordID);
    }
}
