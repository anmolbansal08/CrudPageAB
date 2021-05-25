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
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Stock;
using System.Net;

namespace CargoFlash.Cargo.DataService.AWBStockStatus
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBStockStatusService : SignatureAuthenticate, IAWBStockStatusService
    {

        //public KeyValuePair<string, List<CargoFlash.Cargo.Model.Stock.AWBStockStatus>> GetGridData(string recordID, int page, int pageSize, string whereCondition, string sort)
        //{
        //    CargoFlash.Cargo.Model.Stock.AWBStockStatus CustomerAddress = new CargoFlash.Cargo.Model.Stock.AWBStockStatus();

        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 10), 
        //    new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", "") };


        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_AwbStockStatus_GetAirlineRecord", Parameters);
        //    var AWBStockStatusList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
        //    {
        //        OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
        //        Name = e["Name"].ToString().ToUpper(),
        //        TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
        //        StockUnused = Convert.ToInt32(e["StockUnused"]),
        //        StockIssuedToOffice = Convert.ToInt32(e["StockIssuedToOffice"])
        //    });

        //    ds.Dispose();
        //    return new KeyValuePair<string, List<CargoFlash.Cargo.Model.Stock.AWBStockStatus>>(ds.Tables[1].Rows[0][0].ToString(), AWBStockStatusList.AsQueryable().ToList());
        //}



        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {


                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_AwbStockStatus_GetAirlineRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                {
                    OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                    Name = e["Name"].ToString().ToUpper(),
                    TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                    StockUnused = Convert.ToInt32(e["StockUnused"]),
                    StockIssuedToOffice = Convert.ToInt32(e["StockIssuedToOffice"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }





        public DataSourceResult GetOfficeData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Stock.AWBStockStatus>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_AwbStockStatus_GetOfficeRecord", Parameters);

                var CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Stock.AWBStockStatus
                {
                    CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                    Name = e["Name"].ToString().ToUpper(),
                    TotalStockIssued = Convert.ToInt32(e["TotalStockIssued"]),
                    StockUnused = Convert.ToInt32(e["StockUnused"]),
                    StockIssuedToOffice = Convert.ToInt32(e["StockIssuedToOffice"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CommodityList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
    }
}