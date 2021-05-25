using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SPHCSubClassService : SignatureAuthenticate, ISPHCSubClassService
    {
        

        public KeyValuePair<string, List<SPHCSubClass>> GetSPHCSubClassRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SPHCSubClass CommoditySubGroup = new SPHCSubClass();
                SqlParameter[] Parameters = { new SqlParameter("@ClassSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSPHCSubCharge", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var SPHCSubClassList = ds.Tables[0].AsEnumerable().Select(e => new SPHCSubClass
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ClassSNo = Convert.ToInt32(e["ClassSNo"]),
                    Division = e["Division"].ToString().ToUpper(),
                    DivisionName = e["DivisionName"].ToString().ToUpper(),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    Active = e["Active"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<SPHCSubClass>>(ds.Tables[1].Rows[0][0].ToString(), SPHCSubClassList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> createUpdateSPHCSubClass(string strData)
        {
            try
            {
                //Added By Shivali Thakur
                strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtSPHCSubClass = JsonConvert.DeserializeObject<DataTable>(strData);
                dtSPHCSubClass.Columns["SNo"].SetOrdinal(0);
                dtSPHCSubClass.Columns["ClassSNo"].SetOrdinal(1);
                dtSPHCSubClass.Columns["DivisionName"].SetOrdinal(2);
                dtSPHCSubClass.Columns["Division"].SetOrdinal(3);
                dtSPHCSubClass.Columns["IsActive"].SetOrdinal(4);
                dtSPHCSubClass.Columns["CreatedBy"].SetOrdinal(5);
                dtSPHCSubClass.Columns["UpdatedBy"].SetOrdinal(6);



                var dtCreateSPHCSubClass = (new DataView(dtSPHCSubClass, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateSPHCSubClass = (new DataView(dtSPHCSubClass, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@_SPHCSubClass";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateSPHCSubClass.Rows.Count > 0)
                {
                    param.Value = dtCreateSPHCSubClass;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSPHCSubClass", Parameters);
                }
                // for update existing record
                if (dtUpdateSPHCSubClass.Rows.Count > 0)
                {
                    param.Value = dtUpdateSPHCSubClass;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSPHCSubClass", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SPHCSubClass");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> deleteSPHCSubClass(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSPHCSubClass", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SPHCSubClass");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
