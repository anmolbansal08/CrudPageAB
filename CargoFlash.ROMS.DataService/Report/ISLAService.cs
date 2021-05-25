using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Report
{
    #region Work Order interface Description
    /*
	*****************************************************************************
	interface Name:		IWorkOrderService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    05 Feb 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ISLAService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetSLAReport(SLA SlaData);
    }
}
