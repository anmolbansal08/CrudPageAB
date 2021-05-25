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
    #region MaintenanceType interface Description
    /************************************
	*/
    #endregion
    [ServiceContract]
    public interface IMaintenanceTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetMaintenanceTypeRecord?recid={RecordID}&UserID={UserID}")]
        MaintenanceType GetMaintenanceTypeRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveMaintenanceType")]
        List<string> SaveMaintenanceType(List<MaintenanceType> MainType);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateMaintenanceType")]
        List<string> UpdateMaintenanceType(List<MaintenanceType> MainType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteMaintenanceType")]
        List<string> DeleteMaintenanceType(List<string> RecordID);


    }
}