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
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.DataService;


namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UserStatusService : CargoFlash.Cargo.DataService.SignatureAuthenticate, IUserStatusService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<UserStatusGrid>(filter);
        
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUserStatusRecord", Parameters);
            var UserStatusList = ds.Tables[0].AsEnumerable().Select(e => new UserStatusGrid
            {
                SNo=Convert.ToInt32(e["SNo"].ToString()),
                UsreSNo = Convert.ToInt32(e["UserSNo"].ToString()),
                UserName = e["UserName"].ToString().ToUpper(),
                OldTerminal = e["OldTerminal"].ToString().ToUpper(),
                NewTerminal = e["NewTerminal"].ToString().ToUpper(),
                WeighingScaleName = e["WeighingScaleName"].ToString().ToUpper(),
                UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                //UpdatedOn = Convert.ToDateTime(e["UpdatedOn"]).ToString("dd-MMM-yyyy hh:mm").ToUpper()
               // UpdatedOn = e["UpdatedOn"].ToString().ToUpper(),
               UpdatedOn = e["UpdatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["UpdatedOn"]), DateTimeKind.Utc),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = UserStatusList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public string GetUserDescription(String SNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo ",SNo) };
            DataSet ds = new DataSet();
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUserDescription", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        //public DataSourceResult GetUserDescription(String SNo)
        //{
        //    StringBuilder strUserDescription = new StringBuilder();
        //    List<String> lstUserDescription = new List<String>();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };

        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUserDescription", Parameters);
        //    DataTable dt = ds.Tables[0];
        //    if (dt != null && dt.Rows.Count > 0)
        //    {
                
        //        strUserDescription.Append("<table style='border: 1px solid; width: 100%;'><tr style='text-align: center;'><td><strong>User Name</strong></td><td><strong>First Name</strong></td><td><strong>Email ID</strong></td><td><strong>Mobile No</strong></td><td><strong>City Code</strong></td><td><strong>Default Terminal Name</strong></td></tr>");
        //        for (int i = 0; i < dt.Rows.Count; i++)
        //        {
        //            strUserDescription.Append("<tr style='border: 1px solid;'><td style='text-align: center;'>"
        //                + dt.Rows[i]["UserName"] + "</td><td style='text-align: center;'>"
        //                + dt.Rows[0]["FirstName"] + "</td><td style='text-align: center;'>"
        //                + dt.Rows[i]["EMailID"] + "</td><td style='text-align: center;'>"
        //                + dt.Rows[i]["Mobile"] + "</td><td style='text-align: center;'>"
        //                + dt.Rows[i]["CityCode"] + "</td><td style='text-align: center;'>"
        //                + dt.Rows[i]["TerminalName"] + "<input type='hidden' id='hdnOldTerminalSNo' name='hdnOldTerminalSNo' value='" + dt.Rows[i]["TerminalSNo"] + "' /></td><td style='text-align: center;'>" + "</td></tr>");
        //        }
        //        strUserDescription.Append("</table>");
        //        //strUserDescription.ToString();
        //    }
        //    else
        //    {
        //        strUserDescription.Append("");
        //    }
        //    lstUserDescription.Add(strUserDescription.ToString());
        //    //DataTable lstUserDescription1 = CollectionHelper.ConvertTo(lstUserDescription, ",");

        //    return new DataSourceResult
        //    {
               
        //        Data = lstUserDescription,
        //        Total = lstUserDescription.Count()
        //    };
        //}

        public List<string> SaveUserStatus(List<UserStatus> UserStatus)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateUserStatus = CollectionHelper.ConvertTo(UserStatus, "SNo");

                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("UserStatus", dtCreateUserStatus, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@UserStatusTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateUserStatus;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveUserStatus", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "UserStatus");
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
            }
            catch(Exception ex)// (Exception e)
            {

            }
            return ErrorMessage;
        }

        //public List<string> UpdateUserStatus(List<UserStatus> UserStatus)
        //{
        //    //validate Business Rule
        //    List<string> ErrorMessage = new List<string>();
        //    try
        //    {
        //        DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,StandardName,DayLightSaving,DeltaSeconds,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");
        //        BaseBusiness baseBusiness = new BaseBusiness();

        //        if (!baseBusiness.ValidateBaseBusiness("City", dtCreateCity, "UPDATE"))
        //        {
        //            ErrorMessage = baseBusiness.ErrorMessage;
        //            return ErrorMessage;
        //        }
        //        SqlParameter param = new SqlParameter();
        //        param.ParameterName = "@CityTable";
        //        param.SqlDbType = System.Data.SqlDbType.Structured;
        //        param.Value = dtCreateCity;

        //        SqlParameter[] Parameters = { param };

        //        int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCity", Parameters);
        //        if (ret > 0)
        //        {
        //            if (ret > 1000)
        //            {
        //                //For Customised Validation Messages like 'Record Already Exists' etc
        //                string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "City");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);
        //            }
        //            else
        //            {

        //                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                    ErrorMessage.Add(dataBaseExceptionMessage);
        //            }
        //        }
        //    }
        //    catch(Exception ex)// (Exception e)
        //    {

        //    }
        //    return ErrorMessage;
        //}

        //public List<string> DeleteUserStatus(List<string> listID)
        //{
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    try
        //    {
        //        if (listID.Count > 0)
        //        {
        //            string RecordId = listID[0].ToString();
        //            string UserId = listID[1].ToString();
        //            SqlParameter[] Parameters = { new SqlParameter("@CityCode", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
        //            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCity", Parameters);
        //            if (ret > 0)
        //            {
        //                if (ret > 1000)
        //                {
        //                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "City");
        //                    if (!string.IsNullOrEmpty(serverErrorMessage))
        //                        ErrorMessage.Add(serverErrorMessage);
        //                }
        //                else
        //                {
        //                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
        //                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                        ErrorMessage.Add(dataBaseExceptionMessage);
        //                }
        //            }
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }
        //    catch(Exception ex)// (Exception e)
        //    {

        //    }
        //    return ErrorMessage;
        //}
    }
}
