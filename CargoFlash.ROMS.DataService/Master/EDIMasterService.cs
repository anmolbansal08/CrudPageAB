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
    public class EDIMasterService : SignatureAuthenticate, IEDIMasterService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        /// <summary>
        /// Get Record on the basis of recordID from City
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public EDIMaster GetEDIMasterRecord(string recordID, string UserID)
        {
          
            EDIMaster edi = new EDIMaster();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEDIMaster", Parameters);
                if (dr.Read())
                {

                    edi.SNo = Convert.ToInt32(dr["SNo"]);
                    edi.Name = dr["Name"].ToString().ToUpper();
                    edi.Age = dr["Age"].ToString().ToUpper();
                    edi.City = dr["City"].ToString().ToUpper();
                    edi.Text_City = dr["City"].ToString().ToUpper();
                }
                dr.Close();
                return edi;
            }
            catch(Exception ex)// 
            {

                dr.Close();
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
                string filters = GridFilter.ProcessFilters<AccountType>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListEDIMaster", Parameters);
                var CityList = ds.Tables[0].AsEnumerable().Select(e => new EDIMaster
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    Name = e["Name"].ToString().ToUpper(),
                    Age = e["Age"].ToString().ToUpper(),
                    City = e["City"].ToString().ToUpper(),
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
        public List<string> SaveEDIMaster(List<EDIMaster> EDIMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateEDIMaster = CollectionHelper.ConvertTo(EDIMaster,"Text_City");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("EDIMaster", dtCreateEDIMaster, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EDIMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEDIMaster;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateEDIMaster", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EDIMaster");
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
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
            
        }
        /// <summary>
        ///  Update City record on the basis of ID
        /// </summary>
        /// <param name="City"></param>
        /// <returns></returns>
        public List<string> UpdateEDIMaster(List<EDIMaster> EDIMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateEDIMaster = CollectionHelper.ConvertTo(EDIMaster, "Text_City");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("EDIMaster", dtCreateEDIMaster, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EDIMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEDIMaster;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateEDIMaster", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EDIMaster");
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
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
          
        }
        /// <summary>
        ///  Delete City record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteEDIMaster(List<string> listID)
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
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
            
        }
    }
}
