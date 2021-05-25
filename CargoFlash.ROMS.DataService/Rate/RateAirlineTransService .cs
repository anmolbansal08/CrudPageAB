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
    public class RateAirlineTransService : SignatureAuthenticate, IRateAirlineTransService
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
        public KeyValuePair<string, List<RateAirlineTrans>> GetRateAirlineTransRecord(int rateAirlineMasterSNo, int originAirportSNo)
        {
            try
            {
                RateAirlineTrans RateAirlineTrans = new RateAirlineTrans();
                SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterSNo", rateAirlineMasterSNo), new SqlParameter("@OriginAirportSNo", originAirportSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateAirlineTransRecord", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var RateAirlineTransList = ds.Tables[0].AsEnumerable().Select(e => new RateAirlineTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SlabName = e["SlabName"].ToString(),
                    RateAirlineMasterSNo = Convert.ToInt32(rateAirlineMasterSNo),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"].ToString()),
                    Value = Convert.ToDecimal(e["Value"].ToString())

                });
                return new KeyValuePair<string, List<RateAirlineTrans>>(ds.Tables[1].Rows[0][0].ToString(), RateAirlineTransList.AsQueryable().ToList());
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

        public List<string> createUpdateRateAirlineTrans(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtRateAirlineTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtRateAirlineTrans.Columns.Remove("CommoditySubGroupName");
                dtRateAirlineTrans.Columns.Remove("CommodityCode");
                dtRateAirlineTrans.Columns["HdnCommoditySubGroupName"].ColumnName = "CommoditySubGroupSNo";
                dtRateAirlineTrans.Columns["HdnCommodityCode"].ColumnName = "CommoditySNo";
                var dtCreateRateAirlineTrans = (new DataView(dtRateAirlineTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateRateAirlineTrans = (new DataView(dtRateAirlineTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateAirlineTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateRateAirlineTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateRateAirlineTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateAirlineTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateRateAirlineTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateRateAirlineTrans;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateAirlineTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateAirlineTrans");
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
        public List<string> deleteRateAirlineTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateAirlineTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateAirlineTrans");
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
