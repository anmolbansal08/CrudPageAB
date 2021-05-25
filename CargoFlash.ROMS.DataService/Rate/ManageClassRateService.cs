using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Collections;
using System.Web;
using System.Net;
using System.ServiceModel.Web;



namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ManageClassRateService : SignatureAuthenticate, IManageClassRateService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ManageClassRate>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineClassRate", Parameters);

                var ManageClassRateList = ds.Tables[0].AsEnumerable().Select(e => new ManageClassRate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ClassRateName   = e["ClassRateName"].ToString(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString().ToUpper(),
                    Text_Status = e["Text_Status"].ToString().ToUpper(),
                    ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),

                    RateInPercentage = Convert.ToInt32(e["RateInPercentage"].ToString()),
                    Text_OriginSNo = e["Text_OriginSNo"].ToString().ToUpper(),
                    Text_DestinationSNo = e["Text_DestinationSNo"].ToString().ToUpper(),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                    

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ManageClassRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveManageClassRate(List<ManageClassRate> ManageClassRate)
        {
            //validate Business Rule
            try
            {

                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateManageClassRate = CollectionHelper.ConvertTo(ManageClassRate, "Active,ReferenceNumber,Text_AirlineSNo,Text_ApplicableOn,Text_OriginSNo,Text_DestinationSNo,Text_CommoditySNo,ISINCLUDE,STATUS,Text_OriginLevel,Text_DestinationLevel,Text_Status,International,Text_SHCSNO,ClassRateSlab,Text_AccountSNo,Text_BasedOn,FlightSNo,Text_FlightSNo,Text_OtherAirlineSNo");
                DataTable dtClassRateSlab = CollectionHelper.ConvertTo(ManageClassRate[0].ClassRateSlab, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                string flightSno = ManageClassRate[0].FlightSNo;
                if (!baseBusiness.ValidateBaseBusiness("ManageClassRate", dtCreateManageClassRate, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirLineClassRateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateManageClassRate;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@ClassRateTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtClassRateSlab;
                
                SqlParameter param2 = new SqlParameter("@flightSNo", flightSno);
                SqlParameter[] Parameters = { param, param1, param2 };


                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SPClassRate_CreateAirlineClassRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageClassRate");
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


        public ManageClassRate GetManageClassRateRecord(string recordID, string UserID)
        {
            ManageClassRate manageClassRate = new ManageClassRate();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirLineClassRate", Parameters);
                if (dr.Read())
                {
                    manageClassRate.ReferenceNumber = dr["ReferenceNumber"].ToString();
                    manageClassRate.SNo = Convert.ToInt32(dr["SNo"]);
                    manageClassRate.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    manageClassRate.Text_AirlineSNo = dr["Text_AirlineSNo"].ToString();
                    manageClassRate.Text_Status = (dr["Text_Status"].ToString());
                    manageClassRate.Status = Convert.ToInt32(dr["Status"].ToString());
                    manageClassRate.OriginLevel = Convert.ToInt32(dr["OriginType"].ToString());
                    manageClassRate.Text_OriginLevel = dr["Text_OriginType"].ToString();

                    manageClassRate.Text_DestinationLevel = dr["Text_DestinationType"].ToString();
                    manageClassRate.DestinationLevel = Convert.ToInt32(dr["DestinationType"].ToString());
                    ////  manageClassRate = dr["Text_SurchargeTypeSNo"].ToString();
                    manageClassRate.ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString());
                    manageClassRate.ValidTo = DateTime.Parse(dr["ValidTo"].ToString());
                    manageClassRate.OriginSNo = Convert.ToInt32(dr["OriginSNo"].ToString());
                    manageClassRate.Text_OriginSNo = dr["Text_OriginSNo"].ToString();
                    manageClassRate.DestinationSNo = Convert.ToInt32(dr["DestinationSNo"].ToString());
                    manageClassRate.Text_DestinationSNo = dr["Text_DestinationSNo"].ToString();
                    manageClassRate.RateInPercentage = Convert.ToInt32(dr["RateInPercentage"]);
                    manageClassRate.ApplicableOn = Convert.ToInt32(dr["ApplicableOn"]);
                    manageClassRate.Text_ApplicableOn = dr["Text_ApplicableOn"].ToString();

                    manageClassRate.CommoditySNo = (dr["CommoditySNo"].ToString().TrimEnd(','));
                    manageClassRate.Text_CommoditySNo = (dr["Text_CommoditySNo"].ToString().TrimEnd(','));

                    manageClassRate.SHCSNO = (dr["SHCSNO"].ToString().TrimEnd(','));
                    manageClassRate.Text_SHCSNO = (dr["Text_SHCSNO"].ToString().TrimEnd(','));
                   // manageClassRate.IsInclude = Convert.ToInt32(dr["IsInclude"]);
                 //   manageClassRate.ISINCLUDE = dr["ISINCLUDE"].ToString();
                    manageClassRate.International = dr["International"].ToString();
                    manageClassRate.CreatedBy = dr["CreatedBy"].ToString();
                    manageClassRate.UpdatedBy = dr["UpdatedBy"].ToString();
                    manageClassRate.AccountSNo = dr["AccountSNo"].ToString();
                    manageClassRate.Text_AccountSNo = dr["Text_AccountSNo"].ToString();
                    manageClassRate.BasedOn = Convert.ToInt32( dr["BasedOn"].ToString());
                    manageClassRate.ClassRateName = dr["ClassRateName"].ToString().ToUpper();
                    manageClassRate.Text_BasedOn = dr["Text_BasedOn"].ToString();
                    manageClassRate.FlightSNo = dr["FlightSNo"].ToString();
                    manageClassRate.Text_FlightSNo = dr["FlightSNo"].ToString();
                    manageClassRate.Text_OtherAirlineSNo = dr["Text_OtherAirlineSNo"].ToString();
                    manageClassRate.OtherAirlineSNo = dr["OtherAirlineSNo"].ToString();
                }
            }
            catch(Exception ex)// 
            {
                throw ex;
            }
            dr.Close();
            return manageClassRate;
        }

        public string GetClassRate(int RateSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RateSNo", RateSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spClassRate_GetClassRateCommodity", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> UpdateManageClassRate(List<ManageClassRate> ManageClassRate)
        {
            try
            {
                //validate Business Rule

                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateManageClassRate = CollectionHelper.ConvertTo(ManageClassRate, "Active,ReferenceNumber,Text_AirlineSNo,Text_ApplicableOn,Text_OriginSNo,Text_DestinationSNo,Text_CommoditySNo,ISINCLUDE,STATUS,Text_OriginLevel,Text_DestinationLevel,Text_Status,International,Text_SHCSNO,ClassRateSlab,Text_AccountSNo,Text_BasedOn,FlightSNo,Text_FlightSNo,Text_OtherAirlineSNo");
                DataTable dtClassRateSlab = CollectionHelper.ConvertTo(ManageClassRate[0].ClassRateSlab, "");
                string flightSno = ManageClassRate[0].FlightSNo;
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ManageClassRate", dtCreateManageClassRate, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirLineClassRateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateManageClassRate;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@ClassRateTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtClassRateSlab;

                SqlParameter param2 = new SqlParameter("@flightSNo", flightSno);
                SqlParameter[] Parameters = { param, param1, param2 };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spClassRate_UpdateAirlineClassRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageClassRate");
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

        public string GetCountrySNo(int CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetCountrySNo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetMultipleSHSNo(string Name, string CodesData, string length)
        {
            try
            {
                //SqlParameter[] Parameters = { new SqlParameter("@Name", Name), new SqlParameter("@codes", (CodesData)) };
                //DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetMultipleSHSNo", Parameters);
                //ds.Dispose();
                DataSet ds = new DataSet();
                //ArrayList arrlist = new ArrayList();
                //ArrayList arrlist1 = new ArrayList();
                //arrlist.Add(CodesData);


                if (length == "1")
                {
                    HttpContext.Current.Session["Company"] = null;
                    HttpContext.Current.Session["Company"] = CodesData;
                }

                else
                {
                    HttpContext.Current.Session["Company"] = HttpContext.Current.Session["Company"] + "," + CodesData;
                }

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<ClassRateSlab>> GetClassRateSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "RateAirlineClassRate=" + recordID;
                ClassRateSlab classRateSlab = new ClassRateSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClassRateSlabRecord", Parameters);
                var classRateSlabList = ds.Tables[0].AsEnumerable().Select(e => new ClassRateSlab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    RateAirlineClassRate = Convert.ToInt32(e["RateAirlineClassRate"].ToString()),
                    StartWeight = Convert.ToInt32(e["StartWeight"].ToString()),
                    EndWeight = Convert.ToInt32(e["EndWeight"].ToString()),
                    RateBasedOn = Convert.ToInt32(e["RateBasedOn"].ToString()),
                    Value = Convert.ToDecimal(e["Value"].ToString()),
                 

                });
                return new KeyValuePair<string, List<ClassRateSlab>>(ds.Tables[1].Rows[0][0].ToString(), classRateSlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> DeleteClassRateSlab(string RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteClassRateSlab", Parameters);
                if (ret > 0)
                {
                    if (ret > 2002)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ManageClassRate");
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
            catch (Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }


}
