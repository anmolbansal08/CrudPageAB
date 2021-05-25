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
using CargoFlash.Cargo.Model.SpaceControl;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;


namespace CargoFlash.Cargo.DataService.SpaceControl
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AllocationAccountService : IAllocationAccountService
    {
        public AllocationAccount GetAllocationAccountRecord(string recordID, string UserID)
        {
           
            AllocationAccount AllocAC = new AllocationAccount();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocationAccount", Parameters);
            if (dr.Read())
            {
                AllocAC.SNo = Convert.ToInt32(recordID.ToString());
                AllocAC.AccountAllocationCode = dr["AccountAllocationCode"].ToString();
                AllocAC.Remarks = dr["Remarks"].ToString();
                AllocAC.AccountSNo = dr["AccountSNo"].ToString();
                AllocAC.Text_AccountSNo = dr["Name"].ToString();
                AllocAC.AllocationCode = dr["AllocationCode"].ToString();
               // AllocAC.AccountAllocationCode =dr["AllocationTransSNo"].ToString();
                AllocAC.Text_AllocationTransSNo = dr["Atsno"].ToString();
                AllocAC.ProductSNo = dr["ProductSNo"].ToString();
                AllocAC.Text_ProductSNo = dr["ProductName"].ToString();
                AllocAC.AllocationBlockType = Convert.ToInt32(dr["AllocationBlockType"].ToString());
                AllocAC.Text_AllocationBlockType = "Soft Block";
                //AllocAC.Day1 = dr["Day1"].ToString() == "True" ? true : false;
                //AllocAC.Day2 = dr["Day2"].ToString() == "True" ? true : false;
                //AllocAC.Day3 = dr["Day3"].ToString() == "True" ? true : false;
                //AllocAC.Day4 = dr["Day4"].ToString() == "True" ? true : false;
                //AllocAC.Day5 = dr["Day5"].ToString() == "True" ? true : false;
                //AllocAC.Day6 = dr["Day6"].ToString() == "True" ? true : false;
                //AllocAC.Day7 = dr["Day7"].ToString() == "True" ? true : false;
                AllocAC.AllDays = Convert.ToBoolean(dr["AllDays"]);
                AllocAC.lblAllDays = "Days";
                AllocAC.AllDay = dr["AllDays"].ToString().Contains("1") ? "Yes" : "No";
                AllocAC.Day1 = Convert.ToBoolean(dr["Day1"]);
                AllocAC.lblDay1 = "Sun";
                AllocAC.Sun = dr["Day1"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day2 = Convert.ToBoolean(dr["Day2"]);
                AllocAC.lblDay2 = "Mon";
                AllocAC.Mon = dr["Day2"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day3 = Convert.ToBoolean(dr["Day3"]);
                AllocAC.lblDay3 = "Tue";
                AllocAC.Tue = dr["Day3"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day4 = Convert.ToBoolean(dr["Day4"]);
                AllocAC.lblDay4 = "Wed";
                AllocAC.Wed = dr["Day4"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day5 = Convert.ToBoolean(dr["Day5"]);
                AllocAC.lblDay5 = "Thu";
                AllocAC.Thu = dr["Day5"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day6 = Convert.ToBoolean(dr["Day6"]);
                AllocAC.lblDay6 = "Fri";
                AllocAC.Fri = dr["Day6"].ToString().Contains("True") ? "Yes" : "No";
                AllocAC.Day7 = Convert.ToBoolean(dr["Day7"]);
                AllocAC.lblDay7 = "Sat";
                AllocAC.Sat = dr["Day7"].ToString().Contains("True") ? "Yes" : "No";

                AllocAC.StartDate = Convert.ToDateTime(dr["StartDate"]).ToString("dd-MMM-yyyy");
                AllocAC.EndDate = Convert.ToDateTime(dr["EndDate"]).ToString("dd-MMM-yyyy");
                AllocAC.GrossWeight = Convert.ToDecimal(dr["GrossWeight"].ToString());
                AllocAC.VolumeWeight = Convert.ToDecimal(dr["VolumeWeight"].ToString());
                AllocAC.ReleaseTime = dr["ReleaseTime"].ToString();
                AllocAC.BsaReference = dr["BsaReference"].ToString();
                AllocAC.IsActive = dr["IsActive"] == "True" ? true : false;
                AllocAC.CreatedBy = Convert.ToInt32(dr["CreatedBy"].ToString());
            }
            dr.Close();
            return AllocAC;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Allocation>(filter);
     
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAllocationAccount", Parameters);
            var AllocationList = ds.Tables[0].AsEnumerable().Select(e => new AllocationAccount
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                ProductSNo = e["ProductSNo"].ToString(),
                ProductName = e["ProductName"].ToString(),
                AccountSNo = e["AccountSNo"].ToString(),
              //  Text_AccountSNo = e["Name"].ToString(),
                AccountAllocationCode = e["AccountAllocationCode"].ToString(),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                ReleaseTime = e["ReleaseTime"].ToString(),
                StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
                EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy")
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = AllocationList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public List<string> SaveAllocationAccount(List<AllocationAccount> allocationac)
        {

            List<string> ErrorMessage = new List<string>();

            DataTable dtCreateallocac = CollectionHelper.ConvertTo(allocationac, "Text_AllocationTransSNo,Text_ProductSNo,Text_AccountSNo");

            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("AllocationAccount", dtCreateallocac, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }



            SqlParameter paramAccount = new SqlParameter();
            paramAccount.ParameterName = "@AllocACTbl";
            paramAccount.SqlDbType = System.Data.SqlDbType.Structured;
            paramAccount.Value = dtCreateallocac;

            SqlParameter[] Parameters = { paramAccount };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAllocationAccontTrans", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Allocation");
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

        public List<string> UpdateAllocationAccount(List<AllocationAccount> allocationac)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();

            DataTable dtUpdateAllocationac = CollectionHelper.ConvertTo(allocationac, "AllDay,AllDays,lblAllDays,AllocationCode,Fri,HdnAccountSNo,HdnProductSNo,lblAllDays ,lblDay1,lblDay2,lblDay3,lblDay4,lblDay5,lblDay6,lblDay7,Mon,Tue,Wed,Thu,Fri,Sat,Sun,ProductName,Text_AccountSNo,Text_AllocationTransSNo,Text_ProductSNo,Text_AccountSNo,RemVolumeWeight,RemGrossWeight,Text_AllocationBlockType");

            dtUpdateAllocationac.Columns["SNo"].SetOrdinal(0);
            dtUpdateAllocationac.Columns["AccountAllocationCode"].SetOrdinal(1);
            dtUpdateAllocationac.Columns["Remarks"].SetOrdinal(2);
            dtUpdateAllocationac.Columns["AccountSNo"].SetOrdinal(3);
            dtUpdateAllocationac.Columns["AllocationTransSNo"].SetOrdinal(4);
            dtUpdateAllocationac.Columns["ProductSNo"].SetOrdinal(5);
            dtUpdateAllocationac.Columns["AllocationBlockType"].SetOrdinal(6);
            dtUpdateAllocationac.Columns["Day1"].SetOrdinal(7);
            dtUpdateAllocationac.Columns["Day2"].SetOrdinal(8);
            dtUpdateAllocationac.Columns["Day3"].SetOrdinal(9);
            dtUpdateAllocationac.Columns["Day4"].SetOrdinal(10);
            dtUpdateAllocationac.Columns["Day5"].SetOrdinal(11);
            dtUpdateAllocationac.Columns["Day6"].SetOrdinal(12);
            dtUpdateAllocationac.Columns["Day7"].SetOrdinal(13);
            dtUpdateAllocationac.Columns["StartDate"].SetOrdinal(14);
            dtUpdateAllocationac.Columns["EndDate"].SetOrdinal(15);
            dtUpdateAllocationac.Columns["GrossWeight"].SetOrdinal(16);
            dtUpdateAllocationac.Columns["VolumeWeight"].SetOrdinal(17);
            dtUpdateAllocationac.Columns["ReleaseTime"].SetOrdinal(18);
            dtUpdateAllocationac.Columns["BsaReference"].SetOrdinal(19);
            dtUpdateAllocationac.Columns["IsActive"].SetOrdinal(20);
            dtUpdateAllocationac.Columns["CreatedBy"].SetOrdinal(21);
            
            
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("AllocationAccount", dtUpdateAllocationac, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AllocACTranTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtUpdateAllocationac;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAllocationAccountTrans", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AllocationAccount");
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
        public List<string> DeleteAllocationAccount(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAllocationTransAccount", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AllocationAccount");
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

        public KeyValuePair<string, List<AllocationAccount>> GetAllocationTransAccountRecord (string recordID, int page, int pageSize, string whereCondition, string sort)
        {
      
            AllocationAccount AllocationAc = new AllocationAccount();
            SqlParameter[] Parameters = { new SqlParameter("@AllocationSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocationTransULDIns", Parameters);
            var AllocationAcList = ds.Tables[0].AsEnumerable().Select(e => new AllocationAccount
            {
                SNo = 0,
                AllocationTransSNo = Convert.ToInt32(e["SNo"].ToString()),
                AllDays = Convert.ToBoolean(e["AllDays"]),
                lblAllDays = "Days",
                AllDay = e["AllDays"].ToString().Contains("1") ? "Yes" : "No",
                Day1 = Convert.ToBoolean(e["Day1"]),
                lblDay1 = "Sun",
                Sun = e["Day1"].ToString().Contains("True") ? "Yes" : "No",
                Day2 = Convert.ToBoolean(e["Day2"]),
                lblDay2 = "Mon",
                Mon = e["Day2"].ToString().Contains("True") ? "True" : "False",
                Day3 = Convert.ToBoolean(e["Day3"]),
                lblDay3 = "Tue",
                Tue = e["Day3"].ToString().Contains("True") ? "Yes" : "No",
                Day4 = Convert.ToBoolean(e["Day4"]),
                lblDay4 = "Wed",
                Wed = e["Day4"].ToString().Contains("True") ? "Yes" : "No",
                Day5 = Convert.ToBoolean(e["Day5"]),
                lblDay5 = "Thu",
                Thu = e["Day5"].ToString().Contains("True") ? "Yes" : "No",
                Day6 = Convert.ToBoolean(e["Day6"]),
                lblDay6 = "Fri",
                Fri = e["Day6"].ToString().Contains("True") ? "Yes" : "No",
                Day7 = Convert.ToBoolean(e["Day7"]),
                lblDay7 = "Sat",
                Sat = e["Day7"].ToString().Contains("True") ? "Yes" : "No",

                StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
                EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy"),
               
                ReleaseTime = e["ReleaseTime"].ToString(),
                RemGrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                RemVolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                AccountSNo = "0",
                CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                //AccountSNo = 
                //BsaReference = e["BsaReference"].ToString(),
             //   IsActive = e["IsActive"] == "True" ? true : false
                

            });
            return new KeyValuePair<string, List<AllocationAccount>>(ds.Tables[1].Rows[0][0].ToString(), AllocationAcList.AsQueryable().ToList());
        }


        public KeyValuePair<string, List<AllocationAccount>> GetAllocationTransAccountUpdateRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
       
            AllocationAccount AllocationAc = new AllocationAccount();
            SqlParameter[] Parameters = { new SqlParameter("@AllocationSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocationTransULDIns", Parameters);
            var AllocationAcList = ds.Tables[0].AsEnumerable().Select(e => new AllocationAccount
            {
                SNo = 0,
                AllocationTransSNo = Convert.ToInt32(e["SNo"].ToString()),
                AllDays = Convert.ToBoolean(e["AllDays"]),
                lblAllDays = "Days",
                AllDay = e["AllDays"].ToString().Contains("1") ? "Yes" : "No",
                Day1 = Convert.ToBoolean(e["Day1"]),
                lblDay1 = "Sun",
                Sun = e["Day1"].ToString().Contains("True") ? "Yes" : "No",
                Day2 = Convert.ToBoolean(e["Day2"]),
                lblDay2 = "Mon",
                Mon = e["Day2"].ToString().Contains("True") ? "Yes" : "No",
                Day3 = Convert.ToBoolean(e["Day3"]),
                lblDay3 = "Tue",
                Tue = e["Day3"].ToString().Contains("True") ? "Yes" : "No",
                Day4 = Convert.ToBoolean(e["Day4"]),
                lblDay4 = "Wed",
                Wed = e["Day4"].ToString().Contains("True") ? "Yes" : "No",
                Day5 = Convert.ToBoolean(e["Day5"]),
                lblDay5 = "Thu",
                Thu = e["Day5"].ToString().Contains("True") ? "Yes" : "No",
                Day6 = Convert.ToBoolean(e["Day6"]),
                lblDay6 = "Fri",
                Fri = e["Day6"].ToString().Contains("True") ? "Yes" : "No",
                Day7 = Convert.ToBoolean(e["Day7"]),
                lblDay7 = "Sat",
                Sat = e["Day7"].ToString().Contains("True") ? "Yes" : "No",

                StartDate = Convert.ToDateTime(e["StartDate"]).ToString("dd-MMM-yyyy"),
                EndDate = Convert.ToDateTime(e["EndDate"]).ToString("dd-MMM-yyyy"),

                ReleaseTime = e["ReleaseTime"].ToString(),
                RemGrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                RemVolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                AccountSNo = "0",
                CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                //AccountSNo = 
                //BsaReference = e["BsaReference"].ToString(),
                //   IsActive = e["IsActive"] == "True" ? true : false


            });
            return new KeyValuePair<string, List<AllocationAccount>>(ds.Tables[1].Rows[0][0].ToString(), AllocationAcList.AsQueryable().ToList());
        }

        public List<string> createUpdateAllocationTransAccount(string strData)
        {
            strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            string str1;
            string str2;
            string str3;
            // convert JSON string ito datatable
            //str1 = strData.Replace("UldTypeSNo", "New");
            //str2 = str1.Replace("HdnNew", "UldTypeSNo");
            //str3 = str2.Replace("New", "HdnUldTypeSNo");
            strData = strData.Replace(",,", ",");
            strData = strData.Replace(",,,", ",");
            str3 = strData.Replace("ProductSNo", "New");
            str3 = str3.Replace("HdnNew", "ProductSNo");
            str3 = str3.Replace("New", "HdnProductSNo");

            var dtAllocationTrans = JsonConvert.DeserializeObject<DataTable>(str3);

            dtAllocationTrans.Columns.Remove("HdnProductSNo");
            dtAllocationTrans.Columns.Remove("AllDays");
            foreach (DataColumn dc in dtAllocationTrans.Columns)
            {
                foreach (DataRow dr in dtAllocationTrans.Rows)
                {
                    if (dc.ToString().Contains("Day") || dc.ToString().Contains("IsActive") || dc.ToString().Contains("UTIsActive"))
                    {
                        if (dr[dc].ToString().Contains("1") || dr[dc].ToString().Contains("True"))
                        {
                            dr[dc] = 1;
                        }
                        else
                            dr[dc] = 0;
                    }
                }
            }

            var dtCreateAllocationTrans = (new DataView(dtAllocationTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateAllocationTrans = (new DataView(dtAllocationTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AllocationTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            // for create new record
            if (dtCreateAllocationTrans.Rows.Count > 0)
            {
                param.Value = dtCreateAllocationTrans;
                SqlParameter[] Parameters = { param };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAllocationAccontTrans", Parameters);
               
            }
            // for update existing record
            if (dtUpdateAllocationTrans.Rows.Count > 0)
            {
                param.Value = dtAllocationTrans;
                SqlParameter[] Parameters = { param };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAllocationTransAccountULDTrans", Parameters);
            }
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AllocationAccount");
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

        public DataSourceResult GetAccountAllocationCode(String AllocCode)
        {
            List<String> cur = new List<String>();
            SqlParameter[] Parameters = { new SqlParameter("@AllocCode", AllocCode) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocCodeExists", Parameters);
            if (dr.Read())
            {
                cur.Add(dr["SNo"].ToString());
            }
            return new DataSourceResult
            {
                Data = cur,
                Total = cur.Count()
            };
        }

        public KeyValuePair<string, List<AllocationTransAccountULDTrans>> GetAllocationTransAccountULDRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
         
            AllocationTransAccountULDTrans AllocationAcULD = new AllocationTransAccountULDTrans();
            SqlParameter[] Parameters = { new SqlParameter("@AllocationTranULDSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocationTransULD", Parameters);
            var AllocationAcULDList = ds.Tables[0].AsEnumerable().Select(e => new AllocationTransAccountULDTrans
            {
                SNo = Convert.ToInt32(e["SNo"].ToString()),
                HdnULDTypeSNo = Convert.ToInt32(e["ULDTypeSNo"].ToString()),
                ULDTypeSNo = e["ULDName"].ToString(),
                AllocationTransAccountSNo = Convert.ToInt32(e["AllocationTransAccountSNo"].ToString()),
                Unit = Convert.ToInt32(e["Unit"].ToString()),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"].ToString()),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"].ToString()),
                IsActive = e["IsActive"].ToString().ToUpper() == "FALSE" ? false : true,
                
            });
            return new KeyValuePair<string, List<AllocationTransAccountULDTrans>>(ds.Tables[1].Rows[0][0].ToString(), AllocationAcULDList.AsQueryable().ToList());
        }


        public List<string> createUpdateAllocationTransAccountULD(string strData)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
            strData = strData.Replace("ULDTypeSNo", "New");
            strData = strData.Replace("HdnNew", "ULDTypeSNo");
            strData = strData.Replace("New", "HdnULDTypeSNo");

            var dtAllocationAccountULDTrans = JsonConvert.DeserializeObject<DataTable>(strData);
            dtAllocationAccountULDTrans.Columns.Remove("HdnUldTypeSNo");


            var dtCreateAllocationTrans = (new DataView(dtAllocationAccountULDTrans, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateAllocationTrans = (new DataView(dtAllocationAccountULDTrans, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AllocationTransTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            // for create new record
            if (dtCreateAllocationTrans.Rows.Count > 0)
            {
                param.Value = dtCreateAllocationTrans;
                SqlParameter[] Parameters = { param };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAllocationTransAccountULDTrans", Parameters);
            }
            // for update existing record
            if (dtUpdateAllocationTrans.Rows.Count > 0)
            {
                param.Value = dtAllocationAccountULDTrans;
                SqlParameter[] Parameters = { param };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAllocationTransAccountULDTrans", Parameters);
            }
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AllocationTrans");
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


    
    }
}
