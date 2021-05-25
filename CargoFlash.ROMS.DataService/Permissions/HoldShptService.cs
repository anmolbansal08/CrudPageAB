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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System;
using System.IO;
using System.Collections;
namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HoldShptService : SignatureAuthenticate, IHoldShptService
    {
        public HoldShpt GetHoldShptRecord(string recordID, string UserID)
        {
            HoldShpt holdShpt = new HoldShpt();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHoldShpt", Parameters);
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHoldShpt", Parameters);
                if (dr.Read())
                {
                    holdShpt.SNo = Convert.ToInt32(dr["SNo"]);
                    holdShpt.AWBNo = Convert.ToString(dr["AWBSNo"]);
                    holdShpt.Text_AWBNo = Convert.ToString(dr["AWBNo"]);
                    holdShpt.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    holdShpt.CityCode = Convert.ToString(dr["CitySNo"]);
                    holdShpt.Text_CityCode = Convert.ToString(dr["CityCode"]);
                    //holdShpt.Hold_Type = Convert.ToInt32(dr["Hold_Type"]);
                    //holdShpt.Text_Hold_Type = Convert.ToString(dr["Text_Hold_Type"]).ToUpper();
                    //holdShpt.HoldOn = Convert.ToString(dr["HoldOn"]);
                    //holdShpt.HoldRemarks = Convert.ToString(dr["HoldRemarks"]).ToUpper();
                    //holdShpt.UnHoldOn = Convert.ToString(dr["UnHoldOn"]).ToUpper();
                    //holdShpt.UnHoldRemarks = Convert.ToString(dr["UnHoldRemarks"]).ToUpper();
                    //holdShpt.HoldByXray = Convert.ToString(dr["HoldByXray"]).ToUpper();
                    holdShpt.HoldPieces = Convert.ToInt32(dr["PiecesOnHold"]);
                    holdShpt.MomvementType = Convert.ToString(dr["MomvementType"]);
                    holdShpt.HoldGrossWeight = Convert.ToString(dr["HoldGrossWeight"]);
                    holdShpt.DeliveryOrderNo = Convert.ToInt32(dr["DeliveryOrderSNo"]);
                    holdShpt.Text_DeliveryOrderNo = Convert.ToString(dr["DeliveryOrderNO"]);
                    holdShpt.FlightNo = Convert.ToInt32(dr["FlightNo"]);
                    holdShpt.Text_FlightNo = Convert.ToString(dr["Text_FlightNo"]);
                    holdShpt.FlightDate = dr["FlightDate"].ToString();
                    //if (holdShpt.UnHoldRemarks == "")
                    //{
                    //    holdShpt.UnHold = false;
                    //    holdShpt.Text_UnHold = "NO";
                    //}
                    //else
                    //{
                    //    holdShpt.UnHold = true;
                    //    holdShpt.Text_UnHold = "YES";
                    //}


                }
            }
            catch (Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return holdShpt;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<HoldShpt>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts)/*For Multicity*/ , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsShowAllData", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).IsShowAllData.ToString()), new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListHoldShpt", Parameters);
            var HoldShptList = ds.Tables[0].AsEnumerable().Select(e => new HoldShpt
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = Convert.ToInt32(e["SNo"]),
                AWBNo = Convert.ToString(e["AWBNo"]),
                Text_AWBNo = Convert.ToString(e["AWBNo"]),
                HoldOn = e["HoldOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["HoldOn"]), DateTimeKind.Utc),
                Text_Hold_Type = Convert.ToString(e["HoldType"]),
                Airport = Convert.ToString(e["Airport"]),
                Text_UnHold = Convert.ToString(e["UnHoldBy"]),
                UnHoldOn = e["UnHoldOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["UnHoldOn"]), DateTimeKind.Utc),
                // IsAutoHold = Convert.ToString(e["IsAutoHold"]),
                // IsAutoUnHold = Convert.ToString(e["IsAutoUnHold"]),
                MomvementType = e["MomvementType"].ToString(),
                PiecesOnHold = Convert.ToInt32(e["PiecesOnHold"]),
                Status = e["Status"].ToString(),
                CCTRefNo = e["CCTRefNo"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = HoldShptList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        //public bool CheckDuplicateRows(DataTable dTable, string colName)
        //{
        //    bool check = false;
        //    Hashtable hTable = new Hashtable();
        //    ArrayList duplicateList = new ArrayList();

        //    //Add list of all the unique item value to hashtable, which stores combination of key, value pair.
        //    //And add duplicate item value in arraylist.
        //    foreach (DataRow drow in dTable.Rows)
        //    {
        //        if (hTable.Contains(drow[colName]))
        //            check = true;

        //    }


        //    return check;
        //}
        public bool CheckDuplicateRows(DataTable dTable, string colName)
        {
            bool check = false;
            Hashtable hTable = new Hashtable();
            ArrayList duplicateList = new ArrayList();
            ArrayList duplicateList12 = new ArrayList();


            foreach (DataRow drow in dTable.Rows)
            {
                if (hTable.Contains(drow[colName]))

                    duplicateList.Add(drow);

                else
                    hTable.Add(drow[colName], string.Empty);
            }


            foreach (DataRow dRow in duplicateList)
            {

                check = true;
            }

            return check;
        }
        public string SaveHoldShpt(List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid, string grosswt, string volwt, string AppRemarks, string FohCheck)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtHoldShptInfo = CollectionHelper.ConvertTo(HoldShptInfo, "");
                DataTable dtHoldShptGrid = CollectionHelper.ConvertTo(HoldShptGrid, "");
                DataSet ds = new DataSet();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HoldShptInfo";
                param.ParameterName = "@HoldShptGrid";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtHoldShptInfo;
                param.Value = dtHoldShptGrid;
                string ret = "";
                SqlParameter[] Parameters = { new SqlParameter("@HoldShptInfo", dtHoldShptInfo), new SqlParameter("@HoldShptGrid", dtHoldShptGrid),
                                          new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                          new SqlParameter("@grosswt",grosswt),
                                          new SqlParameter("@volwt",volwt),
                                          new SqlParameter("@AppRemarks",AppRemarks),
                                          new SqlParameter("@FohCheck",FohCheck)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAwbHoldShipment", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string UpdateHoldShptLateAcceptance(List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid, string grosswt, string volwt, string AppRemarks, double? UPenalityAmount, string Ispenalitycharge)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            string message = string.Empty;
            DataSet ds = new DataSet();

            DataTable dtHoldShptInfo = CollectionHelper.ConvertTo(HoldShptInfo, "");
            DataTable dtHoldShptGrid = CollectionHelper.ConvertTo(HoldShptGrid, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@HoldShptInfo";
            param.ParameterName = "@HoldShptGrid";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtHoldShptInfo;
            param.Value = dtHoldShptGrid;
            SqlParameter[] Parameters = {
                                            new SqlParameter("@HoldShptInfo", dtHoldShptInfo), new SqlParameter("@HoldShptGrid", dtHoldShptGrid),
                                          new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                          new SqlParameter("@grosswt",grosswt),
                                          new SqlParameter("@volwt",volwt),
                                          new SqlParameter("@AppRemarks",AppRemarks),
                                          new SqlParameter("@FohCheck",Ispenalitycharge),
                                            new SqlParameter("@UPenalityAmount",UPenalityAmount),
                                             new SqlParameter("@Ispenalitycharge",Convert.ToInt32(Ispenalitycharge))
                                        };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAwbHoldShipment_lateAcp", Parameters);

            if (ds != null && ds.Tables.Count > 0)
            {
                message = ds.Tables[0].Rows[0]["Result"].ToString();
                ErrorMessage.Add(message);
            }
            return message;


        }
        public string UpdateHoldShpt(List<HoldShptInfo> HoldShptInfo, List<HoldShptGrid> HoldShptGrid, string grosswt, string volwt, string AppRemarks, string FohCheck)
        {
            //validate Business Rule
            try
            {

                List<string> ErrorMessage = new List<string>();
                string message = string.Empty;
                DataSet ds = new DataSet();
                DataTable dtHoldShptInfo = CollectionHelper.ConvertTo(HoldShptInfo, "");
                DataTable dtHoldShptGrid = CollectionHelper.ConvertTo(HoldShptGrid, "");

                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@HoldShptInfo";
                param.ParameterName = "@HoldShptGrid";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtHoldShptInfo;
                param.Value = dtHoldShptGrid;
                SqlParameter[] Parameters = { new SqlParameter("@HoldShptInfo", dtHoldShptInfo), new SqlParameter("@HoldShptGrid", dtHoldShptGrid),
                                          new SqlParameter("@UserSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                          new SqlParameter("@grosswt",grosswt),
                                          new SqlParameter("@volwt",volwt),
                                          new SqlParameter("@AppRemarks",AppRemarks),
                                          new SqlParameter("@FohCheck",FohCheck)};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAwbHoldShipment", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

            //if (ds != null && ds.Tables.Count > 0)
            //{
            //    message = ds.Tables[0].Rows[0]["Result"].ToString();
            //    ErrorMessage.Add(message);
            //}
            //return message;


        }


        //public List<string> UpdateHoldShpt(List<HoldShpt> HoldShptInfo)
        //{
        //    //validate Business Rule
        //    List<string> ErrorMessage = new List<string>();
        //    DataTable dtUpdateHoldShpt = CollectionHelper.ConvertTo(HoldShptInfo, "Text_CityCode,UnHold,Text_UnHold,HoldByXray,IsAutoHold,IsAutoUnHold");
        //    BaseBusiness baseBusiness = new BaseBusiness();

        //    if (!baseBusiness.ValidateBaseBusiness("HoldShpt", dtUpdateHoldShpt, "UPDATE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@HoldShptTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtUpdateHoldShpt;

        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateHoldShpt", param);
        //    if (ret > 0)

        //    {

        //        if (ret > 1000)
        //        {


        //                //For Customised Validation Messages like 'Record Already Exists' etc
        //                string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "HoldShpt");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);

        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }

        //    return ErrorMessage;
        //}
        public List<string> DeleteHoldShpt(string recordID)
        {

            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteHoldShpt", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "HoldShpt");
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
            return ErrorMessage;


        }

        public KeyValuePair<string, List<GetHoldAwb>> GetHoldAwbDetails(string recordID, int page, int pageSize, string whereCondition, string sort)
        {


            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBHoldDetail", Parameters);
            var GetHoldAwbList = ds.Tables[0].AsEnumerable().Select(e => new GetHoldAwb
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                Hold = e["Holdtype"].ToString(),
                HoldPiece = e["HoldPieces"].ToString(),
                HoldRemark = e["HoldRemarks"].ToString(),
                UnHold = Convert.ToBoolean(e["Unhold"].ToString()),
                UnHoldRemark = e["UnHoldRemarks"].ToString(),
                HdnHold = Convert.ToInt32(e["HoldTypeSno"]),
                HoldByXray = e["HoldByXray"].ToString(),
                IsUnhold = Convert.ToBoolean(e["Unhold"].ToString()),
                UnHoldBy = e["UserName"].ToString(),
                UnHoldOn = e["UnHoldOn"].ToString(),
                IsAutoUnHold = e["IsAutoUnhold"].ToString(),
                IsApprovedUnhold = Convert.ToInt32(e["IsApprovedUnhold"].ToString())

            });
            return new KeyValuePair<string, List<GetHoldAwb>>(ds.Tables[1].Rows[0][0].ToString(), GetHoldAwbList.AsQueryable().ToList());
        }


        public string GetHoldPieces(string Sno)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHoldpicesFromAWB", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetDeliveryPcs(string Sno, string AwbSno)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno), new SqlParameter("@AwbSNo", AwbSno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryPcs", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string GetDeliveryFlightDate(string AWBNo, string FlightNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@FlightNo", FlightNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryFlightDate", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string GetHWBFOHWeight(string AWBNo, string MovementType)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@MovementType", MovementType) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGetHWBFOHWeight", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public string GetpenalityAmount(string AWBNo, string HoldtypeSno)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@HoldtypeSno", HoldtypeSno) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE_lateAcceptance", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string UpdatedHoldShpt(string AWBNo, string MovementType, string grosswt, string volwt)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@MovementType", MovementType)
                                        , new SqlParameter("@grosswt", MovementType)
                                        , new SqlParameter("@volwt", MovementType)};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdatedHoldShpt", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        //public Stream GetManifestReport(string DailyFlightSNo, string Type = "N")
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@Type", Type) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ManifestReport_new", Parameters);

        //    byte[] resultBytes = Encoding.UTF8.GetBytes(GetManifestReportHTML(ds, Type));
        //    WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
        //    return new MemoryStream(resultBytes);

        //}

        //public string GetManifestReportHTML(DataSet ds, string Type)
        //{
        //    if (ds.Tables.Count == 1)
        //    {
        //        return ds.Tables[0].Rows[0][0].ToString();
        //    }
        //    else
        //    {
        //        int IsPharrma = 0;
        //        StringBuilder tbl = new StringBuilder();
        //        if (ds != null && ds.Tables[0].Rows.Count > 0)
        //        {
        //            tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
        //            //tbl.Append("<tr align=\"center\"><td colspan=\"11\" ><h6>CARGO MANIFEST I.C.A.O ANNEX 9 APPENDIX 3</h6></td></tr> ");
        //            foreach (DataRow dr in ds.Tables[0].Rows)
        //            {
        //                if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
        //                {
        //                    IsPharrma = (Convert.ToInt32(dr["IsPharma"]));
        //                    break;
        //                }
        //            }
        //            if (IsPharrma == 1)
        //            {
        //                tbl.Append("<tr align='left'><td colspan='2' rowspan='3' align='left' style=\"padding: 2px 0px 0px 2px;\"><img src='Logo/CEIV_stamp.jpg' width='120px' height='75px' style='background-color: rgba(0,0,0,.5)'/></td><td colspan='3' align='center' style='font: bold;'><h2>CARGO MANIFEST</h2></td><td colspan='5'>&nbsp;</td></tr>");
        //                tbl.Append("<tr><td align='center' colspan='3'>ICAO ANNEX 9 APPENDIX 3</td><td colspan='5'>&nbsp;</td></tr>");
        //            }
        //            else
        //            {
        //                tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>CARGO MANIFEST</h2> </td></tr> ");
        //                tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
        //            }


        //            //tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>CARGO MANIFEST</h2> </td></tr> ");
        //            //tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ds.Tables[0].Rows[0]["airlinename"].ToString() + "</td><td colspan=\"2\" align=\"left\" >Marks of Nationality/Regn No:</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["RegistrationNo"].ToString() + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
        //            tbl.Append("<tr align=\"left\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Flight Date</td><td align=\"left\" colspan=\"2\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"5\"></td></tr>");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
        //            tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"7\"  style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">SHC</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");

        //            DataTable dtDistinctULD = null;
        //            DataTable dtDistinctDestinationCity = null;
        //            dtDistinctULD = ds.Tables[0].DefaultView.ToTable(true, "ULDNo");
        //            dtDistinctDestinationCity = ds.Tables[0].DefaultView.ToTable(true, "DestinationCity");
        //            foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
        //            {
        //                int pieces = 0;
        //                decimal Weight = 0.00M;

        //                DataRow[] drRpt = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "'");
        //                DataRow[] drLocal = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
        //                DataRow[] drTrans = ds.Tables[0].Select("ULDNo='" + drDistinctULD["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

        //                if (drRpt.Length > 0)
        //                {
        //                    foreach (DataRow dr in drRpt)
        //                    {
        //                        pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
        //                        Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
        //                    }

        //                    tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"9\" >" + drDistinctULD["ULDNo"] + "</td></tr>");
        //                    if (drLocal.Length > 0)
        //                    {
        //                        int j = 1;
        //                        foreach (DataRow dr in drLocal)
        //                        {
        //                            if (j == 1)
        //                            {
        //                                tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/LOCAL CARGO</td></tr>");
        //                            }
        //                            if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
        //                            {
        //                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" ><img src='Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/>" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
        //                                j++;
        //                            }
        //                            else
        //                            {
        //                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
        //                                j++;
        //                            }
        //                        }
        //                    }
        //                    if (drTrans.Length > 0)
        //                    {
        //                        int k = 1;
        //                        foreach (DataRow dr in drTrans)
        //                        {
        //                            if (k == 1)
        //                            {
        //                                tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
        //                            }
        //                            if (Convert.ToInt32(dr["IsPharma"]) == 1 && Convert.ToInt32(dr["IsEurope"]) == 1)
        //                            {
        //                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" ><img src='../../Logo/ceiv-pharma-stamp.gif' width='28px' height='18px' style='vertical-align: middle'/> " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
        //                                k++;
        //                            }
        //                            else
        //                            {
        //                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" > " + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\" ></td><td colspan=\"1\"></td></tr>");
        //                                k++;
        //                            }
        //                        }
        //                    }
        //                    tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");


        //                }


        //            }

        //            //foreach (DataRow drDistinctULD1 in dtDistinctDestinationCity.Rows)
        //            //{
        //            //    //foreach (DataRow drDistinctULD1 in dtDistinctULD.Rows)
        //            //    //{
        //            //        int Totalpieces = 0;
        //            //        decimal TotalWeight = 0.00M;

        //            //        DataRow[] drRpt = ds.Tables[0].Select("DestinationCity='" + drDistinctULD1["DestinationCity"] + "'");
        //            //        //DataRow[] drLocal = ds.Tables[0].Select("ULDNo='" + drDistinctULD1["ULDNo"] + "' AND ULDSTATUS='LOCAL'");
        //            //        //DataRow[] drTrans = ds.Tables[0].Select("ULDNo='" + drDistinctULD1["ULDNo"] + "' AND ULDSTATUS='TRANSIT'");

        //            //        if (drRpt.Length > 0)
        //            //        {
        //            //            foreach (DataRow dr in drRpt)
        //            //            {
        //            //                Totalpieces = (Totalpieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : Totalpieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
        //            //                TotalWeight = (TotalWeight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(TotalWeight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
        //            //            }

        //            //            tbl.Append("<tr class=\"grdTableRow\"><td colspan=\"2\" align=\"left\"><b>Dest.Totals:</b></td><td align=\"center\">" + +Totalpieces + "</td><td></td><td td colspan=\"1\" align=\"center\">" + TotalWeight + "</td><td></td><td></td><td></td><td></td></tr>");
        //            //        }
        //            //    }

        //            tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td  colspan=\"2\" style=\"border-right: none;\"><b>No of AWB : " + ds.Tables[1].Rows[0]["AWBCount"].ToString() + "</b></td><td colspan=\"2\" style=\"border-left: none;border-right: none\"><b>Total Pieces : " + ds.Tables[1].Rows[0]["TotalPlannedPieces"].ToString() + "</b></td><td colspan=\"7\" style=\"border-left: none;\" ><b>Total Gross Weight  : " + ds.Tables[1].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</b></td></tr>");
        //            foreach (DataRow dr1 in dtDistinctDestinationCity.Rows)
        //            {

        //                /// if (ds.Tables[0].Rows[0]["airlinename"].ToString() == "AIR ARABIA" && ds.Tables[0].Rows[0]["DestinationCity"].ToString() == "DEL")

        //                if (ds.Tables[0].Rows[0]["airlinename"].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AirlineName"].ToString().ToLower().Trim() && dr1[0].ToString().ToLower() == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FC_AllowedCity"].ToString().ToLower().Trim())
        //                {
        //                    //tbl.Append("<tr align=\"left\"><td colspan=\"11\" >Notes: NOTE:DME <br/> There are no goods on board of the aircraft the import of which to the Customs Union zone is prohibited or restricted such as pharmaceuticals consisting of narcotic <br/>drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");/

        //                    //tbl.Append("<tr align=\"right\"><td align=\"top\" width=\"10px\">Note:</td><td colspan=\"10\">NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition.</td></tr> ");
        //                    tbl.Append("<tr style=\"font-weight: bold;\" ><td valign=\"top\" >Note:</td><td colspan=\"8\" align=\"left\" >NOTE:DME <br/>There are no goods on board of the aircraft the import of which to the Customs Union zone prohibited or restricted such as pharmaceuticals consisting of narcotic drugs and potent agents; psychotropic & toxic substances; weapon & ammunition</td></tr>");


        //                }
        //            }

        //            tbl.Append("<tr align=\"right\"  class=\"grdTableRow\" id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
        //            tbl.Append("</table>");
        //        }
        //        else
        //        {
        //            tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" ><h2>CARGO MANIFEST</h2> </td></tr> ");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"11\" >ICAO ANNEX 9 APPENDIX 3</td></tr> ");

        //            tbl.Append("<tr align=\"center\"><td colspan=\"11\" style=\"font: bold;'\" >&nbsp;</td></tr> ");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Owner or Operator</td><td colspan=\"2\" align=\"left\" >" + ' ' + "</td><td colspan=\"2\" align=\"left\" >Marks of Nationality/Regn No:</td><td align=\"left\" colspan=\"2\" >" + ' ' + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
        //            tbl.Append("<tr align=\"left\"><td colspan=\"2\" align=\"left\">Flight Number</td><td align=\"left\" colspan=\"2\" >" + ' ' + "</td><td align=\"left\" colspan=\"2\">Flight Date</td><td align=\"left\" colspan=\"2\">" + ' '+"</td><td colspan=\"5\"></td></tr>");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\">Point Of Loading</td><td colspan=\"2\" align=\"left\">"+' '+"</td><td colspan=\"2\" align=\"left\">Point Of Unloading</td><td colspan=\"2\" align=\"left\">" + ' ' + "</td><td colspan=\"6\" >&nbsp;</td></tr>");
        //            tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"7\"  style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");
        //            tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">SHC</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");
        //            tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //            tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //            tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //            tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //            tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9' style='font-size:30px;color:red'>NIL MANIFEST&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //              tbl.Append("<tr><td align='center' colspan='9'>&nbsp;</td></tr>");
        //            tbl.Append("<tr align=\"right\"  class=\"grdTableRow\" id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" /></td></tr>");
        //            tbl.Append("</table>");
        //        }
        //        return tbl.ToString();
        //    }

        //}


    }
}
