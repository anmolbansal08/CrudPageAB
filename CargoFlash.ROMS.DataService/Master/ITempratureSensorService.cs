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
    interface ITempratureSensorService
    {

          [OperationContract]
          [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
          DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTempratureSensorRecord?recid={RecordID}&UserSNo={UserSNo}")]
          TempratureSensor GetTempratureSensorRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveTempratureSensor")]
        List<string> SaveTempratureSensor(List<TempratureSensor> TempratureSensor);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTempratureSensor")]
        List<string> UpdateTempratureSensor(List<TempratureSensor> TempratureSensor);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteTempratureSensor")]
        List<string> DeleteTempratureSensor(List<string> RecordID);





    }
}
