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
using System.Globalization;
using System.Net;
//using CargoFlash.SoftwareFactory.WebUI;


namespace CargoFlash.Cargo.DataService.Master
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SpecialHandlingCodeService : SignatureAuthenticate, ISpecialHandlingCodeService
    {

        public SpecialHandlingCode GetRecordSpecialHandlingCode(string recordID, string UserSNo)
        {
            SqlDataReader dr = null;
            try
            {
                SpecialHandlingCode g = new SpecialHandlingCode();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSPHC", Parameters);

                if (dr.Read())
                {
                    g.SNo = Convert.ToInt32(dr["SNo"]);
                    g.Code = dr["Code"].ToString().ToString().ToUpper();
                    g.IsDGR = Convert.ToBoolean(dr["IsDGR"]);
                    g.DGR = dr["DGR"].ToString().ToUpper();
                    g.Description = dr["Description"].ToString().ToUpper();
                    g.IsShownInNOTOC = Convert.ToBoolean(dr["IsShownInNOTOC"].ToString());
                    g.ShownInNOTOC = dr["ShownInNOTOC"].ToString().ToUpper();
                    g.IsHeavyWeightExempt = Convert.ToBoolean(dr["IsHeavyWeightExempt"].ToString());
                    g.HeavyWeightExempt = dr["HeavyWeightExempt"].ToString().ToUpper();
                    g.IsExpress = Convert.ToBoolean(dr["IsExpress"].ToString());
                    g.Express = dr["Express"].ToString().ToUpper();
                    g.Priority = Decimal.Parse(dr["Priority"].ToString()); //Convert.ToDecimal("10.00");
                    g.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                    g.Active = dr["Active"].ToString().ToUpper();
                    g.IsTemperatureControlled = Convert.ToBoolean(dr["IsTemperatureControlled"].ToString());
                    g.TemperatureControlled = dr["TemperatureControlled"].ToString().ToUpper();
                    g.ExpressDelivery = dr["IsExpressDelivery"].ToString() == "No" ? "NO" : "YES";
                    g.IsExpressDelivery = Convert.ToBoolean(dr["ExpressDelivery"]) == false ? false : true;
                    g.DGClass = dr["DGClass"] == DBNull.Value ? 0 : Convert.ToInt32(dr["DGClass"]);
                    g.Divisions = dr["Division"].ToString().ToUpper();
                    g.Text_DGClass = dr["Text_DGClass"].ToString().ToUpper();
                    g.Text_Divisions = dr["Text_Division"].ToString().ToUpper();
                    g.SHCStatement = dr["SHCStatement"].ToString().ToUpper();
                    g.MandatoryStatement = dr["MandatoryStatement"].ToString().ToUpper();
                    g.StatementLabel = dr["StatementLabel"].ToString().ToUpper();
                    g.PackingInstructionLabel = dr["PackingInstructionLabel"].ToString().ToUpper();
                    g.IsAllowLateAcceptance = Convert.ToBoolean(dr["IsAllowLateAcceptance"].ToString());
                    g.AllowLateAcceptance = dr["AllowLateAcceptance"].ToString().ToUpper();
                    g.UpdatedBy = dr["UpdatedUser"].ToString();
                    g.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return g;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }


        /// <summary>
        /// Get the list of records to be shown in the database
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
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SpecialHandlingCode>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSPHC", Parameters);

                var specialhandlingcodeList = ds.Tables[0].AsEnumerable().Select(e => new SpecialHandlingCode
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Code = e["Code"].ToString().ToUpper(),
                    Description = e["Description"].ToString().ToUpper(),
                    DGR = (e["DGR"].ToString()),
                    ShownInNOTOC = (e["ShownInNOTOC"].ToString()),
                    HeavyWeightExempt = (e["HeavyWeightExempt"].ToString()),
                    Express = (e["Express"].ToString()),
                    Priority = Convert.ToDecimal(e["Priority"].ToString()),
                    Active = (e["Active"].ToString().ToUpper()),
                    TemperatureControlled = (e["TemperatureControlled"].ToString().ToUpper()),
                    ExpressDelivery = (e["ExpressDelivery"].ToString().ToUpper()),
                    Text_DGClass = (e["Text_DGClass"]).ToString(),
                    Divisions = e["Divisions"].ToString(),
                    //SHCStatement=e["SHCStatement"].ToString().ToUpper(),
                    //MandatoryStatement=e["MandatoryStatement"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = specialhandlingcodeList.AsQueryable().ToList(),
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
        /// <param name="SpecialHandlingCode"></param>
        public List<string> SaveSpecialHandlingCode(List<SpecialHandlingCode> SpecialHandlingCode)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateSpecialHandlingCode = CollectionHelper.ConvertTo(SpecialHandlingCode, "DGR,ShownInNOTOC,Express,Active,TemperatureControlled,HeavyWeightExempt,Detail,Deleted,ExpressDelivery,Text_DGClass,Text_Divisions,AllowLateAcceptance");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("SpecialHandlingCode", dtCreateSpecialHandlingCode, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@_SPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSpecialHandlingCode;
                //SqlParameter errorMessage = new SqlParameter("@ErrorMessage", SqlDbType.Text);
                //errorMessage.Direction = ParameterDirection.Output;
                //errorMessage.Size = 250;
                //SqlParameter errorNumber = new SqlParameter("@ErrorNumber", SqlDbType.Int);
                //errorMessage.Direction = ParameterDirection.Output;
                //errorMessage.Size = 32;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSPHC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SpecialHandlingCode");
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
        /// <param name="SpecialHandlingCode"></param>
        public List<string> UpdateSpecialHandlingCode(List<SpecialHandlingCode> SpecialHandlingCode)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateSpecialHandlingCode = CollectionHelper.ConvertTo(SpecialHandlingCode, "DGR,ShownInNOTOC,HeavyWeightExempt,Express,Active,TemperatureControlled,Detail,Deleted,ExpressDelivery,Text_DGClass,Text_Divisions,AllowLateAcceptance");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("SpecialHandlingCode", dtCreateSpecialHandlingCode, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@_SPHCTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSpecialHandlingCode;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSPHC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SpecialHandlingCode");
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
        public List<string> DeleteSpecialHandlingCode(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSPHC", Parameters);
                    if (ret == 547)
                    {
                        ret = 1009;
                    }
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SpecialHandlingCode");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}