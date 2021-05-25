using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ApplicationEntityValueListService : SignatureAuthenticate, IApplicationEntityValueListService
    {
        // get data in grid
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ApplicationEntityGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), 
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetApplicationEntityList", Parameters);

                var ApplicationEntityList = ds.Tables[0].AsEnumerable().Select(e => new ApplicationEntityGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ApplicationCode = e["ApplicationCode"].ToString(),
                    ApplicationName = e["ApplicationName"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    IsActive = e["IsActive"].ToString().ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ApplicationEntityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = "GetApplicationEntityList"
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }


        // for read
        public KeyValuePair<string, List<ApplicationEntity>> GetApplicationEntityValueListRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ApplicationEntity AccountCommission = new ApplicationEntity();

                SqlParameter[] Parameters = { new SqlParameter("@applicationSno", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetApplicationEntityValueList", Parameters);
                var ApplicationEntity = ds.Tables[0].AsEnumerable().Select(e => new ApplicationEntity
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ApplicationCode = e["Code"].ToString(),
                    ApplicationName = e["Name"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    IsActive = e["IsActive"].ToString().ToLower() == "true" ? "1" : "0",
                    Active = e["Active"].ToString()

                });
                return new KeyValuePair<string, List<ApplicationEntity>>(ds.Tables[1].Rows[0][0].ToString(), ApplicationEntity.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //Delete Row
        public List<string> DeleteApplicationEntityValueListRecord(string RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteApplicationEntityValueListRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ApplicationEntityValueList");
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
            }
            catch(Exception ex)//// (Exception e)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        //create Update
        public List<Tuple<string, int>> createUpdateApplicationEntityValueListRecord(string strData)
        {
            try
            {
                int ret = 0;
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtApplicationEntity = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //if (dtAccountCommision.Columns.Contains("ApplicationCode"))
                //    dtAccountCommision.Columns.Remove("AccountCommisionType");
                var dtCreateApplicationEntityList = (new DataView(dtApplicationEntity, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateApplicationEntityList = (new DataView(dtApplicationEntity, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@_ApplicationEntitValueList";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                //return ErrorMessage;
                // for create new record
                if (dtCreateApplicationEntityList.Rows.Count > 0)
                {
                    param.Value = dtCreateApplicationEntityList;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "[CreateApplicationEntityValuelist]", Parameters);
                }
                // for update existing record
                if (dtUpdateApplicationEntityList.Rows.Count > 0)
                {
                    param.Value = dtUpdateApplicationEntityList;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateApplicationEntityValueList", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ApplicationEntityValueList");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));

                    }
                    else if (ret > 1001)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ApplicationEntityValueList");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));

                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (dataBaseExceptionMessage == "Related Information Not Found.")
                        {
                            dataBaseExceptionMessage = "Status Updated Successfully";
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                    }

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
