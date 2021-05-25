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
    public class RegistryControlService : SignatureAuthenticate, IRegistryControlService
    {
        public RegistryControl GetRegistryControlRecord(string recordID, string UserID)
        {
            RegistryControl RegistryControl = new RegistryControl();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PSNo", recordID) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRegistryControl", Parameters);
                if (dr.Read())
                {
                    RegistryControl.ProcessSNo =  Convert.ToInt32(dr["SNo"].ToString());
                    RegistryControl.Text_ProcessSNo = dr["ProcessName"].ToString();
                    RegistryControl.CitySNo = 0;
                    RegistryControl.Text_CitySNo = "";
                    RegistryControl.AirlineSNo = 0;
                    RegistryControl.Text_AirlineSNo = "";
                    RegistryControl.GroupSNo = 0;
                    RegistryControl.Text_GroupSNo = "";
                    RegistryControl.PageSNo = 0;
                    RegistryControl.Text_PageSNo = "";
                    RegistryControl.RType = "";


                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return RegistryControl;
        }

        //public RCGridTran GetRegistryControlRecord(string recordID, string UserID)
        //{
        //    RCGridTran RGT = new RCGridTran();
        //    SqlDataReader dr = null;
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@PSNo", recordID) };
        //        dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRegistryControl", Parameters);
        //        if (dr.Read())
        //        {
        //            RGT.ProcessSNo = dr["DailyFlightSNo"].ToString();
        //            RGT.Text_ProcessSNo = dr["ProcessName"].ToString();
        //        }
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        dr.Close();
        //    }
        //    return RGT;
        //}

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RegistryControl>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRegistryMaster", Parameters);

                // sno, processName,SubProcessName,pagename,priority,IsRequired,isdisplay,
                //isactive,isdeleted,isoneclick,displaycaption,progresscheck,ispopupsubprocess 
                var RCList = ds.Tables[0].AsEnumerable().Select(e => new RegistryControl
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    processName = e["processName"].ToString().ToUpper(),
                    SubProcessName = e["SubProcessName"].ToString().ToUpper(),
                    pagename = e["pagename"].ToString().ToUpper(),
                    priority = e["priority"].ToString(),
                    IsRequired = e["IsRequired"].ToString(),
                    isdisplay = e["isdisplay"].ToString(),

                    isactive = e["isactive"].ToString(),
                    isdeleted = "0",// e["isdeleted"].ToString(),
                    isoneclick = e["isoneclick"].ToString(),
                    displaycaption = e["displaycaption"].ToString().ToUpper(),
                    progresscheck = e["progresscheck"].ToString(),
                    ispopupsubprocess = e["ispopupsubprocess"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RCList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<RCGridTran>> GetRegistryControlTranRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                RCGridTran RCTranData = new RCGridTran();
                SqlParameter[] Parameters = {   new SqlParameter("@RCSno", recordID), 
                                            new SqlParameter("@PageNo", 1), 
                                            new SqlParameter("@PageSize", 100), 
                                            new SqlParameter("@WhereCondition", ""), 
                                            new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRegistryControlTran", Parameters);

                //select sp.SNo, ProcessSNo,subProcessName, priority,isRequired,IsDisplay,IsActive,IsOneClick,DisplayCaption,ProgressCheck,IsPopUpSubProcess
                var RCTList = ds.Tables[0].AsEnumerable().Select(e => new RCGridTran
                {
                    SPSNo = Convert.ToInt32(e["SNo"].ToString()),
                    PSNo = Convert.ToInt32(e["ProcessSNo"].ToString()),
                    SPName = e["subProcessName"].ToString(),
                    priority = e["priority"].ToString(),
                    IsRequired = e["isRequired"].ToString().ToUpper() == "FALSE" ? false : true,
                    IsDisplay = e["IsDisplay"].ToString().ToUpper() == "FALSE" ? false : true,

                    IsActive = e["IsActive"].ToString().ToUpper() == "FALSE" ? false : true,

                    IsOnClick = e["IsOneClick"].ToString().ToUpper() == "FALSE" ? false : true,
                    DC = e["DisplayCaption"].ToString(),
                    ProgressCheck = e["ProgressCheck"].ToString().ToUpper() == "FALSE" ? false : true,
                    IsPopUpSubProcess = e["IsPopUpSubProcess"].ToString().ToUpper() == "FALSE" ? false : true,
                    Status = "",
                    Group = "",
                    totRowCount = ds.Tables[1].Rows[0][0].ToString()
                });
                return new KeyValuePair<string, List<RCGridTran>>(ds.Tables[1].Rows[0][0].ToString(), RCTList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateRegistryControlTran(string strData)
        {
            try
            {
                strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                string str1;
                string str2;
                string str3;
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

                foreach (DataColumn dc in dtAllocationTrans.Columns)
                {
                    foreach (DataRow dr in dtAllocationTrans.Rows)
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> SaveRegistryControl(DataTable dt)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dt;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRC", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RegistryControl");
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
    }
}
