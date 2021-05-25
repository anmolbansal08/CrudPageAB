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
using CargoFlash.Cargo.Model;
using Newtonsoft.Json;
using System.Net;


namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class LoginColorCodeService : SignatureAuthenticate, ILoginColorCodeService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<LoginColorCode>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListLoginColorCode", Parameters);
                var TempLocationList = ds.Tables[0].AsEnumerable().Select(e => new LoginColorCode
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString().ToUpper(),
                    ColorCodeSNo = Convert.ToInt32(e["ColorCodeSNo"]),
                    ColorCode = e["ColorCode"].ToString().ToUpper(),
                    ColorName = e["ColorName"].ToString().ToUpper(),
                    MaxUsers = Convert.ToInt32(e["MaxUsers"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TempLocationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public LoginColorCode GetLoginColorCodeRecord(string recordID, string UserID)
        {
            LoginColorCode ERC = new LoginColorCode();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordLoginColorCode", Parameters);
                if (dr.Read())
                {
                    ERC.SNo = Convert.ToInt32(dr["SNo"]);
                    ERC.Name = dr["Name"].ToString();
                    ERC.ColorCodeSNo = Convert.ToInt32(dr["ColorCodeSNo"]);
                    ERC.MaxUsers = Convert.ToInt32(dr["MaxUsers"]);
                    ERC.ColorCode = dr["ColorCodeSNo"].ToString();
                    ERC.Text_ColorCode = dr["ColorCode"].ToString() + "-" + dr["ColorName"].ToString();
                    ERC.ColorName = dr["ColorName"].ToString();
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return ERC;
        }
        public List<string> SaveLoginColorCode(List<LoginColorCode> LoginColorCode)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateLoginColorCode = CollectionHelper.ConvertTo(LoginColorCode, "ColorCode,ColorName,Text_ColorCode");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("LoginColorCode", dtCreateLoginColorCode, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@LoginColorCodeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateLoginColorCode;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateLoginColorCode", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "LoginColorCode");
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
        public List<string> UpdateLoginColorCode(List<LoginColorCode> LoginColorCode)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateLoginColorCode = CollectionHelper.ConvertTo(LoginColorCode, "ColorCode,ColorName,Text_ColorCode");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("LoginColorCode", dtCreateLoginColorCode, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@LoginColorCodeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateLoginColorCode;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateLoginColorCode", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "LoginColorCode");
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
        public List<string> DeleteLoginColorCode(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteLoginColorCode", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "LoginColorCode");
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
            }
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
            return ErrorMessage;
        }
    }
}
