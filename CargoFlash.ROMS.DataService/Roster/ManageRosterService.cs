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
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.DataService.Roster
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ManageRosterService : SignatureAuthenticate, IManageRosterService
    {      
       
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ManageRoster>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRoster", Parameters);
            var ManageTeamList = ds.Tables[0].AsEnumerable().Select(e => new ManageRoster
            {
                SNo = Convert.ToInt32(e["SNo"]),
                RosterDate = e["Team Name"].ToString().ToUpper(),
                ShiftName = Convert.ToString(e["ValidFrom"]),
                EmployeeName = Convert.ToString(e["ValidTo"]),
                TeamName = e["Active"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ManageTeamList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public KeyValuePair<string, List<RosterEmployeeGrid>> GetRosterEmployee(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            List<RosterEmployeeGrid> listStock = new List<RosterEmployeeGrid>();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRosterEmployee", Parameters);
            var RosterList = ds.Tables[0].AsEnumerable().Select(e => new RosterEmployeeGrid
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Name = e["Name"].ToString().ToUpper(),
                DepartmentName = e["DepartmentName"].ToString().ToUpper(),
                DesignationName = e["DesignationName"].ToString().ToUpper(),
                TeamName = e["TeamName"].ToString().ToUpper(),
                Active = e["Active"].ToString().ToUpper(),
                CityName = e["CityName"].ToString().ToUpper(),
                ContactNo = e["ContactNo"].ToString().ToUpper(),
                Address = e["Address"].ToString().ToUpper(),
            });

            return new KeyValuePair<string, List<RosterEmployeeGrid>>(ds.Tables[1].Rows[0][0].ToString(), RosterList.AsQueryable().ToList());

        }

        public List<string> SaveRoster(List<ManageRoster> RosterEmployee)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(RosterEmployee, "Active,Text_DepartmentSNo,Text_AirlineSNo,Text_DesignationSNo,Text_TeamIDSNo,Text_SkillSNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("RosterEmployee", dtCreateIrr, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RosterEmployeeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRosterEmployee", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterEmployee");
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
    }
}
