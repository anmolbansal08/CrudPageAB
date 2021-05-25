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
    public class HoldTypeService : SignatureAuthenticate, IHoldTypeService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public HoldType GetHoldTypeRecord(string recordID, string UserSNo)
        {
        
            HoldType Holdtype = new HoldType();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHoldType", Parameters);
                if (dr.Read())
                {
                    Holdtype.SNo = Convert.ToInt32(recordID);                   
                    Holdtype.Hold_Type= Convert.ToString(dr["Hold_Type"]).ToUpper();
                    Holdtype.HoldTypeCode = Convert.ToString(dr["HoldTypeCode"]).ToUpper();
                    Holdtype.HoldMessage = Convert.ToString(dr["HoldMessage"]).ToUpper();
                    Holdtype.UnHoldMessage = Convert.ToString(dr["UnHoldMessage"]).ToUpper();
                    Holdtype.IsAutoHold = Convert.ToBoolean(dr["IsAutoHold"]);
                    Holdtype.AutoHold = dr["AutoHold"].ToString().ToUpper();
                    if (!String.IsNullOrEmpty(dr["IsRestrictChangeFinalization"].ToString()))
                    {
                        Holdtype.IsRestrictChangeFinalization = Convert.ToBoolean(dr["IsRestrictChangeFinalization"]);
                        Holdtype.RestrictChangeFinalization = dr["RestrictChangeFinalization"].ToString().ToUpper();
                    }  

                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        Holdtype.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        Holdtype.Active = dr["Active"].ToString().ToUpper();
                    }
                     Holdtype.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    Holdtype.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    Holdtype.hdnEditSno = dr["SNo"].ToString() != "" ? dr["SNo"].ToString() : ""; 
                    Holdtype.IsAutoUnhold= Convert.ToBoolean(dr["IsAutoUnhold"]);
                    Holdtype.Text_IsAutoUnhold = dr["Text_IsAutoUnHold"].ToString().ToUpper();
                    Holdtype.ExcludeProduct = dr["ExcludeProduct"] == DBNull.Value ? "" : Convert.ToString(dr["ExcludeProduct"]);
                    Holdtype.Text_ExcludeProduct = dr["Text_ExcludeProduct"] == DBNull.Value ? "" : Convert.ToString(dr["Text_ExcludeProduct"]);
                    Holdtype.Airline = dr["Airline"] == DBNull.Value ? "" : Convert.ToString(dr["Airline"]);
                    Holdtype.Text_Airline = dr["Text_Airline"] == DBNull.Value ? "" : Convert.ToString(dr["Text_Airline"]);
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return Holdtype;
        }


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<HoldType>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListHoldType", Parameters);
                var HoldTypeList = ds.Tables[0].AsEnumerable().Select(e => new HoldType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Hold_Type = e["Hold_Type"].ToString().ToUpper(),
                    HoldTypeCode = e["HoldTypeCode"].ToString().ToUpper(),
                    AutoHold = e["AutoHold"].ToString(),
                    HoldMessage = e["HoldMessage"].ToString().ToUpper(),
                    UnHoldMessage = e["UnHoldMessage"].ToString().ToUpper(),
                    RestrictChangeFinalization = e["RestrictChangeFinalization"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    Text_IsAutoUnhold = e["Text_IsAutoUnhold"].ToString().ToUpper(),
                    
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = HoldTypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<HoldTypeGridAppendGrid>> GetHoldTypeGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                HoldTypeGridAppendGrid HoldTypeGridAppendGridSPHC = new HoldTypeGridAppendGrid();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHoldTypeCityTransAppendGrid1", Parameters);
                var HoldTypeGridAppendGrid = ds.Tables[0].AsEnumerable().Select(e => new HoldTypeGridAppendGrid
                {
                    SNo = 0,
                    AirportSNo = e["HoldAirportName"].ToString(),
                    HdnAirportSNo = e["AirportSNo"].ToString(),

                    CitySNo = e["HoldCityName"].ToString(),
                    HdnCitySNo = e["CitySNo"].ToString(),
                    CountrySNo = e["HoldCountryName"].ToString(),
                    HdnCountrySNo = e["CountrySNo"].ToString(),


                });
                return new KeyValuePair<string, List<HoldTypeGridAppendGrid>>(ds.Tables[1].Rows[0][0].ToString(), HoldTypeGridAppendGrid.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveHoldType(HoldTypeTransSave data)
        {
            DataTable dtHoldTypeTransTrans = CollectionHelper.ConvertTo(data.HoldTypeTransData, "Text_IsAutoUnHold");
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                int ret = 0;        
                dtHoldTypeTransTrans.Columns.Remove("SNo");
                dtHoldTypeTransTrans.Columns.Remove("AirportSNo");
                dtHoldTypeTransTrans.Columns.Remove("CitySNo");
                dtHoldTypeTransTrans.Columns.Remove("CountrySNo");
                dtHoldTypeTransTrans.Columns.Remove("HoldTypeSNo");
                if (dtHoldTypeTransTrans.Rows.Count > 0)
                {

                    SqlParameter[] param = { new SqlParameter("@Hold_Type", data.Hold_Type),
                                       new SqlParameter("@HoldTypeCode", data.HoldTypeCode),
                                       new SqlParameter("@HoldMessage", data.HoldMessage),
                                       new SqlParameter("@UnHoldMessage", data.UnHoldMessage),
                                        new SqlParameter("@IsAutoHold", data.IsAutoHold),
                                           new SqlParameter("@IsRestrictChangeFinalization", data.IsRestrictChangeFinalization),
                                              new SqlParameter("@IsActive", data.IsActive ),
                                               new SqlParameter("@CreatedBy",data.CreatedBy ),
                                                new SqlParameter("@UpdatedBy",data.UpdatedBy ),
                                               new SqlParameter("@IsAutoUnhold",data.IsAutoUnhold ),
                                       new SqlParameter("@tt", dtHoldTypeTransTrans),
                                       new SqlParameter("@ExcludeProduct",data.ExcludeProduct),
                                        new SqlParameter("@Airline",data.Airline)
                    };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateHoldType", param);
                }
                else
                {
                    ret = 2003;
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HoldType");
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
            catch(Exception ex)//// (Exception e)
            {
                throw ex;
            }
            return ErrorMessage;
        }


        public List<string> UpdateHoldType(HoldTypeTransSave data)
        {
            try
            {
                DataTable dtHoldTypeTransTrans = CollectionHelper.ConvertTo(data.HoldTypeTransData, "Text_IsAutoUnHold");

                //Remove column which is not required in Table Type
                dtHoldTypeTransTrans.Columns.Remove("SNo");
                dtHoldTypeTransTrans.Columns.Remove("AirportSNo");
                dtHoldTypeTransTrans.Columns.Remove("CitySNo");
                dtHoldTypeTransTrans.Columns.Remove("CountrySNo");
                dtHoldTypeTransTrans.Columns.Remove("HoldTypeSNo");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                int ret = 0;

                if (dtHoldTypeTransTrans.Rows.Count > 0)
                {
                    SqlParameter[] param = { new SqlParameter("@SNo", data.SNo ),
                                       new SqlParameter("@Hold_Type", data.Hold_Type),
                                       new SqlParameter("@HoldTypeCode", data.HoldTypeCode),
                                       new SqlParameter("@HoldMessage", data.HoldMessage),
                                       new SqlParameter("@UnHoldMessage", data.UnHoldMessage),
                                        new SqlParameter("@IsAutoHold", data.IsAutoHold),
                                           new SqlParameter("@IsRestrictChangeFinalization", data.IsRestrictChangeFinalization),
                                              new SqlParameter("@IsActive", data.IsActive ),
                                               new SqlParameter("@CreatedBy",data.CreatedBy ),
                                                new SqlParameter("@UpdatedBy",data.UpdatedBy ),
                                                 new SqlParameter("@IsAutoUnhold",data.IsAutoUnhold ),
                                       new SqlParameter("@tt", dtHoldTypeTransTrans),
                                        new SqlParameter("@ExcludeProduct",data.ExcludeProduct),
                                          new SqlParameter("@Airline",data.Airline)
                    };
                


                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateHoldType", param);
                }
                else
                {
                    ret = 2003;
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HoldType");
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
        public List<string> DeleteHoldType(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@HoldType", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteHoldtype", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "HoldType");
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
