
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
using CargoFlash.Cargo.Model.CRA;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;


namespace CargoFlash.Cargo.DataService.CRA
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class CRAInvoiceListService : SignatureAuthenticate, ICRAInvoiceListService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        string connectionString = CRAConnectionString.WebConfigConnectionString.ToString();

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CRAInvoiceList>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListCRAInvoiceList", Parameters);
                var CRAServiceList = ds.Tables[0].AsEnumerable().Select(e => new CRAInvoiceList
                {
                    Invoice_Summary_ID = Convert.ToInt32(e["Invoice_Summary_ID"]),
                    Invc_No = Convert.ToString(e["Invc_No"]).ToString().ToUpper(),
                    Invc_Curr = Convert.ToString(e["Invc_Curr"]),
                    Party_Name = Convert.ToString(e["Party_Name"]),
                    Party_type = Convert.ToString(e["Party_type"]),
                    Invoice_Type = Convert.ToString(e["Invoice_Type"]),
                    Total_Amount = Convert.ToString(e["Total_Amount"]),
                    Generated_By = Convert.ToString(e["Generated_By"]),
                    Verified_by = Convert.ToString(e["Verified_by"]),
                    Printed_by = Convert.ToString(e["Printed_by"]),
                    Draft_Informed = Convert.ToString(e["Draft_Informed"]),
                    Final_Informed = Convert.ToString(e["Final_Informed"]),
                    Status = Convert.ToString(e["Status"]),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CRAServiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRecordListInvoice(string SNo)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@SNo",SNo)                                            
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "spCRA_GetRecordListInvoice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<InvoiceAWBDetailsGrid>> GetInvoiceAWBDetailsRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                InvoiceAWBDetailsGrid invoiceAWBDetailsGrid = new InvoiceAWBDetailsGrid();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListInvoiceAWBDetails", Parameters);
                var InvoiceAWBDetailsGridList = ds.Tables[0].AsEnumerable().Select(e => new InvoiceAWBDetailsGrid
                {
                    AWB_Serial_Number = (e["AWB_Serial_Number"]).ToString(),
                    Weight_Charges_PP = e["Weight_Charges_PP"].ToString(),
                    Weight_Charges_CC = e["Weight_Charges_CC"].ToString(),
                    Other_Charges_Due_Agent_PP = e["Other_Charges_Due_Agent_PP"].ToString(),
                    Other_Charges_Due_Carrier_PP = e["Other_Charges_Due_Carrier_PP"].ToString(),
                    Commission = (e["Commission"]).ToString(),
                    Incentive = (e["Incentive"]).ToString(),
                    Payable = (e["Payable"]).ToString(),
                    Other_Charges_Due_Agent_CC = (e["Other_Charges_Due_Agent_CC"]).ToString(),
                    Other_Charges_Due_Carrier_CC = e["Other_Charges_Due_Carrier_CC"].ToString(),
                    AWB_Currency = e["AWB_Currency"].ToString(),

                    AWB_Gross_Weight = e["AWB_Gross_Weight"].ToString(),
                    AWB_Total_PP = e["AWB_Total_PP"].ToString(),
                    AWB_Total_CC = e["AWB_Total_CC"].ToString(),

                    AWB_Valuation_Charge_PP = (e["AWB_Valuation_Charge_PP"]).ToString(),
                    AWB_Valuation_Charge_CC = e["AWB_Valuation_Charge_CC"].ToString(),
                    AWB_WT_VAL_Charge_PP = e["AWB_WT_VAL_Charge_PP"].ToString(),
                    AWB_WT_VAL_Charge_CC = e["AWB_WT_VAL_Charge_CC"].ToString(),
                    Net_Total = e["Net_Total"].ToString(),

                });

                return new KeyValuePair<string, List<InvoiceAWBDetailsGrid>>(
                ds.Tables[1].Rows[0][0].ToString(), InvoiceAWBDetailsGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
