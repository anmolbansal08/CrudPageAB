using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.SpaceControl;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.SpaceControl
{

    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAWBQueueManagement" in both code and config file together.
    [ServiceContract]
    public interface IAWBQueueManagementService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBQueueManagement")]
        List<string> SaveAWBQueueManagement(List<AWBQueueManagement> awbQueueManagement);

       
        [OperationContract]
        [WebGet(UriTemplate = "GetAWBQueueManagementRecord?recid={RecordID}&UserID={UserID}")]
        AWBQueueManagement GetAWBQueueManagementRecord(string recordID, string UserID);


    }
}
