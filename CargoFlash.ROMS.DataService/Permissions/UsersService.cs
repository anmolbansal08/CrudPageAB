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
using CargoFlash.Cargo.DataService.Common;
using System.Web;
using CargoFlash.Cargo.DataService;

namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UsersService : SignatureAuthenticate, IUsersService
    {
        #region Constructors
        public UsersService()
            : base()
        {
        }
        public UsersService(bool authenticationCheck)
        : base(authenticationCheck)
        {
        }
        #endregion

        public DataSourceResult GetGridData(int UserSNo, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListUsers", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //  MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                FirstName = e["FirstName"].ToString(),
                LastName = e["LastName"].ToString(),
                UserName = e["UserName"].ToString().ToUpper(),
                Address = e["Address"].ToString(),
                GroupEMailID = e["GroupEMailID"].ToString(),
                EMailID = e["EMailID"].ToString(),
                Mobile = e["Mobile"].ToString(),
                Active = e["Active"].ToString(),
                CityCode = e["CityCode"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                UserType = e["UserType"].ToString().ToUpper(),
                Blocked = e["Blocked"].ToString().ToUpper(),
                AirlineName = e["AirlineName"].ToString().ToUpper(),
                UserTypeText = e["UserTypeText"].ToString().ToUpper(),
                Text_UserExpairyDate = e["Text_UserExpairyDate"].ToString().ToUpper(),
                Text_CompanyName = e["Text_CompanyName"].ToString().ToUpper(),
                LastResetBy = e["ResetBy"].ToString().ToUpper(),
                UserCreatedby = e["UserCreatedby"].ToString().ToUpper(),
                UserCreatedOn = e["CreatedOn"].ToString().ToUpper(),
                CreatedOntime = e["CreatedOntime"].ToString().ToUpper(),
                Agent_Master_Branch=Convert.ToString(e["Agent_Master_Branch"]).ToUpper(),
                AgentName=Convert.ToString(e["AgentName"]).ToUpper()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetActiveUsersGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListActiveUsers", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                FirstName = e["FirstName"].ToString(),
                LastName = e["LastName"].ToString(),
                UserName = e["UserName"].ToString().ToUpper(),
                Address = e["Address"].ToString(),
                CityName = e["CityName"].ToString(),
                CityCode = e["CityCode"].ToString(),
                Active = e["Active"].ToString(),
                EMailID = e["EMailID"].ToString(),
                Mobile = e["Mobile"].ToString(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridUserData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int PageSNo = CustomizedGrid.PageSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);
            
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@PageSNo", PageSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageUsers", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                UserName = e["UserName"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridUserData2(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int PageSNo = CustomizedGrid.PageSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@PageSNo", PageSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListPageUsers", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                UserName = e["UserName"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridGroupUsers(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int GroupSNo = CustomizedGrid.GroupSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);
            
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@GroupSNo", GroupSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListGroupUsers", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                UserName = e["UserName"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = userList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public DataSourceResult GetGridGroupUsers2(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            int GroupSNo = CustomizedGrid.GroupSNo;
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Users>(filter);
            
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@GroupSNo", GroupSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListGroupUsers2", Parameters);

            var userList = ds.Tables[0].AsEnumerable().Select(e => new Users
            {
                //MSNo = Convert.ToInt32(e["MSNo"]),
                SNo = Convert.ToInt32(e["SNo"]),
                FirstName = e["FirstName"].ToString(),
                LastName = e["LastName"].ToString(),
                UserName = e["UserName"].ToString().ToUpper(),
                Address = e["Address"].ToString(),
                EMailID = e["EMailID"].ToString(),
                CityCode = e["CityCode"].ToString(),
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

        public Users GetUsersRecord(string recordID)
        {
            //DataSet dsget = new DataSet();
            
            Users u = new Users();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt16(recordID)) };
            //SqlDataReader dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetRecordUsers", Parameters);
            DataSet dsget = SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordUsers", Parameters);
            //if (dr.Read())
            if (dsget.Tables[0].Rows.Count > 0)
            {
                u.SNo = Int32.Parse(recordID);
                u.UserTypeSNo = dsget.Tables[0].Rows[0]["UserType"].ToString().ToUpper();
                u.UserTypeText = dsget.Tables[0].Rows[0]["UserTypeText"].ToString().ToUpper();
                u.UserTypeValue = Convert.ToInt32(dsget.Tables[0].Rows[0]["UserTypeValue"].ToString().ToUpper());
                u.Text_UserTypeValue = dsget.Tables[0].Rows[0]["TextUserTypeValue"].ToString().ToUpper();
                u.Text_UserTypeSNo = dsget.Tables[0].Rows[0]["UserTypeText"].ToString().ToUpper();

                u.EmployeeID = dsget.Tables[0].Rows[0]["EmployeeSNo"].ToString();
                //u.Text_EmployeeID = dsget.Tables[0].Rows[0]["EmployeeID"].ToString();
                u.Text_EmployeeID = dsget.Tables[0].Rows[0]["EmployeeID"].ToString() + "-" + dsget.Tables[0].Rows[0]["EmName"].ToString();
                u.Airline = dsget.Tables[0].Rows[0]["AirlineSNo"].ToString();
                //u.Airline = dsget.Tables[0].Rows[0]["CarrierCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["AirlineName"].ToString();
                u.Text_Airline = dsget.Tables[0].Rows[0]["CarrierCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["AirlineName"].ToString();
                u.FirstName = dsget.Tables[0].Rows[0]["FirstName"].ToString();
                u.LastName = dsget.Tables[0].Rows[0]["LastName"].ToString();
                u.UserName = dsget.Tables[0].Rows[0]["UserName"].ToString();
                u.DCity = dsget.Tables[0].Rows[0]["CityName"].ToString();
                u.Address = dsget.Tables[0].Rows[0]["Address"].ToString();
                u.Agent = dsget.Tables[0].Rows[0]["Agent"].ToString();
                //u.Text_Agent = dsget.Tables[0].Rows[0]["CustomerTypeSNo"].ToString() + "-" + dsget.Tables[0].Rows[0]["CustomerTypeName"].ToString();  // commented by arman ali
                //add by arman ali
                u.Text_Agent = dsget.Tables[0].Rows[0]["Text_Agent"].ToString();
                ////===============For Read Data================
                u.DAirportSNo = dsget.Tables[0].Rows[0]["AirportName"].ToString();
                ////u.DWareHouseMasterSNo = dr["WarehouseName"].ToString();
                ////================For Edit Data====================             
                ////u.CompanyName = dr["CompanyName"].ToString();
                u.Mobile = dsget.Tables[0].Rows[0]["Mobile"].ToString();
                u.MobileCountryCode = dsget.Tables[0].Rows[0]["MobileCountryCode"].ToString();
                u.Text_MobileCountryCode = dsget.Tables[0].Rows[0]["MobileCountryCode"].ToString();
                //Added By NEHAL
               

                //u.OverrideAsAgreedonAWBPrint = dsget.Tables[0].Rows[0]["OverrideAsAgreedonAWBPrint"].ToString();
                //u.Text_OverrideAsAgreedonAWBPrint = dsget.Tables[0].Rows[0]["OverrideAsAgreedonAWBPrint"].ToString();

                //u.ViewRatewhileBooking = dsget.Tables[0].Rows[0]["ViewRatewhileBooking"].ToString();
                //u.Text_ViewRatewhileBooking = dsget.Tables[0].Rows[0]["ViewRatewhileBooking"].ToString();

                //u.EnableRateTabInReservation = dsget.Tables[0].Rows[0]["EnableRateTabInReservation"].ToString();
                //u.Text_EnableRateTabInReservation = dsget.Tables[0].Rows[0]["EnableRateTabInReservation"].ToString();

                //u.ShowBalanceCreditLimit = dsget.Tables[0].Rows[0]["ShowBalanceCreditLimit"].ToString();
                //u.Text_ShowBalanceCreditLimit = dsget.Tables[0].Rows[0]["ShowBalanceCreditLimit"].ToString();

                if (dsget.Tables[0].Rows[0]["AirportCode"].ToString() != "")
                {
                    u.Text_AirportSNo = dsget.Tables[0].Rows[0]["AirportCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["AirportName"].ToString();
                    u.AirportSNo = dsget.Tables[0].Rows[0]["AirportSNo"].ToString() == "" ? 0 : Convert.ToInt32(dsget.Tables[0].Rows[0]["AirportSNo"].ToString());
                }
                else
                {
                    u.Text_AirportSNo = "";
                    u.AirportSNo = 0;
                }
                ////u.Text_WareHouseMasterSNo = dr["WarehouseName"].ToString();
                ////u.WareHouseMasterSNo = dr["WareHouseMasterSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["WareHouseMasterSNo"].ToString());
                u.GroupEMailID = dsget.Tables[0].Rows[0]["GroupEMailID"].ToString();
                u.CityName = dsget.Tables[0].Rows[0]["CityCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["CityName"].ToString();
                u.CitySNo = Convert.ToInt32(dsget.Tables[0].Rows[0]["CitySNo"].ToString());
                u.Text_CitySNo = dsget.Tables[0].Rows[0]["CityCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["CityName"].ToString();

                u.EMailID = dsget.Tables[0].Rows[0]["EMailID"].ToString();

                u.IsActive = Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsActive"].ToString());
                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsBlocked"].ToString()) == false)
                {
                    u.Blocked = "No";

                }
                else { u.Blocked = "Yes"; }
                u.IsBlock = Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsBlocked"].ToString());
                ////u.LanguaugeSNo = dr["LanguaugeSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["LanguaugeSNo"].ToString());
                ////u.Text_LanguaugeSNo = dr["LanguaugeName"].ToString();
                u.Active = dsget.Tables[0].Rows[0]["Active"].ToString();
                u.GroupSNo = Convert.ToInt32(dsget.Tables[0].Rows[0]["GroupSNo"].ToString());
                ////if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 12)
                ////    u.Name = dr["Forwarder"].ToString();
                ////else if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 24)
                ////    u.Name = dr["TruckingCompany"].ToString();
                ////else if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 12)
                ////    u.Name = dr["Forwarder"].ToString();
                u.Text_GroupSNo = dsget.Tables[0].Rows[0]["GroupName"].ToString();
                ////u.ForwarderSno = Convert.ToInt32(dr["ForwarderSno"].ToString());
                ////u.TruckerSno = Convert.ToInt32(dr["TruckingCompanySno"].ToString());
                u.CreatedUser = dsget.Tables[0].Rows[0]["CreatedUser"].ToString();
                u.UpdatedUser = dsget.Tables[0].Rows[0]["UpdatedUser"].ToString();
                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsCityChangeAllowed"].ToString()) == true)
                {
                    u.IsCityChangeAllowed = Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsCityChangeAllowed"].ToString());
                    u.MultipleCity = dsget.Tables[0].Rows[0]["MultiCityName"].ToString();

                }
                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsCityChangeAllowed"].ToString()) == false)
                {
                    u.IsCityChangeAllowed = Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsCityChangeAllowed"].ToString());
                    u.AllowCitySNo = "";
                    u.Text_AllowCitySNo = "";
                }
                u.CityChangeAllowed = dsget.Tables[0].Rows[0]["CityChangeAllowed"].ToString();
                if (dsget.Tables[0].Rows[0]["Text_MultiCitySNo"].ToString() != "0")
                {
                    u.AllowCitySNo = dsget.Tables[0].Rows[0]["Text_MultiCitySNo"].ToString();
                    u.Text_AllowCitySNo = dsget.Tables[0].Rows[0]["MultiCityName"].ToString();
                }
                else
                {
                    u.AllowCitySNo = "";
                    u.Text_AllowCitySNo = "";
                }

                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["OtherAirlineAccess"].ToString()) == true)
                {
                    u.OtherAirlineAccess = Convert.ToBoolean(dsget.Tables[0].Rows[0]["OtherAirlineAccess"].ToString());
                    u.OtherAirline = dsget.Tables[0].Rows[0]["Text_OtherAirlineSNO"].ToString();
                    //u.OtherAirline = dsget.Tables[0].Rows[0]["CarrierCode"].ToString() + "-" + dsget.Tables[0].Rows[0]["AirlineName"].ToString(); 
                    u.Text_OtherAirline = dsget.Tables[0].Rows[0]["OtherAirlineCode"].ToString();
                }
                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["OtherAirlineAccess"].ToString()) == false)
                {
                    u.OtherAirlineAccess = Convert.ToBoolean(dsget.Tables[0].Rows[0]["OtherAirlineAccess"].ToString());
                    //u.Airline = "";
                    //u.Airline = dsget.Tables[0].Rows[0]["AirlineName"].ToString(); //Commented By Shatrughana Kumar Gupta
                    //u.Airline = dsget.Tables[0].Rows[0]["AirlineSNo"].ToString(); //Added by Shatrughana Kumar Gupta// Commented by devendra on 29 may 2018
                    //  u.Text_Airline = dsget.Tables[0].Rows[0]["AirlineName"].ToString();// Commented by devendra on 29 may 2018
                }

                if (dsget.Tables[0].Rows[0]["Text_OtherAirlineSNO"].ToString() != "0")
                {
                    u.OtherAirline = dsget.Tables[0].Rows[0]["Text_OtherAirlineSNO"].ToString();
                    u.Text_OtherAirline = dsget.Tables[0].Rows[0]["OtherAirlineCode"].ToString();

                }
                else
                {
                    u.OtherAirline = "";
                    u.Text_OtherAirline = "";
                }

                //u.CityChangeAllowed = dsget.Tables[0].Rows[0]["CityChangeAllowed"].ToString();
                u.LBLOtherAirlineAccess = dsget.Tables[0].Rows[0]["AirlineAccessAllowed"].ToString();
                u.Designation = Convert.ToInt32(dsget.Tables[0].Rows[0]["DesignationSNo"].ToString());
                u.Text_Designation = dsget.Tables[0].Rows[0]["DesignationName"].ToString();
                u.Terminal = Convert.ToInt32(dsget.Tables[0].Rows[0]["TerminalSNo"].ToString());
                u.Text_Terminal = dsget.Tables[0].Rows[0]["TerminalName"].ToString();

                ////added by Pankaj Khanna
                u.OfficeSNo = Convert.ToInt32(dsget.Tables[0].Rows[0]["OfficeSNo"]);
                u.Text_OfficeSNo = dsget.Tables[0].Rows[0]["OfficeName"].ToString();
                u.NameSNo = Convert.ToInt32(dsget.Tables[0].Rows[0]["NameSNo"]);
                u.Text_NameSNo = dsget.Tables[0].Rows[0]["Text_NameSNo"].ToString();
                u.UserExpairyDate = Convert.ToDateTime(dsget.Tables[0].Rows[0]["UserExpiryDate"].ToString());
                // ********************* Previus ***************************
                //u.SNo = Int32.Parse(recordID);
                //u.FirstName = dr["FirstName"].ToString();
                //u.LastName = dr["LastName"].ToString();
                //u.UserName = dr["UserName"].ToString().ToUpper();
                //u.DCity = dr["CityName"].ToString();
                //u.Address = dr["Address"].ToString();
                ////===============For Read Data================
                //u.DAirportSNo = dr["AirportName"].ToString();
                ////u.DWareHouseMasterSNo = dr["WarehouseName"].ToString();
                ////================For Edit Data====================             
                ////u.CompanyName = dr["CompanyName"].ToString();
                //u.Mobile = dr["Mobile"].ToString();
                //u.MobileCountryCode = dr["MobileCountryCode"].ToString();
                //u.Text_MobileCountryCode = dr["MobileCountryCode"].ToString();
                //if (dr["AirportCode"].ToString() != "")
                //{
                //    u.Text_AirportSNo = dr["AirportCode"].ToString() + "-" + dr["AirportName"].ToString();
                //    u.AirportSNo = dr["AirportSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["AirportSNo"].ToString());
                //}
                //else
                //{
                //    u.Text_AirportSNo = "";
                //    u.AirportSNo = 0;
                //}
                ////u.Text_WareHouseMasterSNo = dr["WarehouseName"].ToString();
                ////u.WareHouseMasterSNo = dr["WareHouseMasterSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["WareHouseMasterSNo"].ToString());
                //u.GroupEMailID = dr["GroupEMailID"].ToString();
                //u.CityName = dr["CityCode"].ToString() + "-" + dr["CityName"].ToString();
                //u.Text_CitySNo = dr["CityCode"].ToString() + "-" + dr["CityName"].ToString();
                //u.CitySNo = Convert.ToInt32(dr["CitySNo"].ToString());
                //u.EMailID = dr["EMailID"].ToString();

                //u.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                //if (Convert.ToBoolean(dr["IsBlocked"].ToString()) == false)
                //{
                //    u.Blocked = "No";

                //}
                //else { u.Blocked = "Yes"; }
                //u.IsBlock = Convert.ToBoolean(dr["IsBlocked"].ToString());
                ////u.LanguaugeSNo = dr["LanguaugeSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["LanguaugeSNo"].ToString());
                ////u.Text_LanguaugeSNo = dr["LanguaugeName"].ToString();
                //u.Active = dr["Active"].ToString();
                //u.GroupSNo = Convert.ToInt32(dr["GroupSNo"].ToString());
                ////if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 12)
                ////    u.Name = dr["Forwarder"].ToString();
                ////else if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 24)
                ////    u.Name = dr["TruckingCompany"].ToString();
                ////else if (Convert.ToInt32(dr["GroupSNo"].ToString()) == 12)
                ////    u.Name = dr["Forwarder"].ToString();
                //u.Text_GroupSNo = dr["GroupName"].ToString();
                ////u.ForwarderSno = Convert.ToInt32(dr["ForwarderSno"].ToString());
                ////u.TruckerSno = Convert.ToInt32(dr["TruckingCompanySno"].ToString());
                //u.CreatedUser = dr["CreatedUser"].ToString();
                //u.UpdatedUser = dr["UpdatedUser"].ToString();
                //if (Convert.ToBoolean(dr["IsCityChangeAllowed"].ToString()) == true)
                //{
                //    u.IsCityChangeAllowed = Convert.ToBoolean(dr["IsCityChangeAllowed"].ToString());
                //    u.MultipleCity = dr["MultiCityName"].ToString();

                //}
                //if (Convert.ToBoolean(dr["IsCityChangeAllowed"].ToString()) == false)
                //{
                //    u.IsCityChangeAllowed = Convert.ToBoolean(dr["IsCityChangeAllowed"].ToString());
                //    u.AllowCitySNo = "";
                //    u.Text_AllowCitySNo = "";
                //}
                //u.CityChangeAllowed = dr["CityChangeAllowed"].ToString();
                //if (dr["Text_MultiCitySNo"].ToString() != "0")
                //{
                //    u.AllowCitySNo = dr["Text_MultiCitySNo"].ToString();
                //    u.Text_AllowCitySNo = dr["MultiCityName"].ToString();
                //}
                //else
                //{
                //    u.AllowCitySNo = "";
                //    u.Text_AllowCitySNo = "";
                //}
                //u.UserTypeSNo = dr["UserType"].ToString().ToUpper();
                //u.UserTypeText = dr["UserTypeText"].ToString().ToUpper();
                //u.UserTypeValue = Convert.ToInt32(dr["UserTypeValue"].ToString().ToUpper());
                //u.Text_UserTypeValue = dr["TextUserTypeValue"].ToString().ToUpper();
                //u.Designation = Convert.ToInt32(dr["DesignationSNo"].ToString());
                //u.Text_Designation = dr["DesignationName"].ToString();
                //u.Terminal = Convert.ToInt32(dr["TerminalSNo"].ToString());
                //u.Text_Terminal = dr["TerminalName"].ToString();

                ////added by Pankaj Khanna
                //u.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                //u.Text_OfficeSNo = dr["OfficeName"].ToString();
                //u.NameSNo = Convert.ToInt32(dr["NameSNo"]);
                //u.Text_NameSNo = dr["Text_NameSNo"].ToString();
                u.isProductAccess = Convert.ToBoolean(dsget.Tables[0].Rows[0]["isProductAccess"].ToString());
                u.Otherproductaccess = dsget.Tables[0].Rows[0]["ProductAccess"].ToString();
                u.Text_Products = dsget.Tables[0].Rows[0]["Otherproductaccess"].ToString();
                u.Productsno = dsget.Tables[0].Rows[0]["Text_OtherproductaccessSNo"].ToString();
                u.Remarks = dsget.Tables[0].Rows[0]["Remarks"].ToString();
                u.IsAllowedUserCreation =Convert.ToString(dsget.Tables[0].Rows[0]["IsAllowedUserCreation"]);
                u.Text_IsAllowedUserCreation = dsget.Tables[0].Rows[0]["Text_IsAllowedUserCreation"].ToString();
                if (Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsSpecialInvoice"].ToString()) == false)
                {
                    u.IsSpecialInvoice = false;

                }
                else { u.IsSpecialInvoice = true; }
                u.SpecialInvoice = dsget.Tables[0].Rows[0]["SpecialInvoice"].ToString();
                u.Text_ShowAsAgreedonAWBPrint = dsget.Tables[0].Rows[0]["Text_ShowAsAgreedonAWBPrint"].ToString();    
                u.ShowAsAgreedonAWBPrint = Convert.ToBoolean(dsget.Tables[0].Rows[0]["IsShowAsAgreedonAWBPrint"]) == false ? false : true;

                u.Text_OverrideAsAgreedonAWBPrint = dsget.Tables[0].Rows[0]["Text_OverrideAsAgreedonAWBPrint"].ToString();
                u.OverrideAsAgreedonAWBPrint = Convert.ToBoolean(dsget.Tables[0].Rows[0]["OverrideAsAgreedonAWBPrint"]) == false ? false : true;
                u.Text_ViewRatewhileBooking = dsget.Tables[0].Rows[0]["Text_ViewRatewhileBooking"].ToString();
                u.ViewRatewhileBooking = Convert.ToBoolean(dsget.Tables[0].Rows[0]["ViewRatewhileBooking"]) == false ? false : true;
                u.Text_EnableRateTabInReservation = dsget.Tables[0].Rows[0]["Text_EnableRateTabInReservation"].ToString();
                u.EnableRateTabInReservation = Convert.ToBoolean(dsget.Tables[0].Rows[0]["EnableRateTabInReservation"]) == false ? false : true;
                u.Text_ShowBalanceCreditLimit = dsget.Tables[0].Rows[0]["Text_ShowBalanceCreditLimit"].ToString();
                u.ShowBalanceCreditLimit = Convert.ToBoolean(dsget.Tables[0].Rows[0]["ShowBalanceCreditLimit"]) == false ? false : true;
            }
            //dr.Close();
            dsget.Dispose();
            return u;
        }

        public List<string> SaveUsers(List<UserCollection> users)
        {
            CommonService c = new CommonService();
            try
            {
                String guid = Guid.NewGuid().ToString();
                string NewPwd = guid.ToString().Substring(0, 8); //"cargo"; 

                List<string> ErrorMessage = new List<string>();
                List<Users> type = users[0].userstype;

                string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
                DataTable dtCreateusers = CollectionHelper.ConvertTo(type, "Blocked,Text_LanguaugeSNo,Text_MobileCountryCode,DCity,Text_WareHouseMasterSNo,Text_AirportSNo,Text_MobileCountryCode,DAirportSNo,DWareHouseMasterSNo,MultipleCity,AllowCitySNo,Text_AllowCitySNo,Text_CityCode,Active,MSNo,CreatedUser,UpdatedUser,CityName,Text_CitySNo,CityCode,Text_ForwarderSno,Text_TruckerSno,Text_GroupSNo,UserType,Name,TempPassword,CityChangeAllowed,AccessibleCitySNo,Text_AccessibleCitySNo,CompanyName,WareHouseMasterSNo,ForwarderSno,TruckerSno,LanguaugeSNo,Text_UserTypeValue,Text_Designation,Text_Terminal,Text_UserTypeSNo,Text_EmployeeID,Text_Airline,Text_Agent,Text_OtherAirline,LBLOtherAirlineAccess,UserTypeText,Text_OfficeSNo,Text_NameSNo,AirlineName,Text_UserExpairyDate,Text_CompanyName,LastResetBy,Text_Products,Text_Products,Otherproductaccess,UserCreatedby,Text_IsAllowedUserCreation,UserCreatedOn,CreatedOntime,SpecialInvoice,Text_ShowAsAgreedonAWBPrint,Text_OverrideAsAgreedonAWBPrint,Text_ViewRatewhileBooking,Text_EnableRateTabInReservation,Text_ShowBalanceCreditLimit");

                int ret = 0;
                int userSNo = 0;
                GroupBusiness groupBusiness = new GroupBusiness();
                if (!groupBusiness.ValidateBaseBusiness("Users", dtCreateusers, "SAVE"))
                {
                    ErrorMessage = groupBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@UsersTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateusers;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@NewPwd";
                param1.SqlDbType = System.Data.SqlDbType.NVarChar;
                param1.Value = NewPwd;


                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@EncyNewPwd";
                param2.SqlDbType = System.Data.SqlDbType.NVarChar;
                param2.Value = c.GenerateSHA512String(NewPwd);



                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@Path";
                param3.SqlDbType = System.Data.SqlDbType.NVarChar;
                param3.Value = HttpContext.Current.Request.Url.AbsoluteUri.Replace(HttpContext.Current.Request.Url.PathAndQuery, "/").ToString();
               
                SqlParameter[] Parameters = { param, param1, param2, param3 };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateUsers", Parameters);
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Create_NewUser", Parameters);
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {

                    ret = Convert.ToInt32(ds.Tables[0].Rows[0]["ErrorNumber"]);
                    userSNo = Convert.ToInt32(ds.Tables[0].Rows[0]["UserSNo"]);

                }

                //}
                if (ret > 0)
                {
                    ///ErrorMessage.Add("0");
                    if (ret > 1000)
                    {
                        string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Users");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(ret, groupBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                else
                {
                    ErrorMessage.Add(userSNo.ToString() + "-");
                }

                return ErrorMessage;

                //else
                //{
                //    ErrorMessage.Add("0" + "-");
                //}

            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public List<string> UpdateUsers(List<UserCollection> users)
        {
            List<string> ErrorMessage = new List<string>();
            List<Users> type = users[0].userstype;

            DataTable dtUpdateUsers = CollectionHelper.ConvertTo(type, "Blocked,Text_LanguaugeSNo,Text_MobileCountryCode,DCity,Text_WareHouseMasterSNo,Text_AirportSNo,Text_MobileCountryCode,DAirportSNo,DWareHouseMasterSNo,MultipleCity,AllowCitySNo,Text_AllowCitySNo,Text_CityCode,Active,MSNo,CreatedUser,UpdatedUser,CityName,Text_CitySNo,CityCode,Text_ForwarderSno,Text_TruckerSno,Text_GroupSNo,UserType,Name,TempPassword,CityChangeAllowed,AccessibleCitySNo,Text_AccessibleCitySNo,CompanyName,WareHouseMasterSNo,ForwarderSno,TruckerSno,LanguaugeSNo,Text_UserTypeValue,Text_Designation,Text_Terminal,Text_UserTypeSNo,Text_EmployeeID,Text_Airline,Text_Agent,Text_OtherAirline,LBLOtherAirlineAccess,UserTypeText,Text_OfficeSNo,Text_NameSNo,AirlineName,Text_UserExpairyDate,Text_CompanyName,LastResetBy,Text_Products,Otherproductaccess,UserCreatedby,Text_IsAllowedUserCreation,UserCreatedOn,CreatedOntime,SpecialInvoice,Text_ShowAsAgreedonAWBPrint,Text_OverrideAsAgreedonAWBPrint,Text_ViewRatewhileBooking,Text_EnableRateTabInReservation,Text_ShowBalanceCreditLimit");

            //DataTable dtUpdateUsers = CollectionHelper.ConvertTo(type, "Blocked,Text_LanguaugeSNo,Text_MobileCountryCode,DCity,Text_WareHouseMasterSNo,Text_AirportSNo,Text_MobileCountryCode,DAirportSNo,DWareHouseMasterSNo,MultipleCity,AllowCitySNo,Text_AllowCitySNo,Text_CityCode,Active,MSNo,CreatedUser,UpdatedUser,CityName,Text_CitySNo,CityCode,Text_ForwarderSno,Text_TruckerSno,Text_GroupSNo,UserType,Name,TempPassword,CityChangeAllowed,AccessibleCitySNo,Text_AccessibleCitySNo,CompanyName,WareHouseMasterSNo,ForwarderSno,TruckerSno,LanguaugeSNo,Text_UserTypeValue,Text_Designation,Text_Terminal,UserTypeText,Text_OfficeSNo,Text_NameSNo");


            //DataTable dtCreateUserCityTrans = CollectionHelper.ConvertTo(subtype, "");
            GroupBusiness groupBusiness = new GroupBusiness();
            if (!groupBusiness.ValidateBaseBusiness("Users", dtUpdateUsers, "UPDATE"))
            {
                ErrorMessage = groupBusiness.ErrorMessage;
                return ErrorMessage;
            }

            int ret = 0;
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@UsersTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateUsers;
            SqlParameter[] Parameters = { param };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateUsers", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Users");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = groupBusiness.ReadServerErrorMessages(ret, groupBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }

        public List<string> DeleteUsers(List<string> listID)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            GroupBusiness groupBusiness = new GroupBusiness();
            if (listID.Count > 1)
            {
                string UserID = listID[0].ToString();
                // string UserID = listID[1].ToString();
                // SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) }; //Commented By Shatrughana Gupta
                SqlParameter[] Parameters = { new SqlParameter("@UserID", Convert.ToInt32(UserID)) }; //Added By Shatrughana Gupta
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUsers", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = groupBusiness.ReadServerErrorMessages(ret, "Users");
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

        public void DeletePermission(int pageSNo, List<DeletePermissionGroupCollection> deletePermissionGroupCollection, List<DeletePermissionUserCollection> deletePermissionUserCollection)
        {
            int returnValue = 0;
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            DataTable dtDeletePermissionGroup = CollectionHelper.ConvertTo(deletePermissionGroupCollection, "");
            DataTable dtDeletePermissionUser = CollectionHelper.ConvertTo(deletePermissionUserCollection, "");

            SqlParameter parampageSNo = new SqlParameter();
            parampageSNo.ParameterName = "@PageSNo";
            parampageSNo.Value = pageSNo;

            SqlParameter paramGroup = new SqlParameter();
            paramGroup.ParameterName = "@DeletePermissionGroupTable";
            paramGroup.SqlDbType = System.Data.SqlDbType.Structured;
            paramGroup.Value = dtDeletePermissionGroup;

            SqlParameter paramUser = new SqlParameter();
            paramUser.ParameterName = "@DeletePermissionUserTable";
            paramUser.SqlDbType = System.Data.SqlDbType.Structured;
            paramUser.Value = dtDeletePermissionUser;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { parampageSNo, paramGroup, paramUser, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(connectionString, "DeletePermission", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void AddUserPermission(int pageSNo, List<DeletePermissionUserCollection> deletePermissionUserCollection)
        {
            int returnValue = 0;
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            DataTable dtAddPermissionUser = CollectionHelper.ConvertTo(deletePermissionUserCollection, "");

            SqlParameter parampageSNo = new SqlParameter();
            parampageSNo.ParameterName = "@PageSNo";
            parampageSNo.Value = pageSNo;

            SqlParameter paramUser = new SqlParameter();
            paramUser.ParameterName = "@DeletePermissionUserTable";
            paramUser.SqlDbType = System.Data.SqlDbType.Structured;
            paramUser.Value = dtAddPermissionUser;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.VarChar);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { parampageSNo, paramUser, errorNumber, errorMessage };

            //DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "AddUserPermission", Parameters);

            int ret = SqlHelper.ExecuteNonQuery(connectionString, "AddUserPermission", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public void AddGroupPermission(int pageSNo, List<DeletePermissionGroupCollection> deletePermissionGroupCollection)
        {
            int returnValue = 0;
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            DataTable dtAddPermissionGroup = CollectionHelper.ConvertTo(deletePermissionGroupCollection, "");

            SqlParameter parampageSNo = new SqlParameter();
            parampageSNo.ParameterName = "@PageSNo";
            parampageSNo.Value = pageSNo;

            SqlParameter paramUser = new SqlParameter();
            paramUser.ParameterName = "@DeletePermissionGroupTable";
            paramUser.SqlDbType = System.Data.SqlDbType.Structured;
            paramUser.Value = dtAddPermissionGroup;

            SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 250;

            SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
            errorMessage.Direction = ParameterDirection.Output;
            errorMessage.Size = 32;

            SqlParameter[] Parameters = { parampageSNo, paramUser, errorNumber, errorMessage };

            int ret = SqlHelper.ExecuteNonQuery(connectionString, "AddGroupPermission", Parameters);
            if (ret != -1)
            {
                //Error 
                returnValue = Convert.ToInt32(errorNumber.Value);
            }
        }

        public string setAirportWarehouseName(int citySno, int airportSNo)
        {
            var retString = "";
            SqlParameter[] Parameters = { new SqlParameter("@CitySno", citySno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportWarehouseDetail", Parameters);
            if (ds.Tables[0].Rows.Count > 0)
            {
                retString = retString + ds.Tables[0].Rows[0]["Sno"].ToString() + "~";
                retString = retString + ds.Tables[0].Rows[0]["AirportName"] + "~";
            }

            if (ds.Tables[1].Rows.Count > 0)
            {
                if (airportSNo > 0)
                {
                    DataRow drWarehouse = ds.Tables[1].Select("CitySNo=" + citySno + " and AirportSNo=" + airportSNo)[0];
                    retString = retString + drWarehouse["Sno"].ToString() + "~";
                    retString = retString + drWarehouse["WareHouseName"] + "~";
                }
                else
                {
                    retString = retString + ds.Tables[1].Rows[0]["Sno"].ToString() + "~";
                    retString = retString + ds.Tables[1].Rows[0]["WareHouseName"] + "~";
                }
            }


            return retString;


            //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommoditySubGroupType", Parameters);
            //ds.Dispose();
            //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetEmployeedetailinformation(int SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEmployeedetailinformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string Getofficelist(int OfficeSNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Getofficelist", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }



        public string GetAirportOfficeInformation(int CitySNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportOfficeInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        //  To get Agent's Office and City Details
        //Added by vkumar on 6th jan 2017 regarding task #38
        public string GetAgentDetails(int agentId)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AgentId", agentId) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getAgentDetails", Parameters);
            return DStoJSON(ds);
        }

        public static string DStoJSON(DataSet ds)
        {
            StringBuilder json = new StringBuilder();
            json.Append("[");
            if (ds != null && ds.Tables.Count > 0)
            {
                int lInteger = 0;
                foreach (DataRow dr in ds.Tables[ds.Tables.Count - 1].Rows)
                {
                    lInteger = lInteger + 1;
                    json.Append("{");
                    int i = 0;
                    int colcount = dr.Table.Columns.Count;
                    foreach (DataColumn dc in dr.Table.Columns)
                    {
                        json.Append("\"");
                        json.Append(dc.ColumnName);
                        json.Append("\":\"");
                        json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                        json.Append("\"");
                        i++;
                        if (i < colcount) json.Append(",");
                    }

                    if (lInteger < ds.Tables[ds.Tables.Count - 1].Rows.Count)
                    {
                        json.Append("},");
                    }
                    else
                    {
                        json.Append("}");
                    }
                }
            }
            json.Append("]");


            return json.ToString();
        }


        public string getDataForGSA_Off_Airline(int office)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@Office", office) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getDataForGSA_Off_Airline", Parameters);
            return DStoJSON(ds);
        }


        public string Get_GSA_Offices(int AirlineSNo, int CitySNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@CitySNo", CitySNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_GSA_Office", Parameters);
            return DStoJSON(ds);
        }

        public string Get_GHA_Offices(int AirlineSNo, int CitySNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@CitySNo", CitySNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_GHA_Office", Parameters);
            return DStoJSON(ds);
        }

        public string Get_Agent_Offices(int AirlineSNo, int CitySNo, int OfficeSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@CitySNo", CitySNo), new SqlParameter("@OfficeSNo", OfficeSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_Agent_Offices", Parameters);
            return DStoJSON(ds);
        }

        //public string Get_Self_OtherAirline(string UserType, int OfficeSNo)
        public string Get_Self_OtherAirline(int OfficeSNo)
        {
            DataSet ds = new DataSet();
            //SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@OfficeSNo", OfficeSNo) };
            SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_Self_OtherAirline", Parameters);
            return DStoJSON(ds);
        }

        public string Get_Default_Airline(String Uname)
        {
            DataSet ds = new DataSet();
            //SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@OfficeSNo", OfficeSNo) };
            SqlParameter[] Parameters = { new SqlParameter("@usertext", Uname) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_Default_AirlineBind", Parameters);
            return DStoJSON(ds);
        }

        public string Get_GSA_Airport(int OfficeSNo)
        {
            DataSet ds = new DataSet();
            //SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@OfficeSNo", OfficeSNo) };
            SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Garuda_GSA_OtherAirport_Bind", Parameters);
            return DStoJSON(ds);
        }

        //Added by Shatrughana -11-02-2017
        public string GetOtherAirlineAccessCondition(int OfficeSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@OfficeSlNo", OfficeSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherAirlineAccessCondition", Parameters);
            return DStoJSON(ds);
        }
        //End Text by Shatrughana

        //================added by arman Ali Date : 30mar, 2017=======================
        public string GetMaxUsers(int id)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AgentSno", id) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUsersLimit", Parameters);

            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);

        }


        public string CountRemainingUsers(int GroupId, int AirlineSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@GroupId", GroupId), new SqlParameter("@AirlineSNo", AirlineSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUsers_CountRemainingUsers", Parameters);

            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);

        }


        public string CountRemainingAdminUsers(int GroupId, int AirlineSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@GroupId", GroupId), new SqlParameter("@AirlineSNo", AirlineSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUsers_CountRemainingAdminUsers", Parameters);

            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);

        }
        //===================end==================================================
        
        public string CheckMultiCityAccess(String GroupName, int AgentSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@GroupName", GroupName), new SqlParameter("@AgentSNo", AgentSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGroupMultiCityAccess", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string GetOtherAirlinesForAgent(int AgentSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AgentSNo", AgentSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherAirlinesForAgent", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
