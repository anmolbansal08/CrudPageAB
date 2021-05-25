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
    public interface IBTBMachinePalletService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBTBMachinePallet")]
        List<string> SaveBTBMachinePallet(List<BTBMachinePallet> BTBMachinePallet);

        [OperationContract]
        [WebGet(UriTemplate = "GetBTBMachinePalletRecord?recid={RecordID}&UserID={UserID}")]
        BTBMachinePallet GetBTBMachinePalletRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateBTBMachinePallet")]
        List<string> UpdateBTBMachinePallet(List<BTBMachinePallet> BTBMachinePallet);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteBTBMachinePallet")]
        List<string> DeleteBTBMachinePallet(List<string> RecordID);

       
    }
}
