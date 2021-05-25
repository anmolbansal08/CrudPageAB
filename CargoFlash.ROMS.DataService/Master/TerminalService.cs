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
    public class TerminalService : SignatureAuthenticate, ITerminalService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Terminal>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTerminal", Parameters);
                var TerminalList = ds.Tables[0].AsEnumerable().Select(e => new Terminal
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    TerminalName = e["TerminalName"].ToString().ToUpper(),
                    XrayMachineName = e["XrayMachineName"].ToString().ToUpper(),
                    AirportName = Convert.ToString(e["AirportName"]),
                    Active = e["Active"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TerminalList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
              
                throw ex;
            }
        }

        public Terminal GetTerminalRecord(string recordID, string UserSNo)
        {
            Terminal t = new Terminal();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTerminalRecord", Parameters);
                if (dr.Read())
                {
                    t.SNo = Convert.ToInt32(dr["SNo"]);
                    t.TerminalName = dr["TerminalName"].ToString().ToUpper();
                    t.CitySNo = Convert.ToInt32(dr["CitySNo"].ToString());
                    t.Text_CitySNo = dr["CityName"].ToString().ToUpper();
                    t.AirportSNo = Convert.ToInt32(dr["AirportSNo"].ToString());
                    t.Text_AirportName = dr["AirportName"].ToString().ToUpper();
                    t.IsActive =Convert.ToBoolean(dr["IsActive"].ToString().ToUpper());
                    t.CityName = dr["CityName"].ToString().ToUpper();
                    t.AirportName = dr["AirportSNo"].ToString().ToUpper();
                    t.Active = dr["Active"].ToString().ToUpper();                   
                    t.Text_XrayMachineName  = dr["Text_XrayMachineName"].ToString().ToUpper();
                    t.VAccountNo = dr["VAccountNo"].ToString(); 
                    t.XrayMachineName = dr["XrayMachineName"].ToString().ToUpper();                    
                    t.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    t.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return t;
        }

        public List<string> SaveTerminal(List<Terminal> t)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateTerminal = CollectionHelper.ConvertTo(t, "operation,Text_City,Text_AirportName,Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Terminal", dtCreateTerminal, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                DataTable dtCreateTerminalUpdated = CollectionHelper.ConvertTo(t, "operation,Text_City,Text_AirportName,Active,AirportName,CityName,Text_AirportName,Text_CitySNo,Text_XrayMachineName");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@tbl";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateTerminalUpdated;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTerminal", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Terminal");
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

        public List<string> UpdateTerminal(List<Terminal> t)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateTerminal = CollectionHelper.ConvertTo(t, "operation,Text_City,Text_AirportName,Active,Text_XrayMachineName");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Terminal", dtCreateTerminal, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                DataTable dtCreateTerminalUpdated = CollectionHelper.ConvertTo(t, "operation,Text_City,Text_AirportName,Active,AirportName,CityName,Text_AirportName,Text_CitySNo,Text_XrayMachineName");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@tbl";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateTerminalUpdated;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateTerminal", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Terminal");
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

        public List<string> DeleteTerminal(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTerminal", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Terminal");
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

        //public string GetXRayMachineInfo(string XraymachineSNo)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@XraymachineSNo", XraymachineSNo.Replace(",,", ",")) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetXRayMachineInfo", Parameters);
        //    ds.Dispose();
        //    return JsonConvert.SerializeObject(ds);
        //}


        public string GetAirportInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
       
    }
}
