using System;
using System.Collections.Generic;
using System.Linq;
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
    #region Commodity Package Service Description
    /*
	*****************************************************************************
	Service Name:	CommodityPackageService      
	Purpose:		This Service used to get details of Commodity Package save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		22 May 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommodityPackageService : SignatureAuthenticate, ICommodityPackageService
    {
        public CommodityPackage GetCommodityPackageRecord(string recordID, string UserID)
        {
            CommodityPackage CommodityPackage = new CommodityPackage();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCommodityPackage", Parameters);
                if (dr.Read())
                {
                    CommodityPackage.SNo = Convert.ToInt32(dr["SNo"]);
                    CommodityPackage.Name = dr["Name"].ToString();
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        CommodityPackage.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        CommodityPackage.Active = dr["Active"].ToString().ToUpper();
                    }
                    CommodityPackage.UpdatedBy = dr["UpdatedUser"].ToString();
                    CommodityPackage.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return CommodityPackage;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CommodityPackage>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCommodityPackage", Parameters);
                var CommodityPackageList = ds.Tables[0].AsEnumerable().Select(e => new CommodityPackage
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommodityPackageList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCommodityPackage(List<CommodityPackage> CommodityPackage)
        {
            //validate Business Rule
            DataTable dtCreateCommodityPackage = CollectionHelper.ConvertTo(CommodityPackage, "Active");
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("CommodityPackage", dtCreateCommodityPackage, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityPackageTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodityPackage;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommodityPackage", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CommodityPackage");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
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

        public List<string> UpdateCommodityPackage(List<CommodityPackage> CommodityPackage)
        {
            //validate Business Rule
            DataTable dtCreateCommodityPackage = CollectionHelper.ConvertTo(CommodityPackage, "Active");
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("CommodityPackage", dtCreateCommodityPackage, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityPackageTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodityPackage;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommodityPackage", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CommodityPackage");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
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

        public List<string> DeleteCommodityPackage(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommodityPackage", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommodityPackage");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        #region Commodity Package Trans

        public KeyValuePair<string, List<CommodityPackageTrans>> GetCommodityPackageTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                CommodityPackageTrans CommodityPackageTrans = new CommodityPackageTrans();
                SqlParameter[] Parameters = { new SqlParameter("@CommodityPackageSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCommodityPackageTrans", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var CommodityPackageTransList = ds.Tables[0].AsEnumerable().Select(e => new CommodityPackageTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CommodityPackageSNo = Convert.ToInt32(e["CommodityPackageSNo"]),
                    CommoditySNo = e["CommodityCode"].ToString(),
                    HdnCommoditySNo = e["CommoditySNo"].ToString(),
                    CommodityGroupSNo = e["GroupName"].ToString(),
                    HdnCommodityGroupSNo = e["CommodityGroupSNo"].ToString(),
                    CommoditySubGroupSNo = e["SubGroupName"].ToString(),
                    HdnCommoditySubGroupSNo = e["CommoditySubGroupSNo"].ToString(),
                    Active = e["Active"].ToString(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<CommodityPackageTrans>>(ds.Tables[1].Rows[0][0].ToString(), CommodityPackageTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> createUpdateCommodityPackageTrans(string strData)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                // convert JSON string ito datatable
                var dtCommodityPackageTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtCommodityPackageTrans.Columns.Remove("CommoditySNo");
                dtCommodityPackageTrans.Columns.Remove("CommodityGroupSNo");
                dtCommodityPackageTrans.Columns.Remove("CommoditySubGroupSNo");
                var dtCreateCommodityPackageTrans = (new DataView(dtCommodityPackageTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCommodityPackageTrans = (new DataView(dtCommodityPackageTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityPackageTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCommodityPackageTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateCommodityPackageTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommodityPackageTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateCommodityPackageTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateCommodityPackageTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommodityPackageTrans", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommodityPackageTrans");
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

        public List<string> deleteCommodityPackageTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommodityPackageTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommodityPackageTrans");
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

        #endregion
    }
}
