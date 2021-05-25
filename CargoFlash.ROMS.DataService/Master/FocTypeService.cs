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
    public class FocTypeService : SignatureAuthenticate, IFocTypeService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public FocType GetFocTypeRecord(string recordID, string UserSNo)
        {
   
            FocType Foctype = new FocType();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordFocType", Parameters);
                if (dr.Read())
                {
                    Foctype.SNo = Convert.ToInt32(recordID);
                    Foctype.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        Foctype.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        Foctype.Active = dr["Active"].ToString().ToUpper();
                    }
                    Foctype.Foc_Type = Convert.ToString(dr["Foc_Type"]).ToUpper();
                    Foctype.FocTypeCode = Convert.ToString(dr["FocTypeCode"]).ToUpper();
                    Foctype.FocPercentage = Convert.ToString(dr["FocPercentage"]).ToUpper();
                    Foctype.UpdatedBy = dr["UpdatedUser"].ToString();
                    Foctype.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return Foctype;
        }

       public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<FocType>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFocType", Parameters);
                var FocTypeList = ds.Tables[0].AsEnumerable().Select(e => new FocType
                 {
                     SNo = Convert.ToInt32(e["SNo"]),
                     Foc_Type = e["Foc_Type"].ToString().ToUpper(),
                     FocTypeCode = e["FocTypeCode"].ToString().ToUpper(),
                     Active = e["Active"].ToString().ToUpper()
                 });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = FocTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
           catch(Exception ex)//
            {
                throw ex;
            }
        }
       public List<string> SaveFocType(List<FocType> FocType)
       {
           List<string> ErrorMessage = new List<string>();
           try
           {
               DataTable dtCreateHtype = CollectionHelper.ConvertTo(FocType, "Active,AutoFoc");
               BaseBusiness baseBusiness = new BaseBusiness();
               if (!baseBusiness.ValidateBaseBusiness("FocType", dtCreateHtype, "SAVE"))
               {
                   ErrorMessage = baseBusiness.ErrorMessage;
                   return ErrorMessage;
               }
               SqlParameter param = new SqlParameter();
               param.ParameterName = "@FocTypeTable";
               param.SqlDbType = System.Data.SqlDbType.Structured;
               param.Value = dtCreateHtype;

               SqlParameter[] Parameters = { param };

               int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateFocType", Parameters);

               if (ret > 0)
               {
                   if (ret > 1000)
                   {
                       //For Customised Validation Messages like 'Record Already Exists' etc
                       string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "FocType");
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
           catch(Exception ex)// //(Exception e)
           {
               throw ex;
           }
           return ErrorMessage;
       }


       public List<string> UpdateFocType(List<FocType> FocType)
       {
           //validate Business Rule
           List<string> ErrorMessage = new List<string>();

           try
           {
               DataTable dtCreateFocType = CollectionHelper.ConvertTo(FocType, "Active,AutoFoc");
               BaseBusiness baseBusiness = new BaseBusiness();
               if (!baseBusiness.ValidateBaseBusiness("FocType", dtCreateFocType, "UPDATE"))
               {
                   ErrorMessage = baseBusiness.ErrorMessage;
                   return ErrorMessage;
               }
               SqlParameter param = new SqlParameter();
               param.ParameterName = "@FocTypeTable";
               param.SqlDbType = System.Data.SqlDbType.Structured;
               param.Value = dtCreateFocType;
               SqlParameter[] Parameters = { param };
               int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateFocType", Parameters);
               if (ret > 0)
               {
                   if (ret > 1000)
                   {
                       //For Customised Validation Messages like 'Record Already Exists' etc
                       string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "FocType");
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


       public List<string> DeleteFocType(List<string> listID)
       {
           List<string> ErrorMessage = new List<string>();

           try
           {
               BaseBusiness baseBussiness = new BaseBusiness();
               if (listID.Count > 0)
               {
                   string RecordId = listID[0].ToString();
                   string UserId = listID[1].ToString();
                   SqlParameter[] Parameters = { new SqlParameter("@FocType", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                   int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteFoctype", Parameters);
                   if (ret > 0)
                   {
                       if (ret > 1000)
                       {
                           string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FocType");
                           if (!string.IsNullOrEmpty(serverErrorMessage))
                               ErrorMessage.Add(serverErrorMessage);
                       }
                       else
                       {
                           //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                           ret = 548;
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
