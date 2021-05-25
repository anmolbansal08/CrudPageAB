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
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Report
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CargoRankingEIService : SignatureAuthenticate, ICargoRankingEIService
    {
        public KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            string FDt = whereCondition.Split('*')[0];
            string TDt = whereCondition.Split('*')[1];
            string Ctype = whereCondition.Split('*')[2];
            string Filter = whereCondition.Split('*')[3];

            whereCondition = "";

            
            CargoRankingEI CargoRankingEI = new CargoRankingEI();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt)) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@CargoType",Ctype),
                                              new SqlParameter("@Filter",Filter)

                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommodityCargoRanking", Parameters);
            var CargoRankingEIList = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
            {

                CommodityCode = Convert.ToString(e["CommodityCode"].ToString()),
                CommodityDescription = Convert.ToString(e["CommodityDescription"].ToString()),
                Export = Convert.ToString(e["Export"].ToString()),
                ERank = Convert.ToString(e["ERank"].ToString()),
                Import = Convert.ToString(e["Import"].ToString()),
                IRank = Convert.ToString(e["IRank"].ToString()),
                Transit = Convert.ToString(e["Transit"].ToString()),
                RRank = Convert.ToString(e["RRank"].ToString()),
                Total = Convert.ToString(e["Total"].ToString()),
                Rank = Convert.ToString(e["TRank"].ToString()),
                Dt = Convert.ToString(e["Dt"].ToString())
            });
            return new KeyValuePair<string, List<CargoRankingEI>>(ds.Tables[1].Rows[0][0].ToString(), CargoRankingEIList.AsQueryable().ToList());
        }


        public List<CargoRankingEI> SearchData(CargoRankingEI obj)
        {
            try
            {
                List<CargoRankingEI> lst = new List<CargoRankingEI>();
         

                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",obj.CargoType),
                                               new SqlParameter("@Filter",obj.Filter)
                                            };



                string procname = "GetCommodityCargoRanking";
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
                    {

                        CommodityCode = Convert.ToString(e["CommodityCode"].ToString()),
                        CommodityDescription = Convert.ToString(e["CommodityDescription"].ToString()),
                        Export = Convert.ToString(e["Export"].ToString()),
                        ERank = Convert.ToString(e["ERank"].ToString()),
                        Import = Convert.ToString(e["Import"].ToString()),
                        IRank = Convert.ToString(e["IRank"].ToString()),
                        Transit = Convert.ToString(e["Transit"].ToString()),
                        RRank = Convert.ToString(e["RRank"].ToString()),
                        Total = Convert.ToString(e["Total"].ToString()),
                        Rank = Convert.ToString(e["TRank"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }

        public List<CargoRankingEI> SearchDataAirline(CargoRankingEI obj)
        {
            try
            {
                List<CargoRankingEI> lst = new List<CargoRankingEI>();
       

                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",obj.CargoType),
                                               new SqlParameter("@Filter",obj.Filter)
                                            };



                string procname = "GetAirlineCargoRanking";
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
                    {

                        AirlineCode = Convert.ToString(e["AirlineCode"].ToString()),
                        AirlineName = Convert.ToString(e["AirlineName"].ToString()),
                        Export = Convert.ToString(e["Export"].ToString()),
                        ERank = Convert.ToString(e["ERank"].ToString()),
                        Import = Convert.ToString(e["Import"].ToString()),
                        IRank = Convert.ToString(e["IRank"].ToString()),
                        Transit = Convert.ToString(e["Transit"].ToString()),
                        RRank = Convert.ToString(e["RRank"].ToString()),
                        Total = Convert.ToString(e["Total"].ToString()),
                        Rank = Convert.ToString(e["TRank"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingAirlineRecord(int recordID, int page, int pageSize, string whereCondition, string sort)
        {
            string FDt = whereCondition.Split('*')[0];
            string TDt = whereCondition.Split('*')[1];
            string Ctype = whereCondition.Split('*')[2];
            string Filter = whereCondition.Split('*')[3];

            whereCondition = "";
           
            CargoRankingEI CargoRankingEI = new CargoRankingEI();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt))  ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",Ctype),
                                               new SqlParameter("@Filter",Filter)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineCargoRanking", Parameters);
            var CargoRankingEIList = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
            {

                AirlineCode = Convert.ToString(e["AirlineCode"].ToString()),
                AirlineName = Convert.ToString(e["AirlineName"].ToString()),
                Export = Convert.ToString(e["Export"].ToString()),
                ERank = Convert.ToString(e["ERank"].ToString()),
                Import = Convert.ToString(e["Import"].ToString()),
                IRank = Convert.ToString(e["IRank"].ToString()),
                Transit = Convert.ToString(e["Transit"].ToString()),
                RRank = Convert.ToString(e["RRank"].ToString()),
                Total = Convert.ToString(e["Total"].ToString()),
                Rank = Convert.ToString(e["TRank"].ToString()),
                Dt = Convert.ToString(e["Dt"].ToString())

            });
            return new KeyValuePair<string, List<CargoRankingEI>>(ds.Tables[1].Rows[0][0].ToString(), CargoRankingEIList.AsQueryable().ToList());
        }

        public List<CargoRankingEI> SearchDataAgent(CargoRankingEI obj)
        {
            try
            {
                List<CargoRankingEI> lst = new List<CargoRankingEI>();
            

                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",obj.CargoType),
                                               new SqlParameter("@Filter",obj.Filter)
                                            };



                string procname = "GetAgentCargoRanking";
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
                    {

                        AgentCode = Convert.ToString(e["AgentCode"].ToString()),
                        Agent = Convert.ToString(e["Agent"].ToString()),
                        Export = Convert.ToString(e["Export"].ToString()),
                        ERank = Convert.ToString(e["ERank"].ToString()),
                        Import = Convert.ToString(e["Import"].ToString()),
                        IRank = Convert.ToString(e["IRank"].ToString()),
                        Transit = Convert.ToString(e["Transit"].ToString()),
                        RRank = Convert.ToString(e["RRank"].ToString()),
                        Total = Convert.ToString(e["Total"].ToString()),
                        Rank = Convert.ToString(e["TRank"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingAgentRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            string FDt = whereCondition.Split('*')[0];
            string TDt = whereCondition.Split('*')[1];
            string Ctype = whereCondition.Split('*')[2];
            string Filter = whereCondition.Split('*')[3];

            whereCondition = "";
    
            CargoRankingEI CargoRankingEI = new CargoRankingEI();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt))  ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",Ctype),
                                               new SqlParameter("@Filter",Filter)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentCargoRanking", Parameters);
            var CargoRankingEIList = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
            {

                AgentCode = Convert.ToString(e["AgentCode"].ToString()),
                Agent = Convert.ToString(e["Agent"].ToString()),
                Export = Convert.ToString(e["Export"].ToString()),
                ERank = Convert.ToString(e["ERank"].ToString()),
                Import = Convert.ToString(e["Import"].ToString()),
                IRank = Convert.ToString(e["IRank"].ToString()),
                Transit = Convert.ToString(e["Transit"].ToString()),
                RRank = Convert.ToString(e["RRank"].ToString()),
                Total = Convert.ToString(e["Total"].ToString()),
                Rank = Convert.ToString(e["TRank"].ToString()),
                Dt = Convert.ToString(e["Dt"].ToString())

            });
            return new KeyValuePair<string, List<CargoRankingEI>>(ds.Tables[1].Rows[0][0].ToString(), CargoRankingEIList.AsQueryable().ToList());
        }


        public List<CargoRankingEI> SearchDataDestination(CargoRankingEI obj)
        {
            try
            {
                List<CargoRankingEI> lst = new List<CargoRankingEI>();
            

                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CargoType",obj.CargoType),
                                              new SqlParameter("@Filter",obj.Filter)
                                            };



                string procname = "GetDestinationCargoRanking";
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
                    {

                        DestinationCode = Convert.ToString(e["DestinationCode"].ToString()),
                        Destination = Convert.ToString(e["Destination"].ToString()),
                        Export = Convert.ToString(e["Export"].ToString()),
                        ERank = Convert.ToString(e["ERank"].ToString()),
                        Import = Convert.ToString(e["Import"].ToString()),
                        IRank = Convert.ToString(e["IRank"].ToString()),
                        Transit = Convert.ToString(e["Transit"].ToString()),
                        RRank = Convert.ToString(e["RRank"].ToString()),
                        Total = Convert.ToString(e["Total"].ToString()),
                        Rank = Convert.ToString(e["TRank"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }


        public KeyValuePair<string, List<CargoRankingEI>> GetCargoRankingDestinationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            string FDt = whereCondition.Split('*')[0];
            string TDt = whereCondition.Split('*')[1];
            string Ctype = whereCondition.Split('*')[2];
            string Filter = whereCondition.Split('*')[3];

            whereCondition = "";
     
            CargoRankingEI CargoRankingEI = new CargoRankingEI();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt))         ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@CargoType",Ctype),
                                               new SqlParameter("@Filter",Filter)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDestinationCargoRanking", Parameters);
            var CargoRankingEIList = ds.Tables[0].AsEnumerable().Select(e => new CargoRankingEI
            {

                DestinationCode = Convert.ToString(e["DestinationCode"].ToString()),
                Destination = Convert.ToString(e["Destination"].ToString()),
                Export = Convert.ToString(e["Export"].ToString()),
                ERank = Convert.ToString(e["ERank"].ToString()),
                Import = Convert.ToString(e["Import"].ToString()),
                IRank = Convert.ToString(e["IRank"].ToString()),
                Transit = Convert.ToString(e["Transit"].ToString()),
                RRank = Convert.ToString(e["RRank"].ToString()),
                Total = Convert.ToString(e["Total"].ToString()),
                Rank = Convert.ToString(e["TRank"].ToString()),
                Dt = Convert.ToString(e["Dt"].ToString())
            });
            return new KeyValuePair<string, List<CargoRankingEI>>(ds.Tables[1].Rows[0][0].ToString(), CargoRankingEIList.AsQueryable().ToList());
        }



    }
}
