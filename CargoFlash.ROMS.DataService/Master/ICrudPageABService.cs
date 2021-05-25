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
    public interface ICrudPageABService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCrudPageAB")]
        List<string> SaveCrudPageAB(List<CrudPageAB> CrudPageAB);

        [OperationContract]
        [WebGet(UriTemplate = "GetCrudPageABRecord?recid={RecordID}&UserID={UserID}")]
        CrudPageAB GetCrudPageABRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCrudPageAB")]
        List<string> UpdateCrudPageAB(List<CrudPageAB> CrudPageAB);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCrudPageAB")]
        List<string> DeleteCrudPageAB(List<string> RecordID);


    }
}
