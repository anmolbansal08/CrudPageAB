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
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
namespace CargoFlash.Cargo.DataService.Irregularity
{
    #region Irregularity Service Description
    /*
	*****************************************************************************
	Service Name:	AirlineService      
	Purpose:		This Service used to get details of Airline save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
  public  class IrregularityStatusSevice:IIrregularityStatusSevice
    {
        public IrregularityStatus GetIrregularityStatusRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            {
            IrregularityStatus irregularityStatus = new IrregularityStatus();
            
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularityStatus", Parameters);
                if (dr.Read())
                {
                    irregularityStatus.SNo = Convert.ToInt32(dr["SNo"]);
                    irregularityStatus.Status = Convert.ToString(dr["Status"]);
                    irregularityStatus.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    irregularityStatus.CreatedOn = Convert.ToString(dr["CreatedOn"]);
                    irregularityStatus.CreatedBy = Convert.ToString(dr["CreatedOn"]);
                    irregularityStatus.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    irregularityStatus.UpdatedOn = Convert.ToString(dr["UpdatedOn"]);
                    
                    irregularityStatus.Active = Convert.ToString(dr["Active"]);
                }
                dr.Close();
                return irregularityStatus;
            }
            catch(Exception ex)// 
            {
                dr.Close();
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
            
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<IrregularityStatus>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularityStatus", Parameters);
                var IrregularityStatusList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityStatus
                {
                    SNo = Convert.ToInt32(e["SNo"]),

                    Status = e["Status"].ToString().ToUpper(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString().ToUpper(),
                    //CreatedBy = e["CreatedBy"].ToString(),
                    //CreatedOn = e["CreatedOn"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IrregularityStatusList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        public List<string> SaveIrregularityStatus(List<IrregularityStatus> IrregularityStatus)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrregularityStatus = CollectionHelper.ConvertTo(IrregularityStatus, "Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("IrregularityStatus", dtCreateIrregularityStatus, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@IrregularityStatusTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrregularityStatus;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIrregularityStatus", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityStatus");
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

                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        public List<string> UpdateIrregularityStatus(List<IrregularityStatus> IrregularityStatus)
        {
            //validate Business Rule
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrregularityStatus = CollectionHelper.ConvertTo(IrregularityStatus, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("IrregularityStatus", dtCreateIrregularityStatus, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@IrregularityStatusTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrregularityStatus;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityStatus", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityStatus");
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

                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        public List<string> DeleteIrregularityStatus(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityStatus", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "IrregularityStatus");
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
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
    }
}
