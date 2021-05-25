using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "TaxLogsService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TaxLogsService : SignatureAuthenticate, ITaxLogsService
    {
        public string TaxLogsTable(int AirlineSNo, int Type, int TaxType, int Status, DateTime StartDate, DateTime EndDate, int OriginLevel, int OriginSNo, int DestinationLevel, int DestinationSNo, string ReferenceNo)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                         new SqlParameter("@AirlineSNo", AirlineSNo),
                                         new SqlParameter("@Type", Type),
                                         new SqlParameter("@TaxType", TaxType),
                                         new SqlParameter("@Status", Status),
                                         new SqlParameter("@StartDate", StartDate),
                                         new SqlParameter("@EndDate", EndDate),
                                         new SqlParameter("@OriginLevel", OriginLevel),
                                         new SqlParameter("@OriginSNo", OriginSNo),
                                         new SqlParameter("@DestinationLevel", DestinationLevel),
                                         new SqlParameter("@DestinationSNo", DestinationSNo),
                                         new SqlParameter("@ReferenceNo", ReferenceNo)};

                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetTaxLogsRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        
    }
}
