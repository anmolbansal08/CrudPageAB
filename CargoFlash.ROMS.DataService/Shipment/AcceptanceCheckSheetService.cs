using CargoFlash.Cargo.DataService.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AcceptanceCheckSheetService : BaseWebUISecureObject, IAcceptanceCheckSheetService
    {
        public string GetAcceptanceCheckSheetRecordGeneral(string pageNo, string pageSize, string WhereCondition, string orderBy, string awbSNo, string checkListTypeSNo, string SPHCSNo)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@pageNo", pageNo), new SqlParameter("@pageSize", pageSize), new SqlParameter("@whereCondition", WhereCondition), new SqlParameter("@OrderBy", orderBy), new SqlParameter("@awbSNo", awbSNo), new SqlParameter("@CheckListTypeSNo", checkListTypeSNo), new SqlParameter("@SPHCSNo", SPHCSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWMSCheckList", Parameter);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAcceptanceCheckSheetRecordOther(string pageNo, string pageSize, string WhereCondition, string orderBy,string AWBSNo, string SPHCSNo, string checkListTypeSNo)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@pageNo", pageNo), new SqlParameter("@pageSize", pageSize), new SqlParameter("@whereCondition", WhereCondition), new SqlParameter("@OrderBy", orderBy), new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@SPHCSNo", SPHCSNo), new SqlParameter("@CheckListTypeSNo", checkListTypeSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWMSCheckList", Parameter);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAcceptanceCheckSheetRecordFooter(string awbSNo, string SPHCSNo, string ChecklistTypeSno)
        {

            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@AWBSNo", awbSNo), new SqlParameter("@SPHCSNo", SPHCSNo), new SqlParameter("@ChecklistTypeSno", ChecklistTypeSno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBChecklistFooter", Parameter);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(ds);
                return JSONString;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAcceptanceCheckSheetRecordHeader(string awbSNo, string SPHCSNo)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@AWBSNo", awbSNo), new SqlParameter("@SPHCSNo", SPHCSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBChecklistHeader", Parameter);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string GetColumnName(string awbSNo)
        {
            try
            {
                SqlParameter[] Parameter = { new SqlParameter("@AWBSNo", awbSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getControlNamePrint", Parameter);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
