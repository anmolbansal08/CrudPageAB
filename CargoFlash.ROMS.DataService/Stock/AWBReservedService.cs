using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;

using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Stock
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBReservedService : SignatureAuthenticate, IAWBReservedService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AWBReserved>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAWBReserved", Parameters);
                var airportList = ds.Tables[0].AsEnumerable().Select(e => new AWBReserved
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    ReservedFor = e["ReservedFor"].ToString().ToUpper(),
                    ReservedBy = e["ReservedBy"].ToString().ToUpper(),
                    Used = e["Used"].ToString().ToUpper(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    ReservedOn = e["ReservedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ReservedOn"]), DateTimeKind.Utc)
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = airportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public CargoFlash.Cargo.Model.Stock.AWBReserved GetAWBReservedRecord(string recordID, string UserID)
        {
            AWBReserved c = new AWBReserved();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBReservedRecord", Parameters);
                if (dr.Read())
                {
                    c.AWBNum = dr["SNo"].ToString();
                    c.Text_AWBNum = dr["AWBNo"].ToString();
                    c.ReservedFor = dr["ReservedFor"].ToString();
                    c.IsReserved = Convert.ToInt32(dr["IsActive"]);
                    c.Active = dr["Active"].ToString();
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return c;
        }

        public List<string> SaveAWBReserved(List<AWBReserved> AWBReserved)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAWBReserved = CollectionHelper.ConvertTo(AWBReserved, "AWBNo,ReservedBy,ReservedOn,IsActive,Text_AWBNum,AWBNum,Active,Used,AirlineName");
                BaseBusiness baseBusiness = new BaseBusiness();

                //if (!baseBusiness.ValidateBaseBusiness("AWBReserved", dtCreateAWBReserved, "SAVE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBAWBReservedTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAWBReserved;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAWBReserved", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBReserved");
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

        public List<string> UpdateAWBReserved(List<AWBReserved> AWBReserved)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtAWBReserved = CollectionHelper.ConvertTo(AWBReserved, "AWBNo,ReservedBy,ReservedOn,IsActive,Text_AWBNum,AWBNum,Active,Used,AirlineName");
                BaseBusiness baseBusiness = new BaseBusiness();

                //if (!baseBusiness.ValidateBaseBusiness("AWBReserved", dtCreateIrr, "UPDATE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBReservedTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtAWBReserved;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAWBReserved", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBReserved");
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
    }
}
