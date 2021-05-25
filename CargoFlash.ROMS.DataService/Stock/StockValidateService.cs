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
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Stock
{
    #region StockValidateService interface Description
    /*
	*****************************************************************************
	interface Name:		IStockValidateService      
	Purpose:		    This interface used to handle StockValidateService
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Parvez KHan
	Created On:		    7 NOV 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class StockValidateService : SignatureAuthenticate, IStockValidateService
    {
        public StockValidate GetStockValidateRecord(string recordID, string UserID)
        {
            StockValidate StockValidate = new StockValidate();
            SqlDataReader dr = null;
            try
            {
                int number = 0;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordStockValidate", Parameters);
                if (dr.Read())
                {
                    StockValidate.SNo = Convert.ToInt32(dr["SNo"]);
                    StockValidate.CountrySNo = Convert.ToInt32(dr["CountrySNo"]);
                    StockValidate.Text_CountrySNo = dr["Text_CountrySNo"].ToString();
                    StockValidate.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    StockValidate.Text_AirlineSNo = (dr["Text_AirlineSNo"]).ToString();
                    StockValidate.AutoAWB = dr["AutoAWB"].ToString();
                    StockValidate.AWBType = Convert.ToInt32(dr["AWBType"]);
                    StockValidate.Text_AWBType = dr["Text_AWBType"].ToString();
                    StockValidate.AWBSeries = Convert.ToInt32(dr["AWBSeries"]);
                    StockValidate.StockValidity = Convert.ToInt32(dr["StockValidity"]);
                    StockValidate.IsAutoAWB = Convert.ToInt32(dr["IsAutoAWB"]);
                    StockValidate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        StockValidate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        StockValidate.Active = dr["Active"].ToString().ToUpper();
                    }

                    StockValidate.UpdatedUser = dr["UpdatedUser"].ToString();
                   
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return StockValidate;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<StockValidate>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListStockValidate", Parameters);
                var StockValidateList = ds.Tables[0].AsEnumerable().Select(e => new StockValidate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_CountrySNo = e["Text_CountrySNo"].ToString(),
                    Text_AirlineSNo = (e["Text_AirlineSNo"]).ToString(),
                    AutoAWB = e["AutoAWB"].ToString(),
                    Text_AWBType = e["Text_AWBType"].ToString(),
                    AWBSeries = Convert.ToInt32(e["AWBSeries"]),
                    StockValidity = Convert.ToInt32(e["StockValidity"]),
                    UpdatedOn = Convert.ToDateTime(e["UpdatedOn"]),
                    UpdatedUser = e["UpdatedUser"].ToString(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = StockValidateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveStockValidate(List<StockValidate> StockValidate)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateStockValidate = CollectionHelper.ConvertTo(StockValidate, "Text_AirlineSNo,Text_CountrySNo,AutoAWB,Text_AWBType,Active,UpdatedUser");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("StockValidate", dtCreateStockValidate, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@StockValidateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateStockValidate;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateStockValidate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "StockValidate");
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
        public List<string> UpdateStockValidate(List<StockValidate> StockValidate)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdateStockValidate = CollectionHelper.ConvertTo(StockValidate, "Active,International,Editable,Deleted,Text_ValueType,Text_SPHCSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("StockValidate", dtUpdateStockValidate, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@StockValidateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateStockValidate;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateStockValidate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "StockValidate");
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
        public List<string> DeleteStockValidate(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteStockValidate", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "StockValidate");
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
