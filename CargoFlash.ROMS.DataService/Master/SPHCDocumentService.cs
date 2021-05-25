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
using System.IO;
using System.Drawing;
using Image = System.Drawing.Image;
using System.Runtime.InteropServices;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SPHCDocumentService : SignatureAuthenticate, ISPHCDocumentService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        /// <summary>
        /// Get Record on the basis of recordID from City
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public SPHCDocument GetSPHCDocumentRecord(string recordID, string UserSNo)
        {
           
            SPHCDocument SPHCDocument = new SPHCDocument();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSPHCDocument", Parameters);
                if (dr.Read())
                {

                    SPHCDocument.SNo = Convert.ToInt32(dr["SNo"]);
                    SPHCDocument.RefNo = Convert.ToString(dr["RefNo"]);
                    //city.ZoneSNo = dr["ZoneSNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["ZoneSNo"]);
                    SPHCDocument.DocumentName = dr["DocumentSNo"].ToString().ToUpper();
                    SPHCDocument.Text_DocumentName = dr["DocumentName"].ToString().ToUpper();
                    SPHCDocument.DocumentCode = dr["DocumentCode"].ToString().ToUpper();
                    //city.Text_ZoneSNo = dr["ZoneName"].ToString().ToUpper();
                    SPHCDocument.Description = dr["DocumentDescription"].ToString().ToUpper();
                    SPHCDocument.AirlineCode = dr["AirlineSNo"].ToString();
                    SPHCDocument.Text_AirlineCode = dr["Text_Airline"].ToString().ToUpper();
                    SPHCDocument.AirportCode = dr["AirportSNo"].ToString();
                    SPHCDocument.Text_AirportCode = dr["Text_Airport"].ToString().ToUpper();
                    SPHCDocument.SPHC = dr["SPHC"].ToString();
                    SPHCDocument.Text_SPHC = dr["Text_SPHC"].ToString().ToUpper();
                    SPHCDocument.SPHCSubGroupSNo = dr["SPHCSubGroupSNo"].ToString();
                    SPHCDocument.Text_SPHCSubGroupSNo = dr["Text_SPHCSubGroupSNo"].ToString().ToUpper();

                    if (!String.IsNullOrEmpty(dr["IsUploadMandatory"].ToString()))
                    {
                        SPHCDocument.IsUploadMandatory = Convert.ToBoolean(dr["IsUploadMandatory"]);
                        SPHCDocument.Text_IsUploadMandatory = dr["Text_IsUploadMandatory"].ToString().ToUpper();
                    }


                    if (!String.IsNullOrEmpty(dr["SPHCType"].ToString()))
                    {
                        SPHCDocument.SPHCType = Convert.ToInt32(dr["SPHCType"]);
                        SPHCDocument.Text_SPHCType = dr["Text_SPHCType"].ToString().ToUpper();
                    }
                    SPHCDocument.DocumentMasterSPHCSampleSno = dr["DocumentMasterSPHCSampleSno"].ToString();
                   SPHCDocument. FileName = dr["FileName"].ToString();
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return SPHCDocument;
        }
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
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SPHCDocument>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSPHCDocument", Parameters);
                var DocumentMasterList = ds.Tables[0].AsEnumerable().Select(e => new SPHCDocument
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    RefNo = Convert.ToString(e["RefNo"]),
                    DocumentName = e["DocumentName"].ToString().ToUpper(),

                    Text_SPHCType = e["Text_SPHCType"].ToString().ToUpper(),
                    Text_SPHC = e["Text_SPHC"].ToString().ToUpper(),
                    Text_AirportCode = e["Text_AirportCode"].ToString().ToUpper(),
                    Text_AirlineCode = e["Text_AirlineCode"].ToString().ToUpper(),
                    Text_IsUploadMandatory = e["Text_IsUploadMandatory"].ToString().ToUpper(),
                    Description = e["Description"].ToString().ToUpper()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DocumentMasterList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        /// <summary>
        /// Save the AccountType Information into City
        /// </summary>
        /// <param name="City"></param>
        /// <returns></returns>
        /// 

        public static byte[] ReadImageFile(string imageLocation)
        {
            byte[] imageData = null;
            FileInfo fileInfo = new FileInfo(imageLocation);
            long imageFileLength = fileInfo.Length;
            FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            imageData = br.ReadBytes((int)imageFileLength);
            return imageData;
        }

        public List<string> SaveSPHCDocument(List<SPHCDocument> SPHCDocument)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {


                DataTable dtCreateSPHCDocument = CollectionHelper.ConvertTo(SPHCDocument, "Active,RefNo,Text_AirportCode,Text_AirlineCode,Text_SPHC,Text_SPHCType,Text_DocumentName,Text_IsUploadMandatory,DocumentMasterSPHCSampleSno,Text_SPHCSubGroupSNo");
                //                DataTable dtCreateCity = CollectionHelper.ConvertTo(City, "Active,strDayLightSaving,Text_ZoneSNo,Text_CountrySNo,Text_TimeZoneSNo,Text_IATAArea");

                //dtCreateSPHCDocument.Columns.Add("SampleDocumentfile", typeof(byte[]));

                //foreach (DataRow dr in dtCreateSPHCDocument.Rows)
                //{
                //    foreach (DataColumn dc in dtCreateSPHCDocument.Columns)
                //    {
                //        if (dc.ToString() == "SampleDocument")
                //        {
                //            if (dr[dc].ToString() != "")
                //            {
                //                var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadDoc/" + dr[dc].ToString());
                //                dr["SampleDocumentfile"] = ReadImageFile(serverPath);
                //            }
                //        }
                //    }
                //}


                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("SPHCDocument", dtCreateSPHCDocument, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SPHCDocumentTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSPHCDocument;

                SqlParameter[] Parameters = { param };

                //int ret = SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters) == null ? 0 : (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSPHCDocument", Parameters);
                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SPHCDocument");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Update City record on the basis of ID
        /// </summary>
        /// <param name="City"></param>
        /// <returns></returns>
        public List<string> UpdateSPHCDocument(List<SPHCDocument> SPHCDocument)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateSPHCDocument = CollectionHelper.ConvertTo(SPHCDocument, "Active,RefNo,Text_AirportCode,Text_AirlineCode,Text_SPHC,Text_SPHCType,Text_DocumentName,Text_IsUploadMandatory,DocumentMasterSPHCSampleSno,Text_SPHCSubGroupSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("SPHCDocument", dtCreateSPHCDocument, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SPHCDocumentTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSPHCDocument;

                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSPHCDocument", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SPHCDocument");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }
        /// <summary>
        ///  Delete City record on the basis of ID
        /// </summary>
        /// <param name="listID"></param>
        /// <returns></returns>
        public List<string> DeleteSPHCDocument(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@Sno", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSPHCDocument", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SPHCDocument");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return ErrorMessage;
        }

        public DayLightSavingTime GetDayLightSavingTime(string TimeZoneSno)
        {
           
            String DeltaSeconds = String.Empty;
            DayLightSavingTime dst = new DayLightSavingTime();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TimeZoneSno", TimeZoneSno) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDayLightSavingTime", Parameters);
                if (dr.Read())
                {
                    dst.DeltaSeconds = dr["DeltaSeconds"].ToString();
                    dst.DayLightSaving = dr["DayLightSaving"].ToString();
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return dst;
        }
    }
}