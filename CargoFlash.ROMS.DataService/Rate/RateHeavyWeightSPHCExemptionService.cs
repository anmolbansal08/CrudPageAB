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
    public class RateHeavyWeightSPHCExemptionService : SignatureAuthenticate, IRateHeavyWeightSPHCExemptionService
    {
        /// <summary>
        /// Retrieve SPHC Sub Group infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <param name="page">page is the page number</param>
        /// <param name="pageSize">pageSize is the per page record</param>
        /// <param name="whereCondition">Where Condition according to which touple is to be retrieved</param>
        /// <param name="sort">Order by</param>
        /// <returns>total rows and record</returns>
        public KeyValuePair<string, List<RateHeavyWeightSPHCExemption>> GetRateHeavyWeightSPHCExemptionRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                RateHeavyWeightSPHCExemption RateHeavyWeightSPHCExemption = new RateHeavyWeightSPHCExemption();
                SqlParameter[] Parameters = { new SqlParameter("@RateHeavyWeightSurchargeSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateHeavyWeightSPHCExemption", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var RateHeavyWeightSPHCExemptionList = ds.Tables[0].AsEnumerable().Select(e => new RateHeavyWeightSPHCExemption
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    RateHeavyWeightSurchargeSNo = Convert.ToInt32(e["RateHeavyWeightSurchargeSNo"]),
                    SPHCSNo = Convert.ToInt32(e["SPHCSNo"].ToString()),
                    Code = e["Code"].ToString(),
                    HdnCode = Convert.ToInt32(e["SPHCSNo"].ToString()),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"].ToString()),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]).ToString(DateFormat.DateFormatString),
                    ValidTo = Convert.ToDateTime(e["ValidTo"]).ToString(DateFormat.DateFormatString),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    Active = e["Active"].ToString().ToUpper()
                });
                return new KeyValuePair<string, List<RateHeavyWeightSPHCExemption>>(ds.Tables[1].Rows[0][0].ToString(), RateHeavyWeightSPHCExemptionList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }

        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="RateHeavyWeightSPHCExemption">object of the Entity</param>

        public List<string> createUpdateRateHeavyWeightSPHCExemption(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtRateHeavyWeightSPHCExemption = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtRateHeavyWeightSPHCExemption.Columns.Remove("Code");
                dtRateHeavyWeightSPHCExemption.Columns["HdnCode"].ColumnName = "SPHCSNo";
                var dtCreateRateHeavyWeightSPHCExemption = (new DataView(dtRateHeavyWeightSPHCExemption, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateRateHeavyWeightSPHCExemption = (new DataView(dtRateHeavyWeightSPHCExemption, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateHeavyWeightSPHCExemptionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateRateHeavyWeightSPHCExemption.Rows.Count > 0)
                {
                    param.Value = dtCreateRateHeavyWeightSPHCExemption;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateHeavyWeightSPHCExemption", Parameters);
                }
                // for update existing record
                if (dtUpdateRateHeavyWeightSPHCExemption.Rows.Count > 0)
                {
                    param.Value = dtUpdateRateHeavyWeightSPHCExemption;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateHeavyWeightSPHCExemption", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateHeavyWeightSPHCExemption");
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
        /// delete the perticular RateHeavyWeightSPHCExemption touple
        /// </summary>
        /// <param name="RecordID">Id of that RateHeavyWeightSPHCExemption touple</param>
        public List<string> deleteRateHeavyWeightSPHCExemption(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateHeavyWeightSPHCExemption", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateHeavyWeightSPHCExemption");
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
