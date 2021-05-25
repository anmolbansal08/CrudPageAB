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
    public interface IAirlineCheckListService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetAirlineCheckListRecord?recid={RecordID}&UserID={UserID}")]
        AirlineCheckList GetAirlineCheckListRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAirlineCheckList")]
        List<string> SaveAirlineCheckList(List<AirlineCList> AirlineCL);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirlineCheckList")]
        List<string> UpdateAirlineCheckList(List<AirlineCList> AirlineCL);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirlineCheckList")]
        List<string> DeleteAirlineCheckList(List<string> RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "ItemValue?ItmVal={ItmVal}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult ItemValue(String ItmVal);
    }
}
