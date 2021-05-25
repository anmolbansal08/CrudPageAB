using System;
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
    public interface IDriversService
    {


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetDriversRecord?recid={RecordID}&UserID={UserID}")]
        Drivers GetDriversRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveDrivers")]
        List<string> SaveDrivers(List<DriversSave> Drivers);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateDrivers")]
        List<string> UpdateDrivers(List<DriversSave> DriversSave);

        

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteDrivers")]
        List<string> DeleteDrivers(List<string> listID);
       
    }
}
