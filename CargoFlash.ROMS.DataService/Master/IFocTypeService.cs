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
    public interface IFocTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetFocTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        FocType GetFocTypeRecord(string recordID, string UserSNo);


       [OperationContract]
       [WebInvoke(Method = "POST", UriTemplate = "/SaveFocType")]
       List<string> SaveFocType(List<FocType> FocType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateFocType")]
         List<string> UpdateFocType(List<FocType> FocType);

       [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteFocType")]
        List<string> DeleteFocType(List<string> RecordID);
    }
}
