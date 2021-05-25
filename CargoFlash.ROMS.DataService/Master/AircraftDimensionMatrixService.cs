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
    #region AircraftDimensionMatrix Service Description
    /*
	*****************************************************************************
	Service Name:	    AircraftDimensionMatrixService      
	Purpose:		    This Service used to get details of AircraftDimensionMatrix save update and delete
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Laxmikanta Pradhan
	Created On:		    3rd Jan 2017
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AircraftDimensionMatrixService : SignatureAuthenticate, IAircraftDimensionMatrixService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);

                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                string filters = GridFilter.ProcessFilters<AircraftDimensionMatrixGridData>(filter);
                AircraftDimensionMatrix AircraftDimensionMatrix = new AircraftDimensionMatrix();

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAircraftDimensionMatrix", Parameters);
                //DateTime? d = null;
                var AircraftDimension = ds.Tables[0].AsEnumerable().Select(e => new AircraftDimensionMatrixGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Aircraft = e["Aircraft"].ToString(),
                    HoldType = e["HoldType"].ToString(),
                    Unit = e["Unit"].ToString(),
                    Rows = Convert.ToInt32(e["Rows"].ToString()),
                    Columns = Convert.ToInt32(e["Columns"].ToString()),
                    //Active = e["Unit"].ToString(),
                    CreatedBy = e["CreatedBy"].ToString(),
                    UpdatedBy = e["UpdatedBy"].ToString(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AircraftDimension.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    //FilterCondition = filters,
                    //SortCondition = sorts,
                    //StoredProcedure = "GetRecordAircraftDimensionMatrix"
                };
            }
            catch(Exception ex)//(Exception ex)
            {

                throw ex;
            }

        }

        
        public string SaveAircraftDimensionMatrix(List<AircraftDimensionMatrix> AircraftDimensionMatrix, List<AircraftMatrixTransVal> AircraftMatrixTransVal, List<AircraftMatrixTrans> AircraftMatrixTrans)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
          // **************** Code on 10 jan 2017 *********************************
            //string Result = "";
            int ret=0;
            //try
            //{
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                DataTable dtaircraftmatrix = CollectionHelper.ConvertTo(AircraftDimensionMatrix, "AircraftMatrixTransVal");
                DataTable dtaircraftmatrixtrans = CollectionHelper.ConvertTo(AircraftMatrixTransVal, "AircraftMatrixTrans");
                DataTable dtaircrafttrans = CollectionHelper.ConvertTo(AircraftMatrixTrans, "");

                SqlParameter paramaircraftmatrix = new SqlParameter();
                paramaircraftmatrix.ParameterName = "@AircraftDimensionMatrixTable";
                paramaircraftmatrix.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftmatrix.Value = dtaircraftmatrix;

                SqlParameter paramaircraftmatrixTrans = new SqlParameter();
                paramaircraftmatrixTrans.ParameterName = "@AircraftDimensionMatrixTrans";
                paramaircraftmatrixTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftmatrixTrans.Value = dtaircraftmatrixtrans;

                SqlParameter paramaircraftTrans = new SqlParameter();
                paramaircraftTrans.ParameterName = "@AircraftMatrixTrans";
                paramaircraftTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftTrans.Value = dtaircraftmatrixtrans;

                if (!baseBusiness.ValidateBaseBusiness("AircraftDimensionMatrix", dtaircrafttrans, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return Convert.ToString(ErrorMessage); ;
                }

                SqlParameter[] Parameters = { 
                                            paramaircraftmatrix ,
                                            paramaircraftmatrixTrans,
                                            paramaircraftTrans
                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAirCraftDimensionMatrix", Parameters);
                ret = Convert.ToInt32(dsResult.Tables[0].Rows[0][0].ToString());
                //if (ret > 0)
                //{
                //    if (dsResult.Tables[0].Rows[0][0].ToString() == "22")
                //    {
                //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, "AircraftDimensionMatrix");
                //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                //            ErrorMessage.Add(dataBaseExceptionMessage);
                //    }

                //    //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
                //}
                dsResult.Dispose();
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
                //}
                //catch(Exception ex)// (Exception ex)
                //{
                //    Result = ex.Message;
                //    //Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
                //}
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            catch(Exception ex)//(Exception ex)
            {
               throw ex;
            }
            //return Convert.ToString(ErrorMessage);
        // ********************* End Of 10 jan 2017 *********************
        }


        //public AircraftMatrixRead GetRecordAircraftDimensionMatrix(string recordID, string UserSNo)
        public string GetAircraftDimensionMatrixRecord(string RecordID, string UserSNo)
        {
            
            AircraftMatrixRead AircraftMatrixRead = new AircraftMatrixRead();
            DataSet dsRead = new DataSet();
            SqlDataReader dr = null;
            string Result = "";
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dsRead = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ReadAircraftDimensionMatrix", Parameters);
                //if (dsRead != null)
                //{
                    //var basicdata = dsRead.Tables[0];
                    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsRead);



                    //if(dsRead.Tables[0].Rows.Count > 0)
                    //{
                    //    AircraftMatrixRead.Aircraft = dsRead.Tables[0].Rows[0][1].ToString();
                    //    AircraftMatrixRead.HoldType = dsRead.Tables[0].Rows[0][2].ToString();
                    //    AircraftMatrixRead.Unit = dsRead.Tables[0].Rows[0][3].ToString();
                    //    AircraftMatrixRead.Rows = Convert.ToInt32(dsRead.Tables[0].Rows[0][4].ToString());
                    //    AircraftMatrixRead.Cols = Convert.ToInt32(dsRead.Tables[0].Rows[0][5].ToString());
                    //    AircraftMatrixRead.CreatedBy = dsRead.Tables[0].Rows[0][6].ToString();
                    //    AircraftMatrixRead.UpdatedBy = dsRead.Tables[0].Rows[0][7].ToString();
                    //    AircraftMatrixRead.CreatedOn = Convert.ToDateTime(dsRead.Tables[0].Rows[0][8].ToString());
                    //    AircraftMatrixRead.UpdatedOn = Convert.ToDateTime(dsRead.Tables[0].Rows[0][9].ToString());
                    //}


                    //var data = dsRead.Tables[1];


                        //.AsEnumerable().Select(e => new AircraftMatrixRead
                    //{
                        //SNo = Convert.ToInt32(e["SNo"]),
                        //AirlineName = e["AirlineName"].ToString().ToUpper().ToUpper(),
                        //FlightNo = e["FlightNo"].ToString().ToUpper(),
                        //FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                        //AgentName = e["AgentName"].ToString().ToUpper(),
                        //OriginCityCode = e["OriginCityCode"].ToString().ToUpper(),
                        //CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                        //CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                        //UploadFrom = e["UploadFrom"].ToString().ToUpper(),
                        //TotalULD = Convert.ToInt32(e["TotalULD"]),
                        //TotalShipment = Convert.ToInt32(e["TotalShipment"]),
                    //});
            //    }

                
            }
            //catch(Exception ex)// (Exception ex)
            //{
            //    Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            //}
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
                throw ex;
            }
            //return AircraftMatrixRead;
            return Result;
        }

        public string UpdateAircraftDimensionMatrix(List<AircraftDimensionMatrix> AircraftDimensionMatrix, List<AircraftMatrixTransVal> AircraftMatrixTransVal, List<AircraftMatrixTrans> AircraftMatrixTrans)
        {
            //List<string> ErrorMessage = new List<string>();
            string Result = "";
            int ret = 0;
            //try
            //{
                //BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                DataTable dtaircraftmatrix = CollectionHelper.ConvertTo(AircraftDimensionMatrix, "AircraftMatrixTransVal");
                DataTable dtaircraftmatrixtrans = CollectionHelper.ConvertTo(AircraftMatrixTransVal, "AircraftMatrixTrans");
                DataTable dtaircrafttrans = CollectionHelper.ConvertTo(AircraftMatrixTrans, "");

                SqlParameter paramaircraftmatrix = new SqlParameter();
                paramaircraftmatrix.ParameterName = "@AircraftDimensionMatrixTable";
                paramaircraftmatrix.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftmatrix.Value = dtaircraftmatrix;

                SqlParameter paramaircraftmatrixTrans = new SqlParameter();
                paramaircraftmatrixTrans.ParameterName = "@AircraftDimensionMatrixTrans";
                paramaircraftmatrixTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftmatrixTrans.Value = dtaircraftmatrixtrans;

                SqlParameter paramaircraftTrans = new SqlParameter();
                paramaircraftTrans.ParameterName = "@AircraftMatrixTrans";
                paramaircraftTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramaircraftTrans.Value = dtaircrafttrans;

                //SqlParameter paramFilter = new SqlParameter();
                //paramFilter.ParameterName = "@Sno";
                ////paramFilter.SqlDbType = System.Data.SqlDbType.Structured;
                //paramFilter.Value = AircraftSNo;

                SqlParameter[] Parameters = { 
                                            paramaircraftmatrix ,
                                            paramaircraftmatrixTrans,
                                            paramaircraftTrans
                                            //paramFilter
                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAirCraftDimensionMatrix", Parameters);
                //ret = Convert.ToInt32(dsResult.Tables[0].Rows[0][0].ToString());
                //if (ret > 0)
                //{
                //    if (dsResult.Tables[0].Rows[0][0].ToString() == "22")
                //    {
                //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, "AircraftDimensionMatrix");
                //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                //            ErrorMessage.Add(dataBaseExceptionMessage);
                //    }
                //    //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
                //}
                dsResult.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            //}
            //catch(Exception ex)//(Exception ex) (Exception ex)
            //{
            //    //Result = ex.Message;
            //    Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            //}
            //return Result;
        }


        public List<string> DeleteAircraftDimension(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@AircraftRcID", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAircraftDimension", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirCraft");
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
                return ErrorMessage;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //#endregion

    }
}
