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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class EmbargoService : SignatureAuthenticate, IEmbargoService
    {
        /// <summary>
        /// Retrieve Embargo infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public Embargo GetEmbargoRecord(string recordID, string UserSNo)
        {
            SqlDataReader dr = null;
            try
            {
                Embargo emb = new Embargo();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };

                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEmbargo", Parameters);

                if (dr.Read())
                {
                    emb.SNo = Convert.ToInt32(dr["SNo"]);
                    emb.ConfigType = Convert.ToBoolean(dr["ConfigType"]);
                    emb.Text_ConfigType = dr["Text_ConfigType"].ToString();
                    emb.EmbargoName = dr["EmbargoName"].ToString().ToUpper();

                    emb.OriginCountrySNo = string.IsNullOrEmpty(dr["OriginCountrySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["OriginCountrySNo"]);
                    emb.Text_OriginCountrySNo = dr["OriginCountry"].ToString().ToUpper();

                    emb.DestinationCountrySNo = string.IsNullOrEmpty(dr["DestinationCountrySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["DestinationCountrySNo"]);
                    emb.Text_DestinationCountrySNo = dr["DestinationCountry"].ToString().ToUpper();

                    emb.OriginAirportSNo = string.IsNullOrEmpty(dr["OriginAirportSNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["OriginAirportSNo"]);
                    emb.DestinationAirportSNo = string.IsNullOrEmpty(dr["DestinationAirportSNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["DestinationAirportSNo"]);
                    emb.FreightType = String.IsNullOrEmpty(dr["FreightType"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["FreightType"]);
                    //emb.OriginLocalZoneSNo = Convert.ToInt32(dr["OriginLocalZoneSNo"]);
                    //emb.DestinationLocalZoneSNo = Convert.ToInt32(dr["DestinationLocalZoneSNo"]);

                    emb.Text_OriginAirportSNo = dr["OriginAirport"] == null ? string.Empty : (dr["OriginAirport"].ToString());
                    emb.Text_DestinationAirportSNo = dr["DestinationAirport"] == null ? string.Empty : (dr["DestinationAirport"].ToString());

                    //emb.Text_OriginLocalZoneSNo = dr["OriginLocalZoneName"] == null ? string.Empty : (dr["OriginLocalZoneName"].ToString());
                    //emb.Text_DestinationLocalZoneSNo = dr["DestinationLocalZoneName"] == null ? string.Empty : (dr["DestinationLocalZoneName"].ToString());

                    emb.OriginCitySNo = string.IsNullOrEmpty(dr["OriginCitySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["OriginCitySNo"]);
                    emb.Text_OriginCitySNo = dr["OriginCity"].ToString().ToUpper();

                    emb.DestinationCitySNo = string.IsNullOrEmpty(dr["DestinationCitySNo"].ToString()) ? (Int32?)null : Convert.ToInt32(dr["DestinationCitySNo"]);
                    emb.Text_DestinationCitySNo = dr["DestinationCity"].ToString().ToUpper();

                    emb.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    emb.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    emb.LimitOn = String.IsNullOrEmpty(dr["LimitOn"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["LimitOn"]);
                    emb.Text_LimitOn = dr["Text_LimitOn"].ToString().ToUpper();
                    emb.Period = String.IsNullOrEmpty(dr["Period"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["Period"]);
                    emb.Text_Period = dr["Text_Period"].ToString().ToUpper();
                    emb.MaxWeight = Convert.ToDouble(dr["MaxWeight"]);
                    emb.AllowedWeight = Convert.ToDouble(dr["AllowedWeight"]);
                    emb.Reason = dr["Reason"].ToString().ToUpper();

                    emb.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    emb.Active = dr["ACTIVE"].ToString();
                    //added by tarun kumar singh 
                    // emb.FreightType = Convert.ToBoolean(dr["FreightType"]);
                    emb.Text_FreightType = dr["Text_FreightType"].ToString();
                    //emb.IsExcludeSHC =Convert.ToBoolean(dr["IsExcludeSHC"]);
                    //emb.Text_IsExcludeSHC = Convert.ToString(dr["Text_IsExcludeSHC"]);//== true ? "Exclude" : "Include";
                    //emb.IsExcludeCommodity = Convert.ToBoolean(dr["IsExcludeCommodity"]);
                    //emb.Text_IsExcludeCommodity = Convert.ToString(dr["Text_IsExcludeCommodity"]);// == true ? "Exclude" : "Include";
                    //emb.IsExcludeFlight = Convert.ToBoolean(dr["IsExcludeFlight"]);
                    //emb.Text_IsExcludeFlight = Convert.ToString(dr["Text_IsExcludeFlight"]);// == true ? "Exclude" : "Include";
                    //emb.IsExcludeProduct = Convert.ToBoolean(dr["IsExcludeProduct"]);
                    //emb.Text_IsExcludeProduct = Convert.ToString(dr["Text_IsExcludeProduct"]);// == true ? "Exclude" : "Include";
                    //emb.IsExcludeAircraft = Convert.ToBoolean(dr["IsExcludeAircraft"]);
                    //emb.Text_IsExcludeAircraft = Convert.ToString(dr["Text_IsExcludeAircraft"]);// == true ? "Exclude" : "Include";
                    emb.IsSoftEmbargo = Convert.ToBoolean(dr["IsSoftEmbargo"]);
                    emb.EmbargoType = dr["EmbargoType"].ToString();

                    emb.SHC = dr["SHCSNo"].ToString();
                    emb.Text_SHC = dr["SHC"].ToString().ToUpper() == "" ? dr["SHC"].ToString().ToUpper() : dr["SHC"].ToString().ToUpper().Remove(dr["SHC"].ToString().Length - 1);
                    emb.Commodity = dr["CommoditySNo"].ToString();
                    emb.Text_Commodity = dr["Commodity"].ToString().ToUpper() == "" ? dr["Commodity"].ToString().ToUpper() : dr["Commodity"].ToString().ToUpper().Remove(dr["Commodity"].ToString().Length - 1);
                    emb.Aircraft = dr["AircraftSNo"].ToString();
                    emb.Text_Aircraft = dr["Aircraft"].ToString().ToUpper() == "" ? dr["Aircraft"].ToString().ToUpper() : dr["Aircraft"].ToString().ToUpper().Remove(dr["Aircraft"].ToString().Length - 1);
                    emb.Flight = dr["FlightSNo"].ToString();
                    emb.Text_Flight = dr["Flight"].ToString().ToUpper() == "" ? dr["Flight"].ToString().ToUpper() : dr["Flight"].ToString().ToUpper().Remove(dr["Flight"].ToString().Length - 1);
                    emb.Product = dr["ProductSNo"].ToString();
                    emb.Text_Product = dr["Product"].ToString().ToUpper() == "" ? dr["Product"].ToString().ToUpper() : dr["Product"].ToString().ToUpper().Remove(dr["Product"].ToString().Length - 1);

                    emb.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    emb.Text_AirlineSNo = dr["Airline"].ToString().ToUpper();
                    emb.AccountSNo = dr["AccountSNo"].ToString();
                    emb.Text_AccountSNo = dr["Text_AccountSNo"].ToString().ToUpper();
                    emb.ApplicableOn = Convert.ToInt32(dr["ApplicableOn"]);
                    emb.Text_ApplicableOn = dr["Text_ApplicableOn"].ToString().ToUpper();
                    emb.DaysOfOps = dr["DaysOfOps"].ToString();
                    emb.Text_DaysOfOps = dr["Text_DaysOfOps"].ToString().ToUpper();
                    emb.CreatedBy = dr["CreatedUser"].ToString();
                    emb.UpdatedBy = dr["UpdatedUser"].ToString();
                    emb.ExcludeCommodity = dr["ExcludeCommodity"].ToString();
                    emb.Text_ExcludeCommodity = dr["Text_ExcludeCommodity"].ToString().ToUpper();
                    /**********************************************************/
                    emb.ExcludeSHC = dr["ExcludeSHC"].ToString();
                    emb.Text_ExcludeSHC = dr["Text_ExcludeSHC"].ToString().ToUpper();

                    emb.ExcludeProduct = dr["ExcludeProduct"].ToString();
                    emb.Text_ExcludeProduct = dr["Text_ExcludeProduct"].ToString().ToUpper();

                    emb.ExcludeAircraft = dr["ExcludeAircraft"].ToString();
                    emb.Text_ExcludeAircraft = dr["Text_ExcludeAircraft"].ToString().ToUpper();

                    emb.ExcludeAccountSNo = dr["ExcludeAccountSNo"].ToString();
                    emb.Text_ExcludeAccountSNo = dr["Text_ExcludeAccountSNo"].ToString().ToUpper();

                    emb.ExcludeFlight = dr["ExcludeFlight"].ToString();
                  
                    emb.Text_ExcludeFlight = dr["Text_ExcludeFlight"].ToString().ToUpper();
                    emb.RefNo = dr["RefNo"].ToString().ToUpper();
                    emb.Text_AgentsAirline = dr["Text_AgentsAirline"].ToString().ToUpper(); 
                    emb.AgentsAirline = dr["AgentsAirline"].ToString();
                    /**********************************************************/
                }
                dr.Close();
                return emb;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }

        /// <summary>
        /// Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Embargo>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), 
                                                new SqlParameter("@PageSize", pageSize), 
                                                new SqlParameter("@WhereCondition", filters),                                            
                                                new SqlParameter("@OrderBy", sorts),
                                             new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListEmbargo", Parameters);

                var embargoList = ds.Tables[0].AsEnumerable().Select(e => new Embargo
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Text_ConfigType = e["Text_ConfigType"].ToString().ToUpper(),
                    EmbargoName = e["EmbargoName"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString().ToUpper(),
                    Text_AccountSNo = e["Text_AccountSNo"].ToString().ToUpper(),
                    Text_FreightType = e["Text_FreightType"].ToString().ToUpper(),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    Active = e["Active"].ToString().ToUpper(),
                    Reason = e["Reason"].ToString().ToUpper(),
                    EmbargoType = e["EmbargoType"].ToString(),
                    Text_CreatedBy = e["userCreatedBy"].ToString(),
                    Text_UpdatedBy = e["userUpdatedBy"].ToString(),
                    Text_LimitOn = e["Text_LimitOn"].ToString(),
                    RefNo = e["RefNo"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = embargoList.AsQueryable().ToList(),
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
        /// <param name="Embargo"></param>
        public List<string> SaveEmbargo(List<Embargo> Embargo)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateEmbargo = CollectionHelper.ConvertTo(Embargo, "Active,CreatedOn,UpdatedOn,Text_OriginCountrySNo,Text_DestinationCountrySNo,Text_OriginCitySNo,Text_DestinationCitySNo,Text_DestinationAirportSNo,Text_OriginAirportSNo,Text_Commodity,Text_SHC,Text_Product,Text_Aircraft,Text_Flight,Text_AirlineSNo,Text_AccountSNo,Origin,Destination,EmbargoType,Text_FreightType,Text_IsExcludeCommodity,Text_IsExcludeProduct,Text_IsExcludeSHC,Text_IsExcludeAircraft,Text_IsExcludeFlight,Text_ConfigType,Text_LimitOn,Text_Period,Text_AllowedWeight,Text_ApplicableOn,Text_DaysOfOps,Text_ExcludeCommodity,RefNo,Text_ExcludeSHC,Text_ExcludeProduct,Text_ExcludeAircraft,Text_ExcludeAccountSNo,Text_ExcludeFlight,Text_AgentsAirline,Text_CreatedBy,Text_UpdatedBy");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Embargo", dtCreateEmbargo, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EmbargoTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEmbargo;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateEmbargo", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Embargo");
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
        /// <param name="Embargo"></param>
        public List<string> UpdateEmbargo(List<Embargo> Embargo)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateEmbargo = CollectionHelper.ConvertTo(Embargo, "Active,CreatedOn,UpdatedOn,Text_OriginCountrySNo,Text_DestinationCountrySNo,Text_OriginCitySNo,Text_DestinationCitySNo,Text_DestinationAirportSNo,Text_OriginAirportSNo,Text_Commodity,Text_SHC,Text_Product,Text_Aircraft,Text_Flight,Text_AirlineSNo,Text_AccountSNo,Origin,Destination,EmbargoType,Text_FreightType,Text_IsExcludeCommodity,Text_IsExcludeProduct,Text_IsExcludeSHC,Text_IsExcludeAircraft,Text_IsExcludeFlight,Text_ConfigType,Text_LimitOn,Text_Period,Text_AllowedWeight,Text_ApplicableOn,Text_DaysOfOps,Text_ExcludeCommodity,RefNo,Text_ExcludeSHC,Text_ExcludeProduct,Text_ExcludeAircraft,Text_ExcludeAccountSNo,Text_ExcludeFlight,Text_AgentsAirline,Text_CreatedBy,Text_UpdatedBy");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Embargo", dtCreateEmbargo, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EmbargoTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEmbargo;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateEmbargo", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Embargo");
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
        ///  Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>
        public List<string> DeleteEmbargo(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteEmbargo", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Embargo");
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

        /// <summary>
        ///  Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>
        public int AirportCitySNo(string OriginAirportSNo)
        {
            int ret = 0;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(OriginAirportSNo)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spGetAirportCitySNo", Parameters);
            }
            catch(Exception ex)////(Exception ex)
            {
                throw ex;
            }
            return ret;
        }
    }
}
