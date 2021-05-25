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
    public interface IRFSLocationService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRFSLocationRecord?recid={RecordID}&UserSNo={UserSNo}")]
        RFSLocation GetRFSLocationRecord(string recordID, string UserSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRFSLocation")]
        List<string> SaveRFSLocation(List<RFSLocation> RFSLocation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRFSLocation")]
        List<string> UpdateRFSLocation(List<RFSLocation> RFSLocation);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRFSLocation")]
        List<string> DeleteRFSLocation(List<string> RecordID);

    }
}