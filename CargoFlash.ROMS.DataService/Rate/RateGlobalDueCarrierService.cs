using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Tariff
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateGlobalDueCarrierService : SignatureAuthenticate, IRateGlobalDueCarrierService
    {
        /// <summary>
        /// Get the list of records to be shown n the database
        /// </summary>
        /// <param name="skip">no. of records to be Skipped</param>
        /// <param name="take">no. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">size of the page i.e. No of record to be displayed at once</param>
        /// <param name="sort">column no according to which records are to be Ordered</param>
        /// <param name="filter">values/parameter according to which record are to be Filtered</param>
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateGlobalDueCarrier>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateGlobalDueCarrier", Parameters);
                var RateGlobalDueCarrierList = ds.Tables[0].AsEnumerable().Select(e => new RateGlobalDueCarrier
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Airline = Convert.ToString(e["Airline"]),
                    OriginAirPort = Convert.ToString(e["OriginAirPort"]),
                    DestinationAirPort = Convert.ToString(e["DestinationAirport"]),
                    OriginCountry = Convert.ToString(e["OriginCountry"]),
                    DestinationCountry = Convert.ToString(e["DestinationCountry"]),
                    OriginIATA = Convert.ToString(e["OriginIATA"]),
                    DestinationIATA = Convert.ToString(e["DestinationIATA"]),
                    Active = Convert.ToString(e["Active"]),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateGlobalDueCarrierList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public RateGlobalDueCarrier GetRateGlobalDueCarrierRecord(int recordID, string UserID)
        {
            try
            {
                RateGlobalDueCarrier ExRate = new RateGlobalDueCarrier();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateGlobalDueCarrier", Parameters);
                if (dr.Read())
                {
                    ExRate.SNo = Convert.ToInt32(dr["SNo"]);

                    ExRate.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    ExRate.Text_AirlineSNo = Convert.ToString(dr["Airline"]);
                    ExRate.Airline = Convert.ToString(dr["Airline"]);

                    ExRate.OriginIATASNo = Convert.ToInt32(dr["OriginIATASNo"]);
                    ExRate.Text_OriginIATASNo = Convert.ToString(dr["OriginIATA"]);
                    ExRate.OriginIATA = Convert.ToString(dr["OriginIATA"]);

                    ExRate.DestinationIATASNo = Convert.ToInt32(dr["DestinationIATASNo"]);
                    ExRate.Text_DestinationIATASNo = Convert.ToString(dr["DestinationIATA"]);
                    ExRate.DestinationIATA = Convert.ToString(dr["DestinationIATA"]);


                    ExRate.OriginCountrySNo = Convert.ToInt32(dr["OriginCountrySNo"]);
                    ExRate.Text_OriginCountrySNo = Convert.ToString(dr["OriginCountry"]);
                    ExRate.OriginCountry = Convert.ToString(dr["OriginCountry"]);

                    ExRate.DestinationCountrySNo = Convert.ToInt32(dr["DestinationCountrySNo"]);
                    ExRate.Text_DestinationCountrySNo = Convert.ToString(dr["DestinationCountry"]);
                    ExRate.DestinationCountry = Convert.ToString(dr["DestinationCountry"]);


                    ExRate.OriginAirportSNo = Convert.ToInt32(dr["OriginAirportSNo"]);
                    ExRate.Text_OriginAirportSNo = Convert.ToString(dr["OriginAirport"]);
                    ExRate.OriginAirPort = Convert.ToString(dr["OriginAirport"]);

                    ExRate.DestinationAirportSNo = Convert.ToInt32(dr["DestinationAirportSNo"]);
                    ExRate.Text_DestinationAirportSNo = Convert.ToString(dr["DestinationAirport"]);
                    ExRate.DestinationAirPort = Convert.ToString(dr["DestinationAirport"]);

                    ExRate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    ExRate.Active = dr["Active"].ToString();
                    ExRate.UpdatedBy = dr["UpdatedUser"].ToString();
                    ExRate.CreatedBy = dr["CreatedUser"].ToString();
                }

                dr.Close();
                return ExRate;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        /// <summary>
        /// Save the entity into the database
        /// </summary>
        /// <param name="RateGlobalDueCarrier"></param>
        public List<string> SaveRateGlobalDueCarrier(List<RateGlobalDueCarrier> RateGlobalDueCarrier)
        {
            try
            {

                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateRateGlobalDueCarrier = CollectionHelper.ConvertTo(RateGlobalDueCarrier, "Text_AirlineSNo,Text_OriginIATASNo,Airline,OriginIATA,Text_OriginCountrySNo,OriginCountry,Text_DestinationIATASNo,Text_OriginAirportSNo,OriginAirPort,DestinationIATA,Text_DestinationCountrySNo,DestinationCountry,Text_DestinationAirportSNo,DestinationAirPort,Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateGlobalDueCarrier", dtCreateRateGlobalDueCarrier, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateExchangeDueCarrierType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateRateGlobalDueCarrier;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateGlobalDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateGlobalDueCarrier");
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
        /// <param name="RateGlobalDueCarrier"></param>

        public List<string> UpdateRateGlobalDueCarrier(List<RateGlobalDueCarrier> RateGlobalDueCarrier)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateRateGlobalDueCarrier = CollectionHelper.ConvertTo(RateGlobalDueCarrier, "Text_AirlineSNo,Text_OriginIATASNo,Airline,OriginIATA,Text_OriginCountrySNo,OriginCountry,Text_OriginAirportSNo,OriginAirPort,DestinationIATA,Text_DestinationCountrySNo,DestinationCountry,Text_DestinationAirportSNo,Text_DestinationIATASNo,DestinationAirPort,Active");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("RateGlobalDueCarrier", dtCreateRateGlobalDueCarrier, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@RateGlobalDueCarrierType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateRateGlobalDueCarrier;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateGlobalDueCarrier", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateGlobalDueCarrier");
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
        /// Delete a particular touple(row) from the database
        /// </summary>
        /// <param name="RecordID"></param>

        public List<string> DeleteRateGlobalDueCarrier(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateGlobalDueCarrier", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateGlobalDueCarrier");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
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



    }
}
