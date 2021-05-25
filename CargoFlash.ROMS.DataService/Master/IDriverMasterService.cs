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
    public interface IDriverMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDriverMasterRecord?recid={RecordID}&UserSNo={UserSNo}")]
        DriverMaster GetDriverMasterRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDriverMaster")]
        List<string> SaveDriverMaster(List<DriverMaster> DriverMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDriverMaster")]
        List<string> UpdateDriverMaster(List<DriverMaster> DriverMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDriverMaster")]
        List<string> DeleteDriverMaster(List<string> RecordID);
    }

     
}
