using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;

namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class OtherChargesHistoryService : SignatureAuthenticate, IOtherChargesHistoryService
    {
        public string GetOtherChargesHistoryData(GetOtherChargesHistoryDataModel obj)
        {
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            OtherChargesHistory OtherChargesHistory = new OtherChargesHistory();
            DataSet dsRead = new DataSet();
            SqlDataReader dr = null;
            string Result = "";
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", obj.AirlineSNo), new SqlParameter("@OtherChargeType", obj.chargeTypeval), new SqlParameter("@DueCarrierChargesCode", obj.DueCarrierCode), new SqlParameter("@Origin", obj.OriginLev), new SqlParameter("@OriginType",
                    obj.Origin), new SqlParameter("@Destnation", obj.DestLev), new SqlParameter("@DestinationType", obj.Destination), new SqlParameter("@Status", obj.statusval), new SqlParameter("@VallidFrom", obj.vallidFrom), new SqlParameter("@VallidTo", obj.VallidTo), new SqlParameter("@ReferenceNumber", obj.ReferenceNumber) };
                dsRead = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherChargesHistory_Record", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsRead);
            }
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            }
            return Result;
        }
    }
}
