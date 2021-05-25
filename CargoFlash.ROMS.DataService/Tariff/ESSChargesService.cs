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
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Net;

using System.IO;
using CargoFlash.SoftwareFactory.WebUI;
using Newtonsoft.Json;
//using CargoFlash.Cargo.Model.Import;

namespace CargoFlash.Cargo.DataService.Tariff
{

    #region ESS Charge Class Description

    /*
	*****************************************************************************
	Class Name:		ESSCharge      
	Purpose:		This class used to Extend Interface IEssCharge. 
	Company:		CargoFlash 
	Author:			Karan Kumar
	Created On:		23 Nov 2015
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ESSChargesService : BaseWebUISecureObject, IESSChargesService
    {
        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>



        private DataTable GetRoomTable(List<DOHandlingCharges> DOHandlingChargesList)
        {
            try
            {
                DataTable dt = new DataTable();
                DataRow dr;
                dt.Columns.Add("SNo", typeof(string));
                dt.Columns.Add("AWBSNo", typeof(string));
                dt.Columns.Add("WaveOff", typeof(string));
                dt.Columns.Add("TariffCodeSNo", typeof(string));
                dt.Columns.Add("TariffHeadName", typeof(string));
                dt.Columns.Add("pValue", typeof(string));
                dt.Columns.Add("sValue", typeof(string));

                dt.Columns.Add("Amount", typeof(decimal));
                dt.Columns.Add("Discount", typeof(decimal));
                dt.Columns.Add("DiscountPercent", typeof(decimal));

                dt.Columns.Add("TotalTaxAmount", typeof(decimal));
                dt.Columns.Add("TotalAmount", typeof(decimal));

                dt.Columns.Add("Rate", typeof(string));
                dt.Columns.Add("Min", typeof(string));
                dt.Columns.Add("Mode", typeof(string));
                dt.Columns.Add("ChargeTo", typeof(string));
                dt.Columns.Add("pBasis", typeof(string));
                dt.Columns.Add("sBasis", typeof(string));
                dt.Columns.Add("Remarks", typeof(string));
                dt.Columns.Add("WaveoffRemarks", typeof(string));
                dt.Columns.Add("DescriptionRemarks", typeof(string));
                dt.Columns.Add("TaxPercent", typeof(string));


                foreach (var item in DOHandlingChargesList)
                {
                    dr = dt.NewRow();
                    dr["SNo"] = item.SNo;
                    dr["AWBSNo"] = item.AWBSNo;
                    dr["WaveOff"] = item.WaveOff;
                    dr["TariffCodeSNo"] = item.TariffCodeSNo;

                    dr["TariffHeadName"] = item.TariffHeadName;
                    dr["pValue"] = item.pValue;
                    dr["sValue"] = item.sValue;
                    dr["Amount"] = item.Amount;
                    dr["TotalTaxAmount"] = item.TotalTaxAmount;
                    dr["TotalAmount"] = item.TotalAmount;
                    dr["Rate"] = item.Rate;
                    dr["Min"] = item.Min;
                    dr["Mode"] = item.Mode;
                    dr["ChargeTo"] = item.ChargeTo;
                    dr["pBasis"] = item.pBasis;
                    dr["sBasis"] = item.sBasis;
                    dr["Remarks"] = item.Remarks;
                    dr["WaveoffRemarks"] = item.WaveoffRemarks;
                    dr["DescriptionRemarks"] = item.DescriptionRemarks;
                    dr["TaxPercent"] = item.TaxPercent;
                    dt.Rows.Add(dr);
                }
                return dt;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private DataTable GetRoomTableLuc(List<DOHandlingCharges> DOHandlingChargesList)
        {
            try
            {
                DataTable dt = new DataTable();
                DataRow dr;
                dt.Columns.Add("SNo", typeof(string));
                dt.Columns.Add("AWBSNo", typeof(string));
                dt.Columns.Add("WaveOff", typeof(string));
                dt.Columns.Add("TariffCodeSNo", typeof(string));
                dt.Columns.Add("TariffHeadName", typeof(string));
                dt.Columns.Add("pValue", typeof(string));
                dt.Columns.Add("sValue", typeof(string));
                dt.Columns.Add("Amount", typeof(decimal));
                dt.Columns.Add("Discount", typeof(decimal));
                dt.Columns.Add("DiscountPercent", typeof(decimal));
                dt.Columns.Add("Tax", typeof(decimal));
                dt.Columns.Add("TaxDiscount", typeof(decimal));
                dt.Columns.Add("TaxDiscountPercent", typeof(decimal));
                dt.Columns.Add("TotalAmount", typeof(decimal));
                dt.Columns.Add("Rate", typeof(string));
                dt.Columns.Add("Min", typeof(string));
                dt.Columns.Add("Mode", typeof(string));
                dt.Columns.Add("ChargeTo", typeof(string));
                dt.Columns.Add("pBasis", typeof(string));
                dt.Columns.Add("sBasis", typeof(string));
                dt.Columns.Add("Remarks", typeof(string));
                dt.Columns.Add("WaveoffRemarks", typeof(string));
                dt.Columns.Add("DescriptionRemarks", typeof(string));
                dt.Columns.Add("TaxPercent", typeof(string));


                foreach (var item in DOHandlingChargesList)
                {
                    dr = dt.NewRow();
                    dr["SNo"] = item.SNo;
                    dr["AWBSNo"] = item.AWBSNo;
                    dr["WaveOff"] = item.WaveOff;
                    dr["TariffCodeSNo"] = item.TariffCodeSNo;
                    dr["TariffHeadName"] = item.TariffHeadName;
                    dr["pValue"] = item.pValue;
                    dr["sValue"] = item.sValue;
                    dr["Amount"] = item.Amount;
                    dr["Discount"] =0;
                    dr["DiscountPercent"] = 0;
                    dr["Tax"] = item.TotalTaxAmount;
                    dr["TaxDiscount"] = 0;
                    dr["TaxDiscountPercent"] = 0;
                    dr["TotalAmount"] = item.TotalAmount;
                    dr["Rate"] = item.Rate;
                    dr["Min"] = item.Min;
                    dr["Mode"] = item.Mode;
                    dr["ChargeTo"] = item.ChargeTo;
                    dr["pBasis"] = item.pBasis;
                    dr["sBasis"] = item.sBasis;
                    dr["Remarks"] = item.Remarks;
                    dr["WaveoffRemarks"] = item.WaveoffRemarks;
                    dr["DescriptionRemarks"] = item.DescriptionRemarks;
                    dr["TaxPercent"] = item.TaxPercent;
                    dt.Rows.Add(dr);
                }
                return dt;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetESSChargesTotal(ESSCharges obj)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "1";
            try
            {

                //  DataTable dtESSChargesTeans = GetRoomTable(obj.LstESSCharges);
                //SqlParameter[] Parameters = { 
                //                                new SqlParameter("@ESSType", obj.Type), new SqlParameter("@ESSTypeValue", obj.TypeValue), new SqlParameter("@ESSBillTo", obj.BillTo), new SqlParameter("@ESSBillToSNo", obj.BillToSNo), new SqlParameter("@ESSFlightDate", obj.FlightDate), new SqlParameter("@HandlingCharge", dtESSChargesTeans), new SqlParameter("@MovementType", obj.MomvementType), new SqlParameter("@ShipmentType", '0') };
                ////   ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "saveESSCharges", Parameters);
                //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getCommonHandlingCharges", Parameters);


                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", obj.TypeValue),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@MovementType", obj.MomvementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", "0"),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", "1004"),
                                            new SqlParameter("@SubProcessSNo", 0),
                                            new SqlParameter("@ArrivedShipmentSNo", 0),
                                            new SqlParameter("@DOSNo", 0),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", obj.Type),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            new SqlParameter("@TariffSNo", obj.TariffSNo),
                                            new SqlParameter("@PrimaryValue", obj.PrimaryValue),
                                            new SqlParameter("@SecondaryValue", obj.SecondaryValue),
                                            new SqlParameter("@TaxReturn", 1)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();

                ret = ds.Tables[0].Rows[0]["ChargeAmount"].ToString();


            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ret.ToString();
        }

        public string CreateESSCharges(ESSCharges obj)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "1";
            try
            {
                foreach (var item in obj.LstDOHandlingCharges)
                {

                    byte[] data = Convert.FromBase64String(item.Remarks);
                    item.Remarks = Encoding.UTF8.GetString(data);
                }
                DataTable dtHandlingCharges = CollectionHelper.ConvertTo(obj.LstDOHandlingCharges, "NonReturnDays,IsDamaged");

                //DataTable dtHandlingCharges = GetRoomTable(obj.LstDOHandlingCharges);

                // DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
                SqlParameter[] Parameters = {
                                               new SqlParameter("@Type", obj.Type),
                                               new SqlParameter("@TypeValue", obj.TypeValue),
                                               new SqlParameter("@BillTo", obj.BillTo),
                                               new SqlParameter("@BillToSNo", obj.BillToSNo),
                                               new SqlParameter("@FlightDate", obj.FlightDate),
                                               new SqlParameter("@ESSHandlingCharge", dtHandlingCharges),
                                               new SqlParameter("@MovementType", obj.MomvementType),
                                               new SqlParameter("@ShipmentType", '0'),
                                               new SqlParameter("@BillToAgentName", obj.BillToAgentName),
                                               new SqlParameter("@ShipperName", obj.ShipperName),
                                               new SqlParameter("@Process", obj.Process),
                                               new SqlParameter("@SubProcess",obj.SubProcess),
                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@LoginCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
                //   ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "saveESSCharges", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "saveESSCharges", Parameters);
                ds.Dispose();
                ret = ds.Tables[0].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ret.ToString();
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchIncludeTransitAWB = "", string SearchExcludeDeliveredAWB = "", string LoggedInCity = "", string searchSPHC = "", string searchConsignee = "")
        {
            try
            {
                LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeSearch:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeDuplicate:

                        break;
                    case DisplayModeEdit:

                        break;
                    case DisplayModeDelete:

                        break;
                    case DisplayModeIndexView:
                        switch (processName)
                        {
                            case "ESS":
                                if (appName.ToUpper().Trim() == "ESS")
                                    CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, searchAWBNo, searchFromDate, searchToDate, SearchIncludeTransitAWB, SearchExcludeDeliveredAWB, searchSPHC, searchConsignee);
                                break;
                            default:
                                break;
                        }
                        break;
                    case DisplayModeReadView:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    default:
                        break;
                }
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private void CreateGrid(StringBuilder myCurrentForm, string processName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string searchSPHC, string searchConsignee)
        {
            throw new NotImplementedException();
        }

        public string CheckCreditLimit(string BillToSNo, string total)
        {
            try
            {
                //int ret;
                SqlParameter[] Parameters = { new SqlParameter("@BillToSNo", BillToSNo), new SqlParameter("@total", total) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ESSCheckCreditLimit", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            //ds.Dispose();
            //ret = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
        }

        public string CheckWalkIn(string Sno, string type)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Sno", Sno), new SqlParameter("@type", type) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ESSCheckWalkIn", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                //ds.Dispose();
                //ret = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CreateCTMCharges(CTMCharges obj)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "1";
            try
            {
                DataTable dtCTMCharges = GetRoomTable(obj.LstCTMCharges);

                // DataTable dtHandlingCharges = CollectionHelper.ConvertTo(lstHandlingCharges, "");
                SqlParameter[] Parameters = {
                                               new SqlParameter("@Type", obj.Type),
                                               new SqlParameter("@TypeValue", obj.TypeValue),
                                               new SqlParameter("@BillTo", obj.BillTo),
                                               new SqlParameter("@FlightNo",obj.FlightNo),
                                               new SqlParameter("@CTMSNo",obj.CTMSNo),
                                               new SqlParameter("@CTMHandlingCharge", dtCTMCharges),
                                               new SqlParameter("@MovementType", obj.MomvementType),
                                               new SqlParameter("@ShipmentType", '0'),
                                               new SqlParameter("@Process", obj.Process),
                                               new SqlParameter("@SubProcess",obj.SubProcessSNo),
                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session    ["UserDetail"])).UserSNo.ToString()),
                                               new SqlParameter("@LoginCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()) };
                //   ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "saveESSCharges", Parameters);
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "saveCTMCharges", Parameters);
                ds.Dispose();
                ret = ds.Tables[0].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ret.ToString();
        }

        public string GetAWBWeight(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Sno", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBWeight", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CTMGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int FlightSNo = 0, int CTMSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", DestinationCity),
                                            new SqlParameter("@MovementType", MovementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", FlightSNo),
                                            new SqlParameter("@PDSNo", CTMSNo),
                                            new SqlParameter("@RateType", RateType),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PValue),
                                            new SqlParameter("@SecondaryValue", SValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", VolWt),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Piecs),
                                            new SqlParameter("@Remarks", Remarks)
                                        };


                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCTMSMendatoryChargesForFC(int AWBSNo, int CTMSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                             new SqlParameter("@AwbSNo", AWBSNo),
                                         new SqlParameter("@CTMSno",CTMSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCTMSMendatoryChargesForFC", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCTMSMendatoryCharges(int AWBSNo, int FlightSNo, int CTMSNo, string CityCode, int ProcessSNo, int SubProcessSNo, int ArrivedShipmentSNo, int RateType, decimal GrWt, decimal ChWt, int Pieces)
        {
            try
            {
                SqlParameter[] Parameters = {
                                             new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", CityCode),
                                            new SqlParameter("@MovementType", 2),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", 0),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", FlightSNo),
                                            new SqlParameter("@PDSNo", CTMSNo),
                                            new SqlParameter("@RateType", RateType),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", 0),
                                            new SqlParameter("@PrimaryValue", 0),
                                            new SqlParameter("@SecondaryValue", 0),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", 0),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Pieces),
                                            new SqlParameter("@Remarks", "")
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetLUCSMendatoryCharges(int SNo, string CityCode, int ProcessSNo, int SubProcessSNo, int ArrivedShipmentSNo, int RateType, decimal GrWt, decimal ChWt, int Pieces)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", SNo),
                                            new SqlParameter("@CityCode", CityCode),
                                            new SqlParameter("@MovementType", 2),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", 0),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", 0),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@RateType", RateType),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", 0),
                                            new SqlParameter("@PrimaryValue", 0),
                                            new SqlParameter("@SecondaryValue", 0),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", 0),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Pieces),
                                            new SqlParameter("@Remarks", "")
                                       };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetExportESSHandlingCharges(Int32 AWBSNO, Int32 HAWBSNo, decimal GrWT, decimal ChWt, int Pieces)
        {
            //((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()try
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNO),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", "2"),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", 1),
                                            new SqlParameter("@SubProcessSNo", 7),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()) ,
                                            new SqlParameter("@GrWT",GrWT),
                                            new SqlParameter("@VolWt",0),
                                            new SqlParameter("@ChWt",ChWt),
                                            new SqlParameter("@Pieces",Pieces),
                                            new SqlParameter("@Remarks","")
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE_Ess_Export", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetCharges_Ess_Import(int TariffSNo, int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, decimal pValue, decimal sValue, int Pieces, int DOSNo, int PDSNo, List<DOShipmentInfo> lstShipmentInfo, String Remarks, int POMailSNo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "ULDSNo");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param =
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", CityCode),
                                            new SqlParameter("@MovementType", 1),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", 0),
                                           new SqlParameter("@DOSNo", DOSNo),
                                            new SqlParameter("@PDSNo", PDSNo),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", pValue),
                                            new SqlParameter("@SecondaryValue", sValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWT),
                                            new SqlParameter("@VolWt", 0),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Pieces),
                                            //new SqlParameter("@Remarks", ""),
                                              new SqlParameter("@Remarks",Remarks),
                                            new SqlParameter("@PartShipmentType",dtShipmentInfo),
                                            new SqlParameter("@AirMailSNo",POMailSNo)

                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound_EssImport", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }


        public string LUCGetChargeValue(int TariffSNo, int AWBSNo, int ArrivedShipmentSNo, string DestinationCity, decimal PValue, decimal SValue, int HAWBSNo, int MovementType, int RateType, decimal GrWt = 0, decimal VolWt = 0, decimal ChWt = 0, int Piecs = 0, string Remarks = "", int FlightSNo = 0, int CTMSNo = 0, int ProcessSNo = 0, int SubProcessSNo = 0)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo", AWBSNo),
                                            new SqlParameter("@CityCode", DestinationCity),
                                            new SqlParameter("@MovementType", MovementType),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", HAWBSNo),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", ProcessSNo),
                                            new SqlParameter("@SubProcessSNo", SubProcessSNo),
                                            new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
                                            new SqlParameter("@DOSNo", FlightSNo),
                                            new SqlParameter("@PDSNo", CTMSNo),
                                            new SqlParameter("@RateType", RateType),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PValue),
                                            new SqlParameter("@SecondaryValue", SValue),
                                            new SqlParameter("@TaxReturn", 1),
                                            new SqlParameter("@IsMandatory", 0),
                                            new SqlParameter("@IsESS", 0),
                                            new SqlParameter("@GrWT", GrWt),
                                            new SqlParameter("@VolWt", VolWt),
                                            new SqlParameter("@ChWt", ChWt),
                                            new SqlParameter("@Pieces", Piecs),
                                            new SqlParameter("@Remarks", Remarks)
                                        };


                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CreateLUCESSCharges(LUCCharges obj)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "1";
            try
            {
                DataTable dtLUCCharges = GetRoomTableLuc(obj.LstLUCCharges);
                SqlParameter[] Parameters = {

                                               new SqlParameter("@BillTo", obj.BillTo),
                                               new SqlParameter("@LUCHandlingCharge", dtLUCCharges),
                                               new SqlParameter("@Process", obj.Process),
                                               new SqlParameter("@SubProcess",obj.SubProcessSNo),
                                               new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),

                                               };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveULDCharges", Parameters);
                ds.Dispose();
                ret = ds.Tables[0].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ret.ToString();
        }
        public string GetMISCChargeSNo(int SNo)
        {
            SqlParameter[] Parameters = { };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMISCChargeSNo", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetULDCharges(string SNo)
        {
            try
            {
                DOHandlingCharges ob;
                SqlParameter[] Parameters = {
                                                new SqlParameter("@SNo",SNo),
                                                //new SqlParameter("@ErrorMessage",SqlDbType.VarChar){Size=500, Direction=ParameterDirection.Output},
                                            };
                //  DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetULDChargeList", Parameters);
                // Add By Sushant 
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDChargeList", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

                //if (ds.Tables[0].Rows.Count > 0)
                //{
                //    ob = ds.Tables[0].AsEnumerable().Select(e => new DOHandlingCharges
                //    {
                //        TariffHeadName = Convert.ToString(e["TariffHeadName"]),
                //        Amount = Convert.ToDecimal(e["Amount"]),
                //        TotalTaxAmount = Convert.ToInt32(e["TotalTaxAmount"]),
                //        TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                //        Remarks = Convert.ToString(e["Remarks"]),
                //        //NonReturnDays =Convert.ToString(e["NonReturnDays"]),
                //         IsDamaged = Convert.ToInt32(e["IsDamaged"]),
                //        ErrorMessage = Convert.ToString(Parameters[1].Value),
                //    }).FirstOrDefault(); 
                //}
                //ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetEssAWBNo_Information(string AWBNo, string FlightNO, string movetype)
        {
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@AwbNO", AWBNo)
                                                , new SqlParameter("@FlightNO", FlightNO.Trim()), new SqlParameter("@movetype", movetype) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "EssAWBNo_Information", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        public string GetEssHouseAWBNo_Information(string AWBNo, string FlightNO, string movetype)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AwbNO", AWBNo),
                new SqlParameter("@FlightNO", FlightNO.Trim()), new SqlParameter("@movetype", movetype) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "EssHouseAWBNo_Information", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        public string SaveHawbEssAWBNo_Information(string strData)
        {
            try
            {
                SaveAtESSRequest SaveAtESSRequest = JsonConvert.DeserializeObject<SaveAtESSRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

                string Message = "";
                DataTable dtEssHouseInfo = CollectionHelper.ConvertTo(SaveAtESSRequest.lstEssHouseInfo, "");
               
               
                SqlParameter paramEssHouseInfo = new SqlParameter();
                paramEssHouseInfo.ParameterName = "@EssHouseInfo";
                paramEssHouseInfo.SqlDbType = System.Data.SqlDbType.Structured;
                paramEssHouseInfo.Value = dtEssHouseInfo;

                SqlParameter[] Parameters = {paramEssHouseInfo,
                                                new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),

                                            new SqlParameter("@Type", SaveAtESSRequest.Type),

                                             new SqlParameter("@NoofHouse", SaveAtESSRequest.NoofHouse)
                                           };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_SaveHawbEssAWBNo_Information", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string CreateAWBSummary(List<AWBSummaryArray> Summary, ShipperInformation ShipperInformation, ConsigneeInformation ConsigneeInformation, string shipperconsignee)
        {
            try
            {

                List<ShipperInformation> lstShipperInformation = new List<ShipperInformation>();
                lstShipperInformation.Add(ShipperInformation);
                DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


                List<ConsigneeInformation> lstConsigneeInformation = new List<ConsigneeInformation>();
                lstConsigneeInformation.Add(ConsigneeInformation);
                DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");




                BaseBusiness baseBusiness = new BaseBusiness();

                string[] SAwb = Summary[0].Awb.Split('-');



                SqlParameter paramShipperInformation = new SqlParameter();
                paramShipperInformation.ParameterName = "@ShipperInformation";
                paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramShipperInformation.Value = dtShipperInformation;

                SqlParameter paramConsigneeInformation = new SqlParameter();
                paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
                paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramConsigneeInformation.Value = dtConsigneeInformation;


                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@Awb",SAwb[1]),
                                            new SqlParameter("@AWBPrefix",SAwb[0]),
                                            new SqlParameter("@Origin", Summary[0].Origin),
                                            new SqlParameter("@destination", Summary[0].destination),
                                            new SqlParameter("@carriercode", Summary[0].carriercode),
                                            new SqlParameter("@AwbFlightNo", Summary[0].AwbFlightNo),
                                            new SqlParameter("@AwbFlightDate",Summary[0].AwbFlightDate),
                                            new SqlParameter("@pieces", Summary[0].pieces),
                                            new SqlParameter("@chweight", Summary[0].chweight),
                                            new SqlParameter("@grwt",Summary[0].grwt),
                                            new SqlParameter("@commodity",Summary[0].commodity),
                                            new SqlParameter("@AwbType",Summary[0].AwbType),
                                            new SqlParameter("@MovementType",Summary[0].MovementType),
                                            new SqlParameter("@BillToSNo",Summary[0].BillToSNo),
                                            new SqlParameter("@CBM",Summary[0].CBM),
                                            new SqlParameter("@VolumeWt",Summary[0].VolumeWt),
                                            new SqlParameter("@NoofHouse",Summary[0].NoofHouse),
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            paramShipperInformation,
                                            paramConsigneeInformation,
                                            new SqlParameter("@shipperconsigneeType",shipperconsignee),
                                            new SqlParameter("@SHIPPERConsigneeName",Summary[0].SHIPPERConsignee),
                                            new SqlParameter("@AWBOrigin",Summary[0].AWBOrigin),
                                            new SqlParameter("@AWBDestination",Summary[0].AWBDestination),
                                            new SqlParameter("@FlightCarrierCode",Summary[0].FlightCarrierCode),
                                            new SqlParameter("@FlightNo",Summary[0].FlightNo),
                                            new SqlParameter("@FlightNoPrix",Summary[0].FlightNoPrix),
                                            new SqlParameter("@FlightNoPrix1",Summary[0].FlightNoPrix1),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@AWBDate",Summary[0].AWBDate),

                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateEssAwbInformation", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }

            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType.Trim()), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetails_Ess", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckIsAWBUsable(string AWBNo, string Mtype)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@Mtype", Mtype) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Ess_CheckIsAWBUsable", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetHouseAWB(string AWBNo, string Mtype)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@Mtype", Mtype) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Ess_GetHouseAWB", Parameters);
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
