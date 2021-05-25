using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.ULD
{
    #region ULDBaggageType interface Description
    /************************************
	*/
    #endregion
    [ServiceContract]
    public interface IULDBaggageTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDBaggageTypeRecord?recid={RecordID}&UserID={UserID}")]
        ULDBaggageType GetULDBaggageTypeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDBaggageType")]
        List<string> SaveULDBaggageType(List<ULDBaggageType> ULDBag);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDBaggageType")]
        List<string> UpdateULDBaggageType(List<ULDBaggageType> ULDBag);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDBaggageType")]
        List<string> DeleteULDBaggageType(List<string> RecordID);
    }
}