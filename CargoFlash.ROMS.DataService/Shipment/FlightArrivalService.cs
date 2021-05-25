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
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;


namespace CargoFlash.Cargo.DataService.Shipment
{
    #region FlightArrival Service Description
    /*
	*****************************************************************************
	Service Name:	FlightArrivalService
	Purpose:		This Service used to get details of FlightArrival save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		20 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FlightArrivalService : IFlightArrivalService
    {
      
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<FlightArrival>(filter);
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightArrival", Parameters);
            //var IrrList = ds.Tables[0].AsEnumerable().Select(e => new FlightArrival
            //{
            //    SNo = Convert.ToInt32(e["SNo"]),
            //    Damage = e["Damage"].ToString().ToUpper(),
            //    DamageType = Convert.ToInt16(e["DamageType"]),
            //    Active = Convert.ToString(e["Active"]),
            //});
            ds.Dispose();
            return new DataSourceResult
            {
              //  Data = IrrList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

    }
}
