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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDVendorPriceListService : SignatureAuthenticate, IULDVendorPriceListService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<VendorGridPriceList>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListVendorPrice", Parameters);
                var VendorGridPriceListList = ds.Tables[0].AsEnumerable().Select(e => new VendorGridPriceList
                {

                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    PartNumber = e["PartNumber"].ToString().ToUpper(),
                    ItemDescription = e["ItemDescription"].ToString().ToUpper(),
                    CustomerSNo = Convert.ToInt32(e["CustomerSNo"].ToString()),
                    Name = (e["Name"].ToString().ToUpper()),
                    Qty = Convert.ToInt32(e["Qty"].ToString()),
                    price = Convert.ToDecimal(e["Price"].ToString()),
                    UOM = Convert.ToInt32(e["UOM"].ToString()),
                    Text_UOM = e["UOM_Text"].ToString().ToUpper(),
                    //   IsActive = Convert.ToBoolean(e["IsActive"].ToString()),
                    Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = VendorGridPriceListList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }


        public List<string> SaveULDVendorPriceList(List<VendorPriceList> VendorPriceList)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCity = CollectionHelper.ConvertTo(VendorPriceList, "Text_CustomerSNo,Text_UOM,Agreement,Active"); //,Text_VolumeConversionCM,Text_VolumeConversionInch
                //                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");

                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("VendorPriceList", dtCreateCity, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@VendorPriceListTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCity;

                SqlParameter[] Parameters = { param };

                // DataSet DS  = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVendorPriceList", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVendorPriceList", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateVendorPriceList", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDVendorPriceList");
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
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> DeleteULDVendorPriceList(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteVendorPriceDetail", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DeleteVendorPriceDetail");
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
                }

                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public VendorPriceList GetULDVendorPriceListRecord(string recordID)
        {
            VendorPriceList VendorPriceList = new VendorPriceList();

            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordVendorPriceList", Parameters);
            try
            {
                if (dr.Read())
                {

                    VendorPriceList.SNo = Convert.ToInt32(dr["SNo"]);
                    VendorPriceList.PartNumber = dr["PartNumber"].ToString().ToUpper();
                    VendorPriceList.ItemDescription = dr["ItemDescription"].ToString().ToUpper();
                    VendorPriceList.Qty = Convert.ToInt32(dr["Qty"].ToString());
                    VendorPriceList.CustomerSNo = Convert.ToInt32(dr["CustomerSNo"].ToString());
                    VendorPriceList.Text_CustomerSNo = dr["Name"].ToString().ToUpper();
                    VendorPriceList.UOM = Convert.ToInt32(dr["UOM"]);
                    VendorPriceList.Text_UOM = dr["Text_UOM"].ToString().ToUpper();
                    VendorPriceList.price = Convert.ToDecimal(dr["Price"].ToString());
                    // VendorPriceList.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    VendorPriceList.Active = dr["Active"].ToString();
                    VendorPriceList.UpdatedBy = dr["Updatedby"].ToString();
                    VendorPriceList.CreatedBy = dr["Createdby"].ToString();
                    //city.IATAArea = dr["IATAArea"].ToString();
                    //city.Text_IATAArea = dr["IATAAreaName"].ToString();

                    //city.TimeZoneSNo = Convert.ToInt32(dr["TimeZoneSNo"]);
                    //city.Text_TimeZoneSNo = dr["TimeZoneName"].ToString().ToUpper();

                    //if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    //{
                    //    city.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //    city.Active = dr["Active"].ToString().ToUpper();
                    //}

                    //if (!string.IsNullOrEmpty(dr["IsPriorApproval"].ToString()))
                    //{
                    //    city.PriorApproval = (dr["IsPriorApproval"].ToString() == "Yes") ? true : false;
                    //    city.IsPriorApproval = dr["IsPriorApproval"].ToString().ToUpper();
                    //}
                    //if (!String.IsNullOrEmpty(dr["IsHouse"].ToString()))
                    //{
                    //    city.IsHouse = Convert.ToBoolean(dr["IsHouse"]);
                    //    city.House = dr["House"].ToString().ToUpper();
                    //}
                    //city.ZoneSNo = dr["ZoneSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["ZoneSNo"]);
                    //city.Text_ZoneSNo = dr["ZoneName"].ToString().ToUpper();
                    //city.SHCSNo = dr["SHCSNo"].ToString().ToUpper();
                    //city.Text_SHCSNo = dr["Text_SHCSNo"].ToString().ToUpper();

                    //city.DGClassSNo = dr["DGClassSNo"].ToString().ToUpper();
                    //city.Text_DGClassSNo = dr["Text_DGClassSNo"].ToString().ToUpper();
                    //city.VolumeConversionCM = Convert.ToDouble(dr["VolumeConversionCM"]);
                    ////city.Text_VolumeConversionCM = dr["Text_VolumeConversionCM"].ToString();
                    //city.VolumeConversionInch = Convert.ToDouble(dr["VolumeConversionInch"]);
                    ////city.Text_VolumeConversionInch = dr["VolumeConversionInch"].ToString();
                    //city.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    //city.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                }
                return VendorPriceList;
            }
            catch (Exception ex)//
            {
                throw ex;
                dr.Close();
            }


        }

        public List<string> UpdateULDVendorPriceList(List<VendorPriceList> VendorPriceList)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCity = CollectionHelper.ConvertTo(VendorPriceList, "Text_CustomerSNo,Text_UOM,Agreement,Active");//,Text_VolumeConversionCM,Text_VolumeConversionInch
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("VendorPriceList", dtCreateCity, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDRepairableItemsTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCity;

                SqlParameter[] Parameters = { param };

                // int ret = 0;
                // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateVendorPriceList", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateVendorPriceList", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDVendorPriceList");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        // For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }

                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public SelectVendor SelectVendor(string CustomerSNo)
        {
            String DeltaSeconds = String.Empty;
            SelectVendor dst = new SelectVendor();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CustomerSNo", CustomerSNo) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSelectVendor", Parameters);
                if (dr.Read())
                {
                    dst.Agreement = dr["AgreementNumber"].ToString();
                    //dst.SNo = dr["DayLightSaving"].ToString();
                }
                return dst;
            }
            catch (Exception ex)//
            {
                throw ex;
                dr.Close();
            }
            //dr.Close();

        }
    }
}
