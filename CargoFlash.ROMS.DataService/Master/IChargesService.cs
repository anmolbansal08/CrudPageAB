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
    interface IChargesService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetChargesRecord?recid={RecordID}&UserID={UserID}")]
        Charges GetChargesRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCharges")]
        List<string> SaveCharges(List<Charges> Charges);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCharges")]
        List<string> UpdateCharges(List<Charges> Charges);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCharges")]
        List<string> DeleteCharges(List<string> RecordID);
    }
}
