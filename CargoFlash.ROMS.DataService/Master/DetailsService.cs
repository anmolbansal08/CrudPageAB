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
//using CargoFlash.Cargo.DataService.Common;
namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DetailsService: CargoFlash.Cargo.DataService.SignatureAuthenticate, IDetailsService
    {

        //CommonService c = new CommonService();
        /// <summary>
        /// Get details record as per the recordid and UserID
        /// </summary>
        /// <param name="RecordID"></param>
        /// /// <param name="UserID"></param>
        /// 
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Details>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDetails4", Parameters);
                var DetailList = ds.Tables[0].AsEnumerable().Select(e => new Details
                {
                    Sno = Convert.ToInt32(e["SNo"]),
                    EmailId = e["MailId"].ToString().ToUpper(),

                    Name = e["Name"].ToString().ToUpper(),
                    PhoneNo = Convert.ToInt32(e["PhoneNo"]),
                    DOB = Convert.ToDateTime(e["DOB"]),

                    Gender = Convert.ToBoolean(e["Gender"]),

                    Address = e["Address"].ToString().ToUpper(),

                    CitySno = Convert.ToInt32(e["CitySno"]),

                    CityName = e["CityName"].ToString().ToUpper(),
                    //CityCode = e["CityCode"].ToString().ToUpper(),


                    //----------- end here-------------------
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DetailList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public Details GetDetailsRecord(string recordID, string UserSNo)
        {
            Details Details = new Details();
            SqlDataReader dr = null;
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDetails2", Parameters);
                if (dr.Read())
                {
                    
                    Details.Name = Convert.ToString(dr["Name"]).ToUpper();
                    Details.PhoneNo = Convert.ToInt32(dr["PhoneNo"]);
                   
                    Details.DOB = Convert.ToDateTime(dr["DOB"]);
                    Details.Gender = Convert.ToBoolean(dr["Gender"]);
                    Details.Address = Convert.ToString(dr["Address"]).ToUpper();
                    Details.CitySno = Convert.ToInt32(dr["CitySno"]);
                    Details.EmailId = Convert.ToString(dr["EmailId"]).ToUpper();
                    Details.CityName = Convert.ToString(dr["CityName"]).ToUpper();
                    //Details.CityCode = Convert.ToString(dr["CityCode"]).ToUpper();

                }
                dr.Close();
            }
            catch (Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return Details;
        }



        /*public Details GetDetailsRecord(int recordID, string UserID)
        {
            Details Details= new Details();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDetails", Parameters);
            if (dr.Read())
            {
                //detail.CitySNo = Convert.ToInt32(dr["SNo"]);
                detail.CitySNo = dr["CitySNo"].ToString();
                //detail.Text_CitySNo = dr["CityCode"].ToString() + "-" + dr["CityName"].ToString();
                // detail.AssociatedBranch = Convert.ToInt32(dr["AssociatedBranchType"].ToString());
                // detail.AssociatedBranchName = dr["AssociatedBranchName"].ToString();
                //  detail.Name = dr["NameSNo"].ToString() == "" ? (int?)null : Convert.ToInt32(dr["NameSNo"].ToString());
                //  detail.Text_Name = dr["CitySNo"].ToString() == "" ? "" : dr["Name"].ToString();
                detail.Name = dr["Name"].ToString();
            
                detail.MailId = dr["EMailID"].ToString();
               
                //  detail.UserName = dr["UserName"].ToString().ToString().Trim();
                // detail.Password = dr["Password"].ToString();
                detail.Address = dr["Address"].ToString();
                        
       

            }
            dr.Close();
            return detail;
        }*/

       

        /*public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Details>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDetails2", Parameters);

            var DetailsList = ds.Tables[0].AsEnumerable().Select(e => new DetailsGridData
            {
                CitySNo = Convert.ToInt32(e["SNo"]).ToString(),
                PhoneNo= e["Mobile"].ToString(),
                Name = e["DriverName"].ToString(),
                MailId= e["Email"].ToString(),
                Address = e["Address"].ToString(),

              //DOB = e["Active"].ToString()

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DetailsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = "GetListDetails2"
            };

        }*/


        /// <summary>
        /// Save Details
        /// </summary>
        /// 
        public List<string> SaveDetails(List<Details> DetailsSave)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();
                System.Data.SqlClient.SqlParameter[] Parameters = {

                //new System.Data.SqlClient.SqlParameter("@SNo",Details[0].SNo),
                new System.Data.SqlClient.SqlParameter("@EmailId",DetailsSave[0].EmailId),
                new System.Data.SqlClient.SqlParameter("@Name",DetailsSave[0].Name),
                new System.Data.SqlClient.SqlParameter("@PhoneNo",DetailsSave[0].PhoneNo),
                new System.Data.SqlClient.SqlParameter("@DOB",DetailsSave[0].DOB),
                new System.Data.SqlClient.SqlParameter("@Gender",DetailsSave[0].Gender),
                new System.Data.SqlClient.SqlParameter("@Address",DetailsSave[0].Address),
                new System.Data.SqlClient.SqlParameter("@CitySno",DetailsSave[0].CitySno),
                //new System.Data.SqlClient.SqlParameter("@CityName",Details[0].CityName),
                //new System.Data.SqlClient.SqlParameter("@CityCode",Details[0].CityCode)

            };

                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDetails3", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "detailstbl");
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

        /* public List<string> SaveDetails(List<Details> Details)
         {

             //validate Business Rule
             List<string> ErrorMessage = new List<string>();

             DataTable dtCreateDetails = CollectionHelper.ConvertTo(Details, "");

             BaseBusiness baseBusiness = new BaseBusiness();
             if (!baseBusiness.ValidateBaseBusiness("Details", dtCreateDetails, "SAVE"))
             {
                 ErrorMessage = baseBusiness.ErrorMessage;
                 return ErrorMessage;
             }
             SqlParameter param = new SqlParameter();
             param.ParameterName = "@detailsTbl";
             param.SqlDbType = System.Data.SqlDbType.Structured;
             param.Value = dtCreateDetails;



             SqlParameter[] Parameters = { param };


             // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateDetails", Parameters);
             int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDetails", Parameters);


             if (ret > 0)
             {
                 if (ret > 1000)
                 {
                     string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Details");
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
         }*/
        /// <summary>
        /// Update Details 
        /// </summary>
        public List<string> UpdateDetails(List<Details> Details)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();

            DataTable dtCreateDetails = CollectionHelper.ConvertTo(Details, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Details", dtCreateDetails, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DetailsTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDetails;

            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDetails", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Details");
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
        /// Delete Details 
        /// </summary>
        public List<string> DeleteDetails(List<string> listID)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDetails", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Details");
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
