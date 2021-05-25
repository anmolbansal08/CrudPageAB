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
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AlertEventTypeService : SignatureAuthenticate, IAlertEventTypeService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Permissions.AlertEventType>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAlertEventType", Parameters);
            var AlertEventTypeList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Permissions.AlertEventType
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AlertEventTypeName = Convert.ToString(e["AlertEventTypeName"]),
                CreatedBy = Convert.ToString(e["CreatedBy"]),
                UpdatedBy = Convert.ToString(e["UpdatedBy"]),
                Active = Convert.ToString(e["Active"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = AlertEventTypeList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };

        }

        public AlertEventType GetAlertEventTypeRecord(string recordID, string UserSNo)
        {
            AlertEventType alertEventType = new AlertEventType();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAlertEventType", Parameters);
                if (dr.Read())
                {
                    alertEventType.SNo = Convert.ToInt32(dr["SNo"]);
                    alertEventType.AlertEventTypeName = Convert.ToString(dr["AlertEventTypeName"]);
                    alertEventType.UpdatedBy = dr["UpdatedBy"].ToString();
                    alertEventType.CreatedBy = dr["CreatedBy"].ToString();
                    alertEventType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    alertEventType.Active = dr["Active"].ToString();

                }
            }
            catch (Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return alertEventType;
        }

        public List<string> SaveAlertEventType(AlertEventType alertEventType)
        {
            //validate Business Rule
            
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = {
                                      new SqlParameter("@AlertSNo",alertEventType.SNo),
                                      new SqlParameter("@AlertEventTypeName",alertEventType.AlertEventTypeName),
                                      new SqlParameter("@CreatedBy",alertEventType.CreatedBy),
                                      new SqlParameter("@IsActive",alertEventType.IsActive),
                                    };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAlertEventType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AlertEventType");
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

        public List<string> UpdateAlertEventType(AlertEventType alertEventType)
        {
            //validate Business Rule
            
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter[] Parameters = {
                                     new SqlParameter("@AlertSNo",alertEventType.SNo),
                                    new SqlParameter("@AlertEventTypeName",alertEventType.AlertEventTypeName),
                                     new SqlParameter("@UpdatedBy",alertEventType.UpdatedBy),
                                      new SqlParameter("@IsActive",alertEventType.IsActive),
                                   
                                    };

            //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAlertEventType", Parameters);
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAlertEventType", Parameters);
       
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AlertEventType");
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

        public List<string> DeleteAlertEventType(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@AlertSNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAlertEventType", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AlertEventType");
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

 
    }
}


