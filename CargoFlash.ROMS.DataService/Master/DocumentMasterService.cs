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
    public class DocumentMasterService : SignatureAuthenticate, IDocumentMasterService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        /// <summary>
        /// Get Record on the basis of recordID from City
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public DocumentMaster GetDocumentMasterRecord(string recordID, string UserSNo)
        {
         
            DocumentMaster DocumentMaster = new DocumentMaster();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDocumentMaster", Parameters);
                if (dr.Read())
                {

                    DocumentMaster.SNo = Convert.ToInt32(dr["SNo"]);
                    //city.ZoneSNo = dr["ZoneSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["ZoneSNo"]);
                    DocumentMaster.DocumentName = dr["DocumentName"].ToString().ToUpper();
                    //city.Text_ZoneSNo = dr["ZoneName"].ToString().ToUpper();
                    DocumentMaster.Description = dr["Description"].ToString().ToUpper();
                  
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        DocumentMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        DocumentMaster.Active = dr["Active"].ToString().ToUpper();
                    }


                    DocumentMaster.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    DocumentMaster.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
            //}
            //catch(Exception ex)// (Exception e)
            //{

                //dr.Close();
            //}
            dr.Close();
            return DocumentMaster;
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
            string filters = GridFilter.ProcessFilters<DocumentMaster>(filter);
           
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDocumentMaster", Parameters);
            var DocumentMasterList = ds.Tables[0].AsEnumerable().Select(e => new DocumentMaster
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                DocumentName = e["DocumentName"].ToString().ToUpper(),
                Description = e["Description"].ToString().ToUpper(),
             
                Active = e["Active"].ToString().ToUpper(),
            
                UpdatedBy = e["UpdatedUser"].ToString().ToUpper()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DocumentMasterList.AsQueryable().ToList(),
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
        public List<string> SaveDocumentMaster(List<DocumentMaster> DocumentMaster)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateDocumentMaster = CollectionHelper.ConvertTo(DocumentMaster, "Active,strDayLightSaving,StandardName,ZoneSNo,Text_ZoneSNo,DayLightSaving,DeltaSeconds,IsDayLightSaving,TimeDifference,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");
                //                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");

                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("DocumentMaster", dtCreateDocumentMaster, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DocumentMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateDocumentMaster;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDocumentMaster", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DocumentMaster");
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
        public List<string> UpdateDocumentMaster(List<DocumentMaster> DocumentMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateDocumentMaster = CollectionHelper.ConvertTo(DocumentMaster, "Active,StandardName,DayLightSaving,DeltaSeconds,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea,IsPriorApproval");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("DocumentMaster", dtCreateDocumentMaster, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DocumentMasterTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateDocumentMaster;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDocumentMaster", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DocumentMaster");
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
        public List<string> DeleteDocumentMaster(List<string> listID)
        {
           
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@Sno", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDocumentMaster", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DocumentMaster");
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
            catch(Exception ex)// //(Exception e)
            {
                throw ex;
            }
           
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
                dr.Close();
                return dst;
            }
            catch(Exception ex)//// (Exception e)
            {
                dr.Close();
                throw ex;
            }
            
        }
    }
}
