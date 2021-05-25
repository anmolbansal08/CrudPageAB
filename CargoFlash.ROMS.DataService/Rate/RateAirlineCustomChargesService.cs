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
    public class RateAirlineCustomChargesService : SignatureAuthenticate, IRateAirlineCustomChargesService
    {
        public KeyValuePair<string, List<RateAirlineCustomCharges>> GetRateAirlineCustomChargesRecord(int rateAirlineMasterSNo, int originCitySNo, int originAirportSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterSNo", rateAirlineMasterSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateAirlineCustomChargesRecord", Parameters);
                var RateAirlineCustomChargesList = ds.Tables[0].AsEnumerable().Select(e => new RateAirlineCustomCharges
                {
                    // SNo = Convert.ToInt32(e["SNo"]),
                    Charge_Name = e["Charge_Name"].ToString(),
                    RateAirlineMasterSNo = Convert.ToInt32(rateAirlineMasterSNo),
                    //Minimum = Convert.ToInt16(e["Minimum"].ToString()),
                    //Maximum = Convert.ToInt16(e["Maximum"].ToString()),
                    Value = Convert.ToDecimal(e["Value"].ToString())

                });

                return new KeyValuePair<string, List<RateAirlineCustomCharges>>(ds.Tables[1].Rows[0][0].ToString(), RateAirlineCustomChargesList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="RateAirlineTrans">object of the Entity</param>

        public List<string> createUpdateRateAirlineCustomCharges(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtRateAirlineCustomCharges = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtRateAirlineTrans.Columns.Remove("CommoditySubGroupName");
                //dtRateAirlineTrans.Columns.Remove("CommodityCode");
                //dtRateAirlineTrans.Columns["HdnCommoditySubGroupName"].ColumnName = "CommoditySubGroupSNo";
                //dtRateAirlineTrans.Columns["HdnCommodityCode"].ColumnName = "CommoditySNo";
                var dtCreateRateAirlineCustomCharges = (new DataView(dtRateAirlineCustomCharges, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateRateAirlineCustomCharges = (new DataView(dtRateAirlineCustomCharges, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@UpdateRateAirlineCustomChargesTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateRateAirlineCustomCharges.Rows.Count > 0)
                {
                    param.Value = dtCreateRateAirlineCustomCharges;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateAirlineCustomCharges", Parameters);
                }
                // for update existing record
                if (dtUpdateRateAirlineCustomCharges.Rows.Count > 0)
                {
                    param.Value = dtUpdateRateAirlineCustomCharges;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateAirlineCustomCharges", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateAirlineCustomCharges");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);

                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        /// <summary>
        /// delete the perticular RateAirlineTrans touple
        /// </summary>
        /// <param name="RecordID">Id of that RateAirlineTrans touple</param>
        public List<string> deleteRateAirlineCustomCharges(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateAirlineCustomCharges", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateAirlineCustomCharges");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);

                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
