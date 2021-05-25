using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Runtime.Serialization;
using System.Net;
using System.ServiceModel.Web;


namespace CargoFlash.Cargo.DataService.Shipment
{
    #region XrayExemption Service Description

    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class XrayExemptionService : SignatureAuthenticate, IXrayExemptionService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<XrayExemptionGetGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListXrayExemption", Parameters);
                var XrayExemptionList = ds.Tables[0].AsEnumerable().Select(e => new XrayExemptionGetGrid
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    // CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                    Airport = e["Airport"].ToString().ToUpper(),
                    //CommodityCode = e["CommodityCode"].ToString().ToUpper(),
                    //ValidFrom = Convert.ToDateTime(e["ValidFrom"].ToString()),
                    //ValidTo = Convert.ToDateTime(e["ValidTo"]),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    //SHCCode = e["SHCCode"].ToString().ToUpper(),

                    Active = e["Active"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedUser"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = XrayExemptionList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        public List<string> SaveXrayExemption(List<XrayExemption> XrayExemption)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
             try
            {
            DataTable dtCreateXrayExemption = CollectionHelper.ConvertTo(XrayExemption, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("XrayExemption", dtCreateXrayExemption, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter paramAccount = new SqlParameter();
          
            paramAccount.ParameterName = " @XrayExemptionTable";
            paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
            paramAccount.Value = dtCreateXrayExemption;

            SqlParameter[] Parameters = { paramAccount};
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "createXrayExemption", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "XrayExemption");
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
             catch(Exception ex)//(Exception ex)
             {
                 throw ex;
             }
            return ErrorMessage;
        }
        public List<string> UpdateXrayExemption(List<XrayExemption> XrayExemption)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateXrayExemption = CollectionHelper.ConvertTo(XrayExemption, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("XrayExemption", dtCreateXrayExemption, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@XrayExemptionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateXrayExemption;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateXrayExemption", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "XrayExemption");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                        return ErrorMessage;
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public XrayExemptionGetRecord GetXrayExemptionRecord(string recordID, string UserSNo)
        {
            XrayExemptionGetRecord xrayExemption = new XrayExemptionGetRecord();
            SqlDataReader dr = null;
            try
            {
          
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordXrayExemption", Parameters);
                if (dr.Read())
                {

                        xrayExemption.SNo = Convert.ToInt32(dr["SNo"]);
                        xrayExemption.AirportCode = Convert.ToInt32(dr["AirportSNo"]);
                        xrayExemption.Text_AirportCode = Convert.ToString(dr["AirportCode"]);
                        xrayExemption.ValidFrom = Convert.ToDateTime(dr["ValidFrom"].ToString());
                        xrayExemption.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                        xrayExemption.AirlineSNo = dr["AirlineSNo"].ToString();
                        xrayExemption.Text_AirlineSNo = dr["Text_AirlineCode"].ToString().ToUpper();
                        xrayExemption.SHCSNo = dr["SHCCode"].ToString();
                        xrayExemption.Text_SHCSNo = dr["Text_SHCCode"].ToString();
                        xrayExemption.CommoditySNo = dr["CommoditySNo"].ToString();
                        xrayExemption.Text_CommoditySNo = dr["Text_CommodityCode"].ToString();
                      
                        //xrayExemption.CommoditySNo = Convert.ToInt32(dr["CommoditySNo"]);
                        //xrayExemption.Text_CommodityCode = dr["Text_SHCCode"].ToString().ToUpper();
                        //xrayExemption.ValidFrom = Convert.ToBoolean(dr["Active"].ToString());
                       
                        if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                        {
                            xrayExemption.IsActive = Convert.ToBoolean(dr["IsActive"]);
                            xrayExemption.Active = dr["Active"].ToString().ToUpper();
                        }
                       // xrayExemption.Active = dr["Active"].ToString();
                        xrayExemption.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                        xrayExemption.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                
                   
                }
                dr.Close();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return xrayExemption;
        }

        //public string CheckVFVTExistence(string obj)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@ValidFrom", obj.Ne), new SqlParameter("@ValidTo", VT) };
        //    string rs = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "GetVFndVT", Parameters);
        //    if(rs != null)
        //    {
        //        return rs = "1";

        //    }
        //   // return rs;
        //}

        public List<string> DeleteXrayExemption(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteXrayExemption", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "XrayExemption");
                            if (!string.IsNullOrEmpty(serverErrorMessage))
                                ErrorMessage.Add(serverErrorMessage);
                        }
                        else
                        {  //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GETSPECIAL(string Values)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Values", Values) };
                string rs = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "GETSPECIAL", Parameters);
                return rs;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string GetXrayExemptionAirline(string Values)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Values", Values) };
                string rs = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "GetXrayExemptionAirline", Parameters);
                return rs;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetXrayExemptionCommodity(string Values)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Values", Values) };
                string rs = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "GetXrayExemptionCommodity", Parameters);
                return rs;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
