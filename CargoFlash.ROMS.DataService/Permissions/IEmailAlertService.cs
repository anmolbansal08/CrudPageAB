using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Permissions.DataService
{

    /*
       *****************************************************************************
       I Name:		      EmailAlert
       Purpose:		    
       Company:		      CargoFlash Infotech Pvt Ltd.
       Author:			  Sushant Kumar Nayak
       Created On:		  22-01-2018
       Updated By:    
       Updated On:
       Approved By:
       Approved On:
       *****************************************************************************
       */
    [ServiceContract]
    public interface IEmailAlertService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int EmailAlertSNo, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveEmailAlert(EmailAlertCollection obj);


    }
}
