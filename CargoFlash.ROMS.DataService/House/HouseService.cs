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
using CargoFlash.Cargo.Model.House;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
//using System.Web.Script.Serialization;
using KLAS.Business.EDI;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;

namespace CargoFlash.Cargo.DataService.House
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HouseService : BaseWebUISecureObject, IHouseService
    {
        public HouseService()
            : base()
        {
        }

        //public HouseService(bool authenticationCheck)
        //    : base(authenticationCheck)
        //{
        //}


        public DataSourceResult GetWMSHouseGridData(string OriginCity, String DestinationCity, String FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string HAWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            //FFMManagement ffm = new FFMManagement();
            //EDICommon edicom=new EDICommon();
            //DataTable dtedimessage = new DataTable();
            //string flightno = "";
           
            //ffm.GenerateFlightManifest(DateTime.Parse("2015-08-29"), "AI-0233", "5");           

            //  var ediFile = new EDIFileTransmitter();
            //  for (int i = 0; i < ffm.FFMTable.Rows.Count; i++)
            //  {
                  
            //    ediFile.ManuallyRead(ffm.FFMTable.Rows[i]["XMLFile"].ToString());
           
            //      edicom.SendMailonSitaAndEmailAddress("", ffm.FFMTable.Rows[i]["XMLFile"].ToString(), "nGen - System Generated Message", "hmishra@cargoflash.com", "");
                 
            //  }
            //  FWBManagement fwb = new FWBManagement();
            //  fwb.MakeFwbFile("7", string.Empty, "AI-0233", DateTime.Parse("2015-08-29"), string.Empty);

              //if (fwb.FwbMessageTable != null)
              //{
              //    dtedimessage.Merge(fwb.FwbMessageTable);
              //}

              //FSUManagement fsu = new FSUManagement();
              
              //fsu.GenerateFsuMessage(string.Empty, string.Empty, "AI-0233", String.Empty, DateTime.Parse("2015-08-29"),"6","DEL");
              //if (fsu.FsuMessageTable != null)
              //    dtedimessage.Merge(fsu.FsuMessageTable);
           //   FHLManagement fhl = new FHLManagement();
            //  fhl.GenerateHouseAwb(string.Empty, "AI-0233", DateTime.Parse("2015-08-29"), string.Empty, "3");

              //if (fhl.FhlTable != null)
              //    dtedimessage.Merge(fhl.FhlTable);
              //if (dtedimessage.Rows.Count > 0)
              //{

              //    for (int j = 0; j < dtedimessage.Rows.Count; j++)
              //    {
                       
              //      var ediFilefsu = new EDIFileTransmitter();
              //      ediFilefsu.ManuallyRead(dtedimessage.Rows[j]["XMLFile"].ToString());                         
                      
              //    }

              //}

            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            if (filter == null)
            {
                filter = new GridFilter();
                filter.Logic = "AND";
                filter.Filters = new List<GridFilter>();
            }
            DataSet ds = new DataSet();

            ProcName = "GetListHouseBookingParam";

            string filters = GridFilter.ProcessFilters<HouseGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), /*new SqlParameter("@FlightNo", FlightNo), */new SqlParameter("@HAWBDate", FlightDate), new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@HAWBNo", FlightNo), new SqlParameter("@LoggedInCity", LoggedInCity) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var houseBookingList = ds.Tables[0].AsEnumerable().Select(e => new HouseGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                HAWBNo = e["HAWBNo"].ToString().ToUpper(),
                AWBNo = e["AWBNo"].ToString(),
                //HAWBDate = e["HAWBDate"].ToString() == "" ? "" : Convert.ToDateTime(e["HAWBDate"].ToString()).ToString(DateFormat.DateFormatString),
                HAWBDate = e["HAWBDate"].ToString(),
                OriginCity = e["OriginCity"].ToString().ToUpper(),
                DestinationCity = e["DestinationCity"].ToString().ToUpper(),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString() == "" ? "0" : e["VolumeWeight"].ToString()),
                ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"].ToString() == "" ? "0" : e["ChargeableWeight"].ToString()),
                Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                CommodityCode = e["CommodityCode"].ToString(),
                AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
            });
            //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
            ds.Dispose();
            return new DataSourceResult
            {
                Data = houseBookingList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

           
        }


        public DataSourceResult GetHousehipppingBillGridData(string HAWBSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            if (filter == null)
            {
                filter = new GridFilter();
                filter.Logic = "AND";
                filter.Filters = new List<GridFilter>();
            }
            DataSet ds = new DataSet();

            ProcName = "GetListHouseShippingBill";

            string filters = GridFilter.ProcessFilters<HouseShippingBillGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@HAWBSNo", HAWBSNo) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new HouseShippingBillGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ShippingBillNo = Convert.ToInt32(e["ShippingBillNo"]),
                AWBNo = e["AWBNo"].ToString(),
                MessageType = e["MessageType"].ToString(),
                AWBType = e["AWBType"].ToString(),
                LEONo = e["LEONo"].ToString()
            });
            //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
            ds.Dispose();
            return new DataSourceResult
            {
                Data = wmsBookingList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
           // FFMManagement fm = new FFMManagement();
            //fm.GenerateFlightManifest(DateTime.Parse("2015-29-08"), "AI-0233", "5");
        }


        public DataSourceResult GetHouseCheckListGridData(string HAWBSNo, string CheckListTypeSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            if (filter == null)
            {
                filter = new GridFilter();
                filter.Logic = "AND";
                filter.Filters = new List<GridFilter>();
            }
            DataSet ds = new DataSet();

            ProcName = "GetListHouseCheckList";

            string filters = GridFilter.ProcessFilters<HouseCheckListGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@HAWBSNo", HAWBSNo), new SqlParameter("@CheckListTypeSNo", CheckListTypeSNo) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new HouseCheckListGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                SrNo = e["SrNo"].ToString(),
                Description = e["Description"].ToString(),
                Y = e["Y"].ToString(),
                N = e["N"].ToString(),
                NA = e["NA"].ToString()
            });
            //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
            ds.Dispose();
            return new DataSourceResult
            {
                Data = wmsBookingList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}