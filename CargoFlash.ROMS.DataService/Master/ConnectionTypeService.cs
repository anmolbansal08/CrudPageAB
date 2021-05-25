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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ConnectionTypeService : SignatureAuthenticate, IConnectionTypeService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ConnectionType>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListConnectionType", Parameters);
                var ConnectionTypeList = ds.Tables[0].AsEnumerable().Select(e => new ConnectionType
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    ConnectionTypeName = e["ConnectionTypeName"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),//foriegn key
                    Text_BasedOn = e["Text_BasedOn"].ToString().ToUpper(),
                    Text_IsRouteSetting = e["Text_IsRouteSetting"].ToString().ToUpper(),
                    UpdatedUser = e["UpdatedUser"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ConnectionTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public ConnectionType GetConnectionTypeRecord(string recordID, string UserSNo)
        {

            try
            {
                ConnectionType connectionType = new ConnectionType();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordConnectionType", Parameters);
                if (dr.Read())
                {
                    connectionType.SNo = Convert.ToInt32(dr["SNo"]);
                    connectionType.ConnectionTypeName = Convert.ToString(dr["ConnectionTypeName"]).ToUpper();
                    connectionType.ConnectionTypeDesc = dr["ConnectionTypeDesc"] == "" ? "" : Convert.ToString(dr["ConnectionTypeDesc"]);
                    connectionType.BasedOn = dr["BasedOn"] == "" ? 255 : Convert.ToInt32(dr["BasedOn"]);
                    connectionType.Text_BasedOn = dr["Text_BasedOn"] == "" ? "" : Convert.ToString(dr["Text_BasedOn"]);
                    connectionType.IsRouteSetting = dr["IsRouteSetting"] == "" ? true : Convert.ToBoolean(dr["IsRouteSetting"]);
                    connectionType.Text_IsRouteSetting = dr["Text_IsRouteSetting"] == "" ? "" : Convert.ToString(dr["Text_IsRouteSetting"]);

                    //connectionType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        connectionType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        connectionType.Active = dr["Active"].ToString().ToUpper();
                    }
                    connectionType.UpdatedUser = dr["UpdatedUser"].ToString().ToUpper();
                    connectionType.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
                dr.Close();
                return connectionType;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveConnectionType(List<ConnectionType> ConnectionType)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {

                DataTable dtCreateConnectionType = CollectionHelper.ConvertTo(ConnectionType, "Active,Text_ConnectionTypeName,Text_BasedOn,Text_IsRouteSetting");
                dtCreateConnectionType.Columns.Add("UpdatedBy");
                dtCreateConnectionType.Rows[0]["UpdatedBy"] = ConnectionType[0].UpdatedUser;
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ConnectionType", dtCreateConnectionType, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ConnectionTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateConnectionType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateConnectionType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConnectionType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteConnectionType(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConnectionType", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ConnectionType");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> UpdateConnectionType(List<ConnectionType> ConnectionType)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateConnectionType = CollectionHelper.ConvertTo(ConnectionType, "Active,Text_ConnectionTypeName,Text_BasedOn,Text_IsRouteSetting");

                dtCreateConnectionType.Columns.Add("UpdatedBy");
                dtCreateConnectionType.Rows[0]["UpdatedBy"] = ConnectionType[0].UpdatedUser;


                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ConnectionType", dtCreateConnectionType, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ConnectionTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateConnectionType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateConnectionType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ConnectionType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }
}
