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
using System.Net;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UserPageRightTransService : SignatureAuthenticate, IUserPageRightTransService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<PageRights>(filter);
         
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUserPageRightTrans", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new UserPageRightTrans
            {
                MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                UserSNo = Convert.ToInt32(e["UserSNo"].ToString()),
                IncludePageRightSNo = Convert.ToInt32(e["IncludePageRightSNo"].ToString()),
                ExcludePageRightSNo = Convert.ToInt32(e["ExcludePageRightSNo"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public UserPageRightTrans GetUserPageRightTransRecord(string recordID)
        {
         
            UserPageRightTrans u = new UserPageRightTrans();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordUserPageRightTrans", Parameters);
            if (dr.Read())
            {
                u.SNo = Int32.Parse(recordID);
                u.MSNo = Int32.Parse(dr["MSNo"].ToString());
                u.UserSNo = Int32.Parse(dr["UserSNo"].ToString());
                u.IncludePageRightSNo = Int32.Parse(dr["IncludePageRightSNo"].ToString());
                u.ExcludePageRightSNo = Int32.Parse(dr["ExcludePageRightSNo"].ToString());
                u.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                u.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                u.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                u.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
            }
            dr.Close();
            return u;
        }

        public void SaveUserPageRightTrans(List<UserPageRightTrans> userPageRightTrans)
        {
            int returnValue = 0;
        
            DataTable dtCreateUserPageRightTrans = CollectionHelper.ConvertTo(userPageRightTrans, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@UserPageRightTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateUserPageRightTrans;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "CreateUserPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void UpdateUserPageRightTrans(List<ChildPagesUserPermissionCollection> childPagesUserPermissionTrueCollection, List<ChildPagesUserPermissionCollection> childPagesUserPermissionFalseCollection)
        {
            int returnValue = 0;
            DataTable dtUpdateUserPageRightsTrue = CollectionHelper.ConvertTo(childPagesUserPermissionTrueCollection, "");
            DataTable dtUpdateUserPageRightsFalse = CollectionHelper.ConvertTo(childPagesUserPermissionFalseCollection, "");


            //Added By Shivali Thakur for Audit Log
            var usr = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
            var UserGroup = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName;
            var Name = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName;
            System.Web.HttpBrowserCapabilities browser = System.Web.HttpContext.Current.Request.Browser;
            var Browser = browser.Browser;
            IPAddress ipAddress = Array.FindLast(Dns.GetHostEntry(string.Empty).AddressList, a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
            var city = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode;
            var TerminalSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo;
            var TerminalName = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).NewTerminalName;



      

            SqlParameter User = new SqlParameter("@User", SqlDbType.Int);
            User.Value = usr;
            User.Direction = ParameterDirection.Input;

            SqlParameter GroupName = new SqlParameter("@UserGroup", SqlDbType.Text);
            GroupName.Value = UserGroup;
            GroupName.Direction = ParameterDirection.Input;

            SqlParameter UserName = new SqlParameter("@UName", SqlDbType.Text);
            UserName.Value = Name.ToString();
            UserName.Direction = ParameterDirection.Input;

            SqlParameter Brows = new SqlParameter("@Browser", SqlDbType.Text);
            Brows.Value = Browser;
            Brows.Direction = ParameterDirection.Input;

            SqlParameter ip = new SqlParameter("@ip", SqlDbType.Text);
            ip.Direction = ParameterDirection.Input;
            ip.Value = ipAddress.ToString();

            SqlParameter LoginCity = new SqlParameter("@LoginCity", SqlDbType.Text);
            LoginCity.Value = city;
            LoginCity.Direction = ParameterDirection.Input;

            SqlParameter TSNo = new SqlParameter("@TerminalSNo", SqlDbType.Int);
            TSNo.Direction = ParameterDirection.Input;
            TSNo.Value = TerminalSNo;

            SqlParameter TName = new SqlParameter("@TerminalName", SqlDbType.Text);
            TName.Direction = ParameterDirection.Input;
            TName.Value = TerminalName;

            SqlParameter paramTrue = new SqlParameter();
            paramTrue.ParameterName = "@UserPageRightTransTable";
            paramTrue.SqlDbType = System.Data.SqlDbType.Structured;
            paramTrue.Value = dtUpdateUserPageRightsTrue;

            SqlParameter paramFalse = new SqlParameter();
            paramFalse.ParameterName = "@UserPageRightTransTable2";
            paramFalse.SqlDbType = System.Data.SqlDbType.Structured;
            paramFalse.Value = dtUpdateUserPageRightsFalse;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { User, GroupName, UserName, Brows, ip, LoginCity, TSNo, TName, paramTrue, paramFalse, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdateUserPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void DeleteUserPageRightTrans(int RecordID)
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

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "DeleteUserPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);

            }
        }
    }
}
