using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
   [ServiceContract]
   public interface IServiceConfigService
    {
       [OperationContract]
       [WebGet(UriTemplate = "GetServiceConfigRecord?recid={recid}&UserID={UserID}&UserSNo={UserSNo}")]
       ServiceConfigs GetServiceConfigRecord(string recid, string UserID, string UserSNo);

       [OperationContract]
       [WebInvoke(Method = "POST", UriTemplate = "/UpdateServiceConfig")]
       List<string> UpdateServiceConfig(List<ServiceConfigs> ServiceConfig);
    }
}
