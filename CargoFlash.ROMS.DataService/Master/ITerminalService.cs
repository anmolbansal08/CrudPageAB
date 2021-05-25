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
    public interface ITerminalService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTerminalRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Terminal GetTerminalRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveTerminal")]
        List<string> SaveTerminal(List<Terminal> City);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTerminal")]
        List<string> UpdateTerminal(List<Terminal> City);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteTerminal")]
        List<string> DeleteTerminal(List<string> RecordID);



        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetXRayMachineInfo(string XraymachineSNo);


        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAirportInformation(string SNo);
    }
}
