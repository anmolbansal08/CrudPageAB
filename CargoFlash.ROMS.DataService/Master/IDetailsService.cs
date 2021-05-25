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
    public interface IDetailsService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDetails")]
        List<string> SaveDetails(List<Details> Details);

        [OperationContract]
        [WebGet(UriTemplate = "GetDetailsRecord?recid={RecordID}&UserID={UserID}")]
        Details GetDetailsRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDetails")]
        List<string> UpdateDetails(List<Details> Details);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDetails")]
        List<string> DeleteDetails(List<string> RecordID);


    }
}








/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;
using KLAS.Business;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public interface IDetailsService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDetailsRecord?recid={RecordID}&UserID={UserID}")]
        Details GetDetailsRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDetails")]
        List<string> SaveDetails(List<Details Details);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDetails")]
        List<string> UpdateDetails(List<DetailsSave> DetailsSave);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDetails")]
        List<string> DeleteDetails(List<string> listID);

    }*/
//}


