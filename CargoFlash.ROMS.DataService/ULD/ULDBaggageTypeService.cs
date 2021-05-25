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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDBaggageTypeService : SignatureAuthenticate, IULDBaggageTypeService
    {
        /// <summary>
        /// Retrieve ULDBaggageType information from the database
        /// </summary>
        /// <param name="recordID">record ID according to which the touple is to be retrieved</param>
        /// <returns></returns>
        public ULDBaggageType GetULDBaggageTypeRecord(int recordID, string UserID)
        {
            try 
            { 
            ULDBaggageType ULDBag = new ULDBaggageType();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDBaggageType", Parameters);
            if (dr.Read())
            {

                    ULDBag.SNo = Convert.ToInt32(dr["SNo"]);
                    ULDBag.BaggageType = Convert.ToString(dr["BaggageType"]);
                    ULDBag.BaggageDesc = Convert.ToString(dr["BaggageDesc"]);
                    //ULDBag.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        ULDBag.IsActive = Convert.ToBoolean(dr["IsActive"]);
                       ULDBag.Active = dr["Active"].ToString().ToUpper();
                        //ULDBag.Active = dr["IsActive"].ToString().ToUpper();
                        //ULDBag.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        //ULDBag.Active = dr["Active"].ToString().ToUpper();
                    }


                    ULDBag.UpdatedBy = dr["UpdatedUser"].ToString();
                    ULDBag.CreatedBy = dr["CreatedUser"].ToString();
            }

            dr.Close();
            return ULDBag;
            }
          
           catch(Exception ex)//
           {
               throw ex;
           }
        }

                

           

        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ULDBaggageType>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDBaggageType", Parameters);

            var ULDBaggageTypeList = ds.Tables[0].AsEnumerable().Select(e => new ULDBaggageType
            {
                SNo = Convert.ToInt32(e["SNo"]),
                BaggageType = Convert.ToString(e["BaggageType"]),
                BaggageDesc = Convert.ToString(e["BaggageDesc"]),
                //Active = e["Active"].ToString().ToUpper(),
                //IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                Active = e["Active"].ToString().ToUpper(),//foriegn key

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ULDBaggageTypeList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }

      
           catch(Exception ex)//
           {
               throw ex;
           }

        }

        /// <summary>
        /// Save the entity into the database
        /// </summary>
        /// <param name="ULDBaggageType"></param>
        public List<string> SaveULDBaggageType(List<ULDBaggageType> ULDBag)
        {
            try { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateULDBaggageType = CollectionHelper.ConvertTo(ULDBag, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDBaggageType", dtCreateULDBaggageType, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ULDBaggageType";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateULDBaggageType;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDBaggageType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDBaggageType");
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

        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name=""></param>

        public List<string> UpdateULDBaggageType(List<ULDBaggageType> ULDBag)
        {

            try 
            { 
           
            // 
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateULDBaggageType = CollectionHelper.ConvertTo(ULDBag, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDBaggageType", dtCreateULDBaggageType, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ULDBaggageType";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateULDBaggageType;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDBaggageType", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDBaggageType");
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

        /// <summary>
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>

        public List<string> DeleteULDBaggageType(List<string> listID)
        {
            try 
            { 
            
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDBaggageType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDBaggageType");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
