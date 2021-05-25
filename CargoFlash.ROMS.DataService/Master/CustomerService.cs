using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using System.Drawing;
using Image = System.Drawing.Image;
using System.Runtime.InteropServices;
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlash.Cargo.DataService.Master
{
    #region Customer Service Description
    /*
	*****************************************************************************
	Service Name:	CustomerService      
	Purpose:		This Service used to get details of Customer save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 feb 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CustomerService : SignatureAuthenticate, ICustomerService
    {
        public Customer GetCustomerRecord(string recordID, string UserSNo)
        {
            Customer Customer = new Customer();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomer", Parameters);
                if (dr.Read())
                {
                    Customer.SNo = Convert.ToInt32(dr["SNo"]);
                    Customer.CustomerTypeName = dr["CustomerTypeName"].ToString().ToUpper();
                    Customer.CustomerTypeSNo = Convert.ToString(dr["CustomerTypeSNo"]).ToUpper();
                    Customer.AccountName = dr["AccountName"].ToString().ToUpper();
                    Customer.AccountSNo = Convert.ToString(dr["AccountSNo"]).ToUpper();
                    Customer.AccountNo = dr["AccountNo"].ToString().ToUpper();
                    Customer.SecurityCode = dr["SecurityCode"].ToString().ToUpper();
                    Customer.Text_CityCode = dr["CityCode"].ToString().ToUpper() + "-" + dr["CityName"].ToString().ToUpper();
                    Customer.Text_CustomerTypeSNo = Convert.ToString(dr["CustomerTypeName"]).ToUpper();
                    Customer.Text_AccountSNo = Convert.ToString(dr["AccountName"]).ToUpper();
                    Customer.CitySNo = dr["CitySNo"].ToString().ToUpper();
                    Customer.Name = dr["Name"].ToString().ToUpper();
                    Customer.CustomerNo = dr["CustomerNo"].ToString().ToUpper();
                    Customer.CityCode = dr["CitySNo"].ToString().ToUpper();
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        Customer.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        Customer.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsFocConsignee"].ToString()))
                    {
                        Customer.IsFocConsignee = Convert.ToBoolean(dr["IsFocConsignee"]);
                        Customer.FocConsignee = dr["FocConsignee"].ToString().ToUpper();
                    }
                    Customer.IsConsigneeAsForwarder = Convert.ToBoolean(dr["IsConsigneeAsForwarder"]);
                    Customer.ConsigneeAsForwarder = dr["ConsigneeAsForwarder"].ToString().ToUpper();
                    Customer.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    Customer.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    Customer.Name2 = dr["Name2"].ToString().ToUpper();
                    Customer.CustomCode = dr["CustomCode"].ToString().ToUpper();
                    Customer.AgreementNumber = dr["AgreementNumber"].ToString().ToUpper();
                    Customer.TaxID = dr["TaxID"].ToString().ToUpper();
                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return Customer;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Customer>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)  };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCustomer", Parameters);
                var CustomerList = ds.Tables[0].AsEnumerable().Select(e => new Customer
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountNo = e["AccountNo"].ToString().ToUpper(),
                    CustomerTypeName = e["CustomerTypeName"].ToString().ToUpper(),
                    AccountName = e["AccountName"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    Name2 = e["Name2"].ToString().ToUpper(),
                    TaxID = e["TaxID"].ToString().ToUpper(),          // updated by Priti Yadav (01-04-2020)
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                    ConsigneeAsForwarder = e["ConsigneeAsForwarder"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CustomerList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveCustomer(List<Customer> Customer)
        {
            //validate Business Rule
            DataTable dtCreateCustomer = CollectionHelper.ConvertTo(Customer, "Active,Text_CustomerTypeSNo,Text_CityCode,Text_AccountSNo,AccountNo,FocConsignee,ConsigneeAsForwarder");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomer;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomer", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Customer");
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

        public List<string> UpdateCustomer(List<Customer> Customer)
        {
            //validate Business Rule
            DataTable dtCreateCustomer = CollectionHelper.ConvertTo(Customer, "Active,Text_CustomerTypeSNo,Text_CityCode,Text_AccountSNo,AccountNo,FocConsignee,ConsigneeAsForwarder");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomer;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomer", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Customer");
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

        public List<string> DeleteCustomer(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomer", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Customer");
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

        //public List<CustomerAddress> GetCustomerAddressRecord(string recordID)
        //{
        //    CustomerAddress CustomerAddress = new CustomerAddress();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomerAddress", Parameters);
        //    // return resultData.Tables[0].AsEnumerable().ToList();
        //    var CustomerAddressList = ds.Tables[0].AsEnumerable().Select(e => new CustomerAddress
        //    {
        //        SNo = Convert.ToInt32(e["SNo"].ToString()),
        //        CustomerSNo = Convert.ToInt32(e["CustomerSNo"]),
        //        CustomerName = e["CustomerName"].ToString().ToUpper(),
        //        Address = e["Address"].ToString().ToUpper(),
        //        //CityName = e["CityName"].ToString().ToUpper(),
        //        //CountryCode = e["CountryCode"].ToString().ToUpper(),
        //        State = e["State"].ToString().ToUpper(),
        //        Street = e["Street"].ToString().ToUpper(),
        //        Town = e["Town"].ToString().ToUpper(),
        //        PostalCode = e["PostalCode"].ToString().ToUpper(),
        //        Phone = e["Phone"].ToString(),
        //        Fax = e["Fax"].ToString(),
        //        Email = e["Email"].ToString().ToUpper(),
        //        IsPrimary = Convert.ToInt32(e["IsPrimary"]),
        //        IsActive = Convert.ToInt32(e["IsActive"]),
        //        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
        //        //IsActive = Convert.ToBoolean(e["IsActive"])
        //    });
        //    return CustomerAddressList.AsQueryable().ToList();
        //}

        //public List<string> createUpdateCustomerAddress(string strData)
        //{
        //    int ret = 0;
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    // convert JSON string ito datatable
        //    var dtCustomerAddress = JsonConvert.DeserializeObject<DataTable>(strData);
        //    var dtCreateCustomerAddress = (new DataView(dtCustomerAddress, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    var dtUpdateCustomerAddress = (new DataView(dtCustomerAddress, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@CustomerAddressTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    // for create new record
        //    if (dtCreateCustomerAddress.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateCustomerAddress;
        //        SqlParameter[] Parameters = { param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomerAddress", Parameters);
        //    }
        //    // for update existing record
        //    if (dtUpdateCustomerAddress.Rows.Count > 0)
        //    {
        //        param.Value = dtUpdateCustomerAddress;
        //        SqlParameter[] Parameters = { param };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomerAddress", Parameters);
        //    }
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerAddress");
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
        //    return ErrorMessage;
        //}

        //public List<string> deleteCustomerAddress(string recordID)
        //{
        //    int ret = 0;
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBussiness = new BaseBusiness();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomerAddress", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerAddress");
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
        //    return ErrorMessage;
        //}

        //public DataSourceResult GetCity(String CountryCode)
        //{
        //    List<String> cur = new List<String>();
        //    SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
        //    SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCityAutocomplete", Parameters);
        //    if (dr.Read())
        //    {
        //        cur.Add(dr["SNo"].ToString());
        //        cur.Add(dr["CityCode"].ToString());
        //        cur.Add(dr["CityName"].ToString());
        //    }
        //    return new DataSourceResult
        //    {
        //        Data = cur,
        //        Total = cur.Count()
        //    };
        //}

        public string GetRecordAuthorizedPersonnel(string CustomerSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CustomerSNo", CustomerSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAuthorizedPersonal", Parameters);
                //if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                //{
                //    DataTable dt = ds.Tables[0];
                //    foreach (DataRow dr in dt.Rows)
                //    {
                //        foreach (DataColumn dc in dt.Columns)
                //        {
                //            if (dc.ToString() == "idcardattachement")
                //            {
                //                byte[] bytes = (byte[])dr[dc];
                //                Image img = ByteArrayToImage(bytes);
                //            }
                //            else if (dc.ToString() == "authorizationletterattachement")
                //            {
                //                byte[] bytes = (byte[])dr[dc];
                //                Image img = ByteArrayToImage(bytes);
                //            }
                //            else if (dc.ToString() == "photoattachement")
                //            {
                //                byte[] bytes = (byte[])dr[dc];
                //                Image img = ByteArrayToImage(bytes);
                //            }
                //        }
                //    }
                //}
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string SaveAuthorizedPersonal(List<AuthorizedPersonal> AuthorizedPersonal)
        {
           
            string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
            string path = BaseDirectory + "UploadImage\\";
            string filename = "";
            byte[] imagebyte;
            string fileurl = "";
            Stream filestream;
            DataTable dtAuthorizedPersonal = CollectionHelper.ConvertTo(AuthorizedPersonal, "");
            //dtAuthorizedPersonal.Columns.Add("IdCardFile", typeof(byte[]));
            //dtAuthorizedPersonal.Columns.Add("AuthorizationLetterFile", typeof(byte[]));
            //dtAuthorizedPersonal.Columns.Add("PhotoFile", typeof(byte[]));
            //dtAuthorizedPersonal.Columns.Add("IdCardURL", typeof(string));
            //dtAuthorizedPersonal.Columns.Add("AuthorizationLetterURL", typeof(string));
            //dtAuthorizedPersonal.Columns.Add("PhotoURL", typeof(string));
            //foreach (DataRow dr in dtAuthorizedPersonal.Rows)
            //{
            //    foreach (DataColumn dc in dtAuthorizedPersonal.Columns)
            //    {
            //        if (dc.ToString() == "AttachIdCardName")
            //        {
            //            if (dr[dc].ToString() != "")
            //            {
            //                var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
            //                //var serverPath = System.Web.HttpContext.Current.Server.MapPath("~/UploadImage/" + dr[dc].ToString());
                            
            //                dr["IdCardFile"] = ReadImageFile(serverPath);
                            
            //                filename = dr["IdCardName"].ToString();
            //                 imagebyte = ReadImageFile(serverPath);
            //                filestream = new MemoryStream(imagebyte);

            //                fileurl =UploadAndDownloadBLOB.UploadToBlob(filestream, filename);
            //                dr["IdCardURL"] = fileurl;
            //                //byte[] downloadedfile = UploadAndDownloadBLOB.DownloadFromBlob();
            //                //File.WriteAllBytes(@"E:\downloadss\" + filename + ".PNG", downloadedfile);
            //            }
            //        }
            //        else if (dc.ToString() == "AttachAuthorizationLetterName")
            //        {
            //            if (dr[dc].ToString() != "")
            //            {
            //                var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
            //                dr["AuthorizationLetterFile"] = ReadImageFile(serverPath);

            //                filename = dr["AuthorizationLetterName"].ToString();
            //                 imagebyte = ReadImageFile(serverPath);
            //                filestream = new MemoryStream(imagebyte);
            //                fileurl = UploadAndDownloadBLOB.UploadToBlob(filestream, filename);
            //                dr["AuthorizationLetterURL"] = fileurl;
            //            }
            //        }
            //        else if (dc.ToString() == "AttachPhotoName")
            //        {
            //            if (dr[dc].ToString() != "")
            //            {
            //                var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr[dc].ToString());
            //                dr["PhotoFile"] = ReadImageFile(serverPath);

            //                filename = dr["PhotoName"].ToString();
            //                 imagebyte = ReadImageFile(serverPath);
            //                filestream = new MemoryStream(imagebyte);
            //                fileurl = UploadAndDownloadBLOB.UploadToBlob(filestream, filename);
            //                dr["PhotoURL"] = fileurl;
            //            }
            //        }
            //    }
            //}

            SqlParameter[] param = 
                                { 
                                  new SqlParameter("@AuthorizedPersonal",dtAuthorizedPersonal),
                                  new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                 };
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAuthorizedPersonal", param);
                for (int i = 0; i < dtAuthorizedPersonal.Rows.Count; i++)
                {
                    //string FileName1 = dtAuthorizedPersonal.Rows[i]["AttachIdCardName"].ToString();
                    //if (FileName1 != "")
                    //    System.IO.File.Delete(Path.GetFullPath(path + FileName1));

                    //string FileName2 = dtAuthorizedPersonal.Rows[i]["AttachAuthorizationLetterName"].ToString();
                    //if (FileName2 != "")
                    //    System.IO.File.Delete(Path.GetFullPath(path + FileName2));

                    //string FileName3 = dtAuthorizedPersonal.Rows[i]["AttachPhotoName"].ToString();
                    //if (FileName3 != "")
                    //    System.IO.File.Delete(Path.GetFullPath(path + FileName3));
                }
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public static byte[] ReadImageFile(string imageLocation)
        {
            try
            {
                byte[] imageData = null;
                FileInfo fileInfo = new FileInfo(imageLocation);
                long imageFileLength = fileInfo.Length;
                FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                imageData = br.ReadBytes((int)imageFileLength);
                fs.Flush();
                fs.Dispose();
                return imageData;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public Image ByteArrayToImage(byte[] byteArrayIn)
        {
            MemoryStream ms = new MemoryStream(byteArrayIn);
            ms.Position = 0;
            Image returnImage = Image.FromStream(ms);
            ms.Flush();
            ms.Dispose();
            return returnImage;
        }


        //public string GetAuthorizedImage(string CustomerSNo, string ImagePath, string ImageId, string CustomerAuthorizedPERSONNELSNo)
        //{
        //    SqlParameter[] Parameters = {
        //                                  new SqlParameter("@CustomerSNo", CustomerSNo),
        //                                  new SqlParameter("@CustomerAuthorizedPersonalSNo", CustomerAuthorizedPERSONNELSNo)
        //                                };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAuthorizedImage", Parameters);
        //    var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + ImagePath);
        //    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        //    {
        //        DataTable dt = ds.Tables[0];
        //        foreach (DataRow dr in dt.Rows)
        //        {
        //            foreach (DataColumn dc in dt.Columns)
        //            {
        //                if (dc.ToString() == ImageId)
        //                {
        //                    byte[] bytes = (byte[])dr[dc];
        //                    Image img = ByteArrayToImage(bytes);
        //                    File.WriteAllBytes(serverPath, bytes);

        //                    //System.Web.HttpPostedFile file = img;
        //                    //    string fname = context.Server.MapPath("~/HtmlForm/" + context.Request.Files.AllKeys[0]);

        //                    //file.SaveAs(serverPath);
        //                }
        //                //else if (dc.ToString() == "authorizationletterattachement")
        //                //{
        //                //    byte[] bytes = (byte[])dr[dc];
        //                //    Image img = ByteArrayToImage(bytes);
        //                //}
        //                //else if (dc.ToString() == "photoattachement")
        //                //{
        //                //    byte[] bytes = (byte[])dr[dc];
        //                //    Image img = ByteArrayToImage(bytes);
        //                //}
        //            }
        //        }
        //    }
        //    ds.Dispose();
        //    return  ImagePath;
        //}
        //==============by arman for countryfilter in address details Date: 18-05-2017=============
        public string GetCountrySNo(int CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetCountrySNo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        //===========end===============================================

        //
        public string CheckAgreementNumber(string AgreementNumber)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgreementNumber", AgreementNumber.ToUpper()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgreementNumber", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        //public string DownloadBLOB(int customersno,string filecolumn)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", customersno), new SqlParameter("@ColumnName", filecolumn), new SqlParameter("@TableName", "CustomerAuthorizedPersonal") };
        //                                   // new SqlParameter("@ColumnName",filecolumn) ,new SqlParameter("@ColumnName",filecolumn)    };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetURLForBlob", Parameters);
           
        //    if (ds.Tables[0].Rows.Count > 0)
        //    {
        //        byte[] downloadedfile = UploadAndDownloadBLOB.DownloadFromBlob(ds.Tables[0].Rows[0][0].ToString());
        //        return Convert.ToBase64String(downloadedfile);
        //    }
        //    else
        //    {
        //        return "";
        //    }
        //}
    }
}
