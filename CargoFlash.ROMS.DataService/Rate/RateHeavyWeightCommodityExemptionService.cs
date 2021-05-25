using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateHeavyWeightCommodityExemptionService : SignatureAuthenticate, IRateHeavyWeightCommodityExemptionService
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
        public KeyValuePair<string, List<RateHeavyWeightCommodityExemption>> GetRateHeavyWeightCommodityExemptionRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                RateHeavyWeightCommodityExemption RateHeavyWeightCommodityExemption = new RateHeavyWeightCommodityExemption();
                SqlParameter[] Parameters = { new SqlParameter("@HeavyWeightSurchargeSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateHeavyWeightCommodityExemption", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var RateHeavyWeightCommodityExemptionList = ds.Tables[0].AsEnumerable().Select(e => new RateHeavyWeightCommodityExemption
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    RateHeavyWeightSurchargeSNo = Convert.ToInt32(e["RateHeavyWeightSurchargeSNo"]),
                    CommoditySNo = Convert.ToInt32(e["CommoditySNo"].ToString()),
                    HdnCommodityCode = Convert.ToInt32(e["CommoditySNo"].ToString()),
                    CommodityCode = e["CommodityCode"].ToString(),
                    CommoditySubGroupSNo = Convert.ToInt32(e["CommoditySubGroupSNo"]),
                    HdnCommoditySubGroupName = Convert.ToInt32(e["CommoditySubGroupSNo"]),
                    CommoditySubGroupName = e["SubGroupName"].ToString(),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"].ToString()),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]).ToString(DateFormat.DateFormatString),
                    ValidTo = Convert.ToDateTime(e["ValidTo"]).ToString(DateFormat.DateFormatString),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    Active = e["Active"].ToString().ToUpper()
                });
                return new KeyValuePair<string, List<RateHeavyWeightCommodityExemption>>(ds.Tables[1].Rows[0][0].ToString(), RateHeavyWeightCommodityExemptionList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }

        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="RateHeavyWeightCommodityExemption">object of the Entity</param>

        public List<string> createUpdateRateHeavyWeightCommodityExemption(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtRateHeavyWeightCommodityExemption = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtRateHeavyWeightCommodityExemption.Columns.Remove("CommoditySubGroupName");
                dtRateHeavyWeightCommodityExemption.Columns.Remove("CommodityCode");
                dtRateHeavyWeightCommodityExemption.Columns["HdnCommoditySubGroupName"].ColumnName = "CommoditySubGroupSNo";
                dtRateHeavyWeightCommodityExemption.Columns["HdnCommodityCode"].ColumnName = "CommoditySNo";
                var dtCreateRateHeavyWeightCommodityExemption = (new DataView(dtRateHeavyWeightCommodityExemption, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateRateHeavyWeightCommodityExemption = (new DataView(dtRateHeavyWeightCommodityExemption, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateHeavyWeightCommodityExemptionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateRateHeavyWeightCommodityExemption.Rows.Count > 0)
                {
                    param.Value = dtCreateRateHeavyWeightCommodityExemption;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateHeavyWeightCommodityExemption", Parameters);
                }
                // for update existing record
                if (dtUpdateRateHeavyWeightCommodityExemption.Rows.Count > 0)
                {
                    param.Value = dtUpdateRateHeavyWeightCommodityExemption;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateHeavyWeightCommodityExemption", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateHeavyWeightCommodityExemption");
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
        /// delete the perticular RateHeavyWeightCommodityExemption touple
        /// </summary>
        /// <param name="RecordID">Id of that RateHeavyWeightCommodityExemption touple</param>
        public List<string> deleteRateHeavyWeightCommodityExemption(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateHeavyWeightCommodityExemption", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateHeavyWeightCommodityExemption");
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
