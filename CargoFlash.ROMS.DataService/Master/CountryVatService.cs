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
    public class CountryVatService : SignatureAuthenticate, ICountryVatService
    {
        //public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        //{

        //    string sorts = GridSort.ProcessSorting(sort);
        //    string filters = GridFilter.ProcessFilters<CountryVat>(filter);

        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCountryVat", Parameters);

        //    var CountryVatList = ds.Tables[0].AsEnumerable().Select(e => new CountryVat
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        CountryName = e["CountryName"].ToString().ToUpper(),
        //        Value = Convert.ToDecimal(e["Value"].ToString()),
        //        DomsticVat = e["DomsticVat"].ToString(),
        //        ValidFrom = DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy"),
        //        ValidTo = DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy"),
        //        Active = (e["Active"].ToString()),
                
        //    });
        //    ds.Dispose();
        //    return new DataSourceResult
        //    {
        //        Data = CountryVatList.AsQueryable().ToList(),
        //        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
        //    };

        //}


        //public List<string> SaveCountryVat(List<CountryVat> CountryVat)
        //{
        //    //validate Business Rule
        //    DataTable dtCreateDomsticVat = CollectionHelper.ConvertTo(CountryVat, "Text_CountrySNo,CountryName,Active,DomsticVat");
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    if (!baseBusiness.ValidateBaseBusiness("CountryVat", dtCreateDomsticVat, "SAVE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@CountryVat";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtCreateDomsticVat;
        //    SqlParameter[] Parameters = { param };

        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCountryVat", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            //For Customised Validation Messages like 'Record Already Exists' etc
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CountryVat");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);
        //        }
        //        else
        //        {

        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }

        //    return ErrorMessage;
        //}

        public KeyValuePair<string, List<CountryVat>> GetCountryVatRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                CountryVat CommoditySubGroup = new CountryVat();
                SqlParameter[] Parameters = { new SqlParameter("@CountrySNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCountryVat", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var CountryVatList = ds.Tables[0].AsEnumerable().Select(e => new CountryVat
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CountryName = e["CountryName"].ToString().ToUpper(),
                    CountrySNo = Convert.ToInt32(e["CountrySNo"].ToString()),
                    Value = Convert.ToDecimal(e["Value"].ToString()),
                    IsDomsticVat = Convert.ToBoolean(e["IsDomsticVat"]),
                    DomsticVat = e["DomsticVat"].ToString(),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<CountryVat>>(ds.Tables[1].Rows[0][0].ToString(), CountryVatList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> createUpdateCountryVat(string strData)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                // Convert JSON string into datatable
                var dtCountryVat = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                var dtCreateCountryVat = (new DataView(dtCountryVat, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCountryVat = (new DataView(dtCountryVat, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@_SPHCSubClass";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCountryVat.Rows.Count > 0)
                {
                    param.Value = dtCreateCountryVat;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCountryVat", Parameters);
                }
                // for update existing record
                if (dtUpdateCountryVat.Rows.Count > 0)
                {
                    param.Value = dtUpdateCountryVat;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCountryVat", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CountryVat");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> deleteCountryVat(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                //ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCountryVat", Parameters);
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCountryVat", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CountryVat");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }




    }
}
