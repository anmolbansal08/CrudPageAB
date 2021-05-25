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
using CargoFlash.Cargo.Model.EDI;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.EDI
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class MessageTypeMasterService : SignatureAuthenticate, IMessageTypeMasterService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<MessageTypeMaster>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListMessageTypeMaster", Parameters);
            var MessageTypeMasterList = ds.Tables[0].AsEnumerable().Select(e => new MessageTypeMaster
            {
                SNo = Convert.ToInt32(e["SNo"]),
                MessageType = e["MessageType"].ToString(),
                MessageDescription = e["MessageDescription"].ToString(),
                MessageSubType = e["MessageSubType"].ToString(),
                CreatedBy=e["CreatedBy"].ToString(),
                UpdatedBy= e["UpdatedBy"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = MessageTypeMasterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public MessageTypeMaster GetMessageTypeMasterRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            { 
            MessageTypeMaster c = new MessageTypeMaster();
           
            //try
            //{
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMessageTypeMaster", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.MessageType = dr["MessageType"].ToString();
                    c.MessageSubType = dr["MessageSubType"].ToString();
                    c.MessageMovementType = dr["MessageMovementType"].ToString();
                    c.Text_MessageMovementType = dr["Text_MessageMovementType"].ToString();
                    c.MessageDescription = dr["MessageDescription"].ToString();
                    c.CreatedBy= dr["CreatedBy"].ToString();
                    c.UpdatedBy= dr["UpdatedBy"].ToString();
                    c.MessageFormat = Convert.ToInt32(dr["MessageFormat"]);
                    c.Text_MessageFormat= dr["Text_MessageFormat"].ToString();
                    c.FileType = Convert.ToInt32(dr["FileType"]);
                    c.Text_FileType = dr["Text_FileType"].ToString();
                    c.FileNameTemplate= dr["FileNameTemplate"].ToString();

                    //c.Version = dr["Version"].ToString();
                }
            //}
            //catch(Exception ex)//(Exception ex) (Exception ex)
            //{
            //    dr.Close();
            //}
            return c;
            }
            catch(Exception ex)//(Exception ex)
            {
                dr.Close();
                throw ex;
            }
        }
        public List<MessageTypeMasterTrans> GetMessageTypeMasterTransRecord(string recordID)
        {
            try { 
            List<MessageTypeMasterTrans> listtariffForwardRateTrans = new List<MessageTypeMasterTrans>();
            MessageTypeMasterTrans TariffForwardRateTrans = new MessageTypeMasterTrans();

            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMessageTypeMasterRecordTrans", Parameters);

            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    listtariffForwardRateTrans.Add(new MessageTypeMasterTrans
                    {
                        MessageTypeVersionTransSNo = Convert.ToInt32(dr["MessageTypeVersionTransSNo"]),
                        MessageTypeMasterSNo = Convert.ToInt32(dr["MessageTypeMasterSNo"]),
                        Version = dr["MessageVersion"].ToString()
                    });
                }
            }
            return listtariffForwardRateTrans;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }
        public List<string> SaveMessageTypeMaster(List<MessageTypeMaster> MessageTypeMasterInfo, List<MessageTypeMaster> MessageTypeMasterParentInfo)
        {
            try
            {

          
            DataTable dtCreateMessageTypeMasterParent = CollectionHelper.ConvertTo(MessageTypeMasterParentInfo, "CreatedBy,UpdatedBy,Version,Text_MessageMovementType,Text_MessageFormat,Text_FileType");
            DataTable dtCreateMessageTypeMasterChild = CollectionHelper.ConvertTo(MessageTypeMasterInfo, "CreatedBy,UpdatedBy,MessageType,MessageTypeSNo,MessageDescription,MessageSubType,MessageMovementType,Text_MessageMovementType,MessageFormat,FileType,FileNameTemplate,Text_MessageFormat,Text_FileType");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            //SqlParameter param = new SqlParameter();
            //param.ParameterName = "@MessageTypeMasterTable";
            //param.SqlDbType = System.Data.SqlDbType.Structured;
            //param.Value = dtCreateMessageTypeMaster;
            SqlParameter[] Parameters = { new SqlParameter("@MessageTypeMasterParentTable",dtCreateMessageTypeMasterParent),
                                            new SqlParameter("@MessageTypeMasterChildTable",dtCreateMessageTypeMasterChild),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateMessageTypeMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "MessageTypeMaster");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> UpdateMessageTypeMaster(List<MessageTypeMasterTrans> MessageTypeMasterInfoUpdate, string MessageDescription)
        {
            try
            { 
            //validate Business Rule
            DataTable dtUpdateMessageTypeMaster = CollectionHelper.ConvertTo(MessageTypeMasterInfoUpdate, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = { new SqlParameter("@MessageTypeMasterTable", dtUpdateMessageTypeMaster),
                                    new SqlParameter("@MessageDescription",MessageDescription),
                                    new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateMessageTypeMaster", param);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDInCompatibility");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
