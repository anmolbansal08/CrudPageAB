using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PageCreationService : SignatureAuthenticate, IPageCreationService
    {
        public PageCreation GetPageCreationRecord(string recordID, string UserID)
        {
            PageCreation c = new PageCreation();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@App_Id", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordPageCreation", Parameters);
                if (dr.Read())
                {

                    c.App_Id = dr["App_Id"].ToString().ToUpper();
                    c.Name = dr["Name"].ToString().ToUpper();
                    c.Description = dr["FormDescription"].ToString().ToUpper();
                    c.Caption = dr["Caption_Text"].ToString().ToUpper();
                    c.CurrentHeadingName = dr["Heading_Text"].ToString().ToUpper();
                    c.ProcessName = dr["ProcessName"].ToString().ToUpper();
                    c.SubProcessName = dr["SubProcessName"].ToString().ToUpper();                   
                    c.SectionName = dr["SectionName"].ToString().ToUpper();
                    c.ProcessSno = Convert.ToInt16(dr["ProcessSno"].ToString());
                    c.SubprocessSno = Convert.ToInt16(dr["SubprocessSno"].ToString());
                    c.TableName = dr["TableName"].ToString().ToUpper();
                    c.Text_ProcessSno = dr["ProcessName"].ToString().ToUpper();// Convert.ToInt16(dr["ProcessSno"].ToString()); ;
                    c.Text_SubprocessSno = dr["SubProcessName"].ToString().ToUpper();    //Convert.ToInt16(dr["SubprocessSno"].ToString());
                    c.SNo = Convert.ToInt16(dr["SNo"].ToString());
                    c.Text_SNo = dr["TableName"].ToString().ToUpper();
                 
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return c;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<PageCreation>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageCreation", Parameters);
                var PageCreationList = ds.Tables[0].AsEnumerable().Select(e => new PageCreation
                {
                    App_Id = e["App_Id"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    Description = e["FormDescription"].ToString().ToUpper(),
                    Caption = e["Caption_Text"].ToString().ToUpper(),
                    CurrentHeadingName = e["Heading_Text"].ToString().ToUpper()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = PageCreationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        public List<string> SavePageCreation(List<PageCreation> PageCreation, DataTable dt)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreatePageCreation = CollectionHelper.ConvertTo(PageCreation, "SNo,CreatedBy,UpdatedBy,Text_SNo,ProcessName,SubProcessName,Text_ProcessSno,Text_SubprocessSno");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("PageCreation", dtCreatePageCreation, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@PageCreationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePageCreation;
                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@PageCreationList";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dt;
                int UserSno = 1;
                SqlParameter[] Parameters = { param, param1, new SqlParameter("@CreatedBy", UserSno) };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreatePageCreation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PageCreation");
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
        public List<string> UpdatePageCreation(List<PageCreation> PageCreation)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdatePageCreation = CollectionHelper.ConvertTo(PageCreation, "SNo,CreatedBy,UpdatedBy");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("PageCreation", dtUpdatePageCreation, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@PageCreationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdatePageCreation;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdatePageCreationTest", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PageCreation");
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
        public List<string> DeletePageCreation(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeletePageCreationTest", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PageCreation");
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
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
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



        public KeyValuePair<string, List<PageCreationTables>> GetTableDescRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                PageCreationTables pageCreationTables = new PageCreationTables();
                string searchby = whereCondition.ToString();
                //string[] search = searchby.Split(',');
                //for (int i = 0; i < search.Length; i++)
                //{
                //    string tblName = search[i].ToString();
                //  
                //}
                whereCondition = "";
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@TableName", searchby.ToString()), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTableDesc", Parameters);
                var pageCreationTablesList = ds.Tables[0].AsEnumerable().Select(e => new PageCreationTables
                {
                    ColumnName = e["Column Name"].ToString(),
                    Datatype = e["Data Type"].ToString(),
                    Length = e["Max Length"].ToString(),
                    DISPLAY_ORDER = Convert.ToInt16(e["DISPLAY_ORDER"].ToString()),
                    ASSEMBLY_NAME = "",
                    LABEL_CELL_TEXT = null,
                    LABEL_CELL_CSSCLASS = "",
                    DATA_FIELDNAME = null,
                    DATA_FIELD_CSSCLASS = null,
                    DATA_CELL_CSSCLASS = null,
                    ONCLICK_HANDLER = null,
                    //POSTBACK_URL=null,
                    //CALLBACK_URL=null,
                    //SKIN_ID=null,
                    TOOLTIP = null,
                    BTN_USESUBMIT_BEHAVIOUR = false,
                    VISIBLE = false,
                    READONLY = false,
                    ENABLE_VIEWSTATE = false,
                    MAXLENGTH = null,
                    MULTILINE = false,
                    WIDTH = null,
                    HEIGHT = null,
                    //Tab_Id=null,
                    //Tab_Name=null,
                    Section_Name = null,
                    ONKEY_HANDLER = null,
                    ONBLUR_HANDLER = null,
                    ENABLE_REQUIREVALIDATION = false,
                    REQUIRED_FIELD_MESSAGE = null,
                    LOOKUP_NAME = null,
                    TAB_INDEX = 0,
                    XmlFolderName = null,
                    XmlFileName = null,

                });
                return new KeyValuePair<string, List<PageCreationTables>>(ds.Tables[1].Rows[0][0].ToString(), pageCreationTablesList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<PageCreationTables>> GetTableDescRecordEdit(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                PageCreationTables pageCreationTables = new PageCreationTables();
                string searchby = whereCondition.ToString();
                //string[] search = searchby.Split(',');
                //for (int i = 0; i < search.Length; i++)
                //{
                //    string tblName = search[i].ToString();
                //  
                //}
                whereCondition = "";
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@TableName", searchby.ToString()), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@AppId", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTableDescEdit", Parameters);
                var pageCreationTablesList = ds.Tables[0].AsEnumerable().Select(e => new PageCreationTables
                {
                    ColumnName = e["ColumnName"].ToString(),
                    Datatype = e["DataType"].ToString(),
                    // Length = e["Max Length"].ToString(),
                    DISPLAY_ORDER = Convert.ToInt16(e["DISPLAY_ORDER"].ToString()),
                    ASSEMBLY_NAME = e["Assembly_Name"].ToString(),
                    LABEL_CELL_TEXT = e["Label_Cell_Text"].ToString(),
                    LABEL_CELL_CSSCLASS = e["Label_Cell_Cssclass"].ToString(),
                    DATA_FIELDNAME = e["Data_Fieldname"].ToString(),
                    DATA_FIELD_CSSCLASS = e["Data_Field_Cssclass"].ToString(),
                    DATA_CELL_CSSCLASS = e["Data_Cell_Cssclass"].ToString(),
                    ONCLICK_HANDLER = "",
                    //POSTBACK_URL=null,
                    //CALLBACK_URL=null,
                    //SKIN_ID=null,
                    TOOLTIP = e["Tooltip"].ToString(),
                    BTN_USESUBMIT_BEHAVIOUR = e["Btn_Usesubmit_Behaviour"].ToString().ToUpper() == "0" ? false : true,
                    VISIBLE = e["Visible"].ToString().ToUpper() == "FALSE" ? false : true,
                    READONLY = e["Readonly"].ToString().ToUpper() == "FALSE" ? false : true,
                    ENABLE_VIEWSTATE = e["Enable_Viewstate"].ToString().ToUpper() == "FALSE" ? false : true,
                    MAXLENGTH = e["Maxlength"].ToString(),
                    MULTILINE = e["Multiline"].ToString().ToUpper() == "FALSE" ? false : true,
                    WIDTH = e["WIDTH"].ToString(),
                    HEIGHT = e["HEIGHT"].ToString(),
                    //Tab_Id=null,
                    //Tab_Name=null,
                    Section_Name = e["Section_Name"].ToString(),
                    ONKEY_HANDLER = e["Onkey_Handler"].ToString(),
                    ONBLUR_HANDLER = e["Onblur_Handler"].ToString(),
                    ENABLE_REQUIREVALIDATION = e["Enable_Requirevalidation"].ToString().ToUpper() == "0" ? false : true,
                    REQUIRED_FIELD_MESSAGE = e["Required_Field_Message"].ToString(),
                    LOOKUP_NAME = e["Lookup_Name"].ToString(),
                    TAB_INDEX = Convert.ToInt32(e["Tab_Index"].ToString()),
                    XmlFolderName = e["XmlFolderName"].ToString(),
                    XmlFileName = e["XmlFileName"].ToString(),

                });
                return new KeyValuePair<string, List<PageCreationTables>>(ds.Tables[1].Rows[0][0].ToString(), pageCreationTablesList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> CreateUpdateTableDesc(string App_Id, string Name, string Description, string Heading, string Caption, string SubprocessSno, string ProcessSno, string TableName, string SectionName, string strData)
        {
            try
            {
                //var PageCreation = JsonConvert.SerializeObject(strData).Replace("\"Total\":0,\"Aggregates\":null", String.Format("\"Total\":{0},\"Aggregates\":null", strData.ToString().Length + 1000));
                var PageCObject = JsonConvert.DeserializeObject<DataTable>(strData);
                var dtPageCreation = (new DataView(PageCObject, "DISPLAY_ORDER>0", "ASSEMBLY_NAME", DataViewRowState.CurrentRows)).ToTable();
                dtPageCreation.Columns.Remove("hdnASSEMBLY_NAME"); dtPageCreation.Columns.Remove("hdnLABEL_CELL_CSSCLASS"); dtPageCreation.Columns.Remove("hdnDATA_CELL_CSSCLASS");
                dtPageCreation.Columns.Remove("Datatype");
                // dtPageCreation.Columns.Add("SubProcessSNo");

                List<PageCreation> listpageCreation = new List<PageCreation>();

                var pageCreation = new PageCreation
                {
                    App_Id = App_Id.ToUpper(),
                    Name = Name.ToUpper(),
                    Description = Description.ToUpper(),
                    Caption = Caption.ToUpper(),
                    CurrentHeadingName = Heading.ToUpper(),
                    //CreatedBy = Convert.ToInt16(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    //UpdatedBy = Convert.ToInt16(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    TableName = TableName,
                    ProcessSno = Convert.ToInt16(ProcessSno),
                    SubprocessSno = Convert.ToInt16(SubprocessSno),
                    SectionName = SectionName,
                };
                listpageCreation.Add(pageCreation);
                object datalist = (object)listpageCreation;

                SavePageCreation(listpageCreation, dtPageCreation);


                ////dtPageCreation = CollectionHelper.CreateTable("SNo,CreatedBy,UpdatedBy");

                ////List<string> ErrorMessage = new List<string>();
                ////BaseBusiness baseBusiness = new BaseBusiness();
                ////if (!baseBusiness.ValidateBaseBusiness("PageCreationTable", dtPageCreation, "UPDATE"))
                ////{
                ////    ErrorMessage = baseBusiness.ErrorMessage;
                ////    return ErrorMessage;
                ////}
                //SqlParameter param = new SqlParameter();
                //param.ParameterName = "@PageCreationTable";
                //param.SqlDbType = System.Data.SqlDbType.Structured;
                //param.Value = dtPageCreation;
                //SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", 1) };

                //int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateUpdateTableDesc", Parameters);
                //if (ret > 0)
                //{
                //    if (ret > 1000)
                //    {
                //        //For Customised Validation Messages like 'Record Already Exists' etc
                //        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PageCreation");
                //        if (!string.IsNullOrEmpty(serverErrorMessage))
                //            ErrorMessage.Add(serverErrorMessage);
                //    }
                //    else
                //    {

                //        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                //        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                //        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                //            ErrorMessage.Add(dataBaseExceptionMessage);
                //    }
                //}
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return null;
        }


        public string GetProcessTemplate(string AssemblyName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Assembley_Name", AssemblyName) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spProcessTemplate", Parameters);
                ds.Dispose();
                return DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private static string DStoJSON(DataSet ds)
        {
            try
            {
                StringBuilder json = new StringBuilder();
                json.Append("[");
                int lInteger = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    lInteger = lInteger + 1;
                    json.Append("{");
                    int i = 0;
                    int colcount = dr.Table.Columns.Count;
                    foreach (DataColumn dc in dr.Table.Columns)
                    {
                        json.Append("\"");
                        json.Append(dc.ColumnName);
                        json.Append("\":\"");
                        json.Append(dr[dc]);
                        json.Append("\"");
                        i++;
                        if (i < colcount) json.Append(",");
                    }

                    if (lInteger < ds.Tables[0].Rows.Count)
                    {
                        json.Append("},");
                    }
                    else
                    {
                        json.Append("}");
                    }
                }

                json.Append("]");

                return json.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



    }
}
