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
    public class AllocationTransService : IAllocationTransService
    {
        public KeyValuePair<string, List<AllocationTrans>> GetAllocationTransRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
    
            AllocationTrans AllocationTrans = new AllocationTrans();
            SqlParameter[] Parameters = { new SqlParameter("@AllocationSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAllocationTrans", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var AllocationTransList = ds.Tables[0].AsEnumerable().Select(e => new AllocationTrans
            {
                sno = Convert.ToInt32(e["SNo"]),
                AllocationSNo = Convert.ToInt32(e["AllocationSNo"]),
                AllocationAirportSNo = e["AirportCode"].ToString(),
                HdnAllocationAirportSNo = Convert.ToInt32(e["AllocationAirportSNo"]),
                Text_AllocationAirportSNo = e["AirportCode"].ToString(),
                //Day1 = (e["Day1"].ToString().ToUpper() == "FALSE" ? false : true),
                //Day2 = e["Day2"].ToString().ToUpper() == "FALSE" ? false : true,
                //Day3 = e["Day3"].ToString().ToUpper() == "FALSE" ? false : true,
                //Day4 = e["Day4"].ToString().ToUpper() == "FALSE" ? false : true,
                //Day5 = e["Day5"].ToString().ToUpper() == "FALSE" ? false : true,
                //Day6 = e["Day6"].ToString().ToUpper() == "FALSE" ? false : true,
                //Day7 = e["Day7"].ToString().ToUpper() == "FALSE" ? false : true,

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
                GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                ReleaseTime = Convert.ToInt16(e["ReleaseTime"]),
                CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                IsActive = e["IsActive"].ToString().ToUpper() == "FALSE" ? false : true,

                UldTypeSNo = e["ULDName"].ToString(),
                HdnUldTypeSNo = Convert.ToInt32(e["UldTypeSNo"]),
                Unit = Convert.ToInt32(e["Unit"]),
                GWeight = Convert.ToDecimal(e["GWeight"]),
                VWeight = Convert.ToDecimal(e["VWeight"]),
                UTIsActive = e["UActive"].ToString().ToUpper() == "FALSE" ? false : true,
                ATUSNo = Convert.ToInt32(e["ATUSNo"])
                
            });
            return new KeyValuePair<string, List<AllocationTrans>>(ds.Tables[1].Rows[0][0].ToString(), AllocationTransList.AsQueryable().ToList());
        }
        public List<string> createUpdateAllocationTrans(string strData)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            string str1;
            string str2;
            string str3;
            strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
                // convert JSON string ito datatable
            strData = strData.Replace(",,", ",");
            str1 = strData.Replace("AllocationAirportSNo", "New");
            str2 = str1.Replace("HdnNew", "AllocationAirportSNo");
            str3 = str2.Replace("New", "HdnAllocationAirportSNo");
            str3 = str3.Replace("UldTypeSNo", "New");
            str3 = str3.Replace("HdnNew", "UldTypeSNo");
            str3 = str3.Replace("New", "HdnUldTypeSNo");

            var dtAllocationTrans = JsonConvert.DeserializeObject<DataTable>(str3);
            dtAllocationTrans.Columns.Remove("AllDays");
            dtAllocationTrans.Columns.Remove("HdnAllocationAirportSNo");
            dtAllocationTrans.Columns.Remove("HdnUldTypeSNo");
            dtAllocationTrans.Columns.Remove("UpdatedBy");

            foreach(DataColumn dc in dtAllocationTrans.Columns)
            {
                foreach(DataRow dr in dtAllocationTrans.Rows)
                {
                    if (dc.ToString().Contains("Day") || dc.ToString().Contains("IsActive") || dc.ToString().Contains("UTIsActive"))
                    {
                        if (dr[dc].ToString().Contains("1"))
                        {
                            dr[dc] = true;
                        }
                        else
                            dr[dc] = false;
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
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAllocationTran", Parameters);
            }
            // for update existing record
            if (dtUpdateAllocationTrans.Rows.Count > 0)
            {
                param.Value = dtAllocationTrans;
                SqlParameter[] Parameters = { param };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAllocationTrans", Parameters);
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
        public List<string> deleteAllocationTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAllocationTrans", Parameters);
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
