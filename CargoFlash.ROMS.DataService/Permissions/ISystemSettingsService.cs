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
using CargoFlash.Cargo.Model.Permissions;


namespace CargoFlash.Cargo.DataService.Permissions
{

    [ServiceContract]
    public interface ISystemSettingsService
    {

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetSystemSettings?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<SystemSettings>> GetSystemSettings(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateSystemSettings")]
        //List<string> UpdateSystemSettings(string strData);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSystemSettings", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> UpdateSystemSettings(string strData);
    }

}
