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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Common;

namespace CargoFlash.Cargo.DataService.Master
{
    /// <summary>
    /// This is Drivers Service Class.
    
    /// </summary>
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DriversService : CargoFlash.Cargo.DataService.SignatureAuthenticate, IDriversService
    {
        CommonService c = new CommonService(); 
        /// <summary>
        /// Get Drivers record as per the recordid and UserID
        /// </summary>
        /// <param name="RecordID"></param>
        /// /// <param name="UserID"></param>
        public Drivers GetDriversRecord(int recordID, string UserID)
        {
            Drivers driver = new Drivers();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDrivers", Parameters);
            if (dr.Read())
            {
                driver.SNo = Convert.ToInt32(dr["SNo"]);
                driver.CitySNo = dr["CitySNo"].ToString();
                driver.Text_CitySNo = dr["CityCode"].ToString() + "-" + dr["CityName"].ToString();
               // driver.AssociatedBranch = Convert.ToInt32(dr["AssociatedBranchType"].ToString());
               // driver.AssociatedBranchName = dr["AssociatedBranchName"].ToString();
              //  driver.Name = dr["NameSNo"].ToString() == "" ? (int?)null : Convert.ToInt32(dr["NameSNo"].ToString());
              //  driver.Text_Name = dr["CitySNo"].ToString() == "" ? "" : dr["Name"].ToString();
                driver.FirstName = dr["FirstName"].ToString();
                driver.LastName = dr["LastName"].ToString();
                driver.EMailID = dr["EMailID"].ToString();
                driver.Mobile = dr["Mobile"].ToString();
              //  driver.UserName = dr["UserName"].ToString().ToString().Trim();
               // driver.Password = dr["Password"].ToString();
                driver.Address = dr["Address"].ToString();
                driver.ZipCode = dr["ZipCode"].ToString();
                driver.LicenceNo = dr["LicenceNo"].ToString();
                driver.LicenceExpiry = Convert.ToDateTime(dr["LicenceExpiry"]);
                driver.IsActive = Convert.ToBoolean(dr["IsActive"]);
             //   driver.Block = dr["Block"].ToString();
                driver.Active = dr["Active"].ToString();
                driver.CreatedUser = dr["CreatedUser"].ToString();
                driver.UpdatedUser = dr["UpdatedUser"].ToString();
             //   driver.TempPassword = dr["Password"].ToString();
             //   driver.AssociatedBranchType = Convert.ToInt32(dr["AssociatedBranchType"].ToString());
                driver.DriverName = dr["FirstName"].ToString() + " " + dr["LastName"].ToString();

            }
            dr.Close();
            return driver;
        }
        /// <summary>
        /// Get grid data
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Drivers>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDrivers", Parameters);

            var DriversList = ds.Tables[0].AsEnumerable().Select(e => new DriversGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Mobile = e["Mobile"].ToString(),
                DriverName = e["DriverName"].ToString(),
                CityName = e["CityName"].ToString(),
                LicenceNo = e["LicenceNo"].ToString(),

                Active = e["Active"].ToString()

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DriversList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = "GetListDrivers"
            };

        }

       
        /// <summary>
        /// Save Drivers
        /// </summary>
        public List<string> SaveDrivers(List<DriversSave> Drivers)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
           
            DataTable dtCreateDrivers = CollectionHelper.ConvertTo(Drivers, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Drivers", dtCreateDrivers, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DriversTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDrivers;

           

            SqlParameter[] Parameters = { param };

           
           // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateDrivers", Parameters);
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDrivers", Parameters);


            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Drivers");
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
        /// <summary>
        /// Update Drivers 
        /// </summary>
        public List<string> UpdateDrivers(List<DriversSave> Drivers)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
           
            DataTable dtCreateDrivers = CollectionHelper.ConvertTo(Drivers, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Drivers", dtCreateDrivers, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DriversTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDrivers;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDrivers", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Drivers");
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
        /// <summary>
        /// Delete Drivers 
       /// </summary>
        public List<string> DeleteDrivers(List<string> listID)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDrivers", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Drivers");
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
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }
    }
}