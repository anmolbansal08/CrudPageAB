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
    public class AWBVoidService : SignatureAuthenticate, IAWBVoidService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AWBVoid>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAWBVoid", Parameters);
                var AWBVoidList = ds.Tables[0].AsEnumerable().Select(e => new AWBVoid
                {

                    AWBNumber = e["AWBNumber"].ToString().ToUpper(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    UpdatedOn = e["UpdatedOn"].ToString().ToUpper()
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AWBVoidList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveAWBVoid(List<AWBVoid> AWBVoid)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAWBVoid = CollectionHelper.ConvertTo(AWBVoid, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AWBVoid", dtCreateAWBVoid, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter[] Parameters = { 
                                             new SqlParameter("@StartRange",Convert.ToInt32(AWBVoid[0].StartRange)),
                                              new SqlParameter("@EndRange",Convert.ToInt32(AWBVoid[0].EndRange)),
                                              new SqlParameter("@AWBPrefix",AWBVoid[0].AWBNumber),
                                              new SqlParameter("@CreatedBy", Convert.ToInt32(AWBVoid[0].CreatedBy)),
                                        };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAWBVoid", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBVoid");
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
