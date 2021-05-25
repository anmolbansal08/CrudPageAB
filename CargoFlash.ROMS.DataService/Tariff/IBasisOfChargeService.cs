using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Tariff
{

    [ServiceContract]
    public interface IBasisOfChargeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBasisOfCharge")]
        List<string> SaveBasisOfCharge(List<BasisOfCharge> BasisOfCharge);


        [OperationContract]
        [WebGet(UriTemplate = "GetBasisOfChargeRecord?recid={RecordID}&UserID={UserID}")]
        BasisOfCharge GetBasisOfChargeRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateBasisOfCharge")]
        List<string> UpdateBasisOfCharge(List<BasisOfCharge> BasisOfCharge);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteBasisOfCharge")]
        List<string> DeleteBasisOfCharge(List<string> RecordID);


    }
}
