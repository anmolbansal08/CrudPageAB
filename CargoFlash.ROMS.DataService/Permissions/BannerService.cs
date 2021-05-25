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
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Permissions;


//namespace CargoFlash.Cargo.DataService.Permissions
//{
//    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
//    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
//    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
//    public class BannerService : SignatureAuthenticate, IBannerService
//    {

//        public List<string> SaveBanner(List<Banner> Uldsla)
//        {
//            try
//            {
//               // validate Business Rule
//                List<string> ErrorMessage = new List<string>();
//                DataTable dtCreateULDSLA = CollectionHelper.ConvertTo(Uldsla, "Text_CustomerSNo,Text_EventSNo,Text_BasisSNo,Text_MaintenanceTypeSNo,AgreementNumber,Vendor,EventName,BasisName,MaintenanceTypeName");
//                BaseBusiness baseBusiness = new BaseBusiness();

//                if (!baseBusiness.ValidateBaseBusiness("ULDSLA", dtCreateULDSLA, "SAVE"))
//                {
//                    ErrorMessage = baseBusiness.ErrorMessage;
//                    return ErrorMessage;
//                }
//                SqlParameter param = new SqlParameter();
//                param.ParameterName = "@ULDSLA";
//                param.SqlDbType = System.Data.SqlDbType.Structured;
//                param.Value = dtCreateULDSLA;
//                SqlParameter[] Parameters = { param };

//                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDSLA", Parameters);
//                if (ret > 0)
//                {
//                    if (ret > 1000)
//                    {
//                        //For Customised Validation Messages like 'Record Already Exists' etc
//                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDSLA");
//                        if (!string.IsNullOrEmpty(serverErrorMessage))
//                            ErrorMessage.Add(serverErrorMessage);
//                    }
//                    else
//                    {

//                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
//                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
//                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
//                            ErrorMessage.Add(dataBaseExceptionMessage);
//                    }


//                }

//                return ErrorMessage;
//            }
//            catch (Exception ex)//
//            {
//                throw ex;
//            }
//        }


//        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
//        {
//            try
//            {
//                string sorts = GridSort.ProcessSorting(sort);
//                string filters = GridFilter.ProcessFilters<BannerGrid>(filter);
//                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
//                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListBannerGridList", Parameters);

//                var ULDSLAList = ds.Tables[0].AsEnumerable().Select(e => new BannerGrid
//                {
//                    SNo = Convert.ToString(e["SNo"]),
//                    Text_BannerType = Convert.ToString(e["Text_BannerType"]),
//                    Title = Convert.ToString(e["BannerDescription"]),
//                    BannerSubject = Convert.ToString(e["BannerSubject"]),
//                    Active = Convert.ToString(e["Active"]),
 
//                });
//                ds.Dispose();
//                return new DataSourceResult

//                {
//                    Data = ULDSLAList.AsQueryable().ToList(),
//                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
//                };
//            }
//            catch (Exception ex)//
//            {
//                throw ex;
//            }

//        }
//    }
//}

//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Runtime.Serialization;
//using System.ServiceModel;
//using System.Text;
//using System.ServiceModel.Activation;
//using System.ServiceModel.Web;
//using System.Configuration;
//using System.Data;
//using System.Data.SqlClient;
//using CargoFlash.nGenDTD.Model.Master;
//using CargoFlash.SoftwareFactory.Data;
//using CargoFlash.nGenDTD.Business;
//using CargoFlash.nGenDTD.DataService;

namespace CargoFlash.Cargo.DataService.Permissions
{
    /// <summary>
    /// This is Banner Service Class.
    /// Created By : Devendra
    /// Created On : 15 JAN 2019
    /// Approved By :Devendra
    /// </summary>
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BannerService : SignatureAuthenticate, IBannerService
    {
        /// <summary>
        /// Get Banner record as per the recordid
        /// Created By : Devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public Banner GetBannerRecord(string recordID, string UserID)
        {
            Banner Banner = new Banner();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBanner", Parameters);
            if (dr.Read())
            {
                Banner.SNo = Convert.ToInt32(dr["SNo"]);
                Banner.BannerSubject = dr["BannerSubject"].ToString();
                Banner.Title = dr["Title"].ToString();
                Banner.BannerDescription = dr["BannerDescription"].ToString();
                Banner.IsActive = Convert.ToBoolean(dr["IsActive"]);
                Banner.Active = dr["Active"].ToString();
                Banner.CreatedUser = dr["CreatedUser"].ToString();
                Banner.UpdatedUser = dr["UpdatedUser"].ToString();
                Banner.BannerTypeName = dr["BannerTypeName"].ToString();
                Banner.BannerTypeNo = Convert.ToInt32(dr["BannerType"]);
                Banner.BannerType = Convert.ToInt32(dr["BannerType"]);
                Banner.UploadDocument = dr["UploadDocument"].ToString() == "" ? null : dr["UploadDocument"].ToString();
                Banner.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                Banner.ValidTo = Convert.ToDateTime(dr["ValidTo"]);

            }
            dr.Close();
            return Banner;
        }
        /// <summary>
        /// Get all records for grid data 
        /// Created By :Devendra
        /// Created On :15 JAN 2019
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
            string filters = GridFilter.ProcessFilters<BannerGridData>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListBanner", Parameters);

            var BannerList = ds.Tables[0].AsEnumerable().Select(e => new BannerGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                BannerSubject = e["BannerSubject"].ToString(),
                Active = e["Active"].ToString(),
                Title = e["Title"].ToString(),
                BannerType = e["BannerType"].ToString(),
                CreatedUser= e["CreatedUser"].ToString(),
                UpdatedUser= e["UpdatedUser"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = BannerList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = "GetListBanner"
            };

        }
        /// <summary>
        /// Save Banner Record 
        /// Created By : Devendra
        /// Created On :  15 JAN 2019
        /// </summary>
        /// <param name="Banner"></param>
        /// <returns></returns>
        /// L
        public List<string> SaveBanner(List<Banner> Banner)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateBanner = CollectionHelper.ConvertTo(Banner, "Active,BannerTypeName,BannerTypeNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Banner", dtCreateBanner, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@BannerTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateBanner;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateBanner", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Banner");
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
        /// Update Banner record 
        /// Created By : Devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="Banner"></param>
        /// <returns></returns>
        public List<string> UpdateBanner(List<Banner> Banner)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateBanner = CollectionHelper.ConvertTo(Banner, "Active,BannerTypeName,BannerTypeNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("Banner", dtCreateBanner, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@BannerTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateBanner;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateBanner", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Banner");
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
        /// Delete Banner record
        /// Created By : Devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteBanner(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteBanner", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Banner");
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

