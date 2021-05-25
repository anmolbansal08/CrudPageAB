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
   public interface IFlightTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetFlightTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        FlightType GetFlightTypeRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveFlightType")]
        List<string> SaveFlightType(List<FlightType> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateFlightType")]
        List<string> UpdateFlightType(List<FlightType> SPHCClass);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteFlightType")]
        List<string> DeleteFlightType(List<string> RecordID);
    }

     
}
