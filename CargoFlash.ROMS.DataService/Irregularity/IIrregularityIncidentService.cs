using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class IrregularityIncidentService : IIrregularityIncident
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<IrregularityIncident>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListIrregularityIncident", Parameters);
            var IrregularityIncidentlist = ds.Tables[0].AsEnumerable().Select(e => new IrregularityIncident
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                IncidentCategory = e["IncidentCategory"].ToString(),
                IncidentCategoryCode = e["IncidentCategoryCode"].ToString()
            });
            ds.Dispose();

            var res = new DataSourceResult
            {
                Data = IrregularityIncidentlist.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            return res;
        }

        //GetIrregularityIncidentRecord


        public IrregularityIncident GetIrregularityIncidentRecord(int recordID, string UserID)
        {
            IrregularityIncident obj = new IrregularityIncident();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordIrregularityIncident", Parameters);
            if (dr.Read())
            {
                obj.SNo = Convert.ToInt32(dr["SNo"].ToString());
                obj.IncidentCategory = dr["IncidentCategory"].ToString();
                obj.IncidentCategoryCode = dr["IncidentCategoryCode"].ToString();
                obj.Description = dr["Description"].ToString();
                obj.InitiationDays = Convert.ToInt32(dr["InitiationDays"]);
                obj.ClosureDays = Convert.ToInt32(dr["ClosureDays"]);
                obj.IsActive = Convert.ToBoolean(dr["IsActive"]);
                obj.Active = dr["ACTIVE"].ToString();
                obj.UpdatedByUser = dr["UpdatedUser"].ToString();
                obj.CreatedByUser = dr["CreatedUser"].ToString();
            }
            dr.Close();
            return obj;
        }
   

        public List<string> SaveIrregularityIncident(List<IrregularityIncident> obj)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(obj, "Active,UpdatedByUser,CreatedByUser");
            dtCreateIrr.Columns.Remove("TransData");  //ADDED

            //string TranData = CargoFlash.Cargo.Business.Common.Base64ToString(obj[0].TransData.ToString());
            //var dtCreateTranData = JsonConvert.DeserializeObject<DataTable>(obj[0].TransData.ToString());
            DataTable dtSubCategory = CollectionHelper.ConvertTo(obj[0].TransData.ToList(), ""); //added
            BaseBusiness baseBusiness = new BaseBusiness();

            if (dtSubCategory.Rows.Count==0)
            {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(1000, "IrregularityIncident");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                return ErrorMessage;
            }

            if (!baseBusiness.ValidateBaseBusiness("IrregularityIncident", dtCreateIrr, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            //SqlParameter param = new SqlParameter();
            //param.ParameterName = "@IrregularityIncidentTable";
            //param.SqlDbType = System.Data.SqlDbType.Structured;
            //param.Value = dtCreateIrr;
            //SqlParameter[] Parameters = { param };
            SqlParameter[] Parameters = { new SqlParameter("@IrregularityIncidentTable", dtCreateIrr), new SqlParameter("@tt", dtSubCategory) };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateIrregularityIncidentAndSubcategory", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityIncident");
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
        public List<string> UpdateIrregularityIncident(List<IrregularityIncident> obj)
        {
            //validate Business Rule
            DataTable dtUpdateIrregularityIncident = CollectionHelper.ConvertTo(obj, "Active,UpdatedByUser,CreatedByUser");
            dtUpdateIrregularityIncident.Columns.Remove("TransData");  //ADDED
           
            DataTable dtSubCategory = CollectionHelper.ConvertTo(obj[0].TransData, ""); //added
           // dtSubCategory.Columns.Remove("Active");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("IrregularityIncident", dtUpdateIrregularityIncident, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            //SqlParameter param = new SqlParameter();
            //param.ParameterName = "@IrregularityIncidentTable";
            //param.SqlDbType = System.Data.SqlDbType.Structured;
            //param.Value = dtUpdateIrregularityIncident;


            SqlParameter[] Parameters = {new SqlParameter("@IrregularityIncidentTableSno", obj[0].SNo), new SqlParameter("@IrregularityIncidentTable", dtUpdateIrregularityIncident), new SqlParameter("@tt", dtSubCategory) };
          //  SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateIncidentAndSubcategory", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityIncident");
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
        public List<string> DeleteIrregularityIncident(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteIrregularityIncident", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "IrregularityIncident");
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


        public string GetList(string AWBNo)
        {
            return "<td style='background:red'><tr>";
        }
    }
     
}
