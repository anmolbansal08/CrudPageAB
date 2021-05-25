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
    [ServiceContract]
    public interface IAllocationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAllocationRecord?recid={RecordID}&UserID={UserID}")]
        Allocation GetAllocationRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAllocation")]
        List<string> SaveAllocation(List<Allocation> alloc);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAllocation")]
        List<string> UpdateAllocation(List<Allocation> alloc);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAllocation")]
        List<string> DeleteAllocation(List<string> RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetAllocationCode?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetAllocationCode(String RecordID);


    }
}
