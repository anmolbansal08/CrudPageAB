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
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CrudPageABService : SignatureAuthenticate, ICrudPageABService
    {


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CrudPageAB>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_SearchCrudPageAB", Parameters);
                var CrudPageABList = ds.Tables[0].AsEnumerable().Select(e => new CrudPageAB
                {
                    SNo = Convert.ToInt32(e["Sno"]),
                    MachineName = e["MachineName"].ToString().ToUpper(),
                    Weight = Convert.ToInt32(e["palletweight"]),
                    Active = Convert.ToBoolean(e["ISActive"]) == true ? "Yes" : "No"

                    //----------- end here-------------------
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CrudPageABList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveCrudPageAB(List<CrudPageAB> CrudPageAB)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                new System.Data.SqlClient.SqlParameter("@MachineName",CrudPageAB[0].MachineName),
                new System.Data.SqlClient.SqlParameter("@palletweight",CrudPageAB[0].Weight),
                new System.Data.SqlClient.SqlParameter("@IsActive",CrudPageAB[0].IsActive),
                new System.Data.SqlClient.SqlParameter("@UserSno",CrudPageAB[0].UserSno),



            };

                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_CreateandUpdateCrudPageAB", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CrudPageAB");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public CrudPageAB GetCrudPageABRecord(string recordID, string UserSNo)
        {
            CrudPageAB CrudPageAB = new CrudPageAB();
            SqlDataReader dr = null;
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCrudPageABOffice", Parameters);
                if (dr.Read())
                {
                    //CrudPageAB.SNo = Convert.ToInt32(dr["SNo"].ToString());
                    CrudPageAB.MachineName = Convert.ToString(dr["MachineName"]).ToUpper();
                    CrudPageAB.Weight = Convert.ToInt32(dr["palletweight"]);
                    CrudPageAB.IsActive = Convert.ToBoolean(dr["Isactive"]);


                }
                dr.Close();
            }
            catch (Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return CrudPageAB;
        }
     

        public List<string> UpdateCrudPageAB(List<CrudPageAB> CrudPageAB)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                new System.Data.SqlClient.SqlParameter("@MachineName",CrudPageAB[0].MachineName),
                new System.Data.SqlClient.SqlParameter("@palletweight",CrudPageAB[0].Weight),
                new System.Data.SqlClient.SqlParameter("@IsActive",CrudPageAB[0].IsActive),
                new System.Data.SqlClient.SqlParameter("@Sno",CrudPageAB[0].SNo),
                new System.Data.SqlClient.SqlParameter("@UserSno",CrudPageAB[0].UpdatedBy),



            };

                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCrudPageAB", Parameters);
                if (ret > 0)
                {
                  
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }

            }
            catch (Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteCrudPageAB(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@Sno", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCrudPageAB", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
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
            catch (Exception ex)//
            {

                throw ex;
            }
        }


    }
}

