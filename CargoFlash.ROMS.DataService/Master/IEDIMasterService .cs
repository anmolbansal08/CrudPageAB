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
   public interface IEDIMasterService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetEDIMasterRecord?recid={RecordID}&UserID={UserID}")]
        EDIMaster GetEDIMasterRecord(string recordID,string UserID);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveEDIMaster")]
        List<string> SaveEDIMaster(List<EDIMaster> EDIMaster);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateEDIMaster")]
        List<string> UpdateEDIMaster(List<EDIMaster> EDIMaster);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteEDIMaster")]
        List<string> DeleteEDIMaster(List<string> RecordID);
    }
}
