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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.DataService;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PageRightsService : SignatureAuthenticate, IPageRightsService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<PageRights>(filter);
       
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageRights", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new PageRights
            {
                SNo = Convert.ToInt32(e["RowNumber"]),
                PageName = e["PageName"].ToString(),
                //Hyperlink = e["Hyperlink"].ToString(),
                MenuSNo = Convert.ToInt32(e["MenuSNo"].ToString()),
                Create = Convert.ToBoolean(e["Create"].ToString()),
                Edit = Convert.ToBoolean(e["Edit"].ToString()),
                Delete = Convert.ToBoolean(e["Delete"].ToString()),
                Read = Convert.ToBoolean(e["Read"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetChildGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int GroupSNo = CustomizedGrid.GroupSNo;
            int UserSNo = CustomizedGrid.UserSNo;

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<PageRights>(filter);
  
            SqlParameter[] Parameters = { new SqlParameter("@MenuSNo", filters.Replace("[MenuSNo] = '", "").Replace("'", "")), new SqlParameter("@GroupSNo", GroupSNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageRights3", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new PageRights
            {
                PageName = e["PageName"].ToString(),
                //Hyperlink = e["Hyperlink"].ToString(),
                SNo=Convert.ToInt32(e["PageSNo"]),
                MenuSNo = Convert.ToInt32(e["MenuSNo"].ToString()),
                Create = Convert.ToBoolean(e["Create"].ToString()),
                Edit = Convert.ToBoolean(e["Edit"].ToString()),
                Delete = Convert.ToBoolean(e["Delete"].ToString()),
                Read = Convert.ToBoolean(e["Read"].ToString()),
                GroupCreate = Convert.ToBoolean(e["GroupCreate"].ToString()),
                GroupEdit = Convert.ToBoolean(e["GroupEdit"].ToString()),
                GroupDelete = Convert.ToBoolean(e["GroupDelete"].ToString()),
                GroupRead = Convert.ToBoolean(e["GroupRead"].ToString()),
                SNo1 = Convert.ToInt32(e["SNo1"].ToString()),
                SNo2 = Convert.ToInt32(e["SNo2"].ToString()),
                SNo3 = Convert.ToInt32(e["SNo3"].ToString()),
                SNo4 = Convert.ToInt32(e["SNo4"].ToString()),
                IsSubProcess=Convert.ToBoolean(e["IsSubProcess"]),
                IsGroupSubProcess = Convert.ToBoolean(e["IsGroupSubProcess"]),
                IsStatusAccessibility= Convert.ToBoolean(e["IsStatusAccessibility"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public PageRights GetPageRightsRecord(string recordID)
        {
     
            PageRights p = new PageRights();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordPageRights", Parameters);
            if (dr.Read())
            {
                p.SNo = Int32.Parse(recordID);
                p.MSNo = Int32.Parse(dr["MSNo"].ToString());
                p.PageName = dr["PageName"].ToString();
                //p.Hyperlink = dr["Hyperlink"].ToString();
                p.MenuSNo = Convert.ToInt32(dr["MenuSNo"].ToString());
                p.Create = Convert.ToBoolean(dr["Create"].ToString());
                p.Edit = Convert.ToBoolean(dr["Edit"].ToString());
                p.Delete = Convert.ToBoolean(dr["Delete"].ToString());
                p.Read = Convert.ToBoolean(dr["Read"].ToString());
                p.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                p.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                p.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                p.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
            }
            dr.Close();
            return p;
        }

        public void SavePageRights(List<PageRights> pageRights)
        {
            int returnValue = 0;
    
            DataTable dtCreatePage = CollectionHelper.ConvertTo(pageRights, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreatePage;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "CreatePageRights", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void UpdatePageRights(List<PageRights> pageRights)
        {
            int returnValue = 0;
            
            DataTable dtUpdatePageRights = CollectionHelper.ConvertTo(pageRights, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageRightsTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdatePageRights;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdatePageRights", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void DeletePageRights(int RecordID)
        {
            int returnValue = 0;
        

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@SNo";
            param.SqlDbType = System.Data.SqlDbType.BigInt;
            param.Value = RecordID;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "DeletePageRights", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);

            }
        }
    }
}
