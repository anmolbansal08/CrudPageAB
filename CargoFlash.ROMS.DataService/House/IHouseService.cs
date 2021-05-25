using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.House
{
    [ServiceContract]
    public interface IHouseService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetWMSHouseGridData(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string HAWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetHousehipppingBillGridData(string HAWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetHouseCheckListGridData(string HAWBSNo, string CheckListTypeSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
    }
}