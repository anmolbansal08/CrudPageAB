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
namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface ISpecialHandlingCodeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetSpecialHandlingCodeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        SpecialHandlingCode GetRecordSpecialHandlingCode(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveSpecialHandlingCode")]
        List<string> SaveSpecialHandlingCode(List<SpecialHandlingCode> SpecialHandlingCode);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateSpecialHandlingCode")]
        List<string> UpdateSpecialHandlingCode(List<SpecialHandlingCode> SpecialHandlingCode);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteSpecialHandlingCode")]
        List<string> DeleteSpecialHandlingCode(List<string> RecordID);
    }
}
