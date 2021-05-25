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
    interface IAirlineAuctionService
    {
            [OperationContract]
            [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

            [OperationContract]
            [WebGet(UriTemplate = "GetAirlineAuctionRecord?recid={RecordID}&UserID={UserID}")]
            AirlineAuction GetAirlineAuctionRecord(string recordID,string UserID);

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/SaveAirlineAuction")]
            List<string> SaveAirlineAuction(List<AirlineAuction> AirlineAuction);

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/UpdateAirlineAuction")]
            List<string> UpdateAirlineAuction(List<AirlineAuction> AirlineAuction);

            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/DeleteAirlineAuction")]
            List<string> DeleteAirlineAuction(List<string> RecordID);
    }
}
