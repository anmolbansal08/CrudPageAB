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
    public class RegionService : SignatureAuthenticate, IRegionService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Region>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRegionDetails", Parameters);
                var RegionList = ds.Tables[0].AsEnumerable().Select(e => new Region
                {
                    //RowNumber,SNo,RegionName,RegionType,IsActive,CreatedOn,CreatedBy,UpdatedOn,UpdatedBy,Active
                    SNo = Convert.ToInt32(e["SNo"].ToString().ToUpper()),
                    RegionName = Convert.ToString(e["RegionName"]).ToUpper(),
                    RegionTypeText = Convert.ToString(e["RegionTypeText"]).ToUpper(),
                    Active = Convert.ToString(e["Active"]).ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RegionList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveRegion(List<Region> regionList)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateRegion = CollectionHelper.ConvertTo(regionList, "CountrySNo,RegionTypeText,Text_Country,Active,CreatedOn,UpdatedOn");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Region", dtcreateRegion, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RegionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateRegion;
                SqlParameter[] Parameters = { param };

               //SqlParameter[] Parameters = { 
               //                             new SqlParameter("@Region", regionList[0].RegionName),
               //                             new SqlParameter("@RegionType", regionList[0].RegionType),
               //                             new SqlParameter("@Country", regionList[0].Country),
               //                             new SqlParameter("@IsActive",Convert.ToBoolean(regionList[0].IsActive)),
               //                             new SqlParameter("@CreatedBy",Convert.ToInt32(regionList[0].CreatedBy)),
               //                             new SqlParameter("@UpdatedBy",Convert.ToInt32(regionList[0].UpdatedBy)),
               //                        };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRegionRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Region");
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
            catch(Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public Region GetRegionRecord(string recordID, string UserSNo)
        {
       
            Region region = new Region();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRegionRecord", Parameters);
                if (dr.Read())
                {
                    //SNo,RegionName,RegionType,Active,Country,CreatedUser,UpdatedUser
                    region.SNo = Convert.ToInt32(dr["SNo"]);
                    region.RegionName = Convert.ToString(dr["RegionName"]);
                    region.RegionTypeText = Convert.ToString(dr["RegionType"]);
                    region.Country = Convert.ToString(dr["Country"]);
                    region.Text_Country = Convert.ToString(dr["Country"]);
                    region.CountrySNo = Convert.ToString(dr["CountrySNo"]);
                    region.Active = Convert.ToString(dr["Active"]);
                    region.CreatedUser = Convert.ToString(dr["CreatedUser"]);
                    region.UpdatedUser = Convert.ToString(dr["UpdatedUser"]);
                }
            }
            catch(Exception ex)//// (Exception e)
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return region;
        }

        public List<string> UpdateRegion(List<Region> regionList)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(regionList, "CountrySNo,RegionTypeText,Text_Country,Active,CreatedOn,UpdatedOn");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Region", dtcreateofficetarget, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RegionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateofficetarget;
                SqlParameter[] Parameters = { param };

                //SqlParameter[] Parameters = { 
                //                            new SqlParameter("@SNo", regionList[0].SNo),
                //                            new SqlParameter("@Region", regionList[0].RegionName),
                //                            new SqlParameter("@RegionType", regionList[0].RegionType),
                //                            new SqlParameter("@Country", regionList[0].Country),
                //                            new SqlParameter("@IsActive",Convert.ToBoolean(regionList[0].IsActive)),
                //                            new SqlParameter("@CreatedBy",Convert.ToInt32(regionList[0].CreatedBy)),
                //                            new SqlParameter("@UpdatedBy",Convert.ToInt32(regionList[0].UpdatedBy)),
                //                       };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRegionRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Region");
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
            catch(Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteRegion(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRegion", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Region");
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
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
            return ErrorMessage;
        }
    }
}
