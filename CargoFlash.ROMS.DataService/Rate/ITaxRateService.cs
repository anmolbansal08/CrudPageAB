using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ITaxRateService" in both code and config file together.
    [ServiceContract]
    public interface ITaxRateService
    {
        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetTaxAppliedOn();

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAirlineCurrency(int AirlineSNo);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetTaxRateRecord?recid={RecordID}&UserID={UserID}")]
        ReadTaxRateDetails GetTaxRateRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTaxAppliedOnEdit(int TaxRateSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetTaxRateParameter(int TaxRateSNo);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetRemarks?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<TaxRateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveTaxRateDetais", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveTaxRateDetais(int TaxRateSNo, string Action, SaveTaxRateDetails TaxRateDetails, List<TaxRateRemarks> TaxRateRemarks, TaxRateOriginCity TaxRateOriginCity, TaxRateOriginCountry TaxRateOriginCountry, TaxRateDestinationCity TaxRateDestinationCity, TaxRateDestinationCountry TaxRateDestinationCountry, TaxRateProduct TaxRateProduct, TaxRateCommodity TaxRateCommodity, TaxRateAgent TaxRateAgent, TaxRateAgentShipper TaxRateAgentShipper, TaxRateOtherChargeCode TaxRateOtherChargeCode, TaxRateIssueCarrier TaxRateIssueCarrier, TaxRateFlightNo TaxRateFlightNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateTaxRateDetais", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateTaxRateDetais(int TaxRateSNo, string Action, SaveTaxRateDetails TaxRateDetails, List<TaxRateRemarks> TaxRateRemarks, TaxRateOriginCity TaxRateOriginCity, TaxRateOriginCountry TaxRateOriginCountry, TaxRateDestinationCity TaxRateDestinationCity, TaxRateDestinationCountry TaxRateDestinationCountry, TaxRateProduct TaxRateProduct, TaxRateCommodity TaxRateCommodity, TaxRateAgent TaxRateAgent, TaxRateAgentShipper TaxRateAgentShipper, TaxRateOtherChargeCode TaxRateOtherChargeCode, TaxRateIssueCarrier TaxRateIssueCarrier,TaxRateFlightNo TaxRateFlightNo, string ErrorMSG);
        // by arman
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCountrySNo(int CitySNo);
    
    }

}
