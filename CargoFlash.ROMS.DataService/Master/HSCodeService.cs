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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region HSCode Service Description
    /*
	*****************************************************************************
	Service Name:   HSCodeService      
	Purpose:		This Service used to get details of HSCode save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Priti Yadav
	Created On:		20 Apr 2020
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HSCodeService : SignatureAuthenticate, IHSCodeService
    {
        public HSCodes GetHSCodeRecord(int recordID, string UserSNo)
        {
            HSCodes ct = new HSCodes();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHSCode", Parameters);
                if (dr.Read())
                {
                    ct.SNo = Convert.ToInt32(dr["SNo"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        ct.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        ct.Active = dr["Active"].ToString().ToUpper();
                    }
                    ct.HSCode = dr["HSCode"].ToString().ToUpper();
                    ct.DescriptionOFGoods = dr["DescriptionOFGoods"].ToString().ToUpper();
                    ct.UpdatedBy = dr["UpdatedUser"].ToString();
                    ct.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch (Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return ct;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<HSCodes>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListHSCode", Parameters);

                var HSCodeList = ds.Tables[0].AsEnumerable().Select(e => new HSCodes
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    HSCode = e["HSCode"].ToString().ToUpper(),
                    DescriptionOFGoods = e["DescriptionOFGoods"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = HSCodeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> SaveHSCode(List<HSCodes> HSCodes)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateHSCode = CollectionHelper.ConvertTo(HSCodes, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HSCodeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateHSCode;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateHSCode", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HSCode");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> UpdateHSCode(List<HSCodes> HSCodes)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreatHSCode = CollectionHelper.ConvertTo(HSCodes, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("HSCode", dtCreatHSCode, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HSCodeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatHSCode;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateHSCode", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HSCode");
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
            catch (Exception ex)
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteHSCode(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteHSCode", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "HSCode");
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
            catch (Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

    }

}
