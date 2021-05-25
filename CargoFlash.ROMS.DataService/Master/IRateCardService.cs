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
  public  interface IRateCardService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetRateCardRecord?recid={RecordID}&UserID={UserID}")]
        RateCard GetRateCardRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveRateCard")]
        List<string> SaveRateCard(List<RateCard> RateCard);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateRateCard")]
        List<string> UpdateRateCard(List<RateCard> RateCard);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteRateCard")]
        List<string> DeleteRateCard(List<string> listID);

    }
}
