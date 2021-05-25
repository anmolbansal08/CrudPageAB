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
using CargoFlash.Cargo.DataService.Tariff;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region RateSurchargeSPHCService  Description
    /*
	*****************************************************************************
	interface Name:		RateSurchargeSPHCService      
	Purpose:		    This interface used to handle RateSurchargeSPHCService
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
    public class RateSurchargeSPHCService : SignatureAuthenticate, IRateSurchargeSPHCServices
    {
        public RateSurchargeSPHC GetRateSurchargeSPHCRecord(string recordID, string UserID)
        {
            RateSurchargeSPHC RateSurchargeSPHC = new RateSurchargeSPHC();
            SqlDataReader dr = null;
            try
            {
                int number = 0;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRateSurchargeSPHC", Parameters);
                if (dr.Read())
                {
                    RateSurchargeSPHC.SNo = Convert.ToInt32(dr["SNo"]);
                    RateSurchargeSPHC.SurChargeName = dr["SurChargeName"].ToString();
                    RateSurchargeSPHC.SPHCSNo = Convert.ToInt32(dr["SPHCSNo"]);
                    RateSurchargeSPHC.StartWeight = Convert.ToDecimal(dr["StartWeight"] == "" ? "0" : dr["StartWeight"]);
                    RateSurchargeSPHC.EndWeight = Convert.ToDecimal(dr["EndWeight"] == "" ? "0" : dr["EndWeight"]);
                    RateSurchargeSPHC.ValueType = Int32.TryParse(dr["ValueType"].ToString(), out number) ? number : 0;
                    RateSurchargeSPHC.Text_ValueType = dr["ValueTypeName"].ToString();
                    RateSurchargeSPHC.Text_SPHCSNo = dr["Text_SPHCSNo"].ToString();
                    RateSurchargeSPHC.Value = Convert.ToDecimal(dr["Value"] == "" ? "0" : dr["Value"]);
                    RateSurchargeSPHC.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    RateSurchargeSPHC.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    RateSurchargeSPHC.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    RateSurchargeSPHC.IsInternational = Convert.ToBoolean(dr["IsIntermational"]);
                    RateSurchargeSPHC.IsEditable = Convert.ToBoolean(dr["IsEditable"]);

                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        RateSurchargeSPHC.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        RateSurchargeSPHC.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsEditable"].ToString()))
                    {
                        RateSurchargeSPHC.IsEditable = Convert.ToBoolean(dr["IsEditable"]);
                        RateSurchargeSPHC.Editable = dr["Editable"].ToString().ToUpper();
                    }
                    RateSurchargeSPHC.UpdatedBy = dr["UpdatedUser"].ToString();
                    RateSurchargeSPHC.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)//
            {
                     dr.Close();
                throw ex;
            }
           
            return RateSurchargeSPHC;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateSurchargeSPHC>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateSurchargeSPHC", Parameters);
                var RateSurchargeSPHCList = ds.Tables[0].AsEnumerable().Select(e => new RateSurchargeSPHC
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SurChargeName = e["SurChargeName"].ToString().ToUpper(),
                    Text_SPHCSNo = e["SPHC"].ToString(),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"]),
                    ValueType = Convert.ToInt32(e["ValueType"]),
                    Text_ValueType = e["Text_ValueType"].ToString(),
                    Value = Convert.ToDecimal(e["Value"]),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"].ToString()),
                    ValidTo = Convert.ToDateTime(e["ValidTo"].ToString()),
                    Active = e["Active"].ToString().ToUpper(),
                    Editable = e["Editable"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateSurchargeSPHCList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }

        }
        public List<string> SaveRateSurchargeSPHC(List<RateSurchargeSPHC> RateSurchargeSPHC)
        {
            //validate Business Rule
            try
            {
                DataTable dtCreateRateSurchargeSPHC = CollectionHelper.ConvertTo(RateSurchargeSPHC, "Active,Editable,Text_ValueType,Text_SPHCSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateSurchargeSPHC", dtCreateRateSurchargeSPHC, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateSurchargeSPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateRateSurchargeSPHC;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateSurchargeSPHC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurchargeSPHC");
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
            catch(Exception ex)//
            {
              
                throw ex;
            }
        }
        public List<string> UpdateRateSurchargeSPHC(List<RateSurchargeSPHC> RateSurchargeSPHC)
        {
            //validate Business Rule
            try
            {
                DataTable dtUpdateRateSurchargeSPHC = CollectionHelper.ConvertTo(RateSurchargeSPHC, "Active,International,Editable,Deleted,Text_ValueType,Text_SPHCSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateSurchargeSPHC", dtUpdateRateSurchargeSPHC, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateSurchargeSPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateRateSurchargeSPHC;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateSurchargeSPHC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurchargeSPHC");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> DeleteRateSurchargeSPHC(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateSurchargeSPHC", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateSurchargeSPHC");
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
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
