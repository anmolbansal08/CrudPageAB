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
    #region ULDSLA interface Description
    /************************************
	*/
    #endregion
    [ServiceContract]
    public interface IULDSLAService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDSLARecord?recid={RecordID}&UserID={UserID}")]
        ULDSLA GetULDSLARecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDSLA")]
        List<string> SaveULDSLA(List<ULDSLA> Uldsla);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDSLA")]
        List<string> UpdateULDSLA(List<ULDSLA> Uldsla);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDSLA")]
        List<string> DeleteULDSLA(List<string> RecordID);
    }
}
