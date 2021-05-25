using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Report
{
    /*
          *****************************************************************************
          I Name:		  IBuiltupreportService
          Purpose:		  Only View 
          Company:		  CargoFlash Infotech Pvt Ltd.
          Author:		  Sushant Kumar Nayak
          Created On:    31-07-2017
          Updated By:    
          Updated On:
          Approved By:
          Approved On:
          *****************************************************************************
          */

    [ServiceContract]
    public interface IBuiltupreportService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string Builtupreport(string ToDate, string FDate, string Flightno);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BuiltUpReportDetails(string Flightno, string FlightDt);
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SummeryDetails(string Flightno, string FlightDt, string ULDNO);

    }
}
