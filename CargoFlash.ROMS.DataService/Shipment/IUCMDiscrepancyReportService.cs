using CargoFlash.Cargo.Model.Export.UldTransfer;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    public interface IUCMDiscrepancyReportService
    {

            [OperationContract]
            [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

            [OperationContract]
            [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            string UCMDiscrepancyReportDetail(int UCMDiscrepancyReportSNo);

            [OperationContract]
            [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            string UCMDiscrepancyExicute(string Edi_UCMID);

            [OperationContract]
            [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            string BtnUCMCiscrepancytUpdate(string Edi_UCMID);

            [OperationContract]
            [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
            string UCMDiscrepency_saveULDTracking(string UCMType, string Flightno, string FlightDate, string Usersno, string Updationtype, string ULDNo);
    }
}
