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
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Web;
using System.Net;
namespace CargoFlash.Cargo.DataService.Tariff
{
    #region Charges Service Description
    /*
	*****************************************************************************
	Service Name:	ChargesService      
	Purpose:		This Service used to get details of Charges save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		26 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class HandlingChargesService : SignatureAuthenticate, IHandlingChargesService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public HandlingCharges GetHandlingChargesRecord(string recordID, string UserID)
        {
            HandlingCharges charges = new HandlingCharges();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordHandlingCharges", Parameters);
                if (dr.Read())
                {
                    charges.SNo = Convert.ToInt32(dr["SNo"]);
                    charges.ChargeName = Convert.ToString(dr["ChargeName"]).ToUpper();
                    charges.PrimaryBasisOfChargeSNo = Convert.ToString(dr["PrimaryBasisOfChargeSNo"]);
                    charges.SecondaryBasisOfChargeSNo = Convert.ToString(dr["SecondaryBasisOfChargeSNo"]);
                    charges.Text_PrimaryBasisOfCharge = Convert.ToString(dr["PrimaryBasisOfCharge"]);
                    charges.Text_SecondaryBasisOfCharge = Convert.ToString(dr["SecondaryBasisOfCharge"]);
                    charges.TariffDescription = Convert.ToString(dr["TariffDescription"]).ToUpper();
                    charges.TariffAccountName = Convert.ToString(dr["TariffAccountName"]).ToUpper();
                    charges.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    charges.Country = Convert.ToString(dr["CountrySNo"]);
                    charges.Text_Country = Convert.ToString(dr["CountryCode"]);
                    charges.City = Convert.ToString(dr["CitySNo"]);
                    charges.Text_City = Convert.ToString(dr["CityCode"]);
                    charges.Active = Convert.ToString(dr["Active"]);
                    charges.Ratetype = dr["RateType"].ToString();
                    charges.Chargetype = dr["ChargeTypeSNo"].ToString();
                    charges.Text_Chargetype = dr["ChargeType"].ToString();
                    charges.ChargeCategory = Convert.ToBoolean(dr["ChargeCategory"]);
                    charges.Text_ChargeCategory = Convert.ToString(dr["Text_ChargeCategory"]);
                    charges.InvoiceGroup = Convert.ToString(dr["InvoiceGroup"]);
                    charges.Text_InvoiceGroup = Convert.ToString(dr["Text_InvoiceGroup"]);
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
            dr.Close();
            return charges;
        }

        public List<HandlingChargesTrans> GetHandlingChargesTransRecord(string recordID)
        {
            try
            {
                List<HandlingChargesTrans> listtariffForwardRateTrans = new List<HandlingChargesTrans>();
                HandlingChargesTrans TariffForwardRateTrans = new HandlingChargesTrans();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHandlingChargesRecordTrans", Parameters);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        listtariffForwardRateTrans.Add(new HandlingChargesTrans
                        {
                            SNo = Convert.ToInt32(dr["HandlingChargesTransSNo"].ToString()),
                            ChargeName1 = dr["ChargeName"].ToString().ToUpper(),
                            IsActive1 = Convert.ToBoolean(dr["IsActive"].ToString()),
                            Active1 = dr["Active"].ToString(),
                            Refundable = dr["Refundable"].ToString(),
                            IsRefundable = Convert.ToBoolean(dr["IsRefundable"].ToString())
                        });
                    }
                }
                return listtariffForwardRateTrans;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<HandlingCharges>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListHandlingCharges", Parameters);
                var ChargesList = ds.Tables[0].AsEnumerable().Select(e => new HandlingCharges
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ChargeName = Convert.ToString(e["ChargeName"].ToString().ToUpper()),
                    Active = Convert.ToString(e["Active"]),
                    Ratetype = Convert.ToString(e["Ratetype"]),
                    Chargetype = Convert.ToString(e["Chargetype"]),
                    Text_ChargeCategory = Convert.ToString(e["Text_ChargeCategory"]),
                    InvoiceGroup = Convert.ToString(e["InvoiceGroup"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ChargesList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> SaveCharges(List<HandlingCharges> HandlingChargesInfo, List<HandlingCharges> HandlingChargesTrans)
        {
            try
            {
                // validate Business Rule
                DataTable dtCreateCharges = CollectionHelper.ConvertTo(HandlingChargesInfo, "Active,Text_PrimaryBasisOfCharge,Text_SecondaryBasisOfCharge,Text_Country,Text_City,Text_Chargetype,Text_ChargeCategory,Refundable,Text_InvoiceGroup");
                DataTable dtCreateChargesTrans = CollectionHelper.ConvertTo(HandlingChargesTrans, "Active,Text_PrimaryBasisOfCharge,Text_SecondaryBasisOfCharge,Text_Country,Text_City,Text_Chargetype,Text_ChargeCategory,Refundable,Text_InvoiceGroup");

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("HandlingCharges", dtCreateCharges, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter[] param = 
                                { 
                                   new SqlParameter("@HandlingChargesTable",dtCreateCharges),
                                   new SqlParameter("@HandlingChargesTableTrans",dtCreateChargesTrans),
                                   new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateHandlingCharges", param).ToString();
                int SNo = 0; int errorNumber = 0;
                if (ret.Contains(','))
                {
                    SNo = Convert.ToInt32(ret.Split(',')[0]);
                    errorNumber = Convert.ToInt32(ret.Split(',')[1]);
                }
                else
                    errorNumber = Convert.ToInt32(ret);
                if (errorNumber > 0)
                {
                    if (errorNumber == 1001)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = "Charges Name Already Exists. ";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (errorNumber == 1002)
                    {
                        string serverErrorMessage = "Charges Code Already Exists.";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (errorNumber == 2000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(errorNumber, "HandlingCharges");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(errorNumber, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateCharges(List<HandlingCharges> HandlingChargesInfo, List<HandlingCharges> HandlingChargesTrans)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateCharges = CollectionHelper.ConvertTo(HandlingChargesInfo, "Active,Text_PrimaryBasisOfCharge,Text_SecondaryBasisOfCharge,Text_Country,Text_City,Text_Chargetype,Text_ChargeCategory,Refundable,Text_InvoiceGroup");
                DataTable dtCreateChargesTrans = CollectionHelper.ConvertTo(HandlingChargesTrans, "Active,Text_PrimaryBasisOfCharge,Text_SecondaryBasisOfCharge,Text_Country,Text_City,Text_Chargetype,Text_ChargeCategory,Refundable,Text_InvoiceGroup");

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("HandlingCharges", dtCreateCharges, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter[] param = 
                                 { 
                                   new SqlParameter("@HandlingChargesTable",dtCreateCharges),
                                   new SqlParameter("@HandlingChargesTableTrans",dtCreateChargesTrans),
                                   new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                  };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateHandlingCharges", param).ToString();
                int SNo = 0; int errorNumber = 0;
                if (ret.Contains(','))
                {
                    SNo = Convert.ToInt32(ret.Split(',')[0]);
                    errorNumber = Convert.ToInt32(ret.Split(',')[1]);
                }
                else
                    errorNumber = Convert.ToInt32(ret);
                if (errorNumber > 0)
                {
                    if (errorNumber == 1001)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = "Charges Name Already Exists";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (errorNumber == 1002)
                    {
                        string serverErrorMessage = "Charges Code Already Exists";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (errorNumber == 2001)
                    {
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(errorNumber, "HandlingCharges");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(errorNumber, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> DeleteHandlingCharges(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteHandlingCharges", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "HandlingCharges");
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
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSliRecord(string a)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(a)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSliRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string GetAWBPrintData(string AwbNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", Convert.ToString(AwbNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AWBPrintGetRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        // Changes by Vipin Kumar
        //public string ReservationBookingGetAWBPrintData(string AwbNo)
        public string ReservationBookingGetAWBPrintData(int? AwbNo)
        // Ends
        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AwbNo),
					 new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))?.UserSNo))
				};

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ReservationBooking_GetAWBPrintData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAirMailPrintData(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", Convert.ToString(DailyFlightSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirMailPrintData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetImportAWBPrintData(string AwbNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", Convert.ToString(AwbNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ImportAWBPrintGetRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveNotocRecord(string Sno, string PreparedBy, string SupplentaryInfo, string OtherInfo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno), new SqlParameter("@PreparedBy", PreparedBy), new SqlParameter("@SupplentaryInfo", SupplentaryInfo), new SqlParameter("@OtherInfo", OtherInfo) };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveNotocData", Parameters);
                // DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveNotocData", Parameters);
                // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                return ret.ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetUldHandOverRecord(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUldHandOverRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetUldHandOverTransfer(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUldHandOverTransfer", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAndUpdateUHFPrint(string Sno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAndUpdateUHFPrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string geteCSDPrint(string AwbNo)
        {
            try
            {
                SqlParameter[] param = { 
                                   new SqlParameter("@AWBNo",AwbNo)
                                   };
                var ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getECSDprint", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Added by Arman Ali for BTB print Data
        /// </summary>
        /// <param name="AwbNo"></param>
        /// <param name="ProcName"></param>
        /// <returns></returns>
        public string AcceptanceBTBPrintData(int? AwbNo, string ProcName)
       
        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AwbNo),
                     new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string AcceptanceHouseBTBPrintData(int? AwbNo, string ProcName)

        {
            try
            {


                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AwbNo),
                     new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
