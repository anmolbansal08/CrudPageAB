using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using Newtonsoft.Json;
using System.Net;


namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateSurchargeService : SignatureAuthenticate, IRateSurchargeService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
 
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateSurcharge>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateSurcharge", Parameters);
                var RateSurchargeList = ds.Tables[0].AsEnumerable().Select(e => new RateSurcharge
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    SurchargeName = e["SurchargeName"].ToString().ToUpper(),
                    Text_SurchargeTypeSNo = e["Text_SurchargeTypeSNo"].ToString().ToUpper(),
                    Text_OriginSNo = e["Text_OriginSNo"].ToString().ToUpper(),
                    Text_ProductSNo = e["Text_ProductSNo"].ToString().ToUpper(),
                    ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc)

                    //Active = e["Active"].ToString().ToUpper(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateSurchargeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        //public List<string> SaveRateSurcharge(List<RateSurcharge> RateSurcharge)
        //{
        //    string Message = "";
        //    List<string> ErrorMessage = new List<string>();
        //    DataTable dtRateSurchargeSlab = new DataTable();
        //    dtRateSurchargeSlab.Columns.Add("SNo", typeof(int));
        //    dtRateSurchargeSlab.Columns.Add("StartWeight", typeof(int));
        //    dtRateSurchargeSlab.Columns.Add("EndWeight", typeof(decimal));
        //    dtRateSurchargeSlab.Columns.Add("BasedOn", typeof(decimal));
        //    dtRateSurchargeSlab.Columns.Add("Amount", typeof(decimal));
        //    DataTable dtRateSurcharge = CollectionHelper.ConvertTo(RateSurcharge, "Text_SurchargeTypeSNo,Text_OriginSNo,Text_CommoditySNo,Text_SHCSNo,ActionType,strData,UpdatedBy,CreatedBy,Text_ValidFrom,Text_ValidTo,Text_ProductSNo");
        //    string ActionType = RateSurcharge[0].ActionType;
        //    DataTable dt = (DataTable)JsonConvert.DeserializeObject(RateSurcharge[0].strData, (typeof(DataTable)));
        //    if (dt != null)
        //        dtRateSurchargeSlab = dt;
        //    try
        //    {
        //        BaseBusiness baseBusiness = new BaseBusiness();
        //        if (!baseBusiness.ValidateBaseBusiness("RateSurcharge", dtRateSurcharge, "SAVE"))
        //        {
        //            ErrorMessage = baseBusiness.ErrorMessage;
        //            return ErrorMessage;
        //        }
        //        SqlParameter[] param = 
        //                                { 
        //                                    new SqlParameter("@ActionType",ActionType),
        //                                    new SqlParameter("@RateSurchargeTable",dtRateSurcharge),
        //                                    new SqlParameter("@RateSurchargeSlabTable",dtRateSurchargeSlab),
        //                                    new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                };
        //        string returns = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAndUpdateRateSurcharge", param).Tables[0].Rows[0][0];
        //        int SNo = 0; int ret = 0;
        //        if (returns.Contains(','))
        //        {
        //            SNo = Convert.ToInt32(returns.Split(',')[0]);
        //            ret = Convert.ToInt32(returns.Split(',')[1]);
        //        }
        //        else
        //            ret = Convert.ToInt32(returns);

        //        Message = ret.ToString();
        //        //if (ret > 0)
        //        //{
        //        //    if (ret > 1000)
        //        //    {
        //        //        //For Customised Validation Messages like 'Record Already Exists' etc
        //        //        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateType");
        //        //        if (!string.IsNullOrEmpty(serverErrorMessage))
        //        //            ErrorMessage.Add(serverErrorMessage);
        //        //    }
        //        //    else
        //        //    {

        //        //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //        //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //        //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //        //            ErrorMessage.Add(dataBaseExceptionMessage);
        //        //    }


        //        //}

        //       // return ErrorMessage;
        //        //if (ret > 0)
        //        //{
        //        //    if (ret == 1001)
        //        //    {
        //        //        //For Customised Validation Messages like 'Record Already Exists' etc
        //        //        string serverErrorMessage = "Rate Surcharge already exists.";
        //        //        //string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTariff");
        //        //        if (!string.IsNullOrEmpty(serverErrorMessage))
        //        //            ErrorMessage.Add(serverErrorMessage);
        //        //    }
        //        //    else if (ret > 1000 && ret < 5000)
        //        //    {
        //        //        //For Customised Validation Messages like 'Record Already Exists' etc
        //        //        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurcharge");
        //        //        if (!string.IsNullOrEmpty(serverErrorMessage))
        //        //            ErrorMessage.Add(serverErrorMessage);
        //        //    }
        //        //    else
        //        //    {
        //        //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //        //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //        //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //        //            ErrorMessage.Add(dataBaseExceptionMessage);
        //        //    }
        //        //}
        //        //else
        //        //{
        //        //    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurcharge");
        //        //    if (!string.IsNullOrEmpty(serverErrorMessage))
        //        //        ErrorMessage.Add(serverErrorMessage);
        //        //}
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        ErrorMessage.Add("Error");
        //    }
        //    return Message;
        //}


        public List<string> SaveAndUpdateRateSurcharge(List<RateSurcharge> RateSurcharge)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateRateSurcharge = CollectionHelper.ConvertTo(RateSurcharge, "UpdatedBy,Text_SurchargeTypeSNo,Text_OriginSNo,Text_CommoditySNo,Text_SHCSNo,strData,Text_ValidFrom,Text_ValidTo,Text_ProductSNo,RateSurchargeSlab");
                DataTable dtcreateRateSurchargeSlab = CollectionHelper.ConvertTo(RateSurcharge[0].RateSurchargeSlab, "SurchargeSNo,SHCSNo");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateSurcharge", dtcreateRateSurcharge, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter[] param = {   //new SqlParameter("@ActionType","NEW"),
                                            new SqlParameter("@RateSurchargeTable",dtcreateRateSurcharge),
                                            new SqlParameter("@RateSurchargeSlabTable",dtcreateRateSurchargeSlab)};
                                            //new SqlParameter("@UpdatedBy",1)};
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAndUpdateRateSurcharge", Parameters);
                string returns = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAndUpdateRateSurcharge", param).Tables[0].Rows[0][0];
                int SNo = 0; int ret = 0;
                if (returns.Contains(','))
                {
                    SNo = Convert.ToInt32(returns.Split(',')[0]);
                    ret = Convert.ToInt32(returns.Split(',')[1]);
                }
                else
                    ret = Convert.ToInt32(returns);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateSurcharge");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public RateSurcharge GetRateSurchargeRecord(string recordID, string UserID)
        {
            RateSurcharge rateSurcharge = new RateSurcharge();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRateSurcharge", Parameters);
                if (dr.Read())
                {
                   rateSurcharge.SNo = Convert.ToInt32(dr["SNo"]);
                   rateSurcharge.SurchargeName = dr["SurchargeName"].ToString();
                   rateSurcharge.SurchargeTypeSNo = Convert.ToInt32(dr["SurchargeTypeSNo"]);
                   rateSurcharge.Text_SurchargeTypeSNo = dr["Text_SurchargeTypeSNo"].ToString();
                 rateSurcharge.OriginSNo = Convert.ToInt32(dr["OriginSNo"]);
                 rateSurcharge.Text_OriginSNo = dr["Text_OriginSNo"].ToString();
                 rateSurcharge.ProductSNo = Convert.ToInt32(dr["ProductSNo"]);
                 rateSurcharge.Text_ProductSNo = dr["Text_ProductSNo"].ToString();
                 rateSurcharge.Text_ValidFrom = dr["Text_ValidFrom"].ToString();
                 rateSurcharge.ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString());
                 rateSurcharge.ValidTo = DateTime.Parse(dr["ValidTo"].ToString());
                 rateSurcharge.Text_ValidTo = dr["Text_ValidTo"].ToString();
                 rateSurcharge.CreatedBy = dr["CreatedBy"].ToString();
                 rateSurcharge.UpdatedBy = dr["UpdatedBy"].ToString();
                 rateSurcharge.CommoditySNo = (dr["CommoditySNo"]).ToString();
                 rateSurcharge.Text_CommoditySNo = (dr["Text_CommoditySNo"]).ToString();
                 rateSurcharge.Text_SHCSNo = (dr["Text_SHCSNo"]).ToString();
                 rateSurcharge.SHCSNo = (dr["SHCSNo"]).ToString();
                 rateSurcharge.Text_SHCSNo = (dr["Text_SHCSNo"]).ToString();
                 rateSurcharge.IsActive = Convert.ToBoolean((dr["IsActive"]).ToString());
                 rateSurcharge.Active = (dr["Active"]).ToString();
                }
            }
           catch(Exception ex)//
            {
              dr.Close();
                throw ex;
            }
          
            dr.Close();
            return rateSurcharge;
        }


        public KeyValuePair<string, List<RateSurchargeSlab>> GetRateSurchargeSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "SurchargeSNo=" + recordID;
                RateSurchargeSlab rateSurchargeSlab = new RateSurchargeSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateSurchargeSlabRecord", Parameters);
                var rateSurchargeSlabList = ds.Tables[0].AsEnumerable().Select(e => new RateSurchargeSlab
                {
                    SNo = Convert.ToInt32(e["SlabSNo"]),
                    SurchargeSNo = Convert.ToInt32(e["SurchargeSNo"].ToString()),
                    StartWeight = Convert.ToDecimal(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToDecimal(e["EndWeight"].ToString()),
                    BasedONSNo = Convert.ToInt32(e["BasedON"].ToString()),
                    BasedOn = Convert.ToInt32(e["BasedOn"].ToString()),
                    Amount = Convert.ToDecimal(e["Amount"].ToString())

                });
                return new KeyValuePair<string, List<RateSurchargeSlab>>(ds.Tables[1].Rows[0][0].ToString(), rateSurchargeSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> DeleteRateSurchargeSlab(string RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateSurchargeSlab", Parameters);
                if (ret > 0)
                {
                    if (ret > 2002)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateSurcharge");
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
