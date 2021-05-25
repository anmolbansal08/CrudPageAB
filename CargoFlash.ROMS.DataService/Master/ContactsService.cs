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
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ContactsService : SignatureAuthenticate, IContactsService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Contacts>(filter);
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListContacts", Parameters);
                var ContactsList = ds.Tables[0].AsEnumerable().Select(e => new Contacts
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ContactsTypeName = e["ContactsTypeName"].ToString(),
                    ContactsTypeDis = e["ContactsTypeDis"].ToString(),
                    Name = e["Name"].ToString(),
                    DepartmentName = e["DepartmentName"].ToString().ToUpper(),
                    PersonName = e["PersonName"].ToString(),
                    Email = e["Email"].ToString(),
                    Mobile = e["Mobile"].ToString(),
                    Phone = e["Phone"].ToString(),
                    Primary = e["Primary"].ToString(),
                    Active = e["Active"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ContactsList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public Contacts GetContactsRecord(string RecordID, string UserID)
        {
            try
            {
                Contacts Contact = new Contacts();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordContacts", Parameters);

                if (dr.Read())
                {
                    Contact.SNo = Convert.ToInt32(dr["SNo"]);
                    Contact.ContactsType = Convert.ToInt32(dr["ContactsType"].ToString());
                    Contact.ContactsTypeDis = dr["ContactsTypeDis"].ToString().ToUpper();
                    Contact.ContactTypeSNo = Convert.ToInt32(dr["ContactTypeSNo"].ToString());
                    Contact.Text_ContactTypeSNo = Convert.ToString(dr["Text_ContactTypeSNo"].ToString()).ToUpper();
                    Contact.Name = Convert.ToString(dr["ContactName"]).ToUpper();
                    Contact.DepartmentSNo = Convert.ToInt32(dr["DepartmentSNo"]);
                    Contact.Text_DepartmentSNo = Convert.ToString(dr["DepartmentName"]).ToUpper();
                    Contact.DepartmentName = Convert.ToString(dr["DepartmentName"]).ToUpper();
                    Contact.PersonName = Convert.ToString(dr["PersonName"]).ToUpper();
                    Contact.Email = Convert.ToString(dr["Email"]);
                    Contact.IsPrimary = Convert.ToBoolean(dr["IsPrimary"].ToString());
                    Contact.Primary = Convert.ToString(dr["Primary"].ToString()).ToUpper();
                    Contact.Mobile = Convert.ToString(dr["Mobile"]);
                    Contact.Phone = Convert.ToString(dr["Phone"]);
                    Contact.Address = Convert.ToString(dr["Address"]).ToUpper();
                    Contact.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    Contact.Text_CitySNo = Convert.ToString(dr["CityCode"]).ToUpper();
                    Contact.PostalCode = Convert.ToString(dr["PostalCode"]).ToUpper();
                    Contact.CountryCode = Convert.ToString(dr["CountryCode"]).ToUpper();
                    Contact.Text_CountryCode = Convert.ToString(dr["CountryName"]).ToUpper();
                    Contact.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                    Contact.Active = dr["Active"].ToString();
                    Contact.UpdatedBy = dr["UpdatedUser"].ToString();
                    Contact.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return Contact;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveContacts(List<Contacts> Contacts)
        {
            //validate Business Rule
            
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateAccount = CollectionHelper.ConvertTo(Contacts, "Text_ContactTypeSNo,ContactsTypeName,ContactsTypeDis,Text_DepartmentSNo,Text_CitySNo,Text_CountryCode,Active,Primary,CreatedUser,UpdatedUser");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Contacts", dtCreateAccount, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter paramAccount = new SqlParameter();
                paramAccount.ParameterName = "@Contacts";
                paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
                paramAccount.Value = dtCreateAccount;
                SqlParameter[] Parameters = { paramAccount };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateContacts", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Contacts");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> UpdateContacts(List<Contacts> Contacts)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtUpdateContacts = CollectionHelper.ConvertTo(Contacts, "Text_ContactTypeSNo,ContactsTypeName,ContactsTypeDis,Text_DepartmentSNo,Text_CitySNo,Text_CountryCode,Active,Primary,CreatedUser,UpdatedUser");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Contacts", dtUpdateContacts, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@Contacts";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateContacts;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateContacts", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Contacts");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteContacts(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteContacts", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Contacts");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public DataSourceResult GetCity(String CountryCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCityAutocomplete", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["SNo"].ToString());
                    cur.Add(dr["CityCode"].ToString());

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


        public DataSourceResult CheckIsPrimary(string contactType, string contactTypeSNo, string primary, string Sno)
        {
            List<String> cur = new List<String>();
            try
            {
                primary = (primary == "0" ? "1" : "0");

                SqlParameter[] Parameters = { new SqlParameter("@contactType", contactType), new SqlParameter("@contactTypeSNo", contactTypeSNo), new SqlParameter("@primary", primary), new SqlParameter("@Sno", Sno) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckisPrimary", Parameters);
                if (dr.HasRows)
                {
                    if (dr.Read())
                    {
                        cur.Add(dr["ReturnNo"].ToString());
                    }
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

    }
}
