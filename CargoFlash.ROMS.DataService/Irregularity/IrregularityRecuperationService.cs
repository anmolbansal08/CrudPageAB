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
    #region IrregularityPacking Service Description
    /*
	*****************************************************************************
	Service Name:	IrregularityRecuperationService      
	Purpose:		This Service used to get details of Country save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta
	Created On:		12 oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityRecuperationService : IIrregularityRecuperationService
    {
        public IrregularityRecuperation GetIrregularityRecuperationRecord(string recordID, string UserID)
        {
            try
            {
            IrregularityRecuperation c = new IrregularityRecuperation();
            SqlDataReader dr = null;
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularityRecuperation", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.RecuperationType = dr["RecuperationType"].ToString();
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
                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<IrregularityRecuperation>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularityRecuperation", Parameters);
            var IrregularityRecuperationList = ds.Tables[0].AsEnumerable().Select(e => new IrregularityRecuperation
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                RecuperationType = e["RecuperationType"].ToString().ToUpper(),
                Active = e["Active"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = IrregularityRecuperationList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveIrregularityRecuperation(List<IrregularityRecuperation> IrregularityPacking)
        {
            //validate Business Rule
            try
            { 
            DataTable dtCreateIrregularityRecuperation = CollectionHelper.ConvertTo(IrregularityPacking, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("IrregularityRecuperation", dtCreateIrregularityRecuperation, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@IrregularityRecuperationTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrregularityRecuperation;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIrregularityRecuperation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityRecuperation");
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
        public List<string> UpdateIrregularityRecuperation(List<IrregularityRecuperation> IrregularityPacking)
        {
            //validate Business Rule
            try
            { 
            DataTable dtUpdateIrregularityRecuperation = CollectionHelper.ConvertTo(IrregularityPacking, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("IrregularityRecuperation", dtUpdateIrregularityRecuperation, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@IrregularityRecuperationTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateIrregularityRecuperation;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIrregularityRecuperation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityRecuperation");
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
        public List<string> DeleteIrregularityRecuperation(List<string> listID)
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

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityRecuperation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityRecuperation");
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
                throw ex;
            }
        }
    }
}
