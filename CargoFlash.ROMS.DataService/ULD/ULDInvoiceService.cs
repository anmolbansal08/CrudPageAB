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
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDInvoiceService : SignatureAuthenticate, IULDInvoiceService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDInvoice>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDInvoice", Parameters);
                var IrrList = ds.Tables[0].AsEnumerable().Select(e => new ULDInvoice
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    NPPANo = e["NPPANo"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    UldNo = e["UldNo"].ToString().ToUpper(),
                    InvoiceDate = Convert.ToDateTime(e["InvoiceDate"]),
                    ULDreturnedStatus = e["ULDreturnedStatus"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IrrList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveULDInvoice(List<ULDInvoice> ULDInvoice)
        {
            try
            {
                string ret = "";
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtULDInvoice = CollectionHelper.ConvertTo(ULDInvoice, "SNo,InvoiceDate,Name,UldNo,ULDreturnedStatus");

                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDRepairInvoiceNPPA";

                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtULDInvoice;

                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairInvoiceNPPA", dtULDInvoice), new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
                ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDInvoice", Parameters);

                return ret.ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGrid(string recordID)
        {
            try
            {
            ULDInvoiceGridAppendGrid ULDInvoiceGridAppendGrid = new ULDInvoiceGridAppendGrid();
            SqlParameter[] Parameters = { new SqlParameter("@ParticipientSNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllListofULDInvoiceDetails", Parameters);
        
                var ULDInvoiceGridAppendGridList = ds.Tables[0].AsEnumerable().Select(e => new ULDInvoiceGridAppendGrid
                {
                    SNo = 0,
                    Equipment = e["Equipment"].ToString(),
                    Registration = e["Registration"].ToString(),
                    Work_Inspection = e["Work_Inspection"].ToString(),
                    //Meterial = Convert.ToDecimal(e["Meterial"]),
                    //ManHours = Convert.ToDecimal(e["ManHours"]),
                    //Total = Convert.ToDecimal(e["Total"]),
                    Meterial = e["Meterial"].ToString(),
                    ManHours = e["ManHours"].ToString(),
                    Total = e["Total"].ToString(),
                    NPPANo = "PG/CA/GA/0022/2017",

                    SalesOrderNo = "",
                    InvoiceDate = DateTime.Now,
                    ParticipientSNo = e["ParticipientSNo"].ToString(),
                    ULDRepairSNo = Convert.ToInt32(e["ULDRepairSNo"]),
                    AgreementNumber = "DS-PERJ-GF-3479",
                    RONO = e["RONO"].ToString(),

                    //HdnSubProcessName = e["HdnSubProcessName"].ToString(),
                    //AWBStatusType = e["AWBStatusType"].ToString(),
                    //HdnAWBStatusType = e["HdnAWBStatusType"].ToString(),
                    //DependSubProcessName = e["DependSubProcessName"].ToString(),
                    //HdnDependSubProcessName = e["HdnDependSubProcessName"].ToString()
                });
                return new KeyValuePair<string, List<ULDInvoiceGridAppendGrid>>("1", ULDInvoiceGridAppendGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDInvoiceGridAppendGrid>> ULDInvoiceGridAppendGridForInvoice(string recordID)
        {
            try
            {
            ULDInvoiceGridAppendGrid ULDInvoiceGridAppendGrid = new ULDInvoiceGridAppendGrid();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllListofULDInvoiceForGenInvoice", Parameters);
          
                var ULDInvoiceGridAppendGridListforvalue = ds.Tables[0].AsEnumerable().Select(e => new ULDInvoiceGridAppendGrid
                {
                    SNo = 0,

                    RONO = e["RONO"].ToString(),
                    Equipment = e["Equipment"].ToString(),
                    Registration = e["Registration"].ToString(),
                    Work_Inspection = e["Work_Inspection"].ToString(),
                    //Meterial = Convert.ToDecimal(e["Meterial"]),
                    // ManHours = Convert.ToDecimal(e["ManHours"]),
                    // Total = Convert.ToDecimal(e["Total"]),
                    Meterial = (e["Meterial"].ToString()),
                    ManHours = (e["ManHours"].ToString()),
                    Total = (e["Total"].ToString()),



                });
                return new KeyValuePair<string, List<ULDInvoiceGridAppendGrid>>("1", ULDInvoiceGridAppendGridListforvalue.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string ULDInvoiceGridAppendGridForInvoiceForPrint(string recordID)
        {
            try
            {
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@SNo",recordID)
                                            
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairInvoiceDetails", Parameters);
           
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string InvoiceGetAgreementNumber(string recordID)
        {
            try
            {
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@SNo",Convert.ToInt32( recordID))
                                            
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "InvoiceGetAgreementNumber", Parameters);
          
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
