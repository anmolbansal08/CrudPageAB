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
    public interface IWeighingScaleService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetWeighingScaleRecord?recid={RecordID}&UserSNo={UserSNo}")]
        WeighingScale GetWeighingScaleRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveWeighingScale")]
        List<string> SaveWeighingScale(List<WeighingScale> WeighingScale);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateWeighingScale")]
        List<string> UpdateWeighingScale(List<WeighingScale> WeighingScale);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteWeighingScale")]
        List<string> DeleteWeighingScale(List<string> RecordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportInformation(string SNo);

        
    }
}
