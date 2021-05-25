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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Airline Service Description
    /*
	*****************************************************************************
	Service Name:	AirlineService
	Purpose:		This Service used to get details of Airline save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Mar 2014
    Updated By:
	Updated On:
	Approved By:
	Approved On:
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirlineService : SignatureAuthenticate, IAirlineService
    {
        public Airline GetAirlineRecord(string recordID, string UserSNo)
        {
            Airline airline = new Airline();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirline", Parameters);
                if (dr.Read())
                {
                    airline.SNo = Convert.ToInt32(dr["SNo"]);
                    airline.AirlineCode = Convert.ToString(dr["AirlineCode"]);
                    airline.CarrierCode = Convert.ToString(dr["CarrierCode"]);
                    airline.AirlineName = Convert.ToString(dr["AirlineName"]);
                    airline.AirportCode = Convert.ToString(dr["AirportCodeSNo"]);
                    airline.Text_AirportCode = Convert.ToString(dr["AirportCode"]);
                    airline.ICAOCode = Convert.ToString(dr["ICAOCode"]);
                    airline.Address = Convert.ToString(dr["Address"]);
                    airline.CountryName = Convert.ToString(dr["CountrySNo"]);
                    airline.Text_CountryName = Convert.ToString(dr["CountryName"]);
                    airline.SenderEmailId = Convert.ToString(dr["SenderEmailId"]);
                    airline.AirlineEmailId = Convert.ToString(dr["AirlineEmailId"]);
                    airline.AirlineLogo =  Convert.ToString(dr["AirlineLogo"]);
                    airline.AwbLogo = Convert.ToString(dr["AwbLogo"]);
                    airline.AirlineWebsite = Convert.ToString(dr["AirlineWebsite"]);
                    airline.MobileCountryCode = Convert.ToString(dr["MobileCountryCode"]) + " ";
                    airline.MobileNo = Convert.ToString(dr["MobileNo"]);
                    airline.PhoneCountryCode = Convert.ToString(dr["PhoneCountryCode"]);
                    airline.CityPrefixCode = Convert.ToString(dr["CityPrefixCode"]);
                    airline.PhoneNo = Convert.ToString(dr["PhoneNo"]);
                    airline.CSDCode = Convert.ToString(dr["CSDCode"]).ToUpper();
                    airline.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    airline.Active = dr["Active"].ToString();
                    airline.CurrencyCode = Convert.ToString(dr["CurrencySNo"]);
                    airline.Text_CurrencyCode = Convert.ToString(dr["CurrencyCode"]);
                    airline.UpdatedBy = dr["UpdatedUser"].ToString();
                    airline.CreatedBy = dr["CreatedUser"].ToString();
                    airline.ContactPerson = Convert.ToString(dr["ContactPerson"]).ToUpper();
                    airline.IsCCAllowed = Convert.ToBoolean(dr["IsCCAllowed"]);
                    airline.CCAllowed = dr["CCAllowed"].ToString();
                    airline.IsPartAllowed = Convert.ToBoolean(dr["IsPartAllowed"]);
                    airline.PartAllowed = dr["PartAllowed"].ToString();
                    airline.IsCheckModulus7 = Convert.ToBoolean(dr["IsCheckModulus7"]);
                    airline.CheckModulus7 = dr["CheckModulus7"].ToString();
                    airline.AWBDuplicacy = dr["AWBDuplicacy"].ToString() == "0" ? "" : dr["AWBDuplicacy"].ToString();
                    airline.HandlingInformation = dr["HandlingInformation"].ToString().ToUpper();
                    airline.IsInterline = Convert.ToBoolean(dr["IsInterline"]);
                    airline.Interline = dr["Interline"].ToString();
                    airline.InvoicingCycle = Convert.ToInt32(dr["InvoicingCycle"]);
                    airline.Text_InvoicingCycle = dr["Text_InvoicingCycle"].ToString();
                    airline.EmailAddress = dr["EmailAddress"].ToString();
                    airline.SitaAddress = dr["SitaAddress"].ToString();


                    airline.SMS = Convert.ToBoolean(dr["SMS"]) == false ? false : true;
                    airline.Message = Convert.ToBoolean(dr["Message"]) == false ? false : true;
                    airline.Mobile = Convert.ToString(dr["Mobile"]).ToUpper();
                    airline.Email = Convert.ToString(dr["Email"]).ToUpper();

                    airline.IsAllowedCL = Convert.ToBoolean(dr["IsAllowedCL"]);
                    airline.AllowedCL = Convert.ToString(dr["AllowedCL"]).ToUpper();
                    airline.CreditLimit = Convert.ToDecimal(dr["CreditLimit"].ToString() == "" ? "0" : dr["CreditLimit"]);
                    airline.MinimumCL = Convert.ToDecimal(dr["MinimumCL"].ToString() == "" ? "0" : dr["MinimumCL"]);
                    airline.AlertCLPercentage = Convert.ToDecimal(dr["AlertCLPercentage"].ToString() == "" ? "0" : dr["AlertCLPercentage"]);
                    airline.AccountNo = dr["AccountNo"].ToString().ToUpper();
                    airline.BillingCode = dr["BillingCode"].ToString().ToUpper();
                    airline.BillingAddress = dr["BillingAddress"].ToString().ToUpper();
                    //airline.InvoiceMode = Convert.ToInt32(dr["InvoiceMode"]);
                    //airline.Text_InvoiceMode = dr["Text_InvoiceMode"].ToString();
                    airline.IsCashAirline = Convert.ToBoolean(dr["IsCashAirline"]);
                    airline.CashAirline = Convert.ToString(dr["CashAirline"]).ToUpper();
                    airline.SCM = Convert.ToInt32(dr["Scm"]);
                    airline.SCMCycle = dr["ScmCycle"].ToString();
                    airline.Text_SCM = Convert.ToString(dr["Text_SCM"]);
                    airline.SCMDays = dr["ScmDay"].ToString();
                    airline.Text_SCMCycle = Convert.ToInt32(dr["ScmCycle"]) == 0 ? "Weekly" : (Convert.ToInt32(dr["ScmCycle"]) == 1 ? "Fortnightly" : "Monthly");

                    if (Convert.ToInt32(dr["ScmCycle"]) == 0)
                    {
                        airline.Text_SCMDays = Convert.ToInt32(dr["ScmDay"]) == 1 ? "SUNDAY" : (Convert.ToInt32(dr["ScmDay"]) == 2 ? "MONDAY" : (Convert.ToInt32(dr["ScmDay"]) == 3 ? "TUESDAY" : (Convert.ToInt32(dr["ScmDay"]) == 4 ? "WEDNESDAY" : (Convert.ToInt32(dr["ScmDay"]) == 5 ? "THURSDAY" : (Convert.ToInt32(dr["ScmDay"]) == 6 ? "FRIDAY" : "SATURDAY ")))));
                    }
                    else if (Convert.ToInt32(dr["ScmCycle"]) == 1)
                    {
                        airline.Text_SCMDays = Convert.ToInt32(dr["ScmDay"]) == 1 ? "START OF FORTNIGHT" : "END  OF FORTNIGHT";
                    }
                    else
                        airline.Text_SCMDays = Convert.ToInt32(dr["ScmDay"]) == 1 ? "START OF MONTH" : "END OF MONTH";


                    //airline.Text_SCMDays = Convert.ToInt32(dr["ScmDay"]) == 0 ? "Sunday" : (Convert.ToInt32(dr["ScmDay"]) == 1 ? "Monday" : (Convert.ToInt32(dr["ScmDay"]) == 2 ? "Tuesday":(Convert.ToInt32(dr["ScmDay"]) == 3 ? "Wednesday":(Convert.ToInt32(dr["ScmDay"]) == 4 ? "Thursday":(Convert.ToInt32(dr["ScmDay"]) == 5 ? "Friday":"Saturday")));



                    airline.PartnerAirline = Convert.ToString(dr["PartnerAirline"]).ToUpper();
                    airline.Text_PartnerAirline = Convert.ToString(dr["Text_PartnerAirline"]).ToUpper();
                    airline.Commission = dr["Commission"] == DBNull.Value ? (Decimal?)null : Convert.ToDecimal(dr["Commission"]);
                    airline.OverBookingCapacity = Convert.ToInt32(dr["OverBookingCapacity"] == "" ? "0" : dr["OverBookingCapacity"]);
                    airline.FreeSaleCapacity = Convert.ToInt32(dr["FreeSaleCapacity"] == "" ? "0" : dr["FreeSaleCapacity"]);
                    airline.FreeSaleCapacityVol = Convert.ToInt32(dr["FreeSaleCapacityVol"] == "" ? "0" : dr["FreeSaleCapacityVol"]);
                    airline.OverBookingCapacityVol = Convert.ToInt32(dr["OverBookingCapacityVol"] == "" ? "0" : dr["OverBookingCapacityVol"]);

					// Added by Devendra
					//airline.FOH_FWB = Convert.ToInt32(dr["FOH_FWB"] == "" ? "0" : dr["FOH_FWB"]);
					airline.FOH_FWB = Convert.ToInt32("0");
					// Added by Pankaj Kumar Ishwar on 24-01-2018
					airline.DimensionMandatoryOn = Convert.ToInt32(dr["DimensionMandatoryOn"]);
                    airline.DimensionMandatory = Convert.ToInt32(dr["DimensionMandatoryOn"]) == 1 ? "Domestic" : (Convert.ToInt32(dr["DimensionMandatoryOn"]) == 2 ? "International" : (Convert.ToInt32(dr["DimensionMandatoryOn"]) == 3 ? "Both" : "None"));
                    if (!String.IsNullOrEmpty(dr["IsHandled"].ToString()))
                    {
                        airline.IsHandled = Convert.ToBoolean(dr["IsHandled"]);
                        airline.Handling = dr["Handling"].ToString().ToUpper();
                    }
                   
                    airline.AirlineType = Convert.ToInt32(dr["AirlinelineType"]);
                    airline.Text_AirlineType = Convert.ToString(dr["Text_AirlineType"]).ToUpper();
                    
                }
                //if (dr["AirlineMember"].ToString() == "1") {
                //    airline.AirlineMember = "None";
                //}
                //else if (dr["AirlineMember"].ToString() == "2") {
                //    airline.AirlineMember = "ICH";
                //}
                //else if (dr["AirlineMember"].ToString() == "3")
                //{
                //    airline.AirlineMember = "ACH";
                //}
                //airline.Text_AirlineMember = dr["Text_AirlineMember"].ToString();
                airline.AirlineMember = Convert.ToInt32(dr["AirlineMember"]);
                airline.Text_AirlineMember = dr["Text_AirlineMember"].ToString();
                if (!String.IsNullOrEmpty(dr["AirlineSignatory"].ToString()))
                   {
                       airline.AirlineSignatory = Convert.ToBoolean(dr["AirlineSignatory"]);
                       airline.Text_AirlineSignatory = dr["Text_AirlineSignatory"].ToString().ToUpper();
                   }


                //airline.IsAirlineSignatory = Convert.ToBoolean(dr["AirlineSignatory"]);
                //airline.AirlineSignatory = dr["AirlineSignatory"].ToString();
                airline.ISCPercentage = dr["ISCPercentage"] == DBNull.Value ? (Decimal?)null : Convert.ToDecimal(dr["ISCPercentage"]);
                airline.SIS = Convert.ToString(dr["SIS"]).ToUpper();
                airline.MaxStackContainer = Convert.ToInt32(dr["MaxStackContainer"]);
                airline.MaxStackPallets = Convert.ToInt32(dr["MaxStackPallets"]);
               if (!String.IsNullOrEmpty(dr["UCMOutAlert"].ToString()))
                   {
                       airline.UCMOutAlert = Convert.ToInt32(dr["UCMOutAlert"]);
                       airline.Text_UCMOutAlert = dr["Text_UCMOutAlert"].ToString().ToUpper();
                   }
                 if (!String.IsNullOrEmpty(dr["UCMOutAlert"].ToString()))
                   {
                       airline.UCMinAlert = Convert.ToInt32(dr["UCMinAlert"]);
                       airline.Text_UCMinAlert = dr["Text_UCMinAlert"].ToString().ToUpper();
                   }

                 airline.CountryRegistration = dr["CountryRegistration"].ToString().ToUpper();
                 airline.VATRegistrationNumber = dr["VATRegistrationNumber"].ToString().ToUpper();
                 airline.SAPCustomeCode = dr["SAPCustomeCode"].ToString().ToUpper();
                 // Added by Devendra
                // airline.ReserveCapacity = Convert.ToInt32(dr["ReserveCapacity"] == "" ? 0 : dr["ReserveCapacity"]);
               //  airline.ReserveCapacityVol = Convert.ToInt32(dr["ReserveCapacityVol"] == "" ? 0 : dr["ReserveCapacityVol"]);
                 //airline.ReserveCapacity = dr["ReserveCapacity"].Equals(DBNull.Value) ? 0 : Convert.ToInt32(dr["ReserveCapacity"]);
                 //airline.ReserveCapacityVol = dr["ReserveCapacityVol"].Equals(DBNull.Value) ? 0 : Convert.ToInt32(dr["ReserveCapacityVol"]);
                 airline.ReserveCapacity = 0;
                 airline.ReserveCapacityVol = 0;
            }
           
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return airline;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Airline>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts)
                , new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirline", Parameters);
                var AirlineList = ds.Tables[0].AsEnumerable().Select(e => new Airline
                {
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    CarrierCode = e["CarrierCode"].ToString(),
                    Interline = e["Interline"].ToString(),
                    // IsInterline = (Convert.ToBoolean(e["Interline"]) == true) ? "YES" : "NO",
                    Active = e["Active"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirlineList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }
        public List<string> SaveAirline(List<Airline> Airline)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirline = CollectionHelper.ConvertTo(Airline, "Active,Text_AirportCode,Text_CountryName,Text_CurrencyCode,CCAllowed,PartAllowed,CheckModulus7,Interline,Text_InvoicingCycle,AllowedCL,CashAirline,Text_SCM,Text_SCMCycle,Text_SCMDays,Text_PartnerAirline,Text_AirlineMember,Text_AirlineSignatory,Text_UCMOutAlert,Text_UCMinAlert,ReserveCapacity,ReserveCapacityVol,DimensionMandatory,Handling,Text_AirlineType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Airline", dtCreateAirline, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirline;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirline", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public List<string> UpdateAirline(List<Airline> Airline)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirline = CollectionHelper.ConvertTo(Airline, "Active,Text_AirportCode,Text_CountryName,Text_CurrencyCode,CCAllowed,PartAllowed,CheckModulus7,Interline,Text_InvoicingCycle,AllowedCL,CashAirline,Text_SCM,Text_SCMCycle,Text_SCMDays,Text_PartnerAirline,Text_AirlineMember,Text_AirlineSignatory,Text_UCMOutAlert,Text_UCMinAlert,ReserveCapacity,ReserveCapacityVol,DimensionMandatory,Handling,Text_AirlineType");
                BaseBusiness baseBusiness = new BaseBusiness();                                                                                                                                                                                                                                                                                                       

                if (!baseBusiness.ValidateBaseBusiness("Airline", dtCreateAirline, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirline;
                SqlParameter[] Parameters = { param };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAirline", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirline", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }

                return ErrorMessage;
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }
        public List<string> DeleteAirline(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirline", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
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
                    //Error
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public DataSourceResult GetCurrency(String CityCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCurrencyCity", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CurrencyCode"].ToString());
                    cur.Add(dr["CurrencyName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public DataSourceResult GetCreditLimit(String AirlineSNo)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCreditLimitAirline", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CreditLimit"].ToString());
                    cur.Add(dr["MinimumCL"].ToString());
                    cur.Add(dr["AlertCLPercentage"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        #region Airline CC Trans AND Airline Part Trans Created By TARUN KUMAR ON 15th Dec 2015

        public List<Tuple<string, int>> CreateUpdateAirlineCCTrans(string strData)
        {
            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            DataTable dtAirlineCCTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData)).DefaultView.ToTable(true);
            // dtAirlineCCTrans.Rows[0].Delete();
            BaseBusiness baseBusiness = new BaseBusiness();

            if (dtAirlineCCTrans.Columns.Contains("CitySNo"))
                dtAirlineCCTrans.Columns.Remove("CitySNo");
            if (dtAirlineCCTrans.Rows[0][0].ToString() == "undefined")
                dtAirlineCCTrans.Rows.Remove(dtAirlineCCTrans.Rows[0]);
            var dtCreateAirlineCCTrans = (new DataView(dtAirlineCCTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateAirlineCCTrans = (new DataView(dtAirlineCCTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AirlineCCTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            // for create new record
            if (dtAirlineCCTrans.Rows.Count > 0 && dtAirlineCCTrans.Rows[0]["hdnCitySNo"].ToString() == "")
            {
                ret = 548;

            }
            else
            {
                if (dtCreateAirlineCCTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateAirlineCCTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlineCCTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateAirlineCCTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateAirlineCCTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlineCCTrans", Parameters);
                }
            }
            if (ret > 0)
            {
                if (ret == 548)
                {
                    ret = 1004;
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                }
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                }
            }
            return ErrorMessage;
        }

        public KeyValuePair<string, List<AirlineCCTrans>> GetAirlineCCTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            AirlineCCTrans AirlineCCTrans = new AirlineCCTrans();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineCCTransRecord", Parameters);
            var AirlineCCTranslist = ds.Tables[0].AsEnumerable().Select(e => new AirlineCCTrans
            {
                SNo = Convert.ToInt32(e["AirlineSNo"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                HdnCitySNo = e["CitySNo"].ToString(),
                CitySNo = e["CityCode"].ToString(),
                //IsCCAllowed = Convert.ToBoolean(e["IsCCAllowed"].ToString()),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
            });
            return new KeyValuePair<string, List<AirlineCCTrans>>("AirlineSNo", AirlineCCTranslist.AsQueryable().ToList());

        }

        public List<string> DeleteAirlineCCTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineCCTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            else
            {
                ErrorMessage.Add("Record Deleted Successfully");

            }
            return ErrorMessage;
        }

        public List<Tuple<string, int>> CreateUpdateAirlinePartTrans(string strData)
        {
            int ret = 0;
            List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            var dtAirlinePartTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData)).DefaultView.ToTable(true);
            //    dtAirlinePartTrans.Rows[0].Delete();
            BaseBusiness baseBusiness = new BaseBusiness();

            if (dtAirlinePartTrans.Columns.Contains("CitySNo"))
                dtAirlinePartTrans.Columns.Remove("CitySNo");
            if (dtAirlinePartTrans.Rows[0][0].ToString() == "undefined")
                dtAirlinePartTrans.Rows.Remove(dtAirlinePartTrans.Rows[0]);
            var dtCreateAirlinePartTrans = (new DataView(dtAirlinePartTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateAirlinePartTrans = (new DataView(dtAirlinePartTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AirlinePartTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            // for create new record
            if (dtAirlinePartTrans.Rows.Count > 0 && dtAirlinePartTrans.Rows[0]["hdnCitySNo"].ToString() == "")
            {
                ret = 548;

            }
            else
            {
                if (dtCreateAirlinePartTrans.Rows.Count > 0)
                {
                    param.Value = dtCreateAirlinePartTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlinePartTrans", Parameters);
                }
                // for update existing record
                if (dtUpdateAirlinePartTrans.Rows.Count > 0)
                {
                    param.Value = dtUpdateAirlinePartTrans;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlinePartTrans", Parameters);
                }
            }
            if (ret > 0)
            {
                if (ret == 548)
                {
                    ret = 1004;
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                }
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                }
            }
            return ErrorMessage;

        }

        public KeyValuePair<string, List<AirlinePartTrans>> GetAirlinePartTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            AirlinePartTrans AirlinePartTrans = new AirlinePartTrans();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlinePartTransRecord", Parameters);
            var AirlinePartTranslist = ds.Tables[0].AsEnumerable().Select(e => new AirlinePartTrans
            {
                SNo = Convert.ToInt32(e["AirlineSNo"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                HdnCitySNo = e["CitySNo"].ToString(),
                CitySNo = e["CityCode"].ToString(),
                //IsPartAllowed = Convert.ToBoolean(e["IsPartAllowed"].ToString()),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
            });
            return new KeyValuePair<string, List<AirlinePartTrans>>("AirlineSNo", AirlinePartTranslist.AsQueryable().ToList());

        }

        public List<string> DeleteAirlinePartTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlinePartTrans", Parameters);
            BaseBusiness baseBusiness = new BaseBusiness();
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }

            else
            {
                ErrorMessage.Add("Record Deleted Successfully");
            }
            return ErrorMessage;
        }

        public KeyValuePair<string, List<RecipientMessageTrnas>> RecipientMessageAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            RecipientMessageTrnas Recipient = new RecipientMessageTrnas();


            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_AirlineGetRecipientMessageRecord", Parameters);
            var RecipientMessageTrnasList = ds.Tables[0].AsEnumerable().Select(e => new RecipientMessageTrnas
            {
                MessageMovementType = e["MessageMovementType"].ToString(),
                MessageType = e["MessageType"].ToString(),
                DestinationCountry = e["DestinationCountry"].ToString(),
                DestinationCity = e["DestinationCity"].ToString(),
                MessageVersion = e["MessageVersion"].ToString(),
                Basis = e["Basis"].ToString(),
                CutOffMins = e["CutOffMins"].ToString()
            });
            return new KeyValuePair<string, List<RecipientMessageTrnas>>("MessageMovementType", RecipientMessageTrnasList.AsQueryable().ToList());

        }

        #endregion


        public string GetCountry(int CitySNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@CitySNo", CitySNo),
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetTaxCountry", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string GetCountryInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCountryInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string UpdateDays(string recordID, string DDays, string IDays, int User)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@DDays", DDays), new SqlParameter("@IDays", IDays), new SqlParameter("@User", User) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAirlineDays", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)//
            {

                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetDays(string recordID)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineDays", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        /*----------------Add By Pankaj Kumar Ishwar on 25/06/2018----------------*/
        public KeyValuePair<string, List<AirlineParameterInformation>> GetAirlineParameterRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirlineParameterInformation AirlineParameterInformation = new AirlineParameterInformation();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AirlineSNo", recordID),
                                           new SqlParameter("@PageNo", page),
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@WhereCondition", whereCondition),
                                           new SqlParameter("@OrderBy", sort)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineParameterRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    var AirlineParameterInformationList = ds.Tables[0].AsEnumerable().Select(e => new AirlineParameterInformation
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                        AirlineParameterText = Convert.ToString(e["AirlineParameterText"]).ToUpper(),
                        AirlineParameterValue = e["AirlineParameterValue"].ToString().ToUpper(),
                        Active = e["Active"].ToString(),
                        IsActive = Convert.ToBoolean(e["IsActive"]),
                        ParameterType = Convert.ToInt32(e["ParameterType"]),
                        SeqNo = Convert.ToInt32(e["SeqNo"]),
                        IsVisible = Convert.ToBoolean(e["IsVisible"]),
                        Visible = e["Visible"].ToString(),
                        ParameterRemarks = e["ParameterRemarks"].ToString()
                });
                    return new KeyValuePair<string, List<AirlineParameterInformation>>(ds.Tables[0].Rows[0][0].ToString(), AirlineParameterInformationList.AsQueryable().ToList());
                }
                else
                    return new KeyValuePair<string, List<AirlineParameterInformation>>(string.Empty, null);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

  
        public List<string> DeleteAirlineParameter(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineParameter", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
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
            catch (Exception ex)//
            {
                throw ex;
            }
        }


 
        public string CreateUpdateAirlineParameter(List<AirlineParameterInformation> AirlineParameterInformation)
        {

            try
            {
                List<string> ErrorMessage = new List<string>();

                DataTable dtOtherAirlines = CollectionHelper.ConvertTo(AirlineParameterInformation,"Insert,Active,Visible");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramRateDetails = new SqlParameter();
                paramRateDetails.ParameterName = "@AirlineParameterType";
                paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateDetails.Value = dtOtherAirlines;
                SqlParameter[] Parameters = { paramRateDetails };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateUpdateAirlineParameter", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        /*----------------End----------------*/
    }
}