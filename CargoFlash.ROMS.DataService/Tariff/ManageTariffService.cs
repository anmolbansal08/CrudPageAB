using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Tariff
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "IrregularityService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ManageTariffService : SignatureAuthenticate, IManageTariffService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

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
                string filters = GridFilter.ProcessFilters<ManageTariff>(filter);
                var user = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@IsShowAllData",user.IsShowAllData.ToString()),
                    new SqlParameter("@UserSNo", user.UserSNo),
                      new SqlParameter("@CitySNo", user.CitySNo),
                        new SqlParameter("@AirportSNo", user.AirportSNo),
                          new SqlParameter("@TerminalSNo", user.TerminalSNo)
            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListManageTariff", Parameters);
                var IrregularityList = ds.Tables[0].AsEnumerable().Select(e => new ManageTariff
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    TariffName = e["TariffName"].ToString().ToUpper(),
                    TariffIdName = e["TariffIdName"].ToString().ToUpper(),
                    TariffForValue = e["TariffFor"].ToString().ToUpper(),
                    Mandatory = e["Mandatory"].ToString().ToUpper(),
                    FreightType = e["FreightType"].ToString().ToUpper(),
                    Location = e["Location"].ToString().ToUpper(),
                    BuildUpTypeValue = e["BuildUpTypeValue"].ToString().ToUpper(),

                    TariffCode = e["TariffCode"].ToString().ToUpper(),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    // ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    // ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    Active = e["Active"].ToString().ToUpper(),

                    ApplicableFor = e["ApplicableFor"].ToString().ToUpper(),
                    Domestic = e["Domestic"].ToString().ToUpper(),
                    ChargeTo = e["ChargeTo"].ToString().ToUpper(),
                    ShipmentType = e["ShipmentType"].ToString().ToUpper(),
                    SPHC = e["SPHC"].ToString().ToUpper(),
                    Text_SHCGroup = e["Text_SHCGroup"].ToString().ToUpper(),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString().ToUpper()


                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IrregularityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get Record on the basis of recordID from ManageTarif
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public ManageTariff GetManageTariffRecord(string recordID, string UserID)
        {
            ManageTariff manageTariff = new ManageTariff();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordManageTariff", Parameters);
                if (dr.Read())
                {
                    manageTariff.SNo = Convert.ToInt32(dr["SNo"]);
                    manageTariff.TariffFor = dr["TariffFor"].ToString().ToUpper();
                    manageTariff.FreightType = dr["FreightType"].ToString();
                    manageTariff.Text_FreightType = dr["FreightType1"].ToString();
                    manageTariff.BuildUpType = dr["BuildUpType"].ToString();
                    manageTariff.BuildUpTypeValue = dr["BuildUpTypeValue"].ToString();
                    manageTariff.TariffForValue = dr["TariffForValue"].ToString().ToUpper();
                    manageTariff.Location = dr["Terminal"].ToString() == "" ? dr["LocationSNo"].ToString() : "";
                    manageTariff.Text_Location = dr["Text_Terminal"].ToString() == "" ? dr["Location"].ToString().ToUpper() : "";
                    manageTariff.LocationMulti = dr["Terminal"].ToString();
                    manageTariff.Text_LocationMulti = dr["Text_Terminal"].ToString().ToUpper();
                    manageTariff.TariffName = dr["TariffNameSNo"].ToString();
                    manageTariff.Text_TariffName = dr["TariffName"].ToString().ToUpper();
                    manageTariff.TariffCode = dr["TariffCodeSNo"].ToString();
                    manageTariff.Text_TariffCode = dr["TariffCode"].ToString().ToUpper();
                    manageTariff.TariffBasis = dr["TariffBasis"].ToString().ToUpper();
                    manageTariff.ShipmentType = dr["ShipmentTypeSNo"].ToString();
                    manageTariff.ShipmentTypeValue = dr["ShipmentType"].ToString().ToUpper();
                    manageTariff.ApplicableFor = dr["ApplicableForSNo"].ToString();
                    manageTariff.ApplicableForValue = dr["ApplicableFor"].ToString().ToUpper();
                    manageTariff.ChargeTo = dr["ChargeToSNo"].ToString();
                    manageTariff.ChargeToValue = dr["ChargeTo"].ToString().ToUpper();
                    manageTariff.ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(dr["ValidFrom"].ToString()), DateTimeKind.Utc);
                    manageTariff.ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(dr["ValidTo"].ToString()), DateTimeKind.Utc);
                    // manageTariff.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    // manageTariff.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    manageTariff.Minimum = dr["Minimum"].ToString();
                    manageTariff.BasedOn = dr["BasedOnSNo"].ToString();
                    manageTariff.BasedOnValue = dr["BasedOn"].ToString().ToUpper();
                    manageTariff.Mandatory = dr["Mandatory"].ToString().ToUpper();
                    manageTariff.ESS = dr["ESS"].ToString();
                    manageTariff.IsMandatory = Convert.ToBoolean(dr["IsMandatory"].ToString());
                    manageTariff.IsESS = Convert.ToBoolean(dr["IsESS"].ToString());
                    manageTariff.Remarks = dr["Remarks"].ToString().ToUpper();
                    manageTariff.FreightPercentValue = dr["FreightPercentValue"].ToString();
                    manageTariff.Currency = dr["CurrencySNo"].ToString().ToUpper();
                    manageTariff.Text_Currency = dr["CurrencyCode"].ToString().ToUpper();
                    manageTariff.Tax = dr["TaxSNo"].ToString();
                    manageTariff.Text_Tax = dr["Tax"].ToString().ToUpper();
                    manageTariff.SPHC = dr["SPHCSNo"].ToString();
                    manageTariff.Text_SPHC = dr["SPHC"].ToString().ToUpper();
                    manageTariff.Agent = dr["AgentSNo"].ToString();
                    manageTariff.Text_Agent = dr["Agent"].ToString().ToUpper();
                    manageTariff.Airline = dr["AirlineSNo"].ToString();
                    manageTariff.Text_Airline = dr["Airline"].ToString().ToUpper();
                    manageTariff.UpdatedBy = dr["UpdatedBy"].ToString().ToUpper();
                    manageTariff.CreatedBy = dr["CreatedBy"].ToString().ToUpper();
                    manageTariff.Ratetype = dr["Ratetype"].ToString();
                    manageTariff.Chargetype = dr["Chargetype"].ToString();

                    manageTariff.Inventory = dr["ConsumableSNo"].ToString();
                    manageTariff.Text_Inventory = dr["ConsumableItem"].ToString();

                    manageTariff.Process = dr["ProcessSNo"].ToString();
                    manageTariff.Text_Process = dr["ProcessName"].ToString();

                    manageTariff.SubProcess = dr["SubProcessSNo"].ToString();
                    manageTariff.Text_SubProcess = dr["SubProcessName"].ToString();


                    manageTariff.Text_Inventory = dr["ConsumableItem"].ToString();
                    manageTariff.IsFlatRate = dr["FlatRate"].ToString();
                    manageTariff.Text_FlatRate = dr["Text_FlatRate"].ToString();

                    manageTariff.IsSurcharge = Convert.ToBoolean(dr["IsSurcharge"].ToString());
                    manageTariff.Text_IsSurcharge = dr["Text_IsSurcharge"].ToString();
                    manageTariff.Days = dr["Days"].ToString();
                    manageTariff.Value = dr["Value"].ToString();

                    manageTariff.IsMON = Convert.ToBoolean(dr["IsMON"].ToString());
                    manageTariff.IsTUE = Convert.ToBoolean(dr["IsTUE"].ToString());
                    manageTariff.IsWED = Convert.ToBoolean(dr["IsWED"].ToString());
                    manageTariff.IsTHU = Convert.ToBoolean(dr["IsTHU"].ToString());
                    manageTariff.IsFRI = Convert.ToBoolean(dr["IsFRI"].ToString());
                    manageTariff.IsSAT = Convert.ToBoolean(dr["IsSAT"].ToString());
                    manageTariff.IsSUN = Convert.ToBoolean(dr["IsSUN"].ToString());


                    manageTariff.MON = dr["MON"].ToString();
                    manageTariff.TUE = dr["TUE"].ToString();
                    manageTariff.WED = dr["WED"].ToString();
                    manageTariff.THU = dr["THU"].ToString();
                    manageTariff.FRI = dr["FRI"].ToString();
                    manageTariff.SAT = dr["SAT"].ToString();
                    manageTariff.SUN = dr["SUN"].ToString();
                    manageTariff.HallDays = (dr["MON"].ToString() + ',' + dr["TUE"].ToString() + ',' + dr["WED"].ToString() + ',' + dr["THU"].ToString() + ',' + dr["FRI"].ToString() + ',' + dr["SAT"].ToString() + ',' + dr["SUN"].ToString());
                    manageTariff.SHCGroup = dr["SHCGroup"].ToString();
                    manageTariff.Text_SHCGroup = dr["Text_SHCGroup"].ToString();

                    manageTariff.TruckDestination = dr["TruckDestination"].ToString();
                    manageTariff.Text_TruckDestination = dr["Text_TruckDestination"].ToString();

                    manageTariff.TariffIdName = dr["TariffIdName"].ToString();

                    manageTariff.Warehousefacility = dr["Warehousefacility"].ToString();
                    manageTariff.Text_Warehousefacility = dr["Text_Warehousefacility"].ToString();

                    manageTariff.AccountTypeId = dr["AccountTypeId"].ToString();
                    manageTariff.Text_AccountTypeId = dr["Text_AccountTypeId"].ToString();

                    manageTariff.SlideScale = dr["Text_SlideScale"].ToString();
                    manageTariff.IsSlideScale = Convert.ToBoolean(dr["SlideScale"].ToString());

                    manageTariff.EditableUnit = dr["EditableUnit"].ToString();
                    manageTariff.IsEditableUnit = Convert.ToBoolean(dr["IsEditableUnit"].ToString());

                    manageTariff.Domestic = dr["Domestic"].ToString();
                    manageTariff.IsDomestic = Convert.ToString(dr["IsDomestic"].ToString());


                    manageTariff.RushHandling = dr["RushHandling"].ToString();
                    manageTariff.IsRushHandling = Convert.ToBoolean(dr["IsRushHandling"].ToString());

                    manageTariff.WHLocationTypeSNo = dr["WHLocationTypeSNo"].ToString();
                    manageTariff.Text_WHLocationTypeSNo = dr["Locationtype"].ToString();

                    manageTariff.DemurrageCast = dr["TotalCost"].ToString();
                    manageTariff.ULDType = dr["ULDType"].ToString();
                    manageTariff.Text_ULDType = dr["ULDType"].ToString();

                    manageTariff.Accounttype = dr["Accounttype"].ToString();
                    manageTariff.Text_Accounttype = dr["AutoCompleteText"].ToString();

                    manageTariff.Active = dr["Active"].ToString();
                    manageTariff.IsActive =Convert.ToBoolean(dr["IsActive"].ToString());
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
            dr.Close();
            return manageTariff;
        }

        /// <summary>
        /// Below Method used to fetch record for edit and view for Slabtrans
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="whereCondition"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public KeyValuePair<string, List<TariffSlab>> GetTariffSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "TariffSNo=" + recordID;
                TariffSlab tariffSlab = new TariffSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTariffSlabRecord", Parameters);
                var tariffSlabList = ds.Tables[0].AsEnumerable().Select(e => new TariffSlab
                {
                    SNo = Convert.ToInt32(e["SlabSNo"]),
                    SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                    TariffSNo = Convert.ToInt32(e["TariffSNo"].ToString()),
                    SlabType = e["SlabType"].ToString(),
                    StartValue = Convert.ToDecimal(e["StartValue"].ToString()),
                    EndValue = Convert.ToDecimal(e["EndValue"].ToString()),
                    SlabValue = Convert.ToDecimal(e["SlabValue"].ToString()),
                    IsFlatRate = Convert.ToBoolean(e["IsFlatRate"].ToString()),
                    MinimumSlab = Convert.ToDecimal(e["MinimumSlab"].ToString())
                });
                return new KeyValuePair<string, List<TariffSlab>>(ds.Tables[1].Rows[0][0].ToString(), tariffSlabList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<RevenueSharingSlab>> GetRevenueSharingSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                whereCondition = "TariffSNo=" + recordID;
                RevenueSharingSlab RevenueSharing = new RevenueSharingSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRevenueSharingSlabRecord", Parameters);
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {


                        if (Convert.ToInt32(ds.Tables[0].Rows[0]["isRevenueSharingAmount"]) == 1)
                        {
                            var RevenueSharingSlabList = ds.Tables[0].AsEnumerable().Select(e => new RevenueSharingSlab
                            {
                                SNo = Convert.ToInt32(e["SlabSNo"]),
                                RevenueSharingCustomer = e["Text_RevenueSharingCustomer"].ToString(),
                                HdnRevenueSharingCustomer = Convert.ToInt32(e["RevenueSharingCustomerSNo"]),
                                RevenueAmount = Convert.ToDecimal(e["RevenueSharing"]),
                                isRevenueSharingAmount = Convert.ToInt32(e["isRevenueSharingAmount"]),

                            });
                            return new KeyValuePair<string, List<RevenueSharingSlab>>(ds.Tables[1].Rows[0][0].ToString(), RevenueSharingSlabList.AsQueryable().ToList());
                        }
                        else
                        {
                            var RevenueSharingSlabList = ds.Tables[0].AsEnumerable().Select(e => new RevenueSharingSlab
                             {
                                 SNo = Convert.ToInt32(e["SlabSNo"]),
                                 RevenueSharingCustomer = e["Text_RevenueSharingCustomer"].ToString(),
                                 HdnRevenueSharingCustomer = Convert.ToInt32(e["RevenueSharingCustomerSNo"]),
                                 RevenueSharing = Convert.ToDecimal(e["RevenueSharing"]),
                                 isRevenueSharingAmount = Convert.ToInt32(e["isRevenueSharingAmount"]),

                             });
                            return new KeyValuePair<string, List<RevenueSharingSlab>>(ds.Tables[1].Rows[0][0].ToString(), RevenueSharingSlabList.AsQueryable().ToList());
                        }
                    }
                    else
                    {
                        var RevenueSharingSlabList = ds.Tables[0].AsEnumerable().Select(e => new RevenueSharingSlab
                        {
                            SNo = Convert.ToInt32(e["SlabSNo"]),
                            RevenueSharingCustomer = e["Text_RevenueSharingCustomer"].ToString(),
                            HdnRevenueSharingCustomer = Convert.ToInt32(e["RevenueSharingCustomerSNo"]),
                            RevenueSharing = Convert.ToDecimal(e["RevenueSharing"]),
                            isRevenueSharingAmount = Convert.ToInt32(e["isRevenueSharingAmount"]),

                        });
                        return new KeyValuePair<string, List<RevenueSharingSlab>>(ds.Tables[1].Rows[0][0].ToString(), RevenueSharingSlabList.AsQueryable().ToList());


                    }
                }
                else
                {
                    var RevenueSharingSlabList = ds.Tables[0].AsEnumerable().Select(e => new RevenueSharingSlab
                    {
                        SNo = Convert.ToInt32(e["SlabSNo"]),
                        RevenueSharingCustomer = e["Text_RevenueSharingCustomer"].ToString(),
                        HdnRevenueSharingCustomer = Convert.ToInt32(e["RevenueSharingCustomerSNo"]),
                        RevenueSharing = Convert.ToDecimal(e["RevenueSharing"]),
                        isRevenueSharingAmount = Convert.ToInt32(e["isRevenueSharingAmount"]),

                    });
                    return new KeyValuePair<string, List<RevenueSharingSlab>>(ds.Tables[1].Rows[0][0].ToString(), RevenueSharingSlabList.AsQueryable().ToList());

                }


            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        /// <summary>
        /// Get Record on the basis of TariffSno from TariffBasis
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public string GetTariffBasis(string TariffSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TariffSNo", TariffSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTariffBasis", Parameters);
                ds.Dispose();
                return DStoJSON(ds);
            }
            catch (Exception ex)//
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
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        ///// </summary>
        ///// <param name="ManageTariff"></param>
        ///// <returns></returns>
        public List<string> SaveAndUpdateManageTariff(List<SaveManageTariff> ManageTariff)
        {
            //ManageTariff mangetraiff_;
            //ManageTariff = new List<ManageTariff>();
            //foreach (var item in ManageTariff)
            //{
            //    if (item.ValidFrom != null)
            //    {
            //        item.ValidFrom_ = Convert.ToDateTime(item.ValidFrom);
            //    }
            //    if (item.ValidTo != null)
            //    {
            //        item.ValidTo_ = Convert.ToDateTime(item.ValidTo);
            //    }
            //}

            List<string> ErrorMessage = new List<string>();
            DataTable dtTariffSlab = new DataTable();
            dtTariffSlab.Columns.Add("SNo", typeof(int));
            dtTariffSlab.Columns.Add("SlabType", typeof(int));
            dtTariffSlab.Columns.Add("StartValue", typeof(decimal));
            dtTariffSlab.Columns.Add("EndValue", typeof(decimal));
            dtTariffSlab.Columns.Add("SlabValue", typeof(decimal));
            dtTariffSlab.Columns.Add("IsFlatRate", typeof(decimal));
            dtTariffSlab.Columns.Add("MinimumSlab", typeof(decimal));

            DataTable dtstrRevenueSlab = new DataTable();
            dtstrRevenueSlab.Columns.Add("SNo", typeof(int));
            dtstrRevenueSlab.Columns.Add("Customer", typeof(int));
            dtstrRevenueSlab.Columns.Add("RevenueSharing", typeof(decimal));
            dtstrRevenueSlab.Columns.Add("isRevenueSharingAmount", typeof(int));



            //DataTable dtTariff = CollectionHelper.ConvertTo(ManageTariff, "ActionType,TariffBasis,ESS,Mandatory,Text_Location,Text_TariffCode,Text_TariffName,Text_Airline,Text_Agent,Text_SPHC,Text_WHLocationTypeSNo,Text_Tax,Text_Currency,strData,BuildUpTypeValue,Text_FreightType,TariffForValue,ShipmentTypeValue,ApplicableForValue,ChargeToValue,BasedOnValue,CreatedBy,UpdatedBy,Ratetype,Chargetype,Text_Inventory,Text_Process,Text_SubProcess,Text_FlatRate,Text_IsSurcharge,MON,TUE,WED,THU,FRI,SAT,SUN,IsMON,IsTUE,IsWED,IsTHU,IsFRI,IsSAT,IsSUN,Text_SHCGroup,Text_LocationMulti,Text_TruckDestination,Text_Warehousefacility,Text_AccountTypeId,SlideScale,EditableUnit,Domestic,RushHandling");

            DataTable dtTariff = CollectionHelper.ConvertTo(ManageTariff, "ActionType,TariffBasis,ESS,Mandatory,Text_Location,Text_TariffCode,Text_TariffName,Text_Airline,Text_Agent,Text_SPHC,Text_WHLocationTypeSNo,Text_Tax,Text_Currency,strRevenueData,strData,BuildUpTypeValue,Text_FreightType,TariffForValue,ShipmentTypeValue,ApplicableForValue,ChargeToValue,BasedOnValue,CreatedBy,UpdatedBy,Ratetype,Chargetype,Text_Inventory,Text_Process,Text_SubProcess,Text_FlatRate,Text_IsSurcharge,MON,TUE,WED,THU,FRI,SAT,SUN,IsMON,IsTUE,IsWED,IsTHU,IsFRI,IsSAT,IsSUN,Text_SHCGroup,Text_LocationMulti,Text_TruckDestination,Text_Warehousefacility,Text_AccountTypeId,SlideScale,EditableUnit,Domestic,RushHandling,DemurrageCast,Text_ULDType,Text_Accounttype,Active");
            string ActionType = ManageTariff[0].ActionType;
            dtTariff.Columns.Remove("HallDays");

            DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(ManageTariff[0].strData), (typeof(DataTable)));
            if (dt != null)
                dtTariffSlab = dt;
            DataTable dt1 = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(ManageTariff[0].strRevenueData), (typeof(DataTable)));
            if (dt1 != null)
                dtstrRevenueSlab = dt1;
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param =
                                        {
                                            new SqlParameter("@ActionType",ActionType),
                                            new SqlParameter("@TariffTable",dtTariff),
                                            new SqlParameter("@TariffSlabTable",dtTariffSlab),
                                            new SqlParameter("@TariffRevenueSlabTable",dtstrRevenueSlab),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                string reterun = (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateAndUpdateManageTariff", param).Tables[0].Rows[0][0];

                int SNo = 0; int ret = 0;
                if (reterun.Contains(','))
                {
                    SNo = Convert.ToInt32(reterun.Split(',')[0]);
                    ret = Convert.ToInt32(reterun.Split(',')[1]);
                }
                else
                    ret = Convert.ToInt32(reterun);
                if (ret > 0)
                {
                    if (ret == 5000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = "Tariff already exists.";
                        //string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTariff");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret > 1000 && ret < 5000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTariff");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteManageTariff(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteManageTariff", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ManageTariff");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteManageTariffSlab(string RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteManageTariffSlab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ManageTariff");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteRevenueSharingSlab(string RecordId)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRevenueSharingSlab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ManageTariff");
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
            catch (Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public string GetRateNChargeType(string TariffCodeSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@TariffCodeSNo", TariffCodeSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateNChargeType", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds); ;
        }
        public string GetSHCForShipmentType(string SHCValue)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SHCValue", SHCValue) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSHCForShipmentType", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)//
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
