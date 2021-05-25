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
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CityService : SignatureAuthenticate, ICityService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        /// <summary>
        /// Get Record on the basis of recordID from City
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public City GetCityRecord(string recordID, string UserSNo)
        {
            City city = new City();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCity", Parameters);
                if (dr.Read())
               {
                    city.SNo = Convert.ToInt32(dr["SNo"]);                   
                    city.StandardName = dr["StandardName"].ToString().ToUpper();                   
                    city.CityCode = dr["CityCode"].ToString().ToUpper();
                    city.CityName = dr["CityName"].ToString().ToUpper();
                    city.CountrySNo = Convert.ToInt32(dr["CountrySNo"]);
                    city.Text_CountrySNo = dr["CountryCode"].ToString().ToUpper() + "-" + dr["CountryName"].ToString().ToUpper();
                    city.CountryCode = dr["CountryCode"].ToString().ToUpper();
                    city.CountryName = dr["CountryName"].ToString().ToUpper();
                    city.DayLightSaving = dr["DayLightSaving"].ToString().ToUpper();
                    city.DeltaSeconds = dr["DeltaSeconds"].ToString().ToUpper();

                    city.IATAArea = dr["IATAArea"].ToString();
                    city.Text_IATAArea = dr["IATAAreaName"].ToString();
                    //city.TimeDifference = Convert.ToInt32(dr["TimeDifference"]);
                    city.TimeZoneSNo =  Convert.ToInt32(dr["TimeZoneSNo"]);
                    city.Text_TimeZoneSNo = dr["TimeZoneName"].ToString().ToUpper();
                    //if (!String.IsNullOrEmpty(dr["IsDayLightSaving"].ToString()))
                    //{
                    //    city.IsDayLightSaving = Convert.ToBoolean(dr["IsDayLightSaving"]);
                    //    city.strDayLightSaving = dr["strDayLightSaving"].ToString().ToUpper();

                    //}
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        city.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        city.Active = dr["Active"].ToString().ToUpper();
                    }

                    if(!string.IsNullOrEmpty(dr["IsPriorApproval"].ToString()))
                    {
                        city.PriorApproval = (dr["IsPriorApproval"].ToString() == "Yes") ? true : false;
                        city.IsPriorApproval = dr["IsPriorApproval"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsHouse"].ToString()))
                    {
                        city.IsHouse = Convert.ToBoolean(dr["IsHouse"]);
                        city.House = dr["House"].ToString().ToUpper();
                    }
                    city.ZoneSNo = dr["ZoneSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["ZoneSNo"]);
                    city.Text_ZoneSNo = dr["ZoneName"].ToString().ToUpper();
                    city.SHCSNo = dr["SHCSNo"].ToString().ToUpper();                    
                    city.Text_SHCSNo = dr["Text_SHCSNo"].ToString().ToUpper();

                   city.DGClassSNo = dr["DGClassSNo"].ToString().ToUpper();
                   city.Text_DGClassSNo = dr["Text_DGClassSNo"].ToString().ToUpper();
                   city.VolumeConversionCM =   Convert.ToDouble(dr["VolumeConversionCM"]);
                   //city.Text_VolumeConversionCM = dr["Text_VolumeConversionCM"].ToString();
                   city.VolumeConversionInch =  Convert.ToDouble(dr["VolumeConversionInch"]);
                   //city.Text_VolumeConversionInch = dr["VolumeConversionInch"].ToString();
                    city.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    city.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    if(!String.IsNullOrEmpty(dr["IsDimension"].ToString()))
                    {
                        city.IsDimension = Convert.ToBoolean(dr["IsDimension"]);
                        city.Dimension = dr["Dimension"].ToString().ToUpper();
                    }
                }
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return city;
        }
        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<City>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCity", Parameters);
                var CityList = ds.Tables[0].AsEnumerable().Select(e => new City
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    CountryCode = e["CountryCode"].ToString().ToUpper(),
                    StandardName = e["StandardName"].ToString().ToUpper(),
                    DayLightSaving = e["DayLightSaving"].ToString().ToUpper(),
                    //TimeDifference = Convert.ToInt32(e["TimeDifference"]),
                    Active = e["Active"].ToString().ToUpper(),
                    // PriorApproval = (e["PriorApproval"]== "0") ? false : true,
                    IsPriorApproval = (Convert.ToBoolean(e["PriorApproval"]) == true) ? "YES" : "NO",
                    // UpdatedBy = e["UpdatedUser"].ToString().ToUpper()
                    House = e["House"].ToString().ToUpper(),
                    //  House = (Convert.ToBoolean(e["House"]) == true) ? "YES" : "NO"
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /// <summary>
        /// Save the AccountType Information into City
        /// </summary>
        /// <param name="City"></param>
        /// <returns></returns>
        public List<string> SaveCity(List<City> City)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,strDayLightSaving,StandardName,DayLightSaving,DeltaSeconds,IsDayLightSaving,TimeDifference,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea,IsPriorApproval,Text_SHCSNo,Text_DGClassSNo,House,Dimension"); //,Text_VolumeConversionCM,Text_VolumeConversionInch
                //                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");

                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("City", dtCreateCity, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCity;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "City");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Update City record on the basis of ID
        /// </summary>
        /// <param name="City"></param>
        /// <returns></returns>
        public List<string> UpdateCity(List<City> City)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,StandardName,DayLightSaving,DeltaSeconds,strDayLightSaving,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea,IsPriorApproval,Text_SHCSNo,Text_DGClassSNo,House,Dimension");//,Text_VolumeConversionCM,Text_VolumeConversionInch
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("City", dtCreateCity, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCity;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "City");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Delete City record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteCity(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@CityCode", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCity", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "City");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {
                            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(dataBaseExceptionMessage);
                        }
                    }
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public DayLightSavingTime GetDayLightSavingTime(string TimeZoneSno)
        {
            String DeltaSeconds = String.Empty;
            DayLightSavingTime dst = new DayLightSavingTime();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TimeZoneSno", TimeZoneSno) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDayLightSavingTime", Parameters);
                if (dr.Read())
                {
                    dst.DeltaSeconds = dr["DeltaSeconds"].ToString();
                    dst.DayLightSaving = dr["DayLightSaving"].ToString();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return dst;
        }
    }
}
