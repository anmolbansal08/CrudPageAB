using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Text;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Shipment
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "UldHandOverService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UldHandOverService : SignatureAuthenticate, IUldHandOverService
    {
        public string GetUldHandOverRecord(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Sno", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUldHandOverRecord", Parameters);
                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
