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
using CargoFlash.Cargo.DataService.Shipment;
using CargoFlash.Cargo.Model.Shipment;
using System.Net;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;


namespace CargoFlash.Cargo.DataService.Shipment
{


    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CCAService : BaseWebUISecureObject, ICCAService
    {
        //BaseWebUISecureObject to replace SignatureAuthenticate
        public Stream GetWebForm(AcceptanceGetWebForm model)
        {
            try
            {
                return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "")
        {
            try
            {
                LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeSearch:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                   
                    default:
                        break;
                }
                byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveAWBEDoxDetail(int CCSNO, List<AWBEDoxDetail> AWBEDoxDetail, string AllEDoxReceived, string Remarks, string PriorApproval, int UpdatedBy, string isFOC, string FOCTypeSNo, string FocRemarks)
        {
            DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
            //DataTable dtSPHCDoxArray = CollectionHelper.ConvertTo(SPHCDoxArray, "");

            SqlParameter paramAWBEDoxDetail = new SqlParameter();
            paramAWBEDoxDetail.ParameterName = "@AWBEDoxDetail";
            paramAWBEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramAWBEDoxDetail.Value = dtAWBEDoxDetail;

            //dtSPHCDoxArray.Columns.Add("FileBinary", typeof(byte[]));
            //foreach (DataRow dr in dtSPHCDoxArray.Rows)
            //{
            //    if (dr["AltDocName"].ToString() != "")
            //    {
            //        var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["AltDocName"].ToString());
            //        dr["FileBinary"] = ReadFile(serverPath);
            //    }
            //}

            //SqlParameter paramAWBSPHCEDoxDetail = new SqlParameter();
            //paramAWBSPHCEDoxDetail.ParameterName = "@SPHCDocDetails";
            //paramAWBSPHCEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            //paramAWBSPHCEDoxDetail.Value = dtSPHCDoxArray;


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", CCSNO),
                                            paramAWBEDoxDetail,
                                            new SqlParameter("@AllEDoxReceived", false),
                                            new SqlParameter("@Remarks", Remarks),
                                            new SqlParameter("@PriorApproval", PriorApproval), 
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),                              
                                            new SqlParameter("@isFOC",isFOC),
                                            new SqlParameter("@FOCTypeSNo",FOCTypeSNo),
                                            new SqlParameter("@FocRemarks",FocRemarks)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CCA_SaveAWBEDoxDetails", Parameters);
                DeleteSelectedFiles();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
               // return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetRecordAtAWBEDox(Int32 CCSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CCSNO", CCSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CCA_GetRecordAtAWBEDox", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public static void DeleteSelectedFiles()
        {
            try
            {
                if (System.IO.Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/")))
                {
                    string[] files = System.IO.Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
                    foreach (string s in files)
                    {
                        if (s.Split('\\').Last().Split('_')[0] == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                        {
                            File.Delete(s);
                        }
                    }
                }
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public static byte[] ReadFile(string imageLocation)
        {
            try
            {
                byte[] imageData = null;
                FileInfo fileInfo = new FileInfo(imageLocation);
                long imageFileLength = fileInfo.Length;
                FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                imageData = br.ReadBytes((int)imageFileLength);
                fs.Dispose();
                br.Dispose();
                return imageData;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<CCAGrid>(filter);
            System.Data.DataSet ds = new DataSet();
            IEnumerable<CCAGrid> CommodityList = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                                         new SqlParameter("@AgentSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AgentSNo.ToString()),
                                          new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spcca_getCCAGridRecord", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {

                    CommodityList = ds.Tables[0].AsEnumerable().Select(e => new CCAGrid
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        CCANo = e["CCANo"].ToString().ToUpper(),
                        Origin = (e["Origin"]).ToString(),
                        Destination = (e["Destination"].ToString()),
                        AgentName = e["AgentName"].ToString(),
                        CreatedBy = (e["CreatedBy"].ToString()),
                        CreatedDate = (e["CreatedDate"].ToString()),
                        ApprovedDate = (e["ApprovedDate"].ToString()),
                        Status = (e["Status"].ToString()),
                        CCAStatus = (e["CCAStatus"].ToString()),
                        CCAGeneratedStatus = (e["CCAGeneratedStatus"].ToString()),
                        PendingDays = (e["PendingDays"].ToString()),
                        IsCCADoc=(e["IsCCADoc"].ToString())
                    });
                    ds.Dispose();
                }
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spcca_getCCAGridRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new DataSourceResult
            {
                Data = ds.Tables.Count > 0 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<CCAGrid>().ToList<CCAGrid>(),
                Total = ds.Tables.Count > 0 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            };

        }


        public string GetCCAData(string AwbSno)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSno",AwbSno)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCCA_GetAWBRecord", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCA_GetAWBRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string GetDepartedAWb(string GroupName)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@GroupName",GroupName)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCCA_GetDepartedAWBOnUser", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCA_GetDepartedAWBOnUser"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string UpdateCCAAWbRecord(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo",SNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCCA_UpdateCCAAWBRecord", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCA_UpdateCCAAWBRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public KeyValuePair<string, List<AWBOtherCharges>> GetChargeCodeOnAwbSno(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            AWBOtherCharges CustomerAddress = new AWBOtherCharges();

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };


            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spcca_GetChargeCodeOnAwbSno", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var CustomerAddressList = ds.Tables[0].AsEnumerable().Select(e => new AWBOtherCharges
            {
                AWBSNO = e["AWBSNO"].ToString(),
                OtherChargeCode = e["OtherChargeCode"].ToString(),
                HdnOtherChargeCode = e["OtherChargeCode"].ToString(),
                //Address = e["Address"].ToString().ToUpper(),
                ChargeAmount = e["ChargeAmount"].ToString(),
                CCAType = e["CCAType"].ToString(),
                HdnCCAType = e["CCAType"].ToString() == "Prepaid" ? "1" : "2"
                //DueType = e["DueType"].ToString(),
                //HdnDueType = e["DueType"].ToString() == "Carrier" ? "C" : "A",



            });
            return new KeyValuePair<string, List<AWBOtherCharges>>(ds.Tables[1].Rows[0][0].ToString(), CustomerAddressList.AsQueryable().ToList());
        }

        public KeyValuePair<string, List<AWBOtherCharges>> GetCCAOtherChargesRecord(string recordID, int page, int pageSize, string whereCondition, string sort, string AwbSNo)
        {

            AWBOtherCharges CustomerAddress = new AWBOtherCharges();


            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize),
            new SqlParameter("@WhereCondition", whereCondition.Split('?')[0]), new SqlParameter("@OrderBy", "") ,new SqlParameter("@AwbSNo", whereCondition.Split('?')[1]) , new SqlParameter("@DueType", whereCondition.Split('?')[2])};


            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spcca_GetCCAOtherChargesRecord", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var CustomerAddressList = ds.Tables[0].AsEnumerable().Select(e => new AWBOtherCharges
            {
                AWBSNO = e["AWBSNO"].ToString(),
                OtherChargeCode = e["OtherChargeCode"].ToString(),
                HdnOtherChargeCode = e["OtherChargeCode"].ToString(),
                //Address = e["Address"].ToString().ToUpper(),
                ChargeAmount = e["ChargeAmount"].ToString(),
                CCAType = e["CCAType"].ToString(),
                HdnCCAType = e["CCAType"].ToString() == "Prepaid" ? "1" : "2"
                //DueType = e["DueType"].ToString(),
                //HdnDueType = e["DueType"].ToString() == "Carrier" ? "C" : "A",



            });
            return new KeyValuePair<string, List<AWBOtherCharges>>(ds.Tables[1].Rows[0][0].ToString(), CustomerAddressList.AsQueryable().ToList());
        }




        public string SaveCCA(int SNo, List<SaveCCA> SaveCCA, string ActionType, List<SaveFlightRequestModel> SaveFlightRequestModel, List<CCACustomerTrans> CCACustomerTrans, int IsRepriceAWB, int IsUpdateAWB, int isTerminateShipment, int TerminateStation, int DestinationChange, List<DueCarrierOtherChargeCCA> dueCarrierOtherChargeCCA, List<DueAgentOtherChargeCCA> dueAgentOtherChargeCCA, int IsDueCarrierChange , int IsDueAgentChange)
        {
            DataSet ds = new DataSet();
            try
            {
                int ret = 0;
                DataTable DtCCA = CollectionHelper.ConvertTo(SaveCCA, "");

                DataTable FlightDetails = CollectionHelper.ConvertTo(SaveFlightRequestModel, "ODPair,oldPieces,oldGrossWeight,oldVolumeWeight,oldVolume");
                DataTable ListCCACustomerTrans = CollectionHelper.ConvertTo(CCACustomerTrans, "Text_RevisedCitySno,Text_RevisedCountrySno,Text_RevisedCustomerSNo,Text_OriginalCitySno,Text_OriginalCountrySno,Text_OriginalCustomerSNo");
                //var Approve = string.Join(",", ApproveType);
                DataTable listdueCarrierOtherChargeCCA = CollectionHelper.ConvertTo(dueCarrierOtherChargeCCA, "");
                DataTable listdueAgentOtherChargeCCA = CollectionHelper.ConvertTo(dueAgentOtherChargeCCA, "");
                SqlParameter[] Parameters = {
                                             new SqlParameter("@SNo", SNo) ,
                                             new SqlParameter("@CCATable", SqlDbType.Structured){Value=DtCCA} ,
                                             new SqlParameter("@ActionType",ActionType),
                                             new SqlParameter("@SaveCCAFlightDetails",SqlDbType.Structured){Value=FlightDetails} ,
                                             new SqlParameter("@CCACustomerTrans",SqlDbType.Structured){Value=ListCCACustomerTrans} ,
                                             new SqlParameter("@IsRepriceAWB", IsRepriceAWB) ,
                                             new SqlParameter("@IsUpdateAWB",IsUpdateAWB),
                                             new SqlParameter("@isTerminateShipment",isTerminateShipment),
                                             new SqlParameter("@TerminateStation",TerminateStation)  ,
                                             new SqlParameter("@DestinationChange",DestinationChange),
                                             new SqlParameter("@DueCarrierOtherChargeTabTable", SqlDbType.Structured) { Value= listdueCarrierOtherChargeCCA},
                                             new SqlParameter("@AgentOtherChargeTabTable",SqlDbType.Structured) { Value=listdueAgentOtherChargeCCA},
                                             new SqlParameter("@IsDueCarrierChange", IsDueCarrierChange),
                                             new SqlParameter("@IsDueAgentChange", IsDueAgentChange)

                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCCA_CreateCCARecord", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCA_CreateCCARecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
        }
        public string GetFlightPlanData(int AWBSNo , int SNo) {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo",AWBSNo),
                                            new SqlParameter("@SNo",SNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCCA_GetflightPlanData", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spCCA_GetflightPlanData"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetCharges(int SNo, List<SaveCCA> SaveCCA)
        {
            DataSet ds = new DataSet();
            try
            {
                int ret = 0;
                DataTable DtCCA = CollectionHelper.ConvertTo(SaveCCA, "");

               
               
                //var Approve = string.Join(",", ApproveType);
             
              
                SqlParameter[] Parameters = {
                                             new SqlParameter("@SNo", SNo) ,
                                             new SqlParameter("@CCATable", SqlDbType.Structured){Value=DtCCA} ,
                                             new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChargesOnCCA", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetChargesOnCCA"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
              return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
