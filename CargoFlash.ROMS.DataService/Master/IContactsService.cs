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
    public interface IContactsService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetContactsRecord?recid={RecordID}&UserID={UserID}")]
        Contacts GetContactsRecord(string RecordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveContacts")]
        List<string> SaveContacts(List<Contacts> Contacts);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateContacts")]
        List<string> UpdateContacts(List<Contacts> Contacts);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteContacts")]
        List<string> DeleteContacts(List<string> Contacts);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCity?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCity(String RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "CheckIsPrimary?ContactType={contactType}&ContactTypeSNo={contactTypeSNo}&Primary={primary}&SNo={Sno}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult CheckIsPrimary(string contactType, string contactTypeSNo, string primary,string Sno);

        
    }
}
