//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.ServiceModel;
//using System.ServiceModel.Activation;
//using System.Configuration;
//using System.Data;
//using System.Data.SqlClient;
//using CargoFlash.Cargo.Model.ULD;
//using CargoFlash.SoftwareFactory.Data;
//using CargoFlash.Cargo.Business;
//using Newtonsoft.Json;
//using System.Text;
//using System.ServiceModel.Web;



//namespace CargoFlash.Cargo.DataService.ULD
//{
//    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
//    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
//    public class ULDTrackingService : IULDTrackingService
//    {

//        public CargoFlash.Cargo.Model.ULD.ULDGridData GetULDTrackingRecord(string recordID)
//        {
//            CargoFlash.Cargo.Model.ULD.ULDGridData ft = new CargoFlash.Cargo.Model.ULD.ULDGridData();
//            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
//            SqlDataReader dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetULDTracking", Parameters);
//            if (dr.Read())
//            {
//                //ft.ULDSNo = Convert.ToInt32(dr["DailyFlightSNo"]);
//                ft.ULDNo = dr["ULDNo"].ToString();
//                ft.FlightNo = dr["FlightNo"].ToString();


//            }
//            dr.Close();
//            return ft;
//        }





//        public KeyValuePair<string, List<ULDGridData>> GetULDSearchRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
//        {
//            ULDGridData FTData = new ULDGridData();
//            SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", "") };
//            DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListFlightSummary1", Parameters);
//            var FTList = ds.Tables[0].AsEnumerable().Select(e => new ULDGridData
//            {
//                DFSNo = e["DailyFlightSNo"].ToString(),
//                FlightNo = e["FlightNo"].ToString().ToUpper(),
//                FlightDate = e["FlightDate"].ToString().ToUpper(),
//                ETD = e["ETD"].ToString().ToUpper(),
//                ETA = e["ETA"].ToString().ToUpper(),
//                Origin = e["Origin"].ToString(),
//                Dest = e["Dest"].ToString(),
//                Atype = e["AType"].ToString(),
//                Route = e["Route"].ToString(),
//                TCapacity = e["TCapacity"].ToString().ToUpper(),
//                ACapacity = e["ACapacity"].ToString(),
//                UCapacity = e["UCapacity"].ToString(),
//                FStatus = e["FStatus"].ToString()

//            });
//            return new KeyValuePair<string, List<FlightGridData>>(ds.Tables[1].Rows[0][0].ToString(), FTList.AsQueryable().ToList());
//        }

//        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
//        {

//            string sorts = GridSort.ProcessSorting(sort);
//            string filters = GridFilter.ProcessFilters<FlightGridData>(filter);
//            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
//            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightTransfer", Parameters);
//            var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightGridData
//            {
//                FlightSNo = Convert.ToInt32(e["DailyFlightSNo"].ToString()),
//                FlightNo = e["FlightNo"].ToString().ToUpper(),
//                FlightDate = e["FlightDate"].ToString().ToUpper(),
//                ETA = e["ETA"].ToString().ToUpper(),
//                ETD = e["ETD"].ToString().ToUpper(),
//                Origin = e["Origin"].ToString(),
//                Dest = e["Dest"].ToString(),
//                Atype = e["AType"].ToString(),
//                Route = e["Route"].ToString(),
//                TCapacity = e["TCapacity"].ToString().ToUpper(),
//                ACapacity = e["ACapacity"].ToString(),
//                UCapacity = e["UCapacity"].ToString(),
//                FStatus = e["FStatus"].ToString()

//            });
//            ds.Dispose();
//            return new DataSourceResult
//            {
//                Data = FTList.AsQueryable().ToList(),
//                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
//            };

//        }



//        public string GetULD(string ULDNo, string StartDate, string EndDate)
//        {
//            SqlParameter[] Parameters = { 
//                new SqlParameter("@ULDNo", ULDNo),
//               new SqlParameter("@StartDate", StartDate),new SqlParameter("@EndDate", EndDate)                         };


//            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDTracking", Parameters);

//            return ds.Tables[0].Rows[0][0].ToString();
//        }


//    }
//}
