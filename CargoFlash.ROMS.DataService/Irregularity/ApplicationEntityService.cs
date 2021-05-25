using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.ServiceModel;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;
using System.ServiceModel.Activation;
using CargoFlash.Cargo.Model.Irregularity;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ApplicationEntityService : SignatureAuthenticate, IApplicationEntityService
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
        public ApplicationEntity GetApplicationEntityRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            {
                ApplicationEntity applicationentity = new ApplicationEntity();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                 dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "dbo.GetRecordApplicationEntity", Parameters);

                if (dr.Read())
                {
                    applicationentity.SNo = Convert.ToInt32(dr["sno"]);
                    applicationentity.ApplicationEntitySno = dr["applicationSNo"].ToString();
                    applicationentity.ApplicationCode = dr["applicationcode"].ToString();
                    applicationentity.ApplicationName = dr["applicationName"].ToString();
                    applicationentity.Remarks = dr["remarks"].ToString();
                }
                dr.Close();
                return applicationentity;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }
    }
}
