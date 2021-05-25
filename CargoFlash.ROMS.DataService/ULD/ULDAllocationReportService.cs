using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{

            /*
            *****************************************************************************
            Service Name:		  ULDAllocationReportService
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


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDAllocationReportService : SignatureAuthenticate, IULDAllocationReportService
    {
        public string ULDAllocationReport(string Station, string Ownership)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Station", Station), new SqlParameter("@Ownership", Ownership), new SqlParameter("@AirlineSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirlineSNo.ToString())};                                                                      
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpCityWiseULDAllocationReport", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
