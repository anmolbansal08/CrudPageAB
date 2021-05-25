//Modified By jitendra kumar,10oct 2017 method ImportFBLAutoCompleteDataSource

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Import;
namespace CargoFlash.Cargo.DataService
{
    [ServiceContract]
    public interface IAutoCompleteService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult AutoCompleteDataSourceV2(int pageSize, GridFilter filter, string autoCompleteName, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters = null);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult AutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult WMSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult ExportESSWMSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string GrWT = "", string Pieces = "", string cityChangeFlag = "");
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult ImportFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", List<DOShipmentInfo> ShipmentDetailArray = null,string ProcessSNo="" ,string subprocesssno="", string cityChangeFlag = "", string Remarks = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult ImportESSFBLAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", List<DOShipmentInfo> ShipmentDetailArray = null, string cityChangeFlag = "", string Remarks = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult WMSRFSAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult SLIESAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult POMailAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "");


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult WMSAutoCompleteDataSource(int pageSize, GridFilter filter, string autoCompleteName, List<CargoFlash.Cargo.Business.SQLParameterList> Parameters = null);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult AutoCompleteDataSourcebyAWB(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string currentawbsno = "", string StartTemp = "", string EndTemp = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult AutoCompleteResourceEmployee(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string employee = "", string staffStatus = "", string degination = "", string dutyarea = "", string start = "", string end = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult ESSAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "");

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult CTMAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "", string FlightSNo = "", string CTMSNo = "", string ProcessSNo = "", string SubProcessSNo = "");


        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult LUCAutoCompleteDataSource(int pageSize, GridFilter filter, string tableName, string keyColumn, string textColumn, List<string> templateColumn, string procedureName = "", string awbSNo = "", string chargeTo = "", string cityCode = "", string movementType = "", string hawbSNo = "", string loginSNo = "", string chWt = "", string cityChangeFlag = "", string FlightSNo = "", string CTMSNo = "", string ProcessSNo = "", string SubProcessSNo = "");
       
    }
}
