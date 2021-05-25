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
using CargoFlash.Cargo.Model.BuildUp;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.BuildUp
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AgentBuildUpService : SignatureAuthenticate,IAgentBuildUpService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AgentBuildUpGrid>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AgentBuildUpGetList", Parameters);
                var data = ds.Tables[0].AsEnumerable().Select(e => new AgentBuildUpGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirlineName = e["AirlineName"].ToString().ToUpper().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    OriginCityCode = e["OriginCityCode"].ToString().ToUpper(),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    UploadFrom = e["UploadFrom"].ToString().ToUpper(),
                    TotalULD = Convert.ToInt32(e["TotalULD"]),
                    TotalShipment = Convert.ToInt32(e["TotalShipment"]),
                    LotNo = e["LotNo"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = data.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveAgentBuildup(List<AgentBuildUp> AgentBuildUpModel, List<AgentBuildUpTrans> LstAgentBuildUpTrans)
        {
           string Result = "";
            try
            {

                DataTable dtAgentBuildUp = CollectionHelper.ConvertTo(AgentBuildUpModel, "LstAgentBuildUpTrans");
                DataTable dtAgentBuildUpTrans = CollectionHelper.ConvertTo(LstAgentBuildUpTrans, "");

                SqlParameter paramAgentBuildUp = new SqlParameter();
                paramAgentBuildUp.ParameterName = "@AgentBuildUp";
                paramAgentBuildUp.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUp.Value = dtAgentBuildUp;

                SqlParameter paramAgentBuildUpTrans = new SqlParameter();
                paramAgentBuildUpTrans.ParameterName = "@AgentBuildUpTrans";
                paramAgentBuildUpTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUpTrans.Value = dtAgentBuildUpTrans;


                SqlParameter[] Parameters = { 
                                            paramAgentBuildUp ,
                                            paramAgentBuildUpTrans
                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAgentBuildUp", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            catch(Exception ex)// (Exception ex)
            {
                //Result = ex.Message;
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";

            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            return Result;
        }

        public string GetAgentBuildUpShipment(int AgentBuildUpSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo", AgentBuildUpSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBuildUpShipment", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string GetAgentBuildUpShipmentforEdit(int AgentBuildUpSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo", AgentBuildUpSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBuildUpShipmentforEdit", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string UpdateAgentBuildup(int AgentBuildUpSNo, List<AgentBuildUpTrans> LstAgentBuildUpTrans)
        {
            string Result = "";
            try
            {
                DataTable dtAgentBuildUpTrans = CollectionHelper.ConvertTo(LstAgentBuildUpTrans, "");

                SqlParameter paramAgentBuildUpTrans = new SqlParameter();
                paramAgentBuildUpTrans.ParameterName = "@AgentBuildUpTrans";
                paramAgentBuildUpTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUpTrans.Value = dtAgentBuildUpTrans;


                SqlParameter[] Parameters = {    
                                             new SqlParameter("@AgentBuildUpSNo", AgentBuildUpSNo),
                                            paramAgentBuildUpTrans,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAgentBuildUp", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            catch(Exception ex)// (Exception ex)
            {
                //Result = ex.Message;
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            return Result;
        }

        public string GetChildULDAgentBuildUpRecord(string AgentBuildUpSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo ", AgentBuildUpSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChildULDAgentBuildUpRecord", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string ValidUldName(string UldName, int AirlineSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UldName ", UldName), new SqlParameter("@AirlineSNo ", AirlineSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetValidULDType", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string AddUldStock(string ULDType, string ULD, string OW, string AirlineSno)
        {
           string Result = "";
            try
            {


                SqlParameter[] Parameters = {    
                                             new SqlParameter("@ULDType", ULDType),   
                                               new SqlParameter("@ULDType", ULD),      
                                                 new SqlParameter("@ULDType", OW),   
                                                 new SqlParameter("@AirlineSno", AirlineSno),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)

                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "AgentBuildupULDStock", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            catch(Exception ex)// (Exception ex)
            {
                //Result = ex.Message;
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            }
            return Result;
        }

        public string GetAgentBUP_AWBDetails(string CheckFor, string AWBNo, int AgentBuildupSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@CheckFor", CheckFor),
                                            new SqlParameter("@AgentBuildupSNo", AgentBuildupSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBUP_AWBDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
