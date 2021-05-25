using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ISPHCClassService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSPHCClassRecord?recid={RecordID}&UserSNo={UserSNo}")]
        SPHCClass GetSPHCClassRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSPHCClass")]
        List<string> SaveSPHCClass(List<SPHCClass> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSPHCClass")]
        List<string> UpdateSPHCClass(List<SPHCClass> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSPHCClass")]
        List<string> DeleteSPHCClass(List<string> RecordID);

        

    }
}
