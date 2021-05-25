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
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class WarehouseSetupService : SignatureAuthenticate, IWarehouseSetupService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<WarehouseSetup>(filter);
                if (!string.IsNullOrEmpty(filters))
                {
                    filters = filters + " AND AirportSNo=" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                }
                else
                {
                    filters = " AirportSNo=" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                }
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWarehouseSetup", Parameters);
                var WarehouseSetupList = ds.Tables[0].AsEnumerable().Select(e => new WarehouseSetup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirportName = e["AirportName"].ToString().ToUpper(),
                    WarehouseName = e["WarehouseName"].ToString().ToUpper(),
                    TerminalName = e["TerminalName"].ToString().ToUpper(),
                    TerminalSNo = e["TerminalSNo"].ToString(),
                    LevelNo = Convert.ToInt32(e["LevelNo"]),
                    TotalArea = Convert.ToInt32(e["TotalArea"]),
                    Active = e["Active"].ToString(),
                    Text_WarehouseType = e["Text_WarehouseType"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = WarehouseSetupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public WarehouseSetup GetWarehouseSetupRecord(string recordID, string UserID)
        {
            WarehouseSetup c = new WarehouseSetup();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordWarehouseSetup", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.AirportName = dr["AirportName"].ToString();
                    c.WarehouseName = dr["WarehouseName"].ToString().ToUpper();
                    c.WarehouseCode = dr["WarehouseCode"].ToString().ToUpper();
                    c.TerminalSNo = dr["TerminalSNo"].ToString();
                    c.TerminalName = dr["TerminalName"].ToString();
                    c.LevelNo = Convert.ToInt32(dr["LevelNo"]);
                    c.WHRowCount = Convert.ToInt32(dr["WHRowCount"]);
                    c.WHColumnCount = Convert.ToInt32(dr["WHColumnCount"]);
                    c.TotalArea = Convert.ToInt32(dr["TotalArea"]);
                    c.Active = dr["IsActive"].ToString() == "True" ? "0" : "1";
                    c.WarehouseType = Convert.ToInt32(dr["WarehouseType"]);
                    c.Text_WarehouseType = dr["Text_WarehouseType"].ToString().ToUpper();
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return c;
        }

        public List<string> SaveWarehouseSetup(List<WarehouseSetup> WarehouseSetup)
        {
            try
            {

                DataTable dtCreateWarehouseSetup = CollectionHelper.ConvertTo(WarehouseSetup, "SNo,AirportName,Active,Text_AirportName,TerminalName,Text_WarehouseType");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WarehouseSetupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateWarehouseSetup;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spWH_SetupCreate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WarehouseSetup");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateWarehouseSetup(List<WarehouseSetup> WarehouseSetup)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdateWarehouseSetup = CollectionHelper.ConvertTo(WarehouseSetup, "AirportName,AirportSNo,Active,WarehouseCode,WHRowCount,WHColumnCount,Text_AirportName,TerminalName,TerminalSNo,Text_WarehouseType");
                //TerminalName,TerminalSNo added to deal with Bad Request Error

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("WarehouseSetup", dtUpdateWarehouseSetup, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WarehouseSetupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateWarehouseSetup;
                SqlParameter[] Parameters = { param };
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateWarehouseSetup", Parameters);

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateWarehouseSetup", Parameters);//UpdateIrregularityPacking
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WarehouseSetup");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        // Add By Sushant On 31-05-2018
        public string WarehouseTypeCheck(string WarehouseName, string AirportName, string WarehouseCod)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@WarehouseName",WarehouseName), new SqlParameter("@AirportName", AirportName)
                                              , new SqlParameter("@WarehouseCod", WarehouseCod)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GETWarehouseTypeCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

    }
}
