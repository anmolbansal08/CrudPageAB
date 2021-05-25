using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityReportService : IIrregularityReportService
    {
        public string GetCDRPrint(int ISNo)
        {
            try
            { 
            SqlParameter[] Parameters = {
                                          new SqlParameter("@ISNo", ISNo),
                                         // new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "USP_IrregularityCDRReport", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
    }
}
