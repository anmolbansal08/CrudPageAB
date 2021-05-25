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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AllotmentService : SignatureAuthenticate, IAllotmentService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<AllotmentGridMain>(filter);
  
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
            new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAllotment", Parameters);
            var AllotmentList = ds.Tables[0].AsEnumerable().Select(e => new AllotmentGridMain
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                AllotmentType = e["AllotmentType"].ToString().ToUpper(),
                AllotmentCode = e["AllotmentCode"].ToString().ToUpper(),
                FlightNo = e["FlightNo"].ToString().ToUpper(),
                Origin = e["Origin"].ToString().ToUpper(),
                Destination = e["Destination"].ToString().ToUpper(),
                OfficeName = e["OfficeName"].ToString().ToUpper(),
                AgentName = e["AgentName"].ToString().ToUpper(),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                ValidFrom=e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),         
                ValidTo=e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                DaysOfOps = e["DaysOfOps"].ToString().ToUpper(),
                AllotmentReleaseTime = e["AllotmentReleaseTime"].ToString(),
                Active = e["Active"].ToString().ToUpper(),
                
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = AllotmentList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };

        }

        public KeyValuePair<string, List<AllotmentRecords>> GetAllotmentAllRecord(int recid, int pageNo, int pageSize, AllotmentData model, string sort)
        {
            try
            {

                AllotmentRecords allotmentRecords = new AllotmentRecords();
                
                SqlParameter[] Parameters = {   new SqlParameter("@PageNo", pageNo), 
                                                new SqlParameter("@PageSize", pageSize), 
                                                new SqlParameter("@AllotmentSNo",model.AllotmentSNo),
                                                new SqlParameter("@From",model.From),
                                                new SqlParameter("@To",model.To),
                                                new SqlParameter("@FlightNo",model.FlightNo),
                                                new SqlParameter("@UserSNo",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAllotment_View", Parameters);
                var AllotmentList = ds.Tables[0].AsEnumerable().Select(e => new AllotmentRecords
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    IsUsed = Convert.ToInt32(e["IsUsed"]),
                    AllowToSubmit = Convert.ToInt32(e["AllowToSubmit"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    Ori = e["OriginAirportCode"].ToString(),
                    Dest = e["DestinationAirportCode"].ToString(),
                    AllotmentSNo = Convert.ToInt32(e["AllotmentSNo"].ToString()),
                    AllotmentCode = e["AllotmentCode"].ToString(),
                    AllotmentTypeSNo = e["AllotmentType"].ToString(),
                    HdnAllotmentTypeSNo = e["AllotmentTypeSNo"].ToString(),
                    AccountSNo = e["Text_AccountSNo"].ToString(),
                    HdnAccountSNo = e["AccountSNo"].ToString(),
                    OfficeSNo = e["Text_OfficeSNo"].ToString(),
                    HdnOfficeSNo = e["OfficeSNo"].ToString(),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                    Volume = Convert.ToDecimal(e["Volume"].ToString()),
                    SHC = e["Text_SHCSNo"].ToString(),
                    HdnSHC = e["SHCSNo"].ToString(),
                    Commodity = e["Text_CommoditySNo"].ToString(),
                    HdnCommodity = e["CommoditySNo"].ToString(),
                    Product = e["Text_ProductSNo"].ToString(),
                    HdnProduct = e["ProductSNo"].ToString(),
                    IsExcludeSHC = String.IsNullOrEmpty(e["SHCType"].ToString()) == true ?(bool?)null: Convert.ToBoolean(e["SHCType"]) ,
                    ExcludeSHC = e["Text_SHCType"].ToString(),
                    IsExcludeCommodity = String.IsNullOrEmpty(e["CommodityType"].ToString()) == true ? (bool?)null : Convert.ToBoolean(e["CommodityType"].ToString()),
                    ExcludeCommodity = e["Text_CommodityType"].ToString(),
                    IsExcludeProduct = String.IsNullOrEmpty(e["ProductType"].ToString()) == true ? (bool?)null : Convert.ToBoolean(e["ProductType"].ToString()),
                    ExcludeProduct = e["Text_ProductType"].ToString(),
                    IsActive = Convert.ToBoolean(e["IsActive"].ToString()) == true ? false : true,
                    Active=e["Active"].ToString(),
                    GrossVariancePlus = Convert.ToDecimal(e["GrossVariancePlus"].ToString()),
                    GrossVarianceMinus = Convert.ToDecimal(e["GrossVarianceMinus"].ToString()),
                    VolumeVariancePlus = Convert.ToDecimal(e["VolumeVariancePlus"].ToString()),
                    VolumeVarianceMinus = Convert.ToDecimal(e["VolumeVarianceMinus"].ToString()),
                    UsedGrossWT = Convert.ToDecimal(e["UsedGrossWeight"].ToString()),
                    UsedVolWT = Convert.ToDecimal(e["UsedVolume"].ToString()),
                    ReleaseGross = e["ReleaseGross"].ToString(),
                    ReleaseVolume = e["ReleaseVolume"].ToString(),
                    ReleaseTimeHr = e["AllotmentReleaseTimeHr"].ToString(),
                    ReleaseTimeMin = e["AllotmentReleaseTimeMin"].ToString(),
                    Mandatory = e["Mandatory"].ToString(),
                    IsMandatory = Convert.ToBoolean(e["IsMandatory"].ToString()),
                    ETD = Convert.ToDateTime(e["ETD"].ToString()),
                    OriginAirportCurrentTime = Convert.ToDateTime(e["OriginAirportCurrentTime"].ToString()),
                });
                return new KeyValuePair<string, List<AllotmentRecords>>(ds.Tables[1].Rows[0][0].ToString(), AllotmentList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> DeleteAllotment(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;

                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID),
                                              new SqlParameter("@UserSNo",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                            };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spAllotment_Delete", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Allotment");
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

        public string GetFlightDetails(string SNo, int AllotmentBasedOn)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo),
                                            new SqlParameter("@AllotmentBasedOn", AllotmentBasedOn)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightDetails", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetSectorDetails(string OriginAirportSNo, string DestinationAirportSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@OriginAirportSNo", OriginAirportSNo),
                                          new SqlParameter("@DestinationAirportSNo", DestinationAirportSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSectorDetails", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public List<string> SaveAllotment(List<Allotment> Allotment)
        {
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateAllotment = CollectionHelper.ConvertTo(Allotment, "Text_AircraftSNo,Sector,TotalGross,TotalVolume,ReserveGross,ReserveVolume,TotalGrossUnit,TotalVolumeUnit,ReserveGrossUnit,ReserveVolumeUnit,Text_OriginSNo,Text_DestinationSNo,AllotmentCode,Text_AllotmentType,Text_OfficeSNo,Text_AccountSNo,Text_GrossWeightType,Text_VolumeWeightType,Text_CommodityType,UpdatedBy,Text_Days,Text_ProductSNo,Text_Commodity,Text_FlightNo,Text_ShipperAccountSNo,Text_ProductType,Active,Mandatory,Text_FlightNo,Text_SHC,Text_SHCType,FlightValidFrom,FlightValidTo,IsUsed,FlightDaysOfOps,Text_AirlineSNo,AllotmentReleaseTimeMin,AllotmentReleaseTimeHr");
            BaseBusiness baseBusiness = new BaseBusiness();
            
            if (!baseBusiness.ValidateBaseBusiness("Allotment", dtCreateAllotment, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AllotmentTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateAllotment;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spAllotment_Create", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Allotment");
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

        public Allotment GetAllotmentRecord(string recordID, string UserSNo)
        {

         
            Allotment allotment = new Allotment();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllotment", Parameters);
                if (dr.Read())
                {
                allotment.SNo = Convert.ToInt32(dr["SNo"]);
                allotment.IsSector = Convert.ToInt32(dr["IsSector"]);
                allotment.Sector = dr["Sector"].ToString();
                allotment.OriginSNo = String.IsNullOrEmpty(dr["OriginSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["OriginSNo"]);
                allotment.Text_OriginSNo = dr["Text_OriginSNo"].ToString();
                allotment.DestinationSNo = String.IsNullOrEmpty(dr["DestinationSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["DestinationSNo"]);
                allotment.Text_DestinationSNo = dr["Text_DestinationSNo"].ToString();
                allotment.FlightNo = String.IsNullOrEmpty(dr["ScheduleTransSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["ScheduleTransSNo"]);
                allotment.Text_FlightNo = dr["Text_FlightNo"].ToString();
                allotment.TotalGross = dr["TotalGross"].ToString();
                allotment.TotalVolume = dr["TotalVolume"].ToString();
                allotment.ReserveGross = dr["ReserveGross"].ToString();
                allotment.ReserveVolume = dr["ReserveVolume"].ToString();
                allotment.TotalGrossUnit = dr["TotalGrossUnit"].ToString();
                allotment.TotalVolumeUnit = dr["TotalVolumeUnit"].ToString();
                allotment.ReserveGrossUnit = dr["ReserveGrossUnit"].ToString();
                allotment.ReserveVolumeUnit = dr["ReserveVolumeUnit"].ToString();
                allotment.AllotmentType = Convert.ToInt32(dr["AllotmentType"]);
                allotment.Text_AllotmentType = dr["Text_AllotmentType"].ToString();
                allotment.OfficeSNo = String.IsNullOrEmpty(dr["OfficeSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["OfficeSNo"]);
                allotment.Text_OfficeSNo = String.IsNullOrEmpty(dr["Text_OfficeSNo"].ToString()) == true ? "" : dr["Text_OfficeSNo"].ToString();
                allotment.AccountSNo = String.IsNullOrEmpty(dr["AccountSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["AccountSNo"]);
                allotment.Text_AccountSNo = String.IsNullOrEmpty(dr["Text_AccountSNo"].ToString()) == true ? "" : dr["Text_AccountSNo"].ToString();
                allotment.ShipperAccountSNo = String.IsNullOrEmpty(dr["ShipperAccountSNo"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["ShipperAccountSNo"]);
                allotment.Text_ShipperAccountSNo = String.IsNullOrEmpty(dr["Text_ShipperAccountSNo"].ToString()) == true ? "" : dr["Text_ShipperAccountSNo"].ToString();
                allotment.GrossWeightType = Convert.ToInt32(dr["GrossWeightType"]);
                allotment.Text_GrossWeightType = dr["Text_GrossWeightType"].ToString();
                allotment.GrossWeight= Convert.ToDecimal(dr["GrossWeight"]);
                allotment.VolumeWeightType = Convert.ToInt32(dr["VolumeWeightType"]);
                allotment.Text_VolumeWeightType = dr["Text_VolumeWeightType"].ToString();
                allotment.VolumeWeight = Convert.ToDecimal(dr["VolumeWeight"]);
                allotment.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                allotment.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                allotment.CommodityType = String.IsNullOrEmpty(dr["CommodityType"].ToString())==true ? (Int32?)null : Convert.ToInt32(dr["CommodityType"]);
                allotment.Text_CommodityType = dr["Text_CommodityType"].ToString();
                allotment.Commodity = dr["Commodity"].ToString();
                allotment.Text_Commodity = dr["Text_Commodity"].ToString();
                allotment.ProductType =String.IsNullOrEmpty(dr["ProductType"].ToString())==true? (Int32?)null : Convert.ToInt32(dr["ProductType"]);
                allotment.Text_ProductType = dr["Text_ProductType"].ToString();
                allotment.ProductSNo = dr["ProductSNo"].ToString();
                allotment.Text_ProductSNo = dr["Text_ProductSNo"].ToString();
                allotment.Days = dr["Days"].ToString();
                allotment.Text_Days = dr["Text_Days"].ToString();
                allotment.IsActive = Convert.ToBoolean(dr["IsActive"]);
                allotment.Active = dr["Active"].ToString();
                allotment.CreatedBy = dr["CreatedUser"].ToString();
                allotment.UpdatedBy = dr["UpdatedUser"].ToString();
                allotment.AllotmentCode = dr["AllotmentCode"].ToString();
                allotment.FlightValidFrom = dr["FlightValidFrom"].ToString();
                allotment.FlightValidTo = dr["FlightValidTo"].ToString();
                allotment.IsUsed = dr["IsUsed"].ToString();
                allotment.SHC = dr["SHC"].ToString();
                allotment.Text_SHC= dr["Text_SHC"].ToString();
                allotment.SHCType = String.IsNullOrEmpty(dr["SHCType"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["SHCType"]);
                allotment.Text_SHCType = dr["Text_SHCType"].ToString();
                allotment.FlightDaysOfOps= dr["FlightDaysOfOps"].ToString();
                allotment.GrossWeightVariance_P =Convert.ToInt32(dr["GrossWeightVariance_P"]);
                allotment.GrossWeightVariance_N = Convert.ToInt32(dr["GrossWeightVariance_N"]);
                allotment.VolumeVariance_P = Convert.ToInt32(dr["VolumeVariance_P"]);
                allotment.VolumeVariance_N = Convert.ToInt32(dr["VolumeVariance_N"]);
                allotment.AllotmentReleaseTime = dr["AllotmentReleaseTime"].ToString();
                allotment.AllotmentReleaseTimeHr = Convert.ToInt32(dr["AllotmentReleaseTimeHr"]);
                allotment.AllotmentReleaseTimeMin = Convert.ToInt32(dr["AllotmentReleaseTimeMin"]);
                allotment.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                allotment.Text_AirlineSNo = dr["Text_AirlineSNo"].ToString();
                allotment.IsMandatory = Convert.ToBoolean(dr["IsMandatory"]);
                allotment.Mandatory = dr["Mandatory"].ToString();
                }
            }
            catch(Exception ex)// (Exception e)
            {

                dr.Close();
            }
            dr.Close();
            return allotment;
        }

        public string UpdateAllotment(List<AllotmentRecords> model)
        {
            try
            {                
                DataTable dtAllotment = CollectionHelper.ConvertTo(model, "AllotmentCode,FlightNo,FlightDate,Ori,Dest,AllotmentTypeSNo,HdnAllotmentTypeSNo,OfficeSNo,HdnOfficeSNo,AccountSNo,HdnAccountSNo,UsedGrossWT,UsedVolWT,ReleaseGross,ReleaseVolume,Active,ExcludeProduct,ExcludeCommodity,ExcludeSHC,Product,Commodity,SHC,Mandatory,ETD,OriginAirportCurrentTime");

                SqlParameter[] Parameters = { new SqlParameter("@Allotment", SqlDbType.Structured){Value=dtAllotment},
                                          new SqlParameter("@UpdatedBy",(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAllotment_Update", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
                return ex.Message;
            }
        }

        public string ValidateData(string AirlineSNo, string AllotmentBasedOn, string AllotmentSNo, string IsSector, string OriginSNo, string DestinationSNo, string ScheduleTransSNo, string GrossWeight, string VolumeWeight, string ValidFrom, string ValidTo, string Days, string AllotmentTypeSNo, string AccountSNo, string ShipperAccountSNo, string OfficeSNo, string CommoditySNo, string CommotityExclude, string SHCSNo, string SHCExclude, string ProductSNo, string ProductExclude)
        {
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AllotmentBasedOn", AllotmentBasedOn),
                                            new SqlParameter("@AirlineSNo", AirlineSNo),
                                            new SqlParameter("@AllotmentSNo", AllotmentSNo),
                                            new SqlParameter("@IsSector", IsSector),
                                            new SqlParameter("@OriginSNo", OriginSNo),
                                            new SqlParameter("@DestinationSNo", DestinationSNo),
                                            new SqlParameter("@ScheduleTransSNo", ScheduleTransSNo),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@VolumeWeight", VolumeWeight),
                                            new SqlParameter("@ValidFrom", ValidFrom),
                                            new SqlParameter("@ValidTo", ValidTo),
                                            new SqlParameter("@Days", Days),
                                            new SqlParameter("@AllotmentTypeSNo", AllotmentTypeSNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@ShipperSNo", ShipperAccountSNo),
                                            new SqlParameter("@OfficeSNo", OfficeSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                            new SqlParameter("@CommotityExclude", CommotityExclude),
                                            new SqlParameter("@SHCSNo", SHCSNo),
                                            new SqlParameter("@SHCExclude", SHCExclude),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@ProductExclude", ProductExclude)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateAllotmentData", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string CheckAgentInternationalDomestic(int OriginAirportSNo, int DestinationAirportSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@OriginAirportSNo", OriginAirportSNo),
                                          new SqlParameter("@DestinationAirportSNo", DestinationAirportSNo)
                                        };
            //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckAgentInternationalDomestic", Parameters);
            //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            int res;
            res = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_CheckAgentInternationalDomestic", Parameters);
            return res.ToString();
            
        }
    }
}
