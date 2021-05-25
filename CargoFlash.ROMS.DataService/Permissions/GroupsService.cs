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
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class GroupsService : SignatureAuthenticate, IGroupsService
    {
        #region Constructors
        public GroupsService()
            : base()
        {
        }
        public GroupsService(bool authenticationCheck)
            : base(authenticationCheck)
        {
        }
        #endregion
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<GroupsGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters),
            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
            
                                            new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListGroups", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new GroupsGridData
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                RefNo = Convert.ToString(e["RefNo"]),
                GroupName = e["GroupName"].ToString(),
                Active = e["Active"].ToString(),
                AllowMultiCity = e["AllowMultiCity"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetActiveGroupGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Groups>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListActiveGroups", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Groups
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                GroupName = e["GroupName"].ToString(),
                Active = e["Active"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridPageData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int PageSNo = CustomizedGrid.PageSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Groups>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@PageSNo", PageSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListGroups2", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Groups
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                GroupName = e["GroupName"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridPageData2(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int PageSNo = CustomizedGrid.PageSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Groups>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@PageSNo", PageSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageGroups", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Groups
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                GroupName = e["GroupName"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridUserGroupsData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int UserSNo = CustomizedGrid.UserSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Groups>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUserGroups", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Groups
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                GroupName = e["GroupName"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridUserGroupsData2(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int UserSNo = CustomizedGrid.UserSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Groups>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUserGroups2", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Groups
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                GroupName = e["GroupName"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                Active = e["Active"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public Groups GetGroupsRecord(string recordID, string UserID)
        {


            Groups g = new Groups();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserSNo",  Convert.ToInt32(UserID))};
            int? a = null;
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordGroups", Parameters);
            if (dr.Read())
            {
                g.SNo = Int32.Parse(recordID);
                g.RefNo = Convert.ToString(dr["RefNo"]);
                g.GroupName = dr["GroupName"].ToString();
                g.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                g.CreatedBy = dr["CreatedBy"].ToString();
                g.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                g.UpdatedBy = dr["UpdatedBy"].ToString();
                g.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                g.Active = dr["Active"].ToString();
                g.CreatedUser = dr["CreatedUser"].ToString();
                g.UpdatedUser = dr["UpdatedUser"].ToString();
                g.MultiCity = dr["MultiCity"].ToString();
                g.IsMultiCity = Convert.ToBoolean(dr["IsMultiCity"].ToString());
                g.CloneGroupSNo = Convert.IsDBNull(dr["CloneGroupSNo"]) ? a : Convert.ToInt32(dr["CloneGroupSNo"]);
                g.Text_CloneGroupSNo = dr["CloneGroupName"].ToString();
                g.CreatedUser = dr["CreatedUser"].ToString();
                g.UpdatedUser = dr["UpdatedUser"].ToString();
                g.Text_UserTypeSNo = dr["Text_UserTypeSNo"].ToString();
                g.UserTypeSNo = dr["UserTypeSNo"].ToString();
                g.PenaltyType = dr["PenaltyType"].ToString(); ;
                g.Text_PenaltyType = dr["Text_PenaltyType"].ToString();
                //g.SNo = Int32.Parse(recordID);
                ////g.MSNo = Int32.Parse(dr["MSNo"].ToString());
                //g.GroupName = dr["GroupName"].ToString();
                //g.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                //g.CreatedBy = dr["CreatedBy"].ToString();
                //g.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                //g.UpdatedBy = dr["UpdatedBy"].ToString();
                //g.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                //g.Active = dr["Active"].ToString();
                //g.CreatedUser = dr["CreatedUser"].ToString();
                //g.UpdatedUser = dr["UpdatedUser"].ToString();
            }
            dr.Close();
            return g;
        }

        public List<string> SaveGroups(List<Groups> groups)
        {
            List<string> ErrorMessage = new List<string>();
             
                
                DataTable dtCreateGroups = CollectionHelper.ConvertTo(groups, "MSNo,RefNo,Active,CreatedUser,UpdatedUser,MultiCity,Text_CloneGroupSNo,Text_UserTypeSNo,Text_PenaltyType");

            GroupBusiness groupBusiness = new GroupBusiness();
            if (!groupBusiness.ValidateBaseBusiness("Groups", dtCreateGroups, "SAVE"))
            {
                ErrorMessage = groupBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@GroupsTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateGroups;

            SqlParameter[] Parameters = { param };

            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateGroups", Parameters);
            int ret = Convert.ToInt32(ds.Tables[0].Rows[0]["ErrorNumber"]);
            int groupSNo = Convert.ToInt32(ds.Tables[0].Rows[0]["GroupSNo"]);
            GroupBusiness.GroupSNo = groupSNo;
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Groups");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {

                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(ret, groupBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }

            return ErrorMessage;
        }

        public List<string> UpdateGroups(List<Groups> groups)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtUpdateGroups = CollectionHelper.ConvertTo(groups, "MSNo,RefNo,Active,CreatedUser,UpdatedUser,MultiCity,Text_CloneGroupSNo,Text_UserTypeSNo,Text_PenaltyType");
            GroupBusiness groupBusiness = new GroupBusiness();

            if (!groupBusiness.ValidateBaseBusiness("Groups", dtUpdateGroups, "UPDATE"))
            {
                ErrorMessage = groupBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@GroupsTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateGroups;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateGroups", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Groups");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {

                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(ret, groupBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }

            return ErrorMessage;
        }

        public List<string> DeleteGroups(List<string> listID)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            GroupBusiness groupBusiness = new GroupBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteGroups", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Groups");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(ret, groupBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }

            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(9001, groupBusiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }

        public string GetGroupDetails(int GroupSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@GroupSNo", GroupSNo) };
            DataSet ds = new DataSet();
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGroupDetails", Parameters);
            ds.Dispose();
            return Common.DStoJSON(ds);
        }
    }
}
