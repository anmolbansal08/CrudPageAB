using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.DataService.AWBStockStatus
{
    [ServiceContract]
    public interface IAWBStockStatusService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetGridData?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //KeyValuePair<string, List<CargoFlash.Cargo.Model.Stock.AWBStockStatus>> GetGridData(string recordID, int page, int pageSize, string whereCondition, string sort);
    }
}
