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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Tax Service Description
    /*
	*****************************************************************************
	Service Name:	TaxService      
	Purpose:		This Service used to get details of Tax save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Pankaj Khanna
	Created On:		10 feb 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TaxService : SignatureAuthenticate, ITaxService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
    
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<TaxGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTax", Parameters);
                var TaxList = ds.Tables[0].AsEnumerable().Select(e => new TaxGrid
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    TaxCode = e["TaxCode"].ToString().ToUpper(),
                    TaxType = e["TaxType"].ToString().ToUpper(),
                    Description = e["Description"].ToString().ToUpper(),
                    CountryCode = e["CountryCode"].ToString().ToUpper(),
                    CountryName = e["CountryName"].ToString().ToUpper(),
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //Buinding XML controls data
        public Tax GetTaxRecord(string recordID, string UserSNo)
        {
            Tax T = new Tax();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTax_GetRecord", Parameters);
                if (dr.Read())
                {
                    T.SNo = Convert.ToInt32(dr["SNo"]);
                    T.TaxCode = Convert.ToString(dr["TaxCode"]);
                    T.TaxType = Convert.ToInt32(dr["TaxType"]) == 0 ? "DOMESTIC" : "INTERNATIONAL";
                    T.Description = Convert.ToString(dr["Description"]);
                    T.Text_CountrySNo = Convert.ToString(dr["Text_CountrySNo"]);
                    T.Text_CitySNo = Convert.ToString(dr["Text_CitySNo"]);
                    T.Active = Convert.ToString(dr["Active"]);
                    T.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    T.UpdatedBy = dr["UpdatedUser"].ToString();
                    T.CreatedBy = dr["CreatedUser"].ToString();
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return T;
        }

        //Buinding AppendGrid
        public KeyValuePair<string, List<TaxTrans>> GetTaxSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "TaxMasterSNo=" + recordID;
                TaxTrans tax = new TaxTrans();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTaxSlabRecord", Parameters);
                var taxSlabList = ds.Tables[0].AsEnumerable().Select(e => new TaxTrans
                {
                    SNo = (e["SNo"]).ToString(),
                    Percentage = Convert.ToDecimal(e["Percentage"].ToString()),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]).ToString("dd-MMM-yyyy"),
                    ValidTo = e["ValidTo"].ToString() == "" ? "" : Convert.ToDateTime(e["ValidTo"]).ToString("dd-MMM-yyyy"),
                });
                return new KeyValuePair<string, List<TaxTrans>>("SNo", taxSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
               
                throw ex;
            }
        }

        public List<string> SaveTax(TaxPost tax)
        {
            try
            {
                //validate Business Rule
                DataTable dtTaxTrans = CollectionHelper.ConvertTo(tax.TransData, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                //if (!baseBusiness.ValidateBaseBusiness("Tax", dtCreateTax, "SAVE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}

                if (tax.CitySNo == "")
                {
                    tax.CitySNo = "0";
                }
                SqlParameter[] Parameters = { new SqlParameter("@TaxCode",tax.TaxCode),
                                            new SqlParameter("@TaxType",tax.TaxType),
                                            new SqlParameter("@Description",tax.Description),
                                        new SqlParameter("@CountrySNo",tax.CountrySNo),
                                        new SqlParameter("@CitySNo",tax.CitySNo),
                                        new SqlParameter("@IsActive",tax.IsActive),
                                        new SqlParameter("@UpdatedBy",tax.UpdatedBy),
                                        new SqlParameter("@TaxTrans",SqlDbType.Structured){Value=dtTaxTrans}};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spTax_Create", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Tax");
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
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }

        public List<string> UpdateTax(TaxPost tax)
        {
            try
            {
                //validate Business Rule
                DataTable dtTaxTrans = CollectionHelper.ConvertTo(tax.TransData, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                //if (!baseBusiness.ValidateBaseBusiness("Tax", dtUpdateTax, "UPDATE"))
                //{
                //    ErrorMessage = baseBusiness.ErrorMessage;
                //    return ErrorMessage;
                //}
                SqlParameter[] Parameters = { new SqlParameter("@TaxMasterSNo",tax.TaxMasterSNo),
                                          new SqlParameter("@Description",tax.Description),
                                        new SqlParameter("@IsActive",tax.IsActive),
                                        new SqlParameter("@UpdatedBy",tax.UpdatedBy),
                                        new SqlParameter("@TaxTrans",SqlDbType.Structured){Value=dtTaxTrans}};


                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spTax_Update", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Tax");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> DeleteTaxSlabRecord(string RecordID)
        {
           
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteTaxSlabRecord", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Tax");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
            return ErrorMessage;
        }



        public string GetCountry(int CitySNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@CitySNo", CitySNo), 
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetTaxCountry", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                
                throw ex;
            }
        }


        public string GetCityInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//(Exception ex)
            {
               
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
