using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommoditySubGroupService : SignatureAuthenticate, ICommoditySubGroupService
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
        public KeyValuePair<string, List<CommoditySubGroup>> GetCommoditySubGroupRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                CommoditySubGroup CommoditySubGroup = new CommoditySubGroup();
                SqlParameter[] Parameters = { new SqlParameter("@CommodityGroupSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCommoditySubGroup", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var CommoditySubGroupList = ds.Tables[0].AsEnumerable().Select(e => new CommoditySubGroup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CommodityGroupSNo = Convert.ToInt32(e["CommodityGroupSNo"]),
                    StartRange = (e["StartRange"].ToString()),
                    EndRange = (e["EndRange"].ToString()),
                    SubGroupName = e["SubGroupName"].ToString().ToUpper(),
                    IsHeavyWeightExempt = Convert.ToInt32(e["IsHeavyWeightExempt"]),
                    HeavyWeightExempt = e["HeavyWeightExempt"].ToString().ToUpper(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    Active = e["Active"].ToString().ToUpper()
                });
                return new KeyValuePair<string, List<CommoditySubGroup>>(ds.Tables[1].Rows[0][0].ToString(), CommoditySubGroupList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            
        }
       
        /// <summary>
        /// Save/Update the Entity into the database
        /// </summary>
        /// <param name="CommoditySubGroup">object of the Entity</param>

        public List<string> createUpdateCommoditySubGroup(string strData)
        {
            int ret =0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                // convert JSON string into datatable
                var dtCommoditySubGroup = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                var dtCreateCommoditySubGroup = (new DataView(dtCommoditySubGroup, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCommoditySubGroup = (new DataView(dtCommoditySubGroup, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommoditySubGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCommoditySubGroup.Rows.Count > 0)
                {
                    param.Value = dtCreateCommoditySubGroup;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommoditySubGroup", Parameters);
                }
                // for update existing record
                if (dtUpdateCommoditySubGroup.Rows.Count > 0 && ret == 0)
                {
                    param.Value = dtUpdateCommoditySubGroup;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommoditySubGroup", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommoditySubGroup");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }

            return ErrorMessage;
        }

      
        /// <summary>
        /// delete the perticular CommoditySubGroup touple
        /// </summary>
        /// <param name="RecordID">Id of that CommoditySubGroup touple</param>
        public List<string> deleteCommoditySubGroup(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommoditySubGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommoditySubGroup");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
      
    }
}
