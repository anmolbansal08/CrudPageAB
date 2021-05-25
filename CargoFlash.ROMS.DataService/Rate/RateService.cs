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
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
using CargoFlash.Cargo.DataService.Common;
using ClosedXML.Excel;
using System.IO;
using System.Web;


namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateService : SignatureAuthenticate, IRateService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
   

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateService", Parameters);
                var RateServiceList = ds.Tables[0].AsEnumerable().Select(e => new RateGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    OD = e["OD"].ToString().ToUpper(),
                    ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),// e["ValidTo"].ToString().ToUpper(),
                    ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),//e["ValidFrom"].ToString().ToUpper(),

                    Active = e["Active"].ToString().ToUpper(),
                    RateCardName = e["RateCardName"].ToString().ToUpper(),
                    OriginType = e["OriginType"].ToString().ToUpper(),
                    DestinationType = e["DestinationType"].ToString().ToUpper(),
                    Currency=e["Currency"].ToString().ToUpper(),
                    RateBased = e["RateBased"].ToString().ToUpper(),
                    RateRaferenceNumber = e["RateRaferenceNumber"].ToString().ToUpper(),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper(),
                    IsExcelUpload = e["IsExcelUpload"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateServiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public DataSourceResult DownloadExcelGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateService_EXCEL", Parameters);
                CommonService grid = new CommonService();
                var RateServiceList = ds.Tables[0].AsEnumerable().Select(e => new RateGrid
                {
                    //SNo = grid.Encrypt(Convert.ToString(e["SNo"])),
                    SNo = Convert.ToInt32(e["SNo"]),
                    OD = Convert.ToString(e["OD"]).ToUpper(),
                    RateCardName = Convert.ToString(e["RateCardName"]).ToUpper(),
                    //ChargeType = Convert.ToString(e["ChargeType"]).ToUpper(),
                    //PaymentType = Convert.ToString(e["PaymentType"]).ToUpper(),
                    Currency = Convert.ToString(e["Currency"]).ToUpper(),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(e["ValidTo"]),
                    OriginType = Convert.ToString(e["OriginType"]).ToUpper(),
                    DestinationType = Convert.ToString(e["OriginType"]).ToUpper(),
                    Active = Convert.ToString(e["Active"]).ToUpper(),
                    RateRaferenceNumber = Convert.ToString(e["RateRaferenceNumber"]).ToUpper(),
                    CreatedBy = Convert.ToString(e["CreatedBy"]).ToUpper(),
                    UpdatedBy = Convert.ToString(e["UpdatedBy"]).ToUpper(),
                    //StartWeight = Convert.ToString(e["StartWeight"]).ToUpper(),
                    //EndWeight = Convert.ToString(e["EndWeight"]).ToUpper(),
                    Unit = Convert.ToString(e["Unit"]).ToUpper(),
                    FlightTypeName = Convert.ToString(e["FlightTypeName"]).ToUpper(),
                    OfficeName = Convert.ToString(e["OfficeName"]).ToUpper(),
                    Commissionable = Convert.ToString(e["Commissionable"]).ToUpper(),
                    Weight_Breakup_Advantage = Convert.ToString(e["Weight_Breakup_Advantage"]).ToUpper(),
                    RateBased = Convert.ToString(e["RateBased"]).ToUpper(),
                    SlabName = Convert.ToString(e["SlabName"]).ToUpper(),
                    SlabDetails = Convert.ToString(e["SlabDetails"]).ToUpper(),
                    REMARKS = Convert.ToString(e["REMARKS"]).ToUpper(),
                    CarrierCode = Convert.ToString(e["CarrierCode"]).ToUpper(),
                    IssueCarrier = Convert.ToString(e["IssueCarrier"]).ToUpper(),
                    FlightNumber = Convert.ToString(e["FlightNumber"]).ToUpper(),
                    ProductName = Convert.ToString(e["ProductName"]).ToUpper(),
                    Commodity = Convert.ToString(e["Commodity"]).ToUpper(),
                    Shipper = Convert.ToString(e["Shipper"]).ToUpper(),
                    Agent = Convert.ToString(e["Agent"]).ToUpper(),

                    SPHC = Convert.ToString(e["SPHC"]).ToUpper(),
                    SPHCGroup = Convert.ToString(e["SPHCGroup"]).ToUpper(),
                    TransitStation = Convert.ToString(e["TransitStation"]).ToUpper(),
                    WeekDays = Convert.ToString(e["WeekDays"]).ToUpper(),
                    ETDT = Convert.ToString(e["ETDT"]).ToUpper(),

                    FlightCarrier_IsInclude = Convert.ToString(e["FlightCarrier_IsInclude"]).ToUpper(),
                    FlightNumber_IsInclude = Convert.ToString(e["Flight_IsInclude"]).ToUpper(),
                    IssueCarrier_IsInclude = Convert.ToString(e["IssueCarrier_IsInclude"]).ToUpper(),
                    Product_IsInclude = Convert.ToString(e["ProductName_IsInclude"]).ToUpper(),
                    Commodity_IsInclude = Convert.ToString(e["Commodity_IsInclude"]).ToUpper(),
                    AccountShipper_IsInclude = Convert.ToString(e["Shipper_IsInclude"]).ToUpper(),
                    Account_IsInclude = Convert.ToString(e["Agent_IsInclude"]).ToUpper(),
                    SPHC_IsInclude = Convert.ToString(e["SPHC_IsInclude"]).ToUpper(),
                    SPHCGroup_IsInclude = Convert.ToString(e["SPHCGroup_IsInclude"]).ToUpper(),
                    Transit_IsInclude = Convert.ToString(e["TransitStation_IsInclude"]).ToUpper(),
                    WeekDays_IsInclude = Convert.ToString(e["WeekDays_IsInclude"]).ToUpper(),
                    ETDT_IsInclude = Convert.ToString(e["ETD_IsInclude"]).ToUpper(),

                    //Mandatory = Convert.ToString(e["Mandatory"]).ToUpper(),
                    //Taxable = Convert.ToString(e["Taxable"]).ToUpper(),
                    //Commissionable = Convert.ToString(e["Commissionable"]).ToUpper(),
                    //Unit = Convert.ToString(e["Unit"]).ToUpper(),
                    //ApplicableOn = Convert.ToString(e["ApplicableOn"]).ToUpper(),
                    //IsReplanCharges = Convert.ToString(e["IsReplanCharges"]).ToUpper(),
                    //MinimumCharge = Convert.ToString(e["MinimumCharge"]).ToUpper(),
                    //Charge = Convert.ToString(e["Charge"]).ToUpper(),
                    //Charge_Type = Convert.ToString(e["Charge_Type"]).ToUpper(),
                    AgentGroup = Convert.ToString(e["AgentGroup"]).ToUpper(),
                    AccountGroup_IsInclude = Convert.ToString(e["AgentGroup_IsInclude"]).ToUpper(),
                });
                ConvertDSToExcel_Success(ds, 0);
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateServiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }

        public void ConvertDSToExcel_Success(DataSet ds, int mode)
        {
            string date = DateTime.Now.ToString();
           
            using (XLWorkbook wb = new XLWorkbook())
            {

                //foreach (DataTable dt in ds.Tables)
                //{
                //Add DataTable as Worksheet.
                //if (mode == 0)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        dt.TableName = "Success_Account";
                //    }
                //    else if (Session["COUNTRY"] != null)
                //    {
                //        dt.TableName = "Success_Country";
                //    }
                //    else if (Session["PageName"].ToString() == "RATE")
                //    {
                //        dt.TableName = "Success_Rate";
                //    }
                //    else if (Session["PageName"].ToString() == "USER")
                //    {
                //        dt.TableName = "Success_User";
                //    }
                //}
                //if (mode == 1)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        dt.TableName = "Duplicate_InValid_Account";
                //    }
                //    else if (Session["PageName"].ToString() == "RATE")
                //    {
                //        dt.TableName = "Duplicate_InValid_Rate";
                //    }
                //    else if (Session["PageName"].ToString() == "USER")
                //    {
                //        dt.TableName = "Duplicate_InValid_User";
                //    }
                //}
                //if (mode == 2)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        dt.TableName = "Error_Blank_Account";
                //    }
                //    else
                //    {
                //        dt.TableName = "Error_Blank_Rate";
                //    }

                //}
                wb.Worksheets.Add(ds);
                //}


                //Export the Excel file.
                //Response.Clear();
                //Response.Buffer = true;
                //Response.Charset = "";
                //Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                //if (mode == 0)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        Response.AddHeader("content-disposition", "attachment;filename=Success_AccountMaster_'" + date + "'.xlsx");
                //    }
                //    else if (Session["COUNTRY"] != null)
                //    {

                //        Response.AddHeader("content-disposition", "attachment;filename=Success_COUNTRY_'" + date + "'.xlsx");
                //    }
                //    else if (Session["CITY"] != null)
                //    {

                //        Response.AddHeader("content-disposition", "attachment;filename=Success_CITY_'" + date + "'.xlsx");
                //    }
                //    else if (Session["AIRPORT"] != null)
                //    {

                //        Response.AddHeader("content-disposition", "attachment;filename=Success_AIRPORT_'" + date + "'.xlsx");
                //    }
                //    else if (Session["PageName"].ToString() == "RATE")
                //    {
                //        Response.AddHeader("content-disposition", "attachment;filename=Success_RateMaster_'" + date + "'.xlsx");
                //    }
                //    else if (Session["PageName"].ToString() == "USER")
                //    {
                //        Response.AddHeader("content-disposition", "attachment;filename=Success_UserMaster_'" + date + "'.xlsx");
                //    }
                //}
                //if (mode == 1)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        Response.AddHeader("content-disposition", "attachment;filename=Duplicate_AccountMaster_'" + date + "'.xlsx");
                //    }
                //    else
                //    {
                //        if (Session["PageName"].ToString() == "RATE")
                //        {
                //            Response.AddHeader("content-disposition", "attachment;filename=Duplicate_RateMaster_'" + date + "'.xlsx");
                //        }
                //        if (Session["PageName"].ToString() == "USER")
                //        {
                //            Response.AddHeader("content-disposition", "attachment;filename=Duplicate_UserMaster_'" + date + "'.xlsx");
                //        }
                //    }
                //}
                //if (mode == 2)
                //{
                //    if (Session["Account"] != null)
                //    {
                //        Response.AddHeader("content-disposition", "attachment;filename=Error_AccountMaster_'" + date + "'.xlsx");
                //    }
                //    else
                //    {

                //        Response.AddHeader("content-disposition", "attachment;filename=Error_RateMaster_'" + date + "'.xlsx");

                //    }
                //}
                //Response.AddHeader("content-disposition", "attachment;filename=Active_RateMaster_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    string FinalPath = "UploadDoc\\RateDownload" + DateTime.Now.ToString("ddMMyyyy_hhmmss") + ".xlsx";
                    wb.SaveAs(MyMemoryStream);
                    System.IO.File.WriteAllBytes(Path.Combine(FinalPath), MyMemoryStream.ToArray());
                    //MyMemoryStream.WriteTo(Response.OutputStream);
                    //Response.Flush();
                    //Response.End();
                }

            }


            //}
            //  ---------------------------------------------------------------
            //Response.Clear();
            //Response.Charset = "";
            //string FileName = "Duplicate/Error_Rate" + DateTime.Now + ".xls";
            //StringWriter strwritter = new StringWriter();
            //HtmlTextWriter htmltextwrtter = new HtmlTextWriter(strwritter);
            //Response.Cache.SetCacheability(HttpCacheability.NoCache); 

            //Response.ContentType = "application/vnd.ms-excel";
            //Response.AddHeader("Content-Disposition", "attachment;filename=" + FileName); 
            //System.Web.UI.WebControls.DataGrid dg = new System.Web.UI.WebControls.DataGrid();
            //dg.GridLines = GridLines.Both;
            //dg.HeaderStyle.Font.Bold = true;
            //dg.DataSource = ds.Tables[0];
            //dg.DataBind();
            //dg.RenderControl(htmltextwrtter);
            //Response.Write(strwritter.ToString());
            //Response.End();
            ////Response.Clear();           // Already have this
            ////Response.ClearContent();    // Add this line
            ////Response.ClearHeaders();
            //Response.BufferOutput = true;
        }
        RateDetailsER IRateService.GetRateRecord(string recordID, string UserID)
        {
            try
            {
                RateDetailsER Rate = new RateDetailsER();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetRecord", Parameters);
                if (dr.Read())
                {
                    Rate.SNo = Convert.ToInt32(dr["SNo"]);
                    Rate.RateCardSNo = Convert.ToInt32(dr["RateCardSNo"]);
                    Rate.Text_RateCardSNo = dr["Text_RateCardSNo"].ToString();
                    Rate.MailRatingCodeSNo = dr["MailRatingCodeSNo"].ToString();
                    Rate.Text_MailRatingCodeSNo = dr["Text_MailRatingCodeSNo"].ToString();
                    Rate.RAirlineSNo = Convert.ToInt32(dr["RAirlineSNo"]);
                    Rate.Text_RAirlineSNo = Convert.ToString(dr["Text_RAirlineSNo"]);
                    Rate.OfficeSNo = dr["OfficeSNo"].ToString();
                    Rate.Text_OfficeSNo = Convert.ToString(dr["Text_OfficeSNo"]);
                    Rate.OriginType = Convert.ToInt32(dr["OriginType"]);
                    Rate.Text_OriginType = dr["Text_OriginType"].ToString();
                    Rate.DestinationType = Convert.ToInt32(dr["DestinationType"]);
                    Rate.Text_DestinationType = dr["Text_DestinationType"].ToString();
                    Rate.OriginSNo = Convert.ToInt32(dr["OriginSNo"].ToString());
                    Rate.Text_OriginSNo = dr["Text_OriginSNo"].ToString();
                    Rate.DestinationSNo = Convert.ToInt32(dr["DestinationSNo"].ToString());
                    Rate.Text_DestinationSNo = dr["Text_DestinationSNo"].ToString();
                    Rate.REFNo = dr["REFNo"].ToString();
                    Rate.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"].ToString());
                    Rate.Text_CurrencySNo = dr["Text_CurrencySNo"].ToString();
                    Rate.Active = Convert.ToInt32(dr["Active"].ToString());
                    Rate.Text_Active = dr["Text_Active"].ToString();
                    Rate.RateBaseSNo = Convert.ToInt32(dr["RateBaseSNo"].ToString());
                    Rate.Text_RateBaseSNo = dr["Text_RateBaseSNo"].ToString();
                    Rate.IsNextSLAB = Convert.ToBoolean(dr["IsNextSLAB"].ToString());
                    Rate.Tax = Convert.ToDecimal(dr["Tax"].ToString());
                    Rate.UOMSNo = Convert.ToInt32(dr["UOMSNo"].ToString());
                    Rate.Text_UOMSNo = dr["Text_UOMSNo"].ToString();
                    Rate.FlightTypeSNo = Convert.ToInt32(dr["FlightTypeSNo"].ToString());
                    Rate.Text_FlightTypeSNo = dr["Text_FlightTypeSNo"].ToString();
                    Rate.RateTypeSNo = Convert.ToInt32(dr["RateTypeSNo"].ToString());
                    Rate.Text_RateTypeSNo = dr["Text_RateTypeSNo"].ToString();
                    Rate.AllotmentSNo = Convert.ToInt32(dr["AllotmentSNo"].ToString());
                    Rate.Text_AllotmentSNo = dr["Text_AllotmentSNo"].ToString();
                    Rate.Remark = dr["Remark"].ToString();
                    Rate.ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(dr["ValidFrom"]), DateTimeKind.Utc);
                    Rate.ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(dr["ValidTo"]), DateTimeKind.Utc);
                    Rate.IsCommissionable = Convert.ToBoolean(dr["IsCommissionable"].ToString());
                    Rate.IsULDRateSlab = Convert.ToBoolean(0);
                    Rate.CreatedBy = dr["CreatedBy"].ToString();
                    Rate.UpdatedBy = dr["UpdatedBy"].ToString();
                }
                dr.Close();
                return Rate;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        //, string AirlineSNo, string Origin, string OriginSNo
        string AirlineSNo; string Origin; string OriginSNo;
        private readonly object rateservice;

        public KeyValuePair<string, List<RateAirlineSLAB>> GetRateSLAB(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                if (whereCondition != "")
                {
                    string[] Condition = whereCondition.Split('_');
                    AirlineSNo = Condition[0];
                    Origin = Condition[1];
                    OriginSNo = Condition[2];
                    whereCondition = "";
                }


                //AirlineSNo = whereCondition.Split("_");
                //if (whereCondition != "")
                //{
                //    if (whereCondition == "undefined-undefined")
                //    {
                //        whereCondition = "";
                //    }
                //    else
                //    {
                //        if (whereCondition != "")
                //        {
                //            string[] Condition = whereCondition.Split('-');
                //            whereCondition = "SlabLevel=" + Condition[0] + " and SlabOriginLevel=" + Condition[1];
                //        }
                //        else
                //        {
                //            whereCondition = "IsDefaultSlab=1"; //"RateSNo=" + recordID;
                //        }
                //    }
                //}
                //if (whereCondition == "")
                //{
                //    whereCondition = "IsDefaultSlab=1"; //"RateSNo=" + recordID;
                //}
                //if (Convert.ToInt32(recordID) > 1)
                //{
                //    whereCondition = "RateSNo=" + recordID;
                //}

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@Origin", Origin), new SqlParameter("@OriginSNo", OriginSNo), new SqlParameter("@RateSNo", recordID) };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetSLAB_ActionReadUpdate", Parameters);
                //DataTable dt;
                //dt = ds.Tables[0];
                //if (ds.Tables[0].Rows.Count <= 0)
                //{
                //    dt = ds.Tables[2];
                //}
                //if (ds.Tables[1].Rows.Count <= 0)
                //{
                //    dt = ds.Tables[3];
                //}
                var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new RateAirlineSLAB
                {
                    SNo = Convert.ToInt32(e["SlabSNo"]),
                    SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                    RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                    SlabName = e["SlabName"].ToString(),
                    SlabTitle = e["SlabTitle"].ToString(),
                    StartWt = Convert.ToDecimal(e["StartWt"].ToString()),
                    EndWt = Convert.ToDecimal(e["EndWt"].ToString()),
                    RateClassSNo = e["Text_RateClassSNo"].ToString(), //== "" ? 0 : Convert.ToInt32(e["Type"].ToString()),
                    HdnRateClassSNo = e["HdnRateClassSNo"].ToString(),
                    // Text_RateClassSNo = e["Text_RateClassSNo"].ToString(),
                    Based = e["Based"].ToString(),// == "" ? 0 : Convert.ToInt32(e["Based"].ToString()),
                    Rate = Convert.ToDecimal(e["Rate"].ToString()),
                    Text_Based = "",

                });
                return new KeyValuePair<string, List<RateAirlineSLAB>>("1", RateSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public KeyValuePair<string, List<RateAirlineSLAB>> GetRateSLAB_New(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                if (whereCondition != "")
                {
                    string[] Condition = whereCondition.Split('_');
                    AirlineSNo = Condition[0];
                    Origin = Condition[1];
                    OriginSNo = Condition[2];
                    whereCondition = "";
                }


                //AirlineSNo = whereCondition.Split("_");
                //if (whereCondition != "")
                //{
                //    if (whereCondition == "undefined-undefined")
                //    {
                //        whereCondition = "";
                //    }
                //    else
                //    {
                //        if (whereCondition != "")
                //        {
                //            string[] Condition = whereCondition.Split('-');
                //            whereCondition = "SlabLevel=" + Condition[0] + " and SlabOriginLevel=" + Condition[1];
                //        }
                //        else
                //        {
                //            whereCondition = "IsDefaultSlab=1"; //"RateSNo=" + recordID;
                //        }
                //    }
                //}
                //if (whereCondition == "")
                //{
                //    whereCondition = "IsDefaultSlab=1"; //"RateSNo=" + recordID;
                //}
                //if (Convert.ToInt32(recordID) > 1)
                //{
                //    whereCondition = "RateSNo=" + recordID;
                //}

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@Origin", Origin), new SqlParameter("@OriginSNo", OriginSNo), new SqlParameter("@RateSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetSLAB_ActionNew", Parameters);
                //DataTable dt;
                //dt = ds.Tables[0];
                //if (ds.Tables[0].Rows.Count <= 0)
                //{
                //    dt = ds.Tables[2];
                //}
                //if (ds.Tables[1].Rows.Count <= 0)
                //{
                //    dt = ds.Tables[3];
                //}
                var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new RateAirlineSLAB
                {
                    SNo = Convert.ToInt32(e["SlabSNo"]),
                    SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                    RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                    SlabName = e["SlabName"].ToString(),
                    SlabTitle = e["SlabTitle"].ToString(),
                    StartWt = Convert.ToDecimal(e["StartWt"].ToString()),
                    EndWt = Convert.ToDecimal(e["EndWt"].ToString()),
                    RateClassSNo = e["Text_RateClassSNo"].ToString(), //== "" ? 0 : Convert.ToInt32(e["Type"].ToString()),
                    HdnRateClassSNo = e["HdnRateClassSNo"].ToString(),
                    // Text_RateClassSNo = e["Text_RateClassSNo"].ToString(),
                    Based = e["Based"].ToString(),// == "" ? 0 : Convert.ToInt32(e["Based"].ToString()),
                    Rate = Convert.ToDecimal(e["Rate"].ToString()),
                    Text_Based = "",

                });
                return new KeyValuePair<string, List<RateAirlineSLAB>>("1", RateSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public KeyValuePair<string, List<RateULDAirlineSLAB>> GetULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "RateSNo=" + recordID;

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetULD", Parameters);
                var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new RateULDAirlineSLAB
                {
                    SNo = Convert.ToInt32(e["SlabSNo"]),
                    SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                    RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                    SLABName = e["SlabName"].ToString(),
                    StartWt = Convert.ToDecimal(e["StartWt"].ToString()),
                    EndWt = Convert.ToDecimal(e["EndWt"].ToString()),
                    RateClassSNo = e["Text_RateClassSNo"].ToString(),
                    HdnRateClassSNo = e["RateClassSNo"].ToString(),
                    HdnULDSNo = e["ULDSNo"].ToString(),
                    Rate = Convert.ToDecimal(e["Rate"].ToString()),
                    RateClassCode = e["Text_RateClassCode"].ToString(),
                    HdnRateClassCode = e["RateClassCodeSNo"].ToString(),
                    ////Text_RateClassCode = e["Text_RateClassCode"].ToString(),
                    UldMinChWT = Convert.ToDecimal(e["UldMinimumChargableWeight"].ToString()),
                    ////Based = e["Based"].ToString(),
                    ULDSNo = e["Text_ULDSNo"].ToString(),

                });
                return new KeyValuePair<string, List<RateULDAirlineSLAB>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public string GetRateParameter(int RateSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RateSNo", RateSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetParameter", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string SaveRateDetais(int RateSNo, string Action, RateDetails RateInfo, List<RateRemarks> RateRemarks, List<RateAirlineSLAB> RateSLABInfoarray, List<RateULDAirlineSLAB> RateULDSLABInfoArray, RateParam RateParamList, int IsULDCheck)
        {
           
            string Result = "";
            //return null;
            try
            {
            List<RateDetails> lstRateDetails = new List<RateDetails>();
            lstRateDetails.Add(RateInfo);

            List<RateParam> lstRateParam = new List<RateParam>();
            lstRateParam.Add(RateParamList);

            DataTable dtRateDetails = CollectionHelper.ConvertTo(lstRateDetails, "");
            DataTable dtRateRemarks = CollectionHelper.ConvertTo(RateRemarks, "");
            DataTable dtRateSlab = CollectionHelper.ConvertTo(RateSLABInfoarray, "HdnRateClassSNo");
            DataTable dtRateULDSlab = CollectionHelper.ConvertTo(RateULDSLABInfoArray, "HdnRateClassSNo,HdnULDSNo,HdnRateClassCode,Text_RateClassCode,RateClassCode");
            DataTable dtRateParam = CollectionHelper.ConvertTo(lstRateParam, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramRateDetails = new SqlParameter();
            paramRateDetails.ParameterName = "@RateDetails";
            paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateDetails.Value = dtRateDetails;

            SqlParameter paramRateRemarks = new SqlParameter();
            paramRateRemarks.ParameterName = "@RateRemarks";
            paramRateRemarks.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateRemarks.Value = dtRateRemarks;

            SqlParameter paramRateSlab = new SqlParameter();
            paramRateSlab.ParameterName = "@RateSLAB";
            paramRateSlab.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateSlab.Value = dtRateSlab;

            SqlParameter paramRateULDSlab = new SqlParameter();
            paramRateULDSlab.ParameterName = "@RateULDSLAB";
            paramRateULDSlab.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateULDSlab.Value = dtRateULDSlab;

            SqlParameter paramRateParam = new SqlParameter();
            paramRateParam.ParameterName = "@RateParam";
            paramRateParam.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateParam.Value = dtRateParam;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@RateSNo", RateSNo),      
                                             new SqlParameter("@PerformAction", Action),     
                                            paramRateDetails,    
                                            paramRateRemarks,  
                                            paramRateSlab,
                                            paramRateULDSlab,
                                            paramRateParam,
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@IsULDCheck", IsULDCheck),
                                        };
           
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spRate_SaveDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                // return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return Result;
        }

        public string GetAllotmentType(int AllotmentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AllotmentSNo", AllotmentSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetAllotmentType", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public KeyValuePair<string, List<RateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "RateSNo=" + recordID;

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@RateSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetRemarks", Parameters);
                var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new RateRemarks
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    // RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                    Remarks = e["Remarks"].ToString(),
                });
                return new KeyValuePair<string, List<RateRemarks>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string GetAirlineCurruncy(int AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetAirlineCurrency", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string UpdateRateDetais(int RateSNo, string Action, RateDetails RateInfo, List<RateRemarks> RateRemarks, List<RateAirlineSLAB> RateSLABInfoarray, List<RateULDAirlineSLAB> RateULDSLABInfoArray, RateParam RateParamList, string ErrorMSG)
        {
            string Result = "";
            try
            { 
            //return null;
            List<RateDetails> lstRateDetails = new List<RateDetails>();
            lstRateDetails.Add(RateInfo);

            List<RateParam> lstRateParam = new List<RateParam>();
            lstRateParam.Add(RateParamList);

            DataTable dtRateDetails = CollectionHelper.ConvertTo(lstRateDetails, "");
            DataTable dtRateRemarks = CollectionHelper.ConvertTo(RateRemarks, "");
            DataTable dtRateSlab = CollectionHelper.ConvertTo(RateSLABInfoarray, "HdnRateClassSNo");
            DataTable dtRateULDSlab = CollectionHelper.ConvertTo(RateULDSLABInfoArray, "HdnRateClassSNo,HdnULDSNo,HdnRateClassCode,Text_RateClassCode,RateClassCode");
            DataTable dtRateParam = CollectionHelper.ConvertTo(lstRateParam, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramRateDetails = new SqlParameter();
            paramRateDetails.ParameterName = "@RateDetails";
            paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateDetails.Value = dtRateDetails;

            SqlParameter paramRateRemarks = new SqlParameter();
            paramRateRemarks.ParameterName = "@RateRemarks";
            paramRateRemarks.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateRemarks.Value = dtRateRemarks;

            SqlParameter paramRateSlab = new SqlParameter();
            paramRateSlab.ParameterName = "@RateSLAB";
            paramRateSlab.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateSlab.Value = dtRateSlab;

            SqlParameter paramRateULDSlab = new SqlParameter();
            paramRateULDSlab.ParameterName = "@RateULDSLAB";
            paramRateULDSlab.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateULDSlab.Value = dtRateULDSlab;

            SqlParameter paramRateParam = new SqlParameter();
            paramRateParam.ParameterName = "@RateParam";
            paramRateParam.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateParam.Value = dtRateParam;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@RateSNo", RateSNo),      
                                             new SqlParameter("@PerformAction", Action),     
                                            paramRateDetails,    
                                            paramRateRemarks,  
                                            paramRateSlab,
                                            paramRateULDSlab,
                                            paramRateParam,
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                           new SqlParameter("@ErrorMSg", ErrorMSG),     
                                        };
           
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spRate_UpdateDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                // return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return Result;
        }


        public string GetULDClassMinimumCWt(int ClassCodeSNo, int AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ClassCodeSNo", ClassCodeSNo),
                                             new SqlParameter("@AirlineSNo", AirlineSNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetULDClassMinimumCWt", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string SaveRateDownloadRequest(int AirlineSno, string Status, string Message, int OriginSno=0, int DestinationSno=0, int OfficeSno=0, int AgentSno=0, string SHCSno="")
        {
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@AirlineSNo", AirlineSno),
                                          new SqlParameter("@OriginSNo", OriginSno),
                                          new SqlParameter("@DestinationSNo", DestinationSno),
                                          new SqlParameter("@OfficeSNo", OfficeSno),
                                          new SqlParameter("@AccountSNo", AgentSno),
                                          new SqlParameter("@SHCSNo", SHCSno),
                                         new SqlParameter("@Status", Status),
                                         new SqlParameter("@Message", Message),
                                         new SqlParameter("@UserId", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRateDownloadRequest", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
