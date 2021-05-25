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
    public class UserGroupService : SignatureAuthenticate, IUserGroupService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int UserSNo = CustomizedGrid.UserSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<UserGroup>(filter); // Change by akash bcz filter is not getting due to wrong class
           
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUserGroup", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new UserGroup
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                UserName = e["UserName"].ToString(),
                GroupName = e["GroupName"].ToString(),
                UserSNo = Convert.ToInt32(e["UserSNo"].ToString()),
                GroupSNo = Convert.ToInt32(e["GroupSNo"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridUserGroupData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int PageSNo = CustomizedGrid.PageSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<UserGroup>(filter); // Change by akash bcz filter is not getting due to wrong class
        
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@PageSNo", PageSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUsersGroup", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new UserGroup
            {
                GroupName = e["GroupName"].ToString(),
                IsGroup = Convert.ToBoolean(e["IsGroup"].ToString()),
                GroupSNo = Convert.ToInt32(e["GroupSNo"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public UserGroup GetUserGroupRecord(string recordID)
        {
        
            UserGroup u = new UserGroup();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordUserGroup", Parameters);
            if (dr.Read())
            {
                u.SNo = Int32.Parse(recordID);
                u.MSNo = Int32.Parse(dr["MSNo"].ToString());
                u.UserSNo = Int32.Parse(dr["UserSNo"].ToString());
                u.GroupSNo = Int32.Parse(dr["GroupSNo"].ToString());
                u.UserName = dr["UserName"].ToString();
                u.GroupName = dr["GroupName"].ToString();
                u.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                u.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                u.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                u.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
            }
            dr.Close();
            return u;
        }

        public void SaveUserGroup(List<GroupUsersCollection> groupUsersCollection)
        {
            int returnValue = 0;
     
            DataTable dtCreateUserGroup = CollectionHelper.ConvertTo(groupUsersCollection, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@UserGroupTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateUserGroup;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "CreateUserGroup", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void UpdateUserGroup(List<UserGroup> userGroup)
        {
            int returnValue = 0;
    
            DataTable dtUpdateUserGroup = CollectionHelper.ConvertTo(userGroup, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageUserGroup";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateUserGroup;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdateUserGroup", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void DeleteUserGroup(List<GroupUsersCollection> groupUsersCollection)
        {
            int returnValue = 0;
      
            DataTable dtDeleteUserGroup = CollectionHelper.ConvertTo(groupUsersCollection, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageUserGroup";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtDeleteUserGroup;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "DeleteUserGroup", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }
    }
}
