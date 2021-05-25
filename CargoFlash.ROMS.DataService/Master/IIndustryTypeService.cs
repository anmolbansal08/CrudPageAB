using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IIndustryTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        //[OperationContract]
        //[WebInvoke(BodyStyle=WebMessageBodyStyle.WrappedRequest, ResponseFormat= WebMessageFormat.Json, RequestFormat=WebMessageFormat.Json)]

        [OperationContract]
        [WebGet(UriTemplate = "GetIndustryTypeRecord?recid={RecordID}&UserID={UserID}")]
        IndustryType GetIndustryTypeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveIndustryType")]
        List<string> SaveIndustryType(List<IndustryType> IndustryType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateIndustryType")]
        List<string> UpdateIndustryType(List<IndustryType> IndustryType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteIndustryType")]
        List<string> DeleteIndustryType(List<string> listID);





    }
}
