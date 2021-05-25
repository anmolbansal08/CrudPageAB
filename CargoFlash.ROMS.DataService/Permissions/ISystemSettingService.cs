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
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [ServiceContract]
    public interface ISystemSettingService
    {
       
        [OperationContract]
        [WebGet(UriTemplate = "GetSystemSettingRecord?recid={recid}&UserID={UserID}&UserSNo={UserSNo}")]
        SystemSetting GetSystemSettingRecord(string recid, string UserID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSystemSetting")]
        List<string> UpdateSystemSetting(List<SystemSetting> SystemSetting);
    }
}
