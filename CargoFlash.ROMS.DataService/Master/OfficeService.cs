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

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class OfficeService : SignatureAuthenticate, IOfficeService
    {
        #region Region used for Master office Detail
        /// <summary>
        ///  Get list of the records to be shown in the grid on Pageload
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>office.
        /// <returns></returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Office>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListOffice", Parameters);
                var OfficeList = ds.Tables[0].AsEnumerable().Select(e => new Office
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString().ToUpper(),
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                    CreditLimitOnAgent=e["CreditLimitOnAgent"].ToString(),
                    CreditLimitOfOffice=e["CreditLimitOfOffice"].ToString(),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    CurrencyCode = e["CurrencyCode"].ToString(),
                    //SitaAddress = e["SitaAddress"].ToString(),
                    CustomsOriginCode = e["CustomsOriginCode"].ToString(),
                    //RegulatedAgentRegNo = e["RegulatedAgentRegNo"].ToString(),
                    OfficeType = e["OfficeType"].ToString(),
                    //GSTNumber = e["GSTNumber"].ToString()
                    //AgentRegExpirydate = DateTime.Parse(e["AgentRegExpirydate"].ToString())
                    Airline = e["Airline"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = OfficeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// <param name="office"></param>
        /// <returns></returns>
        public List<string> SaveOffice(List<Office> office)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtcreateoffice = CollectionHelper.ConvertTo(office, "Text_CitySNo,Text_CurrencySNo,BankGuarantee,Self,Active,AllowedCl,UserCreatedBy,UserUpdatedBy,Text_ParentID,HeadOffice,Text_OfficeType,Text_AirportSNo,hidenOfficeType,ConsolidatedStock,CreditLimitOnAgent,CreditLimitOfOffice,Text_InvoicingCycle,Airline");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Office", dtcreateoffice, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtcreateoffice;
                SqlParameter[] Parameters = { param };
                
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOffice", Parameters);
                //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, "SaveDirectPayment", Parameters);
                //return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (ret > 0)
                {

                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Office");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }

                   else if (ret == 545)
                    {
                        ErrorMessage.Add("Office Name " + dtcreateoffice.Rows[0]["Name"] + " already exist for " + dtcreateoffice.Rows[0]["CityName"]);
                    }
                   else if (ret == 546)
                    {
                        ErrorMessage.Add("GSA Office"+ " already exist for " + dtcreateoffice.Rows[0]["CityName"]);
                    }

                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch(Exception ex)//// (Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        /// <summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public Office GetRecordOffice(string recordID, string UserSNo)
        {
            Office office = new Office();
            SqlDataReader dr = null;
            try
            {
               
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordOffice", Parameters);
                if (dr.Read())
                {
                    office.SNo = Convert.ToInt32(dr["SNo"]);
                    office.ParentID = int.Parse(dr["ParentID"].ToString() == "" ? "0" : dr["ParentID"].ToString());
                    if (dr["ParentID"].ToString() != "0")
                        office.Text_ParentID = dr["Text_ParentID"].ToString().ToUpper();
                    else
                        office.Text_ParentID = "";
                    //office.SitaAddress = dr["SitaAddress"].ToString().ToUpper();
                    office.CustomsOriginCode = dr["CustomsOriginCode"].ToString().ToUpper();
                    //office.RegulatedAgentRegNo = dr["RegulatedAgentRegNo"].ToString().ToUpper();
                    //office.AgentRegExpirydate = DateTime.Parse(dr["AgentRegExpirydate"].ToString());
                    office.CitySNo = int.Parse(dr["CitySNo"].ToString());
                    office.Text_CitySNo = dr["cityCode"].ToString().ToUpper();
                    office.AirportSNo = int.Parse(dr["AirportSNo"].ToString());
                    office.Text_AirportSNo = dr["AirportCode"].ToString().ToUpper();

                    office.Longitude = Decimal.Parse(dr["Longitude"].ToString());
                    office.Latitude = Decimal.Parse(dr["Latitude"].ToString());
                    office.Name = dr["Name"].ToString().ToUpper();
                    office.Address = dr["Address"].ToString().ToUpper();
                    office.ERPCode = dr["ERPCode"].ToString().ToUpper();
                    office.CurrencySNo = dr["CurrencySNo"].ToString();
                    office.Text_CurrencySNo = dr["CurrencyCode"].ToString();
                    office.ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString());
                    office.ValidTo = DateTime.Parse(dr["ValidTo"].ToString());
                    office.CreditLimit = Decimal.Parse(dr["CreditLimit"].ToString());
                    office.MinimumCL = Decimal.Parse(dr["MinimumCL"].ToString());
                    office.AlertClPerCentage = Decimal.Parse(dr["AlertClPerCentage"].ToString());
                    if (!String.IsNullOrEmpty(dr["IsSelf"].ToString()))
                    {
                        office.IsSelf = Convert.ToBoolean(dr["IsSelf"]);
                        office.Self = dr["Self"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        office.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        office.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsAllowedCL"].ToString()))
                    {
                        office.IsAllowedCL = Convert.ToBoolean(dr["IsAllowedCL"]);
                        office.AllowedCl = dr["AllowedCL"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["AllowCreditLimitOnAgent"].ToString()))
                    {
                        office.AllowCreditLimitOnAgent = Convert.ToBoolean(dr["AllowCreditLimitOnAgent"]);
                        office.CreditLimitOnAgent = dr["CreditLimitOnAgent"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["AllowCreditLimitOfOffice"].ToString()))
                    {
                        office.AllowCreditLimitOfOffice = Convert.ToBoolean(dr["AllowCreditLimitOfOffice"]);
                        office.CreditLimitOfOffice = dr["CreditLimitOfOffice"].ToString().ToUpper();
                    }
                    office.InvoicingCycle = Convert.ToInt32(dr["InvoicingCycle"]);
                    office.Text_InvoicingCycle = dr["Text_InvoicingCycle"].ToString();
                    office.UserCreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    office.UserUpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    if (!String.IsNullOrEmpty(dr["IsHeadOffice"].ToString()))
                    {
                        office.IsHeadOffice = Convert.ToBoolean(dr["IsHeadOffice"]);
                        office.HeadOffice = dr["HeadOffice"].ToString().ToUpper();
                    }
                    office.OfficeType = dr["OfficeTypeSNo"].ToString();
                    office.Text_OfficeType = dr["OfficeType"].ToString();
                    office.hidenOfficeType = dr["OfficeType"].ToString();
                    if (!String.IsNullOrEmpty(dr["IsConsolidatedStock"].ToString()))
                    {
                        office.IsConsolidatedStock = Convert.ToBoolean(dr["IsConsolidatedStock"]);
                        office.ConsolidatedStock = dr["ConsolidatedStock"].ToString().ToUpper();//Added by Akaram Ali on 18 nov 2017
                    }
                    office.GSTNumber = Convert.ToString(dr["GSTNumber"]);
                    office.SMS = Convert.ToBoolean(dr["SMS"]) == false ? false : true;
                    office.Message = Convert.ToBoolean(dr["Message"]) == false ? false : true;
                    office.MessageCSR = Convert.ToBoolean(dr["MessageCSR"]) == false ? false : true;
                    office.Mobile = Convert.ToString(dr["Mobile"]).ToUpper();
                    office.Email = Convert.ToString(dr["Email"]).ToUpper();
                    office.EmailID = Convert.ToString(dr["EmailID"]).ToUpper();
                    office.InvoiceDays = Convert.ToInt32(dr["InvoiceDays"]);
                    office.StockUtilization = Convert.ToInt32(dr["StockUtilization"]);

                }
                dr.Close();
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return office;
        }

        public List<string> UpdateOffice(List<Office> office)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtupdateoffice = CollectionHelper.ConvertTo(office, "Text_AirlineSNo,Text_CitySNo,Text_CurrencySNo,BankGuarantee,Self,Active,AllowedCl,UserCreatedBy,UserUpdatedBy,Text_ParentID,HeadOffice,Text_OfficeType,Text_AirportSNo,hidenOfficeType,ConsolidatedStock,CreditLimitOnAgent,CreditLimitOfOffice,Text_InvoicingCycle,Airline");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Office", dtupdateoffice, "Update"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtupdateoffice;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOffice", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Office");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }

                   else if (ret == 545)
                    {
                        ErrorMessage.Add("Office Name " + dtupdateoffice.Rows[0]["Name"] + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
                    }
                    else if (ret == 546)
                    {
                        ErrorMessage.Add("GSA Office" + " already exist for " + dtupdateoffice.Rows[0]["CityName"]);
                    }

                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        /// <summary>
        /// InActive the perticular Office information
        /// </summary>
        /// <param name="RecordID">Id of that Office </param>
        public List<string> DeleteOffice(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@OfficeCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOffice", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        //#region THis Region Used for Insert and Update and Fetch record for Assign office Commision

        /// <summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public List<string> CreateUpdateOfficeCommision(string strDate)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtOfficeCommision = JsonConvert.DeserializeObject<DataTable>(strDate);
                if (dtOfficeCommision.Columns.Contains("OfficeCommisionType"))
                    dtOfficeCommision.Columns.Remove("OfficeCommisionType");
                var dtCreateOfficeCommision = (new DataView(dtOfficeCommision, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdatedtOfficeCommision = (new DataView(dtOfficeCommision, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeCommisionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateOfficeCommision.Rows.Count > 0)
                {
                    if (dtCreateOfficeCommision.Columns.Contains("OfficeCommisionType"))
                        dtCreateOfficeCommision.Columns.Remove("OfficeCommisionType");
                    param.Value = dtCreateOfficeCommision;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOfficeCommision", Parameters);
                }
                // for update existing record
                if (dtUpdatedtOfficeCommision.Rows.Count > 0)
                {
                    if (dtCreateOfficeCommision.Columns.Contains("OfficeCommisionType"))
                        dtCreateOfficeCommision.Columns.Remove("OfficeCommisionType");
                    param.Value = dtUpdatedtOfficeCommision;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeCommision", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public KeyValuePair<string, List<OfficeCommision>> GetOfficeCommisionRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                OfficeCommision officeCommision = new OfficeCommision();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeCommisionRecord", Parameters);
                var officeCommisionList = ds.Tables[0].AsEnumerable().Select(e => new OfficeCommision
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    OfficeSNo = Convert.ToInt32(e["OfficeSno"]),
                    OfficeCommisionType = e["CommisionType"].ToString(),
                    NetNet = Convert.ToInt16(e["NetNet"].ToString()),
                    NetNetCommision = e["strNetNet"].ToString(),
                    CommisionType = Convert.ToInt32(e["CommisionType"].ToString()),
                    CommisionTypeoffice = e["strCommisionType"].ToString(),
                    CommisionAmount = Convert.ToDecimal(e["CommisionAmount"].ToString()),
                    IncentiveType = Convert.ToInt32(e["IncentiveType"].ToString()),
                    OfficeIncentive = e["strIncentiveType"].ToString(),
                    IncentiveAmount = Convert.ToDecimal(e["IncentiveAmount"].ToString()),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                    IsActive = bool.Parse(e["IsActive"].ToString()),
                    Active = e["IsActive"].ToString() == "True" ? "YES" : "NO",
                });
                return new KeyValuePair<string, List<OfficeCommision>>(ds.Tables[1].Rows[0][0].ToString(), officeCommisionList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// delte  the perticular office Commision
        /// </summary>
        /// <param name="RecordID">Id of that OfficeCommision</param>
        public List<string> DeleteOfficeCommision(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOfficeCommision", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        #endregion

        #region THis Region Used for Insert and Update and Fetch record for Assign office to airline
        /// <summary>
        /// Method Used to Insert Record in OfficeAirlineTrans and Update
        /// </summary>
        /// <param name="strDate"></param>
        /// <returns></returns>
        public List<Tuple<string, int>> CreateUpdateOfficeAirlineTrans(string strData)
        {
            try
            {
                int ret = 0;
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtOfficeAirlineTrans = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));

                // var dtCreateOfficeAirlineTrans = (new DataView(dtOfficeAirlineTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateOfficeAirlineTrans = (new DataView(dtOfficeAirlineTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeAirlineTransTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                // if (dtOfficeAirlineTrans.Rows.Count > 0 && Convert.ToInt32(dtCreateOfficeAirlineTrans.Rows[0]["SNo"].ToString()) == 0)
                if (dtOfficeAirlineTrans.Rows.Count > 0)
                {
                    //if (dtCreateOfficeAirlineTrans.Columns.Contains("AirlineSNo"))
                    //    dtCreateOfficeAirlineTrans.Columns.Remove("AirlineSNo");
                    //if (dtCreateOfficeAirlineTrans.Columns.Contains("AirlineCode"))
                    //    dtCreateOfficeAirlineTrans.Columns.Remove("AirlineCode");
                    param.Value = dtOfficeAirlineTrans;
                    SqlParameter[] Parameters = {param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)
                (System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

                    //ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateOfficeAirlineTrans", Parameters);
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpadateOfficeAirlineTrans", Parameters);
                }

                if (ret > 0)
                {
                    if (ret == 547)
                    {
                        ret = 2003;
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else if (ret < 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }

                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            // for update existing record
            //if (dtUpdateOfficeAirlineTrans.Rows.Count > 0 && ret==0)
            //{
            //    //if (dtUpdateOfficeAirlineTrans.Columns.Contains("AirlineSNo"))
            //    //    dtUpdateOfficeAirlineTrans.Columns.Remove("AirlineSNo");
            //    //if (dtUpdateOfficeAirlineTrans.Columns.Contains("AirlineCode"))
            //    //    dtUpdateOfficeAirlineTrans.Columns.Remove("AirlineCode");
            //    param.Value = dtUpdateOfficeAirlineTrans;
            //    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeAirlineTrans", Parameters);

            //    if (ret > 0)
            //    {
            //        if (ret > 1000)
            //        {
            //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
            //            if (!string.IsNullOrEmpty(serverErrorMessage))
            //                ErrorMessage.Add(serverErrorMessage);
            //        }
            //        else
            //        {
            //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
            //            string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
            //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
            //                ErrorMessage.Add(dataBaseExceptionMessage);
            //        }
            //    }

            //}

        }

        public KeyValuePair<string, List<OfficeAirlineTrans>> GetOfficeAirlineTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                OfficeAirlineTrans officeAirlineTrans = new OfficeAirlineTrans();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeAirlineTransRecord", Parameters);
                var OfficeAirlineTransList = ds.Tables[0].AsEnumerable().Select(e => new OfficeAirlineTrans
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    OfficeSNo = Convert.ToInt32(e["OfficeSno"]),
                    HdnAirlineCode = int.Parse(e["AirlineSNo"].ToString().ToUpper()),
                    AirlineCode = (e["AirlineCode"].ToString()),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                    IsActive = bool.Parse(e["IsActive"].ToString()),
                    Active = e["IsActive"].ToString() == "True" ? "YES" : "NO",
                    FFM = e["FFM"].ToString(),
                    FAAEmail = e["FAAEmail"].ToString(),
                    FAASMSMobile = e["FAASMSMobile"].ToString(),
                    FFMStatus = Convert.ToInt32(e["FFMStatus"])
                });
                return new KeyValuePair<string, List<OfficeAirlineTrans>>(ds.Tables[1].Rows[0][0].ToString(), OfficeAirlineTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<AcceptanceVariance>> GetAcceptanceVarianceRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AcceptanceVariance officeAirlineTrans = new AcceptanceVariance();
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAcceptanceVarianceRecord1", Parameters);
                var OfficeAirlineTransList = ds.Tables[0].AsEnumerable().Select(e => new AcceptanceVariance
                {
                    SNo = Convert.ToInt32(e["OfficeAirlineTransSNo"]),
                    AirlineCode = (e["AirlineCode"].ToString()),
                    HdnAirlineCode = int.Parse(e["AirlineSNo"].ToString().ToUpper()),
                    FblFwbGrWt = Convert.ToDecimal(e["FblFwbGrWt"]),
                    FblFwbVolWt = Convert.ToDecimal(e["FblFwbVolWt"]),
                    FwbFohGrWt = Convert.ToDecimal(e["FwbFohGrWt"]),
                    FwbFohVolWt = Convert.ToDecimal(e["FwbFohVolWt"]),
                    FblFohGrWt = Convert.ToDecimal(e["FblFohGrWt"]),
                    FblFohVolWt = Convert.ToDecimal(e["FblFohVolWt"]),
                    OfficeSNo = e["OfficeSNo"].ToString(),
                    OfficeAirlineTransSNo = e["OfficeAirlineTransSNo"].ToString()

                });
                return new KeyValuePair<string, List<AcceptanceVariance>>(ds.Tables[1].Rows[0][0].ToString(), OfficeAirlineTransList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// delte  the perticular office Commision
        /// </summary>
        /// <param name="RecordID">Id of that OfficeCommision</param>
        public List<string> DeleteOfficeAirline(string recordID)
        {
            int ret = 0;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOfficeAirline", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        #endregion

        public List<string> DeleteAcceptanceVariance(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAcceptanceVariance", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<OfficeContactInformation>> GetContactInformationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                OfficeContactInformation contactInformation = new OfficeContactInformation();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@OfficeSNo", recordID),
                                           new SqlParameter("@PageNo", page),
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@WhereCondition", whereCondition),
                                           new SqlParameter("@OrderBy", sort)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOfficeContactInformationRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    var contactInformationList = ds.Tables[0].AsEnumerable().Select(e => new OfficeContactInformation
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        OfficeSNo = Convert.ToInt32(e["OfficeSNo"]),
                        Name = e["Name"].ToString().ToUpper(),
                        EmailId = e["EmailId"].ToString().ToUpper(),
                        MobileNo = e["MobileNo"].ToString(),
                        PhoneNo = e["PhoneNo"].ToString(),
                        Address = e["Address"].ToString().ToUpper(),
                        PostalCode = e["PostalCode"].ToString().ToUpper(),
                        CountryName = e["CountryName"].ToString(),
                        HdnCountryName = e["CountryNameSNo"].ToString(),
                        CityName = e["CityName"].ToString(),
                        HdnCityName = e["CityNameSNo"].ToString(),
                        Active = e["Active"].ToString(),
                        IsActive = e["IsActive"].ToString()
                    });
                    return new KeyValuePair<string, List<OfficeContactInformation>>(ds.Tables[0].Rows[0][0].ToString(), contactInformationList.AsQueryable().ToList());
                }
                else
                    return new KeyValuePair<string, List<OfficeContactInformation>>(string.Empty, null);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> CreateUpdateOfficeContact(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dt = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                DataTable dtAccountContact = new DataTable();
                dtAccountContact.Columns.Add("SNo", typeof(int));
                dtAccountContact.Columns.Add("OfficeSNo", typeof(int));
                dtAccountContact.Columns.Add("Name");
                dtAccountContact.Columns.Add("CountryCode");
                dtAccountContact.Columns.Add("CitySNo", typeof(int));
                dtAccountContact.Columns.Add("Email");
                dtAccountContact.Columns.Add("Mobile");
                dtAccountContact.Columns.Add("Phone");
                dtAccountContact.Columns.Add("Address");
                //  dtAccountContact.Columns.Add("CitySNo", typeof(int));
                dtAccountContact.Columns.Add("PostalCode");
                //  dtAccountContact.Columns.Add("CountryCode");
                dtAccountContact.Columns.Add("IsActive", typeof(bool));
                dtAccountContact.Columns.Add("CreatedBy", typeof(int));
                dtAccountContact.Columns.Add("UpdatedBy", typeof(int));
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtAccountContact.NewRow();
                    drRow["SNo"] = dr["SNo"];
                    drRow["OfficeSNo"] = dr["OfficeSNo"];
                    drRow["Name"] = dr["Name"];
                    drRow["CountryCode"] = dr["HdnCountryName"];
                    drRow["CitySNo"] = dr["HdnCityName"];
                    drRow["Email"] = dr["EmailId"];
                    drRow["Mobile"] = dr["MobileNo"];
                    drRow["Phone"] = dr["PhoneNo"];
                    drRow["Address"] = dr["Address"];

                    drRow["PostalCode"] = dr["PostalCode"];

                    drRow["IsActive"] = dr["Active"].ToString() == "1" ? true : false;
                    drRow["CreatedBy"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    drRow["UpdatedBy"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    dtAccountContact.Rows.Add(drRow);
                }
                //var dtCreateOfficeContact = (new DataView(dtAccountContact, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateOfficeContact = (new DataView(dtAccountContact, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@OfficeContactType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtAccountContact.Rows.Count > 0)
                {
                    param.Value = dtAccountContact;
                    SqlParameter[] Parameters = { param };


                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateOfficeContact", Parameters);

                    // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateUpdateOfficeContact", Parameters);
                }
                // for update existing record
                //if (dtUpdateOfficeContact.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateOfficeContact;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateOfficeContact", Parameters);
                //}
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> CreateUpdateAcceptanceVariance(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dt = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                DataTable dtAcceptanceVariance = new DataTable();
                dtAcceptanceVariance.Columns.Add("SNo");
                dtAcceptanceVariance.Columns.Add("AirlineSNo");
                dtAcceptanceVariance.Columns.Add("FblFwbGrWt");
                dtAcceptanceVariance.Columns.Add("FblFwbVolWt");
                dtAcceptanceVariance.Columns.Add("FwbFohGrWt");
                dtAcceptanceVariance.Columns.Add("FwbFohVolWt");
                dtAcceptanceVariance.Columns.Add("FblFohGrWt");
                dtAcceptanceVariance.Columns.Add("FblFohVolWt");
                dtAcceptanceVariance.Columns.Add("UpdatedOn", typeof(DateTime));
                dtAcceptanceVariance.Columns.Add("UpdatedBy");
                dtAcceptanceVariance.Columns.Add("OfficeSNo");
                dtAcceptanceVariance.Columns.Add("OfficeAirlineTransSNo");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtAcceptanceVariance.NewRow();
                    drRow["SNo"] = dr["HdnAirlineCode"] == "" ? null : dr["HdnAirlineCode"];
                    drRow["AirlineSNo"] = dr["HdnAirlineCode"] == "" ? null : dr["HdnAirlineCode"];
                    drRow["FblFwbGrWt"] = dr["FblFwbGrWt"] == "" ? null : dr["FblFwbGrWt"];
                    drRow["FblFwbVolWt"] = dr["FblFwbVolWt"] == "" ? null : dr["FblFwbVolWt"];
                    drRow["FwbFohGrWt"] = dr["FwbFohGrWt"] == "" ? null : dr["FwbFohGrWt"];
                    drRow["FwbFohVolWt"] = dr["FwbFohVolWt"] == "" ? null : dr["FwbFohVolWt"];
                    drRow["FblFohGrWt"] = dr["FblFohGrWt"] == "" ? null : dr["FblFohGrWt"];
                    drRow["FblFohVolWt"] = dr["FblFohVolWt"] == "" ? null : dr["FblFohVolWt"];
                    drRow["UpdatedOn"] = DateTime.Now;
                    drRow["UpdatedBy"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    drRow["OfficeSNo"] = dr["OfficeSNo"] == "" ? null : dr["OfficeSNo"];
                    drRow["OfficeAirlineTransSNo"] = dr["OfficeAirlineTransSNo"] == "" ? null : dr["OfficeAirlineTransSNo"];
                    dtAcceptanceVariance.Rows.Add(drRow);
                }
                //var dtCreateAcceptanceVariance = (new DataView(dtAcceptanceVariance, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                //var dtUpdateAcceptanceVariance
                //    = (new DataView(dtAcceptanceVariance, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();

                if (!baseBussiness.ValidateBaseBusiness("AcceptanceVariance", dtAcceptanceVariance, "SAVE"))
                {
                    ErrorMessage = baseBussiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AcceptanceVarianceTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtAcceptanceVariance.Rows.Count > 0)
                {
                    param.Value = dtAcceptanceVariance;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAcceptanceVariance", Parameters);
                }
                // for update existing record
                //if (dtUpdateAcceptanceVariance.Rows.Count > 0)
                //{
                //    param.Value = dtUpdateAcceptanceVariance;
                //    SqlParameter[] Parameters = { param };
                //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAcceptanceVariance" "UpdateOfficeAirlineTrans", Parameters);
                //}
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AcceptanceVarianceInformation");
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
                else
                {
                    ErrorMessage.Add("Acceptance Variance added successfully");
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> DeleteOfficeContact(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOfficeContact", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Office");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string GetAirportInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)// //(Exception)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        /* Author : chandra prakash singh 
           Modification Date  : 27/12/2016
           desc : add function GetAssociatedAirlineCount for get return row number from database
        */

        public string GetIsdCode(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCountryIsdCode", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)// //(Exception)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string GetAssociatedAirlineCount(string masterTableSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@masterTableSNo", masterTableSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAssociatedAirlineCount", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//// (Exception)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /* Author : shahbaz akhtar 
         Modification Date  : 12/01/2017
         desc : add function GetCurrencyInformation for get return currrency from database
      */
        public string GetCurrencyInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCurrencyInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//// (Exception)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /* Author :    DEVENDRA SINGH SIKARWAR
       Added on  :  01 JAN 2018
       desc : add function GetOfficeBranchRecord for get return branch from database
     */
        public KeyValuePair<string, List<Office>> GetofficeBranchRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                Office branch = new Office();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@officeSNo", recordID)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetofficeBranchRecord", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    var branchList = ds.Tables[0].AsEnumerable().Select(e => new Office
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        CityCode = e["CityCode"].ToString(),
                        CityName = e["CityName"].ToString(),
                        Name = e["Name"].ToString(),
                        Address = e["Address"].ToString()
                    });
                    return new KeyValuePair<string, List<Office>>(ds.Tables[0].Rows[0][0].ToString(), branchList.AsQueryable().ToList());
                }
                else
                    return new KeyValuePair<string, List<Office>>(string.Empty, null);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


    }

   
}
