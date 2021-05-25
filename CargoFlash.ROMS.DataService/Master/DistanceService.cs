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
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DistanceService : SignatureAuthenticate, IDistanceService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<DistanceGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDistance", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new DistanceGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    RefNo = Convert.ToString(e["RefNo"]),
                    OriginAirportSNo = Convert.ToString(e["OriginAirportSNo"]),
                    DestinationAirportSNo = Convert.ToString(e["DestinationAirportSNo"]),
                    TDistance = Convert.ToInt32(e["TDistance"]),


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = "GetListDistance"
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }


        public Distance GetDistanceRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            {
                Distance distance = new Distance();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDistance", Parameters);
                if (dr.Read())
                {
                    distance.SNo = Convert.ToInt32(dr["SNo"]);
                    distance.RefNo = Convert.ToString(dr["RefNo"]);
                    distance.OriginAirportSNo = Convert.ToInt32(dr["OriginAirportSNo"]);
                    distance.DestinationAirportSNo = Convert.ToInt32(dr["DestinationAirportSNo"]);
                    distance.Text_OriginAirportSNo = dr["Text_OriginAirportSNo"].ToString();
                    distance.Text_DestinationAirportSNo = dr["Text_DestinationAirportSNo"].ToString();
                    distance.TDistance = Convert.ToInt32(dr["Distance"]);

                    //route.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //route.Active = dr["Active"].ToString();
                    //route.Leg = dr["Leg"].ToString();
                    //route.Text_Leg = dr["Map"].ToString();
                    //route.CreatedUser = dr["CreatedUser"].ToString();
                    //route.UpdatedUser = dr["UpdatedUser"].ToString();



                }
                dr.Close();
                return distance;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }


        public List<string> SaveDistance(List<Distance> Distance)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateDistance = CollectionHelper.ConvertTo(Distance, "Text_OriginAirportSNo,RefNo,Text_DestinationAirportSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Distance", dtCreateDistance, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DistanceTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateDistance;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDistance", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Distance");
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

        public List<string> UpdateDistance(List<Distance> Distance)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateDistance = CollectionHelper.ConvertTo(Distance, "Text_OriginAirportSNo,RefNo,Text_DestinationAirportSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Distance", dtCreateDistance, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DistanceTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateDistance;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDistance", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Distance");
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

        public List<string> DeleteDistance(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDistance", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Distance");
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

    }
}
