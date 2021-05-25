using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.EDI
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TelexTypeService : SignatureAuthenticate, ITelexTypeService
    {
        public int SaveTelexType(string SitaAddress, string EmailAddress, string TeleTextMessage)
        {
            try
            { 
           SqlParameter param = new SqlParameter();

           SqlParameter[] Parameters = { new SqlParameter("@SitaAddress", SitaAddress), new SqlParameter("@EmailAddress", EmailAddress), new SqlParameter("@TeleTextMessage", CargoFlash.Cargo.Business.Common.Base64ToString(TeleTextMessage)),
                 new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTelexType", Parameters);
           
            

            return ret;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
