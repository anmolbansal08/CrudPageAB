using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateGlobalDueCarrierTransService : SignatureAuthenticate, IRateGlobalDueCarrierTransService
    {
        //DateTime? DateNull = null;
        public KeyValuePair<string, List<RateGlobalDueCarrierTrans>> GetRateGlobalDueCarrierTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                RateGlobalDueCarrierTrans RateGlobalDueCarrierTrans = new RateGlobalDueCarrierTrans();
                SqlParameter[] Parameters = { new SqlParameter("@RateGlobalDuecarrierSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateGlobalDueCarrierTrans", Parameters);
                var RateGlobalDueCarrierTransList = ds.Tables[0].AsEnumerable().Select(e => new RateGlobalDueCarrierTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),

                    DueCarrierSNo = e["DueCarrierCode"].ToString(),
                    HdnDueCarrierSNo = e["DueCarrierSNo"].ToString(),

                    CommoditySNo = e["CommodityCode"].ToString(),
                    HdnCommoditySNo = e["CommoditySNo"].ToString(),


                    SPHCSNo = e["SPHCCode"].ToString(),
                    HdnSPHCSNo = e["SPHCSNo"].ToString(),

                    ProductSNo = e["ProductName"].ToString(),
                    HdnProductSNo = e["ProductSNo"].ToString(),

                    CurrencySNo = e["CurrencyCode"].ToString(),
                    HdnCurrencySNo = e["CurrencySNo"].ToString(),


                    Value = Convert.ToDecimal(e["Value"].ToString()),
                    MinimumValue = Convert.ToDecimal(e["MinimumValue"].ToString()),
                    OriginalValue = Convert.ToDecimal(e["OriginalValue"].ToString()),


                    //ValidFrom = DateTime.ParseExact(e["ValidFrom"].ToString(),"dd-MMM-yyyy",null),
                    //ValidTo = Convert.IsDBNull(e["ValidTo"].ToString()) ? DateNull : DateTime.ParseExact(e["ValidTo"].ToString(),"dd-MMM-yyyy",null),

                    ValidFrom = DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy"),
                    ValidTo = e["ValidTo"].ToString() == string.Empty ? "" : DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy"),


                    IsChargeableWeight = Convert.ToBoolean(e["IsChargeableWeight"]),
                    ChargeableWeight = Convert.ToString(e["ChargeableWeight"]),

                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString(),

                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<RateGlobalDueCarrierTrans>>(ds.Tables[1].Rows[0][0].ToString(), RateGlobalDueCarrierTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> createUpdateRateGlobalDueCarrierTrans(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dtRateGlobalDueCarrierTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //Remove DataTable Column 
                dtRateGlobalDueCarrierTrans.Columns.Remove("DueCarrierSNo");
                dtRateGlobalDueCarrierTrans.Columns.Remove("CommoditySNo");
                dtRateGlobalDueCarrierTrans.Columns.Remove("SPHCSNo");
                dtRateGlobalDueCarrierTrans.Columns.Remove("ProductSNo");
                dtRateGlobalDueCarrierTrans.Columns.Remove("CurrencySNo");
                //Rename DataTable Column 
                dtRateGlobalDueCarrierTrans.Columns["HdnDueCarrierSNo"].ColumnName = "DueCarrierSNo";
                dtRateGlobalDueCarrierTrans.Columns["HdnCommoditySNo"].ColumnName = "CommoditySNo";
                dtRateGlobalDueCarrierTrans.Columns["HdnSPHCSNo"].ColumnName = "SPHCSNo";
                dtRateGlobalDueCarrierTrans.Columns["HdnProductSNo"].ColumnName = "ProductSNo";
                dtRateGlobalDueCarrierTrans.Columns["HdnCurrencySNo"].ColumnName = "CurrencySNo";
                dtRateGlobalDueCarrierTrans.AcceptChanges();
                var dtCreateRateGlobalDueCarrierTrans = (new DataView(dtRateGlobalDueCarrierTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateRateGlobalDueCarrierTrans = (new DataView(dtRateGlobalDueCarrierTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateGlobalDueCarrierTransType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateRateGlobalDueCarrierTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateRateGlobalDueCarrierTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateGlobalDueCarrierTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateRateGlobalDueCarrierTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateRateGlobalDueCarrierTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateGlobalDueCarrierTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateGlobalDueCarrierTrans");
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
        public List<string> deleteRateGlobalDueCarrierTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateGlobalDueCarrierTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateGlobalDueCarrierTrans");
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


        public DataSourceResult GetExchangeRate(String OriginalValue, String CurrencySNo)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@OriginalValue", OriginalValue), new SqlParameter("@CurrencySNo", CurrencySNo) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetConvertExchangeRate", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["ConvertRate"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        } 

    }
}
