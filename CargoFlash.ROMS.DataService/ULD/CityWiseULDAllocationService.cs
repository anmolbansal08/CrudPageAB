using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CityWiseULDAllocationService : SignatureAuthenticate, ICityWiseULDAllocationService
    {
        public CityWiseULDAllocation GetCityWiseULDAllocationRecord(string recordID)
        {
            try
            {
            CityWiseULDAllocation uldAllocation = new CityWiseULDAllocation();
            SqlDataReader dr = null;
            
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityWiseULDAllocationRecord", Parameters);
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityWiseULDAllocationRecord", Parameters);
                if (dr.Read())
                {
                    uldAllocation.SNo = Convert.ToInt32(dr["SNo"]);
                    uldAllocation.Airline = Convert.ToInt32(dr["OfficeAirlineTransSno"]);
                    uldAllocation.Text_Airline = Convert.ToString(dr["AirlineCodeAndName"]);
                    uldAllocation.Airport = Convert.ToInt32(dr["AirportSNo"]);
                    uldAllocation.Text_Airport = Convert.ToString(dr["AirportName"]);
                    uldAllocation.City = Convert.ToString(dr["CityName"]);
                    if (ds.Tables[1].Rows.Count>0)
                    {
    
                        uldAllocation.Office = Convert.ToInt32(ds.Tables[1].Rows[0]["SNo"]);
                        uldAllocation.Text_Office = ds.Tables[1].Rows[0]["Name"].ToString().ToUpper();
                        uldAllocation.EmailAddress = ds.Tables[1].Rows[0]["AlertEmail"].ToString().ToUpper();
                    }
                }
            dr.Close();
            return uldAllocation;
          }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<CityWiseULDAllocationTrans>> GetCityWiseULDAllocationRecordTrans(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                CityWiseULDAllocationTrans AirlineCCTrans = new CityWiseULDAllocationTrans();
                SqlParameter[] Parameters = { new SqlParameter("@ULDAllocationSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityWiseULDAllocationRecordTrans", Parameters);
                var AirlineCCTranslist = ds.Tables[0].AsEnumerable().Select(e => new CityWiseULDAllocationTrans
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        HdnULDCode = Convert.ToInt32(e["ULDTypeSNo"]),
                        ULDCode = Convert.ToString(e["UldCodeAndContainerType"]),
                        MinAllocation = Convert.ToString(e["MinAllocation"]),
                        MaxAllocation = Convert.ToString(e["MaxAllocation"]),
                        MinAlert = Convert.ToString(e["MinAlert"]),
                        MaxAlert = Convert.ToString(e["MaxAlert"]),
                        AlertEmail = Convert.ToString(e["AlertEmail"]),
                        CurrentULDStock = Convert.ToInt32(e["NoOfUld"]),

                        //  CurrentULDStock=Convert.ToInt32(ds.Tables[2].Rows[0][0]),
                        //HdnCitySNo = e["CitySNo"].ToString(),
                        //CitySNo = e["CityCode"].ToString(),
                        ////IsCCAllowed = Convert.ToBoolean(e["IsCCAllowed"].ToString()),
                        //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                        //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    });
                return new KeyValuePair<string, List<CityWiseULDAllocationTrans>>(ds.Tables[1].Rows[0][0].ToString(), AirlineCCTranslist.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CityWiseULDAllocationGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCityWiseULDAllocation", Parameters);
                var ChargesList = ds.Tables[0].AsEnumerable().Select(e => new CityWiseULDAllocationGrid
                {
                    ULDAllocationSNo = Convert.ToInt32(e["ULDAllocationSNo"]),
                    AirportName = Convert.ToString(e["AirportName"].ToString().ToUpper()),
                    AirlineName = Convert.ToString(e["AirlineName"]).ToString().ToUpper(),
                    ULDCode = Convert.ToString(e["ULDCode"]).ToString().ToUpper(),
                    ContainerType = Convert.ToString(e["ContainerType"]).ToString().ToUpper(),
                    CurrentStock = Convert.ToInt32(e["CurrentStock"]),
                    MinAllocation = Convert.ToString(e["MinAllocation"]).ToString().ToUpper(),
                    MaxAllocation = Convert.ToString(e["MaxAllocation"]).ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ChargesList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> SaveCityWiseULDAllocation(CityWiseULDAllocationTransSave formData)
        {
            try
            {
                int ret = 0;
                DataTable dtUldAllocation = new DataTable();
                dtUldAllocation.Columns.Add("Sno", typeof(int));
                dtUldAllocation.Columns.Add("AirportSno", typeof(int));
                dtUldAllocation.Columns.Add("AirportCode", typeof(string));
                dtUldAllocation.Columns.Add("OfficeAirlineTransSNo", typeof(int));
                dtUldAllocation.Columns.Add("AirlineCode", typeof(string));
                dtUldAllocation.Columns.Add("EmailAddress", typeof(string));
                DataRow dr = dtUldAllocation.NewRow();
                if (formData.SNo == null)
                    dr["Sno"] = 0;
                else
                    dr["Sno"] = formData.SNo;
                dr["AirportSno"] = formData.Airport;
                dr["AirportCode"] = formData.Text_Airport;
                dr["OfficeAirlineTransSNo"] = formData.Airline;
                dr["AirlineCode"] = formData.Text_Airline;
                dr["EmailAddress"] = formData.EmailAddress;
              
                dtUldAllocation.Rows.Add(dr);
               
                dtUldAllocation.AcceptChanges();

               
                DataTable dtULDAllocationTrans = CollectionHelper.ConvertTo(formData.EventTransData, "ULDAllocationSNo,CurrentULDStock,EmailAddress");
           


                if (dtULDAllocationTrans.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtULDAllocationTrans.Rows)
                    {
                        var str = drow["ULDCode"].ToString();
                        drow["ULDCode"] = str.Substring(0, 3);
                    }
                }
                
                //Remove column which is not required in Table Type
                
                var dtCreateUldAllocation = (new DataView(dtUldAllocation, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateUldAllocation = (new DataView(dtUldAllocation, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();


                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();


                if (dtCreateUldAllocation.Rows.Count > 0)
                {
                    SqlParameter[] param = { new SqlParameter("@UldAllocation", dtCreateUldAllocation), new SqlParameter("@UldAllocationTrans", dtULDAllocationTrans) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDAllocationANDTrans", param);
                }
                // for update existing record
                if (dtUpdateUldAllocation.Rows.Count > 0)
                {
                    var UpdatedBy = 1;
                    SqlParameter[] param = { new SqlParameter("@UldAllocation", dtUpdateUldAllocation), new SqlParameter("@UldAllocationTrans", dtULDAllocationTrans), new SqlParameter("@UpdatedBy", UpdatedBy) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDAllocationANDTrans", param);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CityWiseULDAllocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public string GetCity(string Key)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(Key)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityWiseAllocationCity", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public string GetCurrentStock(string UldSNo, string CarrierCode, string CityCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDSNo", Convert.ToInt32(UldSNo)), new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@AirportSNo", CityCode) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCurrentStock", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public string GetAgentName(string AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", Convert.ToInt32(AWBSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentName", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public string CheckAirlineExists(string CarrierCode, string AirportCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", CarrierCode), new SqlParameter("@AirportCode", AirportCode) };
                int ret = (int)SqlHelper.ExecuteScalar(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckAirlineExists", Parameters);
                string retN = ret.ToString();
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ret.ToString());
                return retN;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteCityWiseULDAllocationRecordTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCityWiseULDAllocationRecordTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CityWiseULDAllocation");
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
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
