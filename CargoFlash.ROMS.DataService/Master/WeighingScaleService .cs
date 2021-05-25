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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WeighingScaleService : SignatureAuthenticate, IWeighingScaleService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public WeighingScale GetWeighingScaleRecord(string recordID, string UserSNo)
        {
         
            WeighingScale WeighingScale = new WeighingScale();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordWeighingScale", Parameters);
                if (dr.Read())
                {

                    WeighingScale.SNo = Convert.ToInt32(dr["SNo"]);
                    WeighingScale.Name = Convert.ToString(dr["Name"]).ToUpper();
                    WeighingScale.WeighingScaleID = Convert.ToString(dr["WeighingScaleID"]).ToUpper();
                    WeighingScale.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                   // WeighingScale.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    WeighingScale.Text_CitySNo = Convert.ToString(dr["CityName"]).ToUpper();
                    WeighingScale.AirportSNo = Convert.ToInt32(dr["AirportSNo"]);
                    WeighingScale.Text_AirportSNo = Convert.ToString(dr["AirportName"]).ToUpper();
                   // WeighingScale.AirportSNo = Convert.ToInt32(dr["AirportSNo"]);
                    WeighingScale.TerminalSNo = Convert.ToInt32(dr["TerminalSNo"]);
                    WeighingScale.Text_TerminalSNo = Convert.ToString(dr["TerminalName"]).ToUpper();
                    WeighingScale.IPAddress = Convert.ToString(dr["IPAddress"]).ToUpper();
                    WeighingScale.FTPHostName = Convert.ToString(dr["FTPHostName"]).ToUpper();
                    WeighingScale.FTPFolderPath = Convert.ToString(dr["FTPFolderPath"]).ToUpper();
                    WeighingScale.FTPUserId = Convert.ToString(dr["FTPUserId"]).ToUpper();
                    WeighingScale.FTPPassword = Convert.ToString(dr["FTPPassword"]).ToUpper();
                    WeighingScale.PortNo = Convert.ToString(dr["PortNo"]).ToUpper();
                    WeighingScale.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                    WeighingScale.Active = dr["Active"].ToString().ToUpper();
                  
                    WeighingScale.CreatedBy = Convert.ToString(dr["CreatedUser"]).ToUpper();
                    WeighingScale.UpdatedBy = Convert.ToString(dr["UpdatedUser"]).ToUpper();

                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return WeighingScale;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                var user = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<WeighingScale>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@IsShowAllData", user.IsShowAllData.ToString()),
                    new SqlParameter("@AirPortSNo", user.AirportSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWeighingScale", Parameters);
                var WeighingScale = ds.Tables[0].AsEnumerable().Select(e => new WeighingScale
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    Name = e["Name"].ToString().ToUpper(),
                    WeighingScaleID = e["WeighingScaleID"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    AirportName = e["AirportName"].ToString().ToUpper(),
                    TerminalName = e["TerminalName"].ToString().ToUpper(),
                    IPAddress = e["IPAddress"].ToString().ToUpper(),
                    PortNo = e["PortNo"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = WeighingScale.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public List<string> SaveWeighingScale(List<WeighingScale> WeighingScale)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtWeighingScale = CollectionHelper.ConvertTo(WeighingScale, "Active,CityName,AirportName,TerminalName,Text_CitySNo,Text_AirportSNo,Text_TerminalSNo,Text_TerminalSNo ");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("WeighingScale", dtWeighingScale, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WeighingScale";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtWeighingScale;

                SqlParameter[] Parameters = { param };


                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateWeighingScale", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WeighingScale");
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

        public List<string> UpdateWeighingScale(List<WeighingScale> WeighingScale)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtWeighingScale = CollectionHelper.ConvertTo(WeighingScale, "Active,CityName,AirportName,TerminalName,Text_CitySNo,Text_AirportSNo,Text_TerminalSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("WeighingScale", dtWeighingScale, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WeighingScale";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                 param.Value = dtWeighingScale;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateWeighingScale", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WeighingScale");
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
        public List<string> DeleteWeighingScale(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteWeighingScale", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "WeighingScale");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
            return ErrorMessage;
        }

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
