using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;

namespace CargoFlash.Cargo.DataService.Irregularity
{    
    [ServiceContract]
    public interface ISpecialCargoService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);


        [OperationContract]
        [WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{SpecialCargoType}/{SpecialCargoNo}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetGridData(string processName, string moduleName, string appName, string SpecialCargoType, string SpecialCargoNo);

        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GeSpecialCargoGridData(string SpecialCargoType, string SpecialCargoNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);
        
    }
}
