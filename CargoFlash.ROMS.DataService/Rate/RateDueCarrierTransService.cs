using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateDueCarrierTransService : SignatureAuthenticate, IRateDueCarrierTransService
    {
        /// <summary>
        /// Retrieve Commodity Sub Group infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <param name="page">page is the page number</param>
        /// <param name="pageSize">pageSize is the per page record</param>
        /// <param name="whereCondition">Where Condition according to which touple is to be retrieved</param>
        /// <param name="sort">Order by</param>
        /// <returns>total rows and record</returns>
        public KeyValuePair<string, List<RateDueCarrierTrans>> GetRateDueCarrierTransRecord(int rateAirlineMasterSNo, int rateType)
        {
            try
            {
                RateDueCarrierTrans RateDueCarrierTrans = new RateDueCarrierTrans();
                SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterSNo", rateAirlineMasterSNo), new SqlParameter("@RateType", rateType) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateDueCarrierTransRecord", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var RateDueCarrierTransList = ds.Tables[0].AsEnumerable().Select(e => new RateDueCarrierTrans
                {
                    HdnName = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString() + " - " + e["Name"].ToString(),
                    FreightType = e["FreightType"].ToString(),
                    MinimumValue = Convert.ToDecimal(e["MinimumValue"].ToString()),
                    ChargeableWeight = e["ChargeableWeight"].ToString(),
                    IsChargeableWeight = Convert.ToBoolean(e["IsChargeableWeight"].ToString()),
                    RateAirlineMasterSNo = Convert.ToInt32(rateAirlineMasterSNo),
                    Value = Convert.ToDecimal(e["Value"].ToString()),
                    IsMandatory = Convert.ToBoolean(e["IsMandatory"].ToString()),
                    ValidFrom = e["ValidFrom"].ToString(),
                    ValidTo = e["ValidTo"].ToString()

                });
                return new KeyValuePair<string, List<RateDueCarrierTrans>>(ds.Tables[0].Rows.Count > 0 ? ds.Tables[0].Rows[0][0].ToString() : "0", RateDueCarrierTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }
        public string GetFreightType(int recid)
        {
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@recid", recid) };
                return Convert.ToString(SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFreightType", Parameters));
                // return resultData.Tables[0].AsEnumerable().ToList();
                return "";
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

    }
}
