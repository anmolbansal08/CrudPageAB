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
    public class GroupPageRightTransService : SignatureAuthenticate, IGroupPageRightTransService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<GroupPageRightTrans>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageRights", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new GroupPageRightTrans
            {
                MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["RowNumber"]),
                GroupSNo = Convert.ToInt32(e["GroupSNo"].ToString()),
                PageRightsSNo = Convert.ToInt32(e["PageRightsSNo"].ToString())
                //UpdatedOn = Convert.ToDateTime(e["UpdatedOn"]),
                //CreatedOn = Convert.ToDateTime(e["CreatedOn"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public GroupPageRightTrans GetGroupPageRightTransRecord(string recordID)
        {
        
            GroupPageRightTrans g = new GroupPageRightTrans();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordGroupPageRightTrans", Parameters);

            if (dr.Read())
            {
                g.SNo = Int32.Parse(recordID);
                g.MSNo = Int32.Parse(dr["MSNo"].ToString());
                g.GroupSNo = Convert.ToInt32(dr["GroupSNo"].ToString());
                g.PageRightsSNo = Convert.ToInt32(dr["PageRightsSNo"].ToString());
                g.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                g.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                g.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                g.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
            }
            dr.Close();
            return g;
        }

        public void SaveGroupPageRightTrans(List<GroupPageRightTrans> groupPageRightTrans)
        {
            int returnValue = 0;
     
            DataTable dtCreateGroupPageRightTrans = CollectionHelper.ConvertTo(groupPageRightTrans, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@GroupPageRightTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateGroupPageRightTrans;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "CreateGroupPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void UpdateGroupPageRightTrans(List<ChildPagesPermissionCollection> childPagesPermissionTrueCollection, List<ChildPagesPermissionCollection> childPagesPermissionFalseCollection)
        {
            int returnValue = 0;
            //Added By Shivali Thakur for Audit Log
            DataTable dtUpdateGroupPageRightsTrue = CollectionHelper.ConvertTo(childPagesPermissionTrueCollection, "");
            DataTable dtUpdateGroupPageRightsFalse = CollectionHelper.ConvertTo(childPagesPermissionFalseCollection, "");
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
            paramTrue.ParameterName = "@GroupPageRightTransTable";
            paramTrue.SqlDbType = System.Data.SqlDbType.Structured;
            paramTrue.Value = dtUpdateGroupPageRightsTrue;

            SqlParameter paramFalse = new SqlParameter();
            paramFalse.ParameterName = "@GroupPageRightTransTable2";
            paramFalse.SqlDbType = System.Data.SqlDbType.Structured;
            paramFalse.Value = dtUpdateGroupPageRightsFalse;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { User, GroupName, UserName, Brows, ip, LoginCity, TSNo, TName, paramTrue, paramFalse, errorNumber, errorMessage };

            //DataSet ds = SqlHelper.ExecuteDataset(connectionString, "UpdateGroupPageRightTrans", Parameters);

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdateGroupPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void DeleteGroupPageRightTrans(int RecordID)
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

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "DeleteGroupPageRightTrans", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);

            }
        }
    }
}
