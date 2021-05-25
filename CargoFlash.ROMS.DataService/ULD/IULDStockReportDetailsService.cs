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
    /*
          *****************************************************************************
          I Name:		      ULDStockReportDetailsService
          Purpose:		      Only View 
          Company:		      CargoFlash Infotech Pvt Ltd.
          Author:			  Sushant Kumar Nayak
          Created On:		  18-11-2017
          Updated By:    
          Updated On:
          Approved By:
          Approved On:
          *****************************************************************************
          */

    [ServiceContract]
    public interface IULDStockReportDetailsService
    {


        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetULDStockReportDetailsService?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<ULDStockReportDetails>> GetULDStockReportDetailsService(string recordID, int page, int pageSize, string whereCondition, string sort);

         
        [OperationContract]
        [WebInvoke(UriTemplate = "ExportExcelPdf", ResponseFormat = WebMessageFormat.Json)]
        List<ULDStockReportDetails> ExportExcelPdf(ULDStockReportDetails obj);
    }
}
