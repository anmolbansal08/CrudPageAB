using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Inventory
{
    [ServiceContract]
    public interface IConsumableService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetConsumableRecord?recid={RecordID}&UserID={UserID}")]
        Consumable GetConsumableRecord(int recordID, string UserID);

        [WebInvoke(Method = "POST", UriTemplate = "/SaveConsumable")]
        List<string> SaveConsumable(List<Consumable> ULDStock);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateConsumable")]
        List<string> UpdateConsumable(List<Consumable> Consumable);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteConsumable")]
        List<string> DeleteConsumable(List<string> RecordID);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportOfficeInformation(string CitySNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string Getofficelist(string OfficeSNo);
    }
}
