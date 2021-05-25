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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    class UwsPrintService : SignatureAuthenticate, IUwsPrintService
    {
      

        public string GetFlight(string FlightNo, string FlightDate)
        {
            try
            { 
            SqlParameter[] Parameters = { 
                new SqlParameter("@FlightNo", FlightNo),
               new SqlParameter("@FlightDate", FlightDate)                         };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDailyFlight", Parameters);

            return ds.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }       

       
    }
}
