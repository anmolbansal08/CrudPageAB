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
    #region IrregularityStatus Service Description
    /*
	*****************************************************************************
	Service Name:	IrregularityStatusService      
	Purpose:		This Service used to get details of Country save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		14 oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityStatusService : IIrregularityStatusService
    {

        public IrregularityStatus GetIrregularityStatusRecord(string recordID, string UserID)
        {
            try
            {
            IrregularityStatus c = new IrregularityStatus();
            SqlDataReader dr = null;
            

                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularityStatus", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.Status = dr["Status"].ToString();
                    c.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    c.UpdatedBy = dr["UpdatedUser"].ToString();
                    c.CreatedBy = dr["CreatedUser"].ToString();
                    c.Active = dr["ACTIVE"].ToString();
                }
                dr.Close();
                return c;
            }
            catch(Exception ex)// 
            {
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
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularityStatus", Parameters);
                var IrregularityStatusList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityStatus
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    Status = e["Status"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
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
                DataTable dtCreateIrregularityStatus = CollectionHelper.ConvertTo(IrregularityStatus, "");
                dtCreateIrregularityStatus.Columns.Remove("CreatedON");
                dtCreateIrregularityStatus.Columns.Remove("UpdatedON");
                //dtCreateIrregularityStatus.Columns.Remove("ISDeleted");

                dtCreateIrregularityStatus.Columns["SNo"].SetOrdinal(0);
                dtCreateIrregularityStatus.Columns["Status"].SetOrdinal(1);
                dtCreateIrregularityStatus.Columns["IsActive"].SetOrdinal(2);
                dtCreateIrregularityStatus.Columns["Active"].SetOrdinal(3);
                dtCreateIrregularityStatus.Columns["UpdatedBy"].SetOrdinal(4);
                dtCreateIrregularityStatus.Columns["CreatedBy"].SetOrdinal(5);
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("IrregularityStatus", dtCreateIrregularityStatus, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@IrregularityPackingTable";
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
                DataTable dtUpdateIrregularityStatus = CollectionHelper.ConvertTo(IrregularityStatus, "");

                dtUpdateIrregularityStatus.Columns.Remove("CreatedON");
                dtUpdateIrregularityStatus.Columns.Remove("UpdatedON");
                //dtUpdateIrregularityStatus.Columns.Remove("ISDeleted");

                dtUpdateIrregularityStatus.Columns["SNo"].SetOrdinal(0);
                dtUpdateIrregularityStatus.Columns["Status"].SetOrdinal(1);
                dtUpdateIrregularityStatus.Columns["IsActive"].SetOrdinal(2);
                dtUpdateIrregularityStatus.Columns["Active"].SetOrdinal(3);
                dtUpdateIrregularityStatus.Columns["UpdatedBy"].SetOrdinal(4);
                dtUpdateIrregularityStatus.Columns["CreatedBy"].SetOrdinal(5);
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("IrregularityStatus", dtUpdateIrregularityStatus, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@IrregularityStatusTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateIrregularityStatus;
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
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityStatus", Parameters);
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

                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
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
