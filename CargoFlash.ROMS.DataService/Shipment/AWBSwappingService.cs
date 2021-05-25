using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Text;
using System.ServiceModel.Web;
using Newtonsoft.Json;
using System.Net;


namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBSwappingService : SignatureAuthenticate, IAWBSwappingService
    {
      

         public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<FlightGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightTransfer", Parameters);
                var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightGridData
                {
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    ETDETA = e["ETDETA"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString(),
                    Dest = e["Dest"].ToString(),
                    Atype = e["Atype"].ToString(),
                    Route = e["Route"].ToString(),
                    TCapacity = e["TCapacity"].ToString().ToUpper(),
                    ACapacity = e["ACapacity"].ToString(),
                    UCapacity = e["UCapacity"].ToString(),
                    FStatus = e["FStatus"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = FTList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
      
        public string BindAWBSwap(string AWBNO, string SwapAWBNO)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                       new SqlParameter("@AWBNo", AWBNO),
                                       new SqlParameter("@SwapAWBNo", SwapAWBNO)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBSwapDetail", Parameters);
                ds.Dispose();

                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        public string AWBSwap(string AWBList, string SwapAWBList)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            int ret = 0;
            try
            {
                var dtAWBList = JsonConvert.DeserializeObject<DataTable>(AWBList);
                var dtSwapAWBList = JsonConvert.DeserializeObject<DataTable>(SwapAWBList);


                SqlParameter[] Parameters = { new SqlParameter("@AWBList", dtAWBList), new SqlParameter("@SwapAWBList", dtSwapAWBList) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SwapAWB", Parameters);
               
             
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ret.ToString();
        }


       
        public static string DStoJSON(DataSet ds)
        {
            try
            {
                StringBuilder json = new StringBuilder();
                json.Append("[");
                if (ds != null && ds.Tables.Count > 0)
                {
                    int lInteger = 0;
                    foreach (DataRow dr in ds.Tables[ds.Tables.Count - 1].Rows)
                    {
                        lInteger = lInteger + 1;
                        json.Append("{");
                        int i = 0;
                        int colcount = dr.Table.Columns.Count;
                        foreach (DataColumn dc in dr.Table.Columns)
                        {
                            json.Append("\"");
                            json.Append(dc.ColumnName);
                            json.Append("\":\"");
                            json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                            json.Append("\"");
                            i++;
                            if (i < colcount) json.Append(",");
                        }

                        if (lInteger < ds.Tables[ds.Tables.Count - 1].Rows.Count)
                        {
                            json.Append("},");
                        }
                        else
                        {
                            json.Append("}");
                        }
                    }
                }
                json.Append("]");


                return json.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public static string CompleteDStoJSON(DataSet ds)
        {
            try
            {
                StringBuilder json = new StringBuilder();
                if (ds != null && ds.Tables.Count > 0)
                {
                    json.Append("{");
                    for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
                    {
                        if (tblCount > 0)
                            json.Append(",");
                        json.Append("\"Table" + tblCount.ToString() + "\":");
                        int lInteger = 0;
                        json.Append("[");
                        foreach (DataRow dr in ds.Tables[tblCount].Rows)
                        {
                            lInteger = lInteger + 1;
                            json.Append("{");
                            int i = 0;
                            int colcount = dr.Table.Columns.Count;
                            foreach (DataColumn dc in dr.Table.Columns)
                            {
                                json.Append("\"");
                                json.Append(dc.ColumnName);
                                json.Append("\":\"");
                                json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                                json.Append("\"");
                                i++;
                                if (i < colcount) json.Append(",");
                            }

                            if (lInteger < ds.Tables[tblCount].Rows.Count)
                            {
                                json.Append("},");
                            }
                            else
                            {
                                json.Append("}");
                            }
                        }
                        json.Append("]");
                    }
                    json.Append("}");
                }
                else
                {
                    json.Append("[");
                    json.Append("]");
                }


                return json.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
