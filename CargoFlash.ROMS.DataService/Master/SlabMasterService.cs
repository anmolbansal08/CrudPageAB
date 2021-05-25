using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region SlabMaster Service Description
    /*
	*****************************************************************************
	Service Name:	SlabMasterService      
	Purpose:		This Service used to get details of SlabMaster save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		11 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SlabMasterService : SignatureAuthenticate, ISlabMasterService
    {
        public SlabMaster GetSlabMasterRecord(string recordID, string UserID)
        {
            
           
           SqlDataReader dr = null;
            try
            {
                SlabMaster SlabMaster = new SlabMaster();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSlabMaster", Parameters);
                if (dr.Read())
                {
                    SlabMaster.SNo = Convert.ToInt32(dr["SNo"]);
                    SlabMaster.SlabTitle = dr["SlabTitle"].ToString().ToUpper();
                    SlabMaster.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    SlabMaster.Text_AirlineSNo = dr["AirlineName"].ToString();
                    SlabMaster.IsDefault = Convert.ToBoolean(dr["IsDefaultSlab"]);
                    //SlabMaster.CountryCode = Convert.ToString(dr["CountrySNo"]);
                    SlabMaster.Default = dr["DefaultSlab"].ToString();
                    SlabMaster.SlabLevel = Convert.ToInt32(dr["SlabLevel"]);
                    SlabMaster.Text_SlabLevel = dr["Text_SlabLevel"].ToString();
                    SlabMaster.Slab = dr["SlabOriginLevel"].ToString();
                    SlabMaster.Text_Slab = dr["Text_SlabOriginLevel"].ToString();
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        SlabMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        SlabMaster.Active = dr["Active"].ToString().ToUpper();
                    }
                    SlabMaster.UpdatedBy = dr["UpdatedUser"].ToString();
                    SlabMaster.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
          

                return SlabMaster;
            }
        catch(Exception ex)//
           {
                dr.Close();
                throw ex;
           }
}
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SlabMaster>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSlabMaster", Parameters);
                var SlabMasterList = ds.Tables[0].AsEnumerable().Select(e => new SlabMaster
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SlabTitle = e["SlabTitle"].ToString().ToUpper(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString(),
                    SlabLevel = Convert.ToInt32(e["SlabLevel"]),
                    Text_SlabLevel = e["Text_SlabLevel"].ToString(),
                    Slab = e["Text_SlabLevel"].ToString(),
                    Text_Slab = e["Text_Slab"].ToString().TrimEnd(','),
                    Default = e["Default"].ToString().ToUpper(),
                    //  AirlineName = e["AirlineName"].ToString().ToUpper(),
                    //CountryCode = e["CountryCode"].ToString().ToUpper(),
                    //  CityCode = e["CityCode"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = SlabMasterList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveSlabMaster(List<SlabMaster> SlabMaster)
        {
            try
            {
                //validate Business Rule
                int ret = 0;

                DataTable dtCreateSlabMaster = CollectionHelper.ConvertTo(SlabMaster, "Active,Text_AirlineSNo,Default,Text_Slab,Text_SlabLevel");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("SlabMaster", dtCreateSlabMaster, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SlabMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSlabMaster;
                SqlParameter[] Parameters = { param };
                string res = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSlabMaster", Parameters);

                ret = res.Split(',').Length > 1 ? Convert.ToInt32(res.Split(',')[1]) : Convert.ToInt32(res.Split(',')[0]);
                ErrorMessage.Add(res.Split(',')[0]);


                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SlabMaster");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> UpdateSlabMaster(List<SlabMaster> SlabMaster)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateSlabMaster = CollectionHelper.ConvertTo(SlabMaster, "Active,Text_AirlineSNo,Default,Text_Slab,Text_SlabLevel");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("SlabMaster", dtCreateSlabMaster, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SlabMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSlabMaster;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSlabMaster", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SlabMaster");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> DeleteSlabMaster(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSlabMaster", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SlabMaster");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //public DataSourceResult GetDefault()
        //{
        //    List<String> cur = new List<String>();
        //    //SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
        //    SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDefaultSlab");
        //    if (dr.Read())
        //    {
        //        cur.Add(dr["Slab"].ToString());
        //        cur.Add(dr["SlabTitle"].ToString());
        //    }
        //    return new DataSourceResult
        //    {
        //        Data = cur,
        //        Total = cur.Count()
        //    };
        //}
    }
}
