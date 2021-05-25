using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.IO;
using System.Text;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReleaseNoteService : SignatureAuthenticate, IReleaseNoteService
    {
        public ReleaseNote GetReleaseNoteRecord(int RecordID, string UserSNo)
        {
            try
            {
                ReleaseNote ReleaseNote = new ReleaseNote();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetReleaseNoteRecord", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    ReleaseNote.SNo = Convert.ToInt32(ds.Tables[0].Rows[0]["SNo"]);
                    ReleaseNote.Author = Convert.ToString(ds.Tables[0].Rows[0]["Author"]).ToUpper();
                    ReleaseNote.Major = Convert.ToInt32(ds.Tables[0].Rows[0]["Major"]);
                    ReleaseNote.Minor = Convert.ToInt32(ds.Tables[0].Rows[0]["Minor"]);
                    ReleaseNote.Build = Convert.ToInt32(ds.Tables[0].Rows[0]["Build"]);
                    ReleaseNote.Version = Convert.ToString(ds.Tables[0].Rows[0]["Version"]);
                    ReleaseNote.ReleaseDate = Convert.ToDateTime(ds.Tables[0].Rows[0]["ReleaseDate"]).ToString("dd-MMM-yyyy");
                    ReleaseNote.Description = Convert.ToString(ds.Tables[0].Rows[0]["Description"]).ToUpper();

                }
                return ReleaseNote;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ReleaseNote>> GetReleaseNoteRecords(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ReleaseNote ReleaseNote = new ReleaseNote();
                SqlParameter[] Parameters = {                                          
                                           new SqlParameter("@SNo", recordID),                                    
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetReleaseNoteExcelRecord", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ReleaseNoteList = ds.Tables[0].AsEnumerable().Select(e => new ReleaseNote
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        Author = Convert.ToString(e["Author"]).ToUpper(),
                        Major = Convert.ToInt32(e["Major"]),
                        Minor = Convert.ToInt32(e["Minor"]),
                        Build = Convert.ToInt32(e["Build"]),
                        Version = Convert.ToString(e["Version"]),
                        ReleaseDate = Convert.ToDateTime(e["ReleaseDate"]).ToString("dd-MMM-yyyy"),
                        Description = Convert.ToString(e["Description"]).ToUpper(),
                        Module = Convert.ToString(e["Module"]).ToUpper().Trim(),
                        ModuleDescription = Convert.ToString(e["ModuleDescription"]).ToUpper(),
                        TFSId = Convert.ToInt32(e["TFSId"]),
                        ModuleOwner = Convert.ToString(e["ModuleOwner"]).ToUpper(),
                    });
                    return new KeyValuePair<string, List<ReleaseNote>>(ds.Tables[0].Rows[0][0].ToString(), ReleaseNoteList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ReleaseNote
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ReleaseNote>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ReleaseNote>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListReleaseNote", Parameters);

                var ReleaseNote = ds.Tables[0].AsEnumerable().Select(e => new ReleaseNote
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Author = Convert.ToString(e["Author"]).ToUpper(),
                    Version = Convert.ToString(e["Version"]),
                    ReleaseDate = Convert.ToDateTime(e["ReleaseDate"]).ToString("dd-MMM-yyyy"),
                    Description = Convert.ToString(e["Description"]).ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ReleaseNote.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteReleaseNote(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "Usp_DeleteReleaseNote", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Irregularity");
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
                else
                {
                    //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(2002, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                    //Error
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteReleaseNoteTrans(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "Usp_DeleteReleaseNoteTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReleaseNote");
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
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
