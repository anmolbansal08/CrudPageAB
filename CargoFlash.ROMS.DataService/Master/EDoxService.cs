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
    public class EDoxService : SignatureAuthenticate, IEDoxService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public EDox GetEDoxRecord(string recordID, string UserSNo)
        {
        
            EDox edox = new EDox();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEDox", Parameters);
                if (dr.Read())
                {
                    edox.SNo = Convert.ToInt32(dr["SNo"]);
                    edox.DocumentName = dr["DocumentName"].ToString().ToUpper();
                    edox.Text_ApplicableIn = dr["Text_ApplicableIn"].ToString().ToUpper();
                    edox.ApplicableIn = Convert.ToInt32(dr["ApplicableIn"]);
                    edox.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    edox.Active = dr["Active"].ToString().ToUpper();
                    edox.UpdatedBy = dr["UpdatedBy"].ToString().ToUpper();
                    edox.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);
                }

                dr.Close();
                return edox;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            //}
            //catch(Exception ex)// (Exception e)
            //{
            //    dr.Close();
            //}
          
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<EDoxGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListEDox", Parameters);
                var EDoxList = ds.Tables[0].AsEnumerable().Select(e => new EDoxGrid
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    DocumentName = e["DocumentName"].ToString().ToUpper(),
                    ApplicableInTxt = e["ApplicableInTxt"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                    UpdatedOn = e["UpdatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["UpdatedOn"]), DateTimeKind.Utc),
                    IsActiveTxt = e["IsActiveTxt"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = EDoxList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public List<string> SaveEDox(List<EDox> EDox)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateEDox = CollectionHelper.ConvertTo(EDox, "Active,Text_ApplicableIn");


                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("EDox", dtCreateEDox, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EDoxTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEDox;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateEDox1", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EDox");
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

        public List<string> UpdateEDox(List<EDox> EDox)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateEDox = CollectionHelper.ConvertTo(EDox, "Active,Text_ApplicableIn");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("EDox", dtCreateEDox, "UPDATEON"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EDoxTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEDox;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateEDox1", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "EDox");
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
         //   return ErrorMessage;
        }

        public List<string> DeleteEDox(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@EDoxCode", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteEDox", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "EDox");
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
            catch(Exception ex)//// (Exception e)
            {
                throw ex;
            }
            
        }
    }

}
