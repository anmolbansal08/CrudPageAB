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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PagesService : SignatureAuthenticate, IPagesService
    {
        #region Constructors
        public PagesService()
            : base()
        {
        }
        public PagesService(bool authenticationCheck)
        : base(authenticationCheck)
        {
        }
        #endregion


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int GroupSNo = CustomizedGrid.GroupSNo;
            int UserSNo = CustomizedGrid.UserSNo;

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Pages>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@GroupSNo", GroupSNo), new SqlParameter("@UserSNo", UserSNo) };

            string ProcedureName = "GetListPage2";
            if (UserSNo != 0)
                ProcedureName = "GetListPage";

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcedureName, Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new Pages
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                PageName = e["PageName"].ToString(),
                MenuSNo = Convert.ToInt32(e["MenuSNo"].ToString()),
                DisplayOrder = Convert.ToInt32(e["DisplayOrder"].ToString()),
                Help = e["Help"].ToString(),
                Description = e["Description"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                IsFound = Convert.ToBoolean(e["IsFound"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcedureName
            };
        }

        public DataSourceResult GetGridChildData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Pages>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListModulePage", Parameters);

            var pageList = ds.Tables[0].AsEnumerable().Select(e => new Pages
            {
                MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                PageName = e["PageName"].ToString(),
                Hyperlink = e["Hyperlink"].ToString(),
                MenuSNo = Convert.ToInt32(e["MenuSNo"].ToString()),
                DisplayOrder = Convert.ToInt32(e["DisplayOrder"].ToString()),
                Help = e["Help"].ToString(),
                Description = e["Description"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = pageList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public Pages GetPagesRecord(string recordID)
        {

            Pages p = new Pages();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordPage", Parameters);
            if (dr.Read())
            {
                p.SNo = Int32.Parse(recordID);
                p.MSNo = Int32.Parse(dr["MSNo"].ToString());
                p.PageName = dr["PageName"].ToString();
                p.Hyperlink = dr["Hyperlink"].ToString();
                p.MenuSNo = Convert.ToInt32(dr["MenuSNo"].ToString());
                p.DisplayOrder = Convert.ToInt32(dr["DisplayOrder"].ToString());
                p.Help = dr["Help"].ToString();
                p.Description = dr["Description"].ToString();
                p.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                p.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                p.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                p.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                p.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
            }
            dr.Close();
            return p;
        }

        public void SavePages(List<Pages> page)
        {
            int returnValue = 0;

            DataTable dtCreatePage = CollectionHelper.ConvertTo(page, "");

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

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "CreatePage", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void UpdatePages(List<PagesPermission> PageAccessibilityList)
        {
            int returnValue = 0;

            DataTable dtUpdatePage = CollectionHelper.ConvertTo(PageAccessibilityList, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdatePage;
            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;
            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;
            SqlParameter[] Parameters = { param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdatePage", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void DeletePages(int RecordID)
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

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "DeletePage", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);

            }
        }

        public Pages GetModulePagesRecord(string recordID)
        {

            Pages p = new Pages();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordModulePage", Parameters);
            if (dr.Read())
            {
                p.PageName = dr["PageName"].ToString();
                p.Hyperlink = dr["ModuleName"].ToString();
            }
            dr.Close();
            return p;
        }

        public DataSet GetModuleList()
        {


            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.VarChar);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { errorMessage, errorNumber };

            DataSet dataSet = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetModuleList", Parameters);

            return dataSet;
        }

        public DataSet GetPageList(List<ModulePage> modulePage)
        {

            DataTable dtGetPages = CollectionHelper.ConvertTo(modulePage, "");

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageTable2";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtGetPages;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.VarChar);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { param, errorMessage, errorNumber };

            DataSet dataSet = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPageList", Parameters);

            return dataSet;
        }

        public void UpdatePagesRightsCollection(int GroupSNo, int UserSNo, List<PagesPermission> PageAccessibilityList)
        {
            int GroupSNo2 = CustomizedGrid.GroupSNo;

            int returnValue = 0;

            DataTable dtUpdatePage2 = CollectionHelper.ConvertTo(PageAccessibilityList, "");

            SqlParameter paramGroupSNo = new SqlParameter();
            paramGroupSNo.ParameterName = "@GroupSNo";
            paramGroupSNo.Value = GroupSNo;

            SqlParameter paramGroupSNo2 = new SqlParameter();
            paramGroupSNo2.ParameterName = "@GroupSNo";
            paramGroupSNo2.Value = GroupSNo2;

            SqlParameter paramUserSNo = new SqlParameter();
            paramUserSNo.ParameterName = "@UserSNo";
            paramUserSNo.Value = UserSNo;

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@PageTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdatePage2;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { paramGroupSNo, paramGroupSNo2, paramUserSNo, param, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "UpdatePageCollection", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public KeyValuePair<string, List<ProcessPermissionList>> GetProcessPermission(string UserSNo, string GroupSNo, string PageSNo)
        {

            ProcessPermissionList SPL = new ProcessPermissionList();
            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", (UserSNo)),
                                                new SqlParameter("@GroupSNo", (GroupSNo)),
                                                new SqlParameter("@PageSNo", Convert.ToInt32(PageSNo)) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessPermission", Parameters);
            var processList = ds.Tables[0].AsEnumerable().Select(e => new ProcessPermissionList
            {
                SNo = Convert.ToInt32(e["SNo"]),
                UserSNo = Convert.ToInt32(e["UserSNo"]),
                SubProcessSNo = Convert.ToInt32(e["SubProcessSNo"]),
                SubProcessDisplayName = Convert.ToString(e["SubProcessDisplayName"]),
                IsBlocked = Convert.ToBoolean(e["IsBlocked"]),
                IsView = Convert.ToBoolean(e["IsView"]),
                IsEdit = Convert.ToBoolean(e["IsEdit"])
            });
            return new KeyValuePair<string, List<ProcessPermissionList>>("SNo", processList.AsQueryable().ToList());
        }

        public string SaveProcessPermission(List<ProcessPermissionList> arr, string UserSNo, string GroupSNo)
        {
            var usr = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
            IPAddress ipAddress = Array.FindLast(Dns.GetHostEntry(string.Empty).AddressList, a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
            System.Web.HttpBrowserCapabilities browser = System.Web.HttpContext.Current.Request.Browser;

            DataTable TransData = CollectionHelper.ConvertTo(arr, "UserSNo,SubProcessDisplayName");
            List<string> ErrorMessage = new List<string>();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@User",usr.UserSNo), 
                                            new SqlParameter("@UsGroup",usr.GroupName),
                                                 new SqlParameter("@UsName",usr.UserName.ToString()),      new SqlParameter("@Browser",browser.Browser),
                                                    new SqlParameter("@ip",ipAddress.ToString()),  new SqlParameter("@LoginCity",usr.CityCode),
                                                      new SqlParameter("@TerminalSNo",usr.TerminalSNo), new SqlParameter("@TerminalName",usr.NewTerminalName),
                                            new SqlParameter("@ProcessPermission", SqlDbType.Structured) { Value = TransData },
                                            
                                        new  SqlParameter("@UserSNo", UserSNo),
                                        new  SqlParameter("@GroupSNo",GroupSNo),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveProcessPermission", Parameters);

            string returnVal = string.Empty;
            if (ds != null && ds.Tables.Count > 0)
            {
                returnVal = ds.Tables[0].Rows[0][0].ToString();
            }
            return returnVal;
        }

        public KeyValuePair<string, List<SpecialPermissionList>> GetSpecialPermission(int UserSNo)
        {

            SpecialPermissionList SPL = new SpecialPermissionList();
            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", (UserSNo)) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSpecialPermission", Parameters);
            var splList = ds.Tables[0].AsEnumerable().Select(e => new SpecialPermissionList
            {
                SNo = Convert.ToInt32(e["SNo"]),
                PageName = Convert.ToString(e["PageName"]),
                Code = Convert.ToString(e["Code"]),
                Description = Convert.ToString(e["Description"]),
                IsEnabled = Convert.ToBoolean(e["IsEnabled"])
            });
            return new KeyValuePair<string, List<SpecialPermissionList>>("SNo", splList.AsQueryable().ToList());
        }

        public string SaveSpecialPermission(List<SpecialPermissionList> arry, int UserSNo)
        {

            var usr = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
            IPAddress ipAddress = Array.FindLast(Dns.GetHostEntry(string.Empty).AddressList, a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
            System.Web.HttpBrowserCapabilities browser = System.Web.HttpContext.Current.Request.Browser;
  
            DataTable TransData = CollectionHelper.ConvertTo(arry, "PageName,Code,Description");
            List<string> ErrorMessage = new List<string>();
            //Added By Shivali Thakur for Audit Log
            SqlParameter[] Parameters = { new SqlParameter("@User",usr.UserSNo), new SqlParameter("@UserGroup",usr.GroupName),
                                                 new SqlParameter("@UName",usr.UserName.ToString()),      new SqlParameter("@Browser",browser.Browser),
                                                    new SqlParameter("@ip",ipAddress.ToString()),  new SqlParameter("@LoginCity",usr.CityCode),
                                                      new SqlParameter("@TerminalSNo",usr.TerminalSNo), new SqlParameter("@TerminalName",usr.NewTerminalName),new SqlParameter("@UserSNo", UserSNo),
                                          new SqlParameter("@SpecialPermission", SqlDbType.Structured) { Value = TransData },
                                          new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveSpecialPermission", Parameters);

            string returnVal = string.Empty;
            //if (ds != null && ds.Tables.Count > 0)
            //{
            //    returnVal = ds.Tables[0].Rows[0][0].ToString();
            //}
            return returnVal;
        }

        public List<StatusAccessibilityList> GetPageStatusAccessibility(string GroupSNo, string PageSNo)
        {

            ProcessPermissionList SPL = new ProcessPermissionList();
            SqlParameter[] Parameters = { new SqlParameter("@GroupSNo", (GroupSNo)),
                                                new SqlParameter("@PageSNo", Convert.ToInt32(PageSNo)) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPageStatusAccessibility", Parameters);
            var processList = ds.Tables[0].AsEnumerable().Select(e => new StatusAccessibilityList
            {
                SNo = Convert.ToInt32(e["SNo"]),
                StatusSNo = Convert.ToInt32(e["StatusSNo"]),
                PageSNo = Convert.ToInt32(e["PageSNo"]),
                StatusCode = Convert.ToString(e["StatusCode"]),
                IsAllow = Convert.ToBoolean(e["IsAllow"])
            });
            return processList.ToList();
        }

        public string SaveStatusAccessibility(List<StatusAccessibilityList> arry, int GroupSNo)
        {
            DataTable TransData = CollectionHelper.ConvertTo(arry, "StatusSNo,PageSNo,StatusCode");
            List<string> ErrorMessage = new List<string>();

            SqlParameter[] Parameters = { new SqlParameter("@GroupSNo", GroupSNo),
                                          new SqlParameter("@StatusAccessibility", SqlDbType.Structured) { Value = TransData },
                                          new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveStatusAccessibility", Parameters);

            string returnVal = string.Empty;
            if (ds != null && ds.Tables.Count > 0)
            {
                returnVal = ds.Tables[0].Rows[0][0].ToString();
            }
            return returnVal;
        }
    }
}
