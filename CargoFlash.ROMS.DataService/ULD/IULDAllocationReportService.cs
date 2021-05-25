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
          I Name:		  IULDAllocationReportService
          Purpose:		      Only View 
          Company:		      CargoFlash Infotech Pvt Ltd.
          Author:			      Sushant Kumar Nayak
          Created On:		      24-07-2017
          Updated By:    
          Updated On:
          Approved By:
          Approved On:
          *****************************************************************************
          */

    [ServiceContract]
    public interface IULDAllocationReportService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string ULDAllocationReport(string Station, string Ownership);

    }
}
