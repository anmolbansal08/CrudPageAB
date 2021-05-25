using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommodityGroupService : SignatureAuthenticate, ICommodityGroupService
    {
        /// <summary>
        /// Retrieve Airline infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public CommodityGroup GetCommodityGroupRecord(string recordID, string UserSNo)
        {
            try
            {

                CommodityGroup commodityGroup = new CommodityGroup();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID),
                                        new SqlParameter("@UserSNo", recordID)};
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCommodityGroup", Parameters);
                if (dr.Read())
                {
                    commodityGroup.SNo = Convert.ToInt32(dr["SNo"]);
                    commodityGroup.StartRange = (dr["StartRange"].ToString());
                    commodityGroup.EndRange = (dr["EndRange"].ToString());
                    commodityGroup.GroupName = Convert.ToString(dr["GroupName"]);
                    commodityGroup.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    commodityGroup.Active = dr["Active"].ToString();
                    commodityGroup.CreatedBy = dr["CreatedUser"].ToString();
                    commodityGroup.UpdatedBy = dr["UpdatedUser"].ToString();
                }
                dr.Close();
                return commodityGroup;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
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
                string filters = GridFilter.ProcessFilters<CommodityGroup>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCommodityGroup", Parameters);
                var CommodityGroupList = ds.Tables[0].AsEnumerable().Select(e => new CommodityGroup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    StartRange = (e["StartRange"].ToString()),
                    EndRange = (e["EndRange"].ToString()),
                    GroupName = e["GroupName"].ToString().ToUpper(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommodityGroupList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        /// <summary>
        /// Save the Entity into the database
        /// </summary>
        /// <param name="CommodityGroup">object of the Entity</param>
        public List<string> SaveCommodityGroup(List<CommodityGroup> CommodityGroup)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCommodityGroup = CollectionHelper.ConvertTo(CommodityGroup, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("CommodityGroup", dtCreateCommodityGroup, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodityGroup;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommodityGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CommodityGroup");
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
        /// Update the Entity into the database
        /// </summary>
        /// <param name="CommodityGroup">list of CommodityGroup to be updated</param>
        public List<string> UpdateCommodityGroup(List<CommodityGroup> CommodityGroup)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCommodityGroup = CollectionHelper.ConvertTo(CommodityGroup, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("CommodityGroup", dtCreateCommodityGroup, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityGroupTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodityGroup;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommodityGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CommodityGroup");
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
        /// delete the perticular CommodityGroup touple
        /// </summary>
        /// <param name="RecordID">Id of that CommodityGroup touple</param>
        public List<string> DeleteCommodityGroup(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommodityGroup", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CommodityGroup");
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
                    //Error
                }
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }
}
