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
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region RateSurchargeCommodityService  Description
    /*
	*****************************************************************************
	interface Name:		RateSurchargeCommodityService      
	Purpose:		    This interface used to handle RateSurchargeCommodityService
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Parvez Khan
	Created On:		    7 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateSurchargeCommodityService : SignatureAuthenticate, IRateSurchargeCommodityService
    {
        public RateSurchargeCommodity GetRateSurchargeCommodityRecord(string recordID, string UserID)
        {
            RateSurchargeCommodity RateSurchargeCommodity = new RateSurchargeCommodity();
            SqlDataReader dr = null;
            try
            {
                int number = 0;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRateSurchargeCommodity", Parameters);
                if (dr.Read())
                {
                    RateSurchargeCommodity.SNo = Convert.ToInt32(dr["SNo"]);
                    RateSurchargeCommodity.SurChargeName = dr["SurChargeName"].ToString();
                    RateSurchargeCommodity.CommoditySNo = Convert.ToInt32(dr["CommoditySNo"]);
                    RateSurchargeCommodity.CommoditySubGroupSNo = Convert.ToInt32(dr["CommoditySubGroupSNo"]);
                    RateSurchargeCommodity.StartWeight = Convert.ToDecimal(dr["StartWeight"] == "" ? "0" : dr["StartWeight"]);
                    RateSurchargeCommodity.EndWeight = Convert.ToDecimal(dr["EndWeight"] == "" ? "0" : dr["EndWeight"]);
                    RateSurchargeCommodity.ValueType = Int32.TryParse(dr["ValueType"].ToString(), out number) ? number : 0;
                    RateSurchargeCommodity.Text_ValueType = dr["ValueTypeName"].ToString();
                    RateSurchargeCommodity.Text_CommoditySNo = dr["Text_CommoditySNo"].ToString();
                    RateSurchargeCommodity.Text_CommoditySubGroupSNo = dr["Text_CommoditySubGroupSNo"].ToString();
                    RateSurchargeCommodity.Value = Convert.ToDecimal(dr["Value"] == "" ? "0" : dr["Value"]);
                    RateSurchargeCommodity.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    RateSurchargeCommodity.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    RateSurchargeCommodity.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    RateSurchargeCommodity.IsInternational = Convert.ToBoolean(dr["IsInternational"]);
                    RateSurchargeCommodity.IsEditable = Convert.ToBoolean(dr["IsEditable"]);

                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        RateSurchargeCommodity.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        RateSurchargeCommodity.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsEditable"].ToString()))
                    {
                        RateSurchargeCommodity.IsEditable = Convert.ToBoolean(dr["IsEditable"]);
                        RateSurchargeCommodity.Editable = dr["Editable"].ToString().ToUpper();
                    }
                    RateSurchargeCommodity.UpdatedBy = dr["UpdatedUser"].ToString();
                    RateSurchargeCommodity.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
                 catch(Exception ex)//(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
           
            return RateSurchargeCommodity;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateSurchargeCommodity>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateSurchargeCommodity", Parameters);
                var RateSurchargeCommodityList = ds.Tables[0].AsEnumerable().Select(e => new RateSurchargeCommodity
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SurChargeName = e["SurChargeName"].ToString().ToUpper(),
                    Text_CommoditySNo = e["Commodity"].ToString(),
                    Text_CommoditySubGroupSNo = e["CommoditySubGroup"].ToString(),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"]),
                    ValueType = Convert.ToInt32(e["ValueType"]),
                    Text_ValueType = e["Text_ValueType"].ToString(),
                    Value = Convert.ToDecimal(e["Value"]),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"].ToString()),
                    ValidTo = Convert.ToDateTime(e["ValidTo"].ToString()),
                    Active = e["IsActive"].ToString().ToUpper(),
                    Editable = e["IsEditable"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateSurchargeCommodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveRateSurchargeCommodity(List<RateSurchargeCommodity> RateSurchargeCommodity)
        {
            //validate Business Rule
            try
            {
                DataTable dtCreateRateSurchargeCommodity = CollectionHelper.ConvertTo(RateSurchargeCommodity, "Active,Editable,Text_ValueType,Text_CommoditySNo,Text_CommoditySubGroupSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateSurchargeCommodity", dtCreateRateSurchargeCommodity, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateSurchargeCommodityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateRateSurchargeCommodity;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateSurchargeCommodity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurchargeCommodity");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> UpdateRateSurchargeCommodity(List<RateSurchargeCommodity> RateSurchargeCommodity)
        {
            //validate Business Rule
            try
            {
                DataTable dtUpdateRateSurchargeCommodity = CollectionHelper.ConvertTo(RateSurchargeCommodity, "Active,International,Editable,Deleted,Text_ValueType,Text_CommoditySNo,Text_CommoditySubGroupSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateSurchargeCommodity", dtUpdateRateSurchargeCommodity, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateSurchargeCommodityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateRateSurchargeCommodity;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateSurchargeCommodity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurchargeCommodity");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> DeleteRateSurchargeCommodity(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateSurchargeCommodity", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateSurchargeCommodity");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)//
            {

                throw ex;
            }
        }

        public DataSourceResult GetCommodityBySubGroupSno(int SubGroupSno)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@SubGroupSno", SubGroupSno) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommodityBySubGroupSno", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["SNo"].ToString());
                    cur.Add(dr["CommodityCode"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
