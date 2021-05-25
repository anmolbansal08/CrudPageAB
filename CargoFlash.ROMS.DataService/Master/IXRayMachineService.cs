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

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IXRayMachineService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetXRayMachineRecord?recid={RecordID}&UserSNo={UserSNo}")]
        XRayMachine GetXRayMachineRecord(string recordID, string UserSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveXRayMachine")]
        List<string> SaveXRayMachine(List<XRayMachine> XRayMachine);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateXRayMachine")]
        List<string> UpdateXRayMachine(List<XRayMachine> XRayMachine);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteXRayMachine")]
        List<string> DeleteXRayMachine(List<string> RecordID);
    }
}
