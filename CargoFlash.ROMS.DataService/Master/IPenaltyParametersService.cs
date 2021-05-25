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
    public interface IPenaltyParametersService
    {
    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
    DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


    
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "/SavePenaltyParameters")]
    List<string> SavePenaltyParameters(List<PenaltyParameters> PenaltyParameters);

    [OperationContract]
    [WebInvoke(Method = "GET", UriTemplate = "GetPenaltyParametersRecord?recid={RecordID}&UserID={UserID}")]
    PenaltyParameters GetPenaltyParametersRecord(string recordID, string UserID);

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "/UpdatePenaltyParameters")]
    List<string> UpdatePenaltyParameters(List<PenaltyParameters> PenaltyParameters);

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "/DeletePenaltyParameters")]
    List<string> DeletePenaltyParameters(List<string> listID);

    // For Append grid record
    [OperationContract]
    [WebInvoke(Method = "GET", UriTemplate = "GetPenaltyParametersSlabRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
    KeyValuePair<string, List<PenaltyParametersSlab>> GetPenaltyParametersSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort);


    }
}
