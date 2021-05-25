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
    class IrregularityEventService : IIrregularityEventService
    {
        public IrregularityEvent GetIrregularityEventRecord(string recordID, string UserID)
        {
            try
            {
            IrregularityEvent irregularityEvent = new IrregularityEvent();
            SqlDataReader dr = null;
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularityEvent", Parameters);
                if (dr.Read())
                {
                    irregularityEvent.SNo = Convert.ToInt32(dr["SNo"]);
                    irregularityEvent.EventName = Convert.ToString(dr["EventName"]);
                    irregularityEvent.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    irregularityEvent.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                    irregularityEvent.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);
              
                    irregularityEvent.Active = Convert.ToString(dr["Active"]);
                }
                dr.Close();
                return irregularityEvent;
            }
            catch(Exception ex)// 
            {
                throw ex;   
            }
        }

        public KeyValuePair<string, List<SubCategoryTrans>> GetIrregularityIncidentRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            { 
            whereCondition = "IncidentCategorySNo=" + recordID;
            SubCategoryTrans SubCategory = new SubCategoryTrans();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetIrregularityIncidentSubCategoryRecord", Parameters);
            var SubCategoryList = ds.Tables[0].AsEnumerable().Select(e => new SubCategoryTrans
            {
                SNo = (e["SNo"]).ToString(),
                SubCategoryCode = e["SubCategoryCode"].ToString(),
                SubCategoryName = e["SubCategoryName"].ToString(),
                SubCategoryDesc = e["SubCategoryDesc"].ToString(),
                IsActive = Convert.ToInt32(e["IsActive"])
                 
                //Active = e["Active"].ToString(),
            });
            return new KeyValuePair<string, List<SubCategoryTrans>>("SNo", SubCategoryList.AsQueryable().ToList());
           }
            catch(Exception ex)//
            {
                throw ex;   
            }
        }
        public List<string> DeleteIrregularityIncidentSubCategoryRecord(string RecordID)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIncidentSubCategoryRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Tax");
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

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<IrregularityEvent>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularityEvent", Parameters);
            var IrregularityEventList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityEvent
            {
                SNo = Convert.ToInt32(e["SNo"]),

                EventName = e["EventName"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"]),
                Active = e["Active"].ToString().ToUpper(),
                //CreatedBy = e["CreatedBy"].ToString(),
                //CreatedOn = e["CreatedOn"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = IrregularityEventList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }
            catch(Exception ex)//
            {
                throw ex;  
            }
        }
        public List<string> SaveIrregularityEvent(List<IrregularityEvent> IrregularityEvent)
        {
            //validate Business Rule
            try
            { 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrregularityEvent = CollectionHelper.ConvertTo(IrregularityEvent, "Active,TransData");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("IrregularityEvent", dtCreateIrregularityEvent, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@IrregularityEventTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrregularityEvent;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIrregularityEvent", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityEvent");
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
        public List<string> UpdateIrregularityEvent(List<IrregularityEvent> IrregularityEvent)
        {
            try
            { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrregularityEvent = CollectionHelper.ConvertTo(IrregularityEvent, "Active,TransData");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("IrregularityEvent", dtCreateIrregularityEvent, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@IrregularityEventTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrregularityEvent;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityEvent", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityEvent");
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
        public List<string> DeleteIrregularityEvent(List<string> listID)
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
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityEvent", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "IrregularityEvent");
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
                throw ex;
            }
        }
    }
}



