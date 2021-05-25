using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
	[GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
	[ServiceBehavior(IncludeExceptionDetailInFaults = true)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
	class FHLExportService : BaseWebUISecureObject, IFHLExportService
	{

		public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
		{
			return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
		}

		private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchIncludeTransitAWB = "", string SearchExcludeDeliveredAWB = "", string LoggedInCity = "", string searchSPHC = "", string searchConsignee = "")
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
					case DisplayModeDuplicate:

						break;
					case DisplayModeEdit:

						break;
					case DisplayModeDelete:

						break;
					case DisplayModeIndexView:
						switch (processName)
						{
							case "FHLExport":
								if (appName.ToUpper().Trim() == "FHLEXPORT")
									CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, searchAWBNo, searchFromDate, searchToDate, SearchIncludeTransitAWB, SearchExcludeDeliveredAWB, searchSPHC, searchConsignee);
								break;
							default:
								break;
						}
						break;
					case DisplayModeReadView:
						using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
						{
							htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
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

		public Stream GetGridData(string processName, string moduleName, string appName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string LoggedInCity, string searchSPHC, string searchConsignee)
		{
			return BuildWebForm(processName, moduleName, appName, "IndexView", searchAirline: searchAirline, searchFlightNo: searchFlightNo, searchAWBNo: searchAWBNo, searchFromDate: searchFromDate, searchToDate: searchToDate, SearchIncludeTransitAWB: SearchIncludeTransitAWB, SearchExcludeDeliveredAWB: SearchExcludeDeliveredAWB, LoggedInCity: LoggedInCity, searchSPHC: searchSPHC, searchConsignee: searchConsignee);
		}

		private void CreateGrid(StringBuilder Container, string ProcessName, string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string searchSPHC, string searchConsignee)
		{
			try
			{
				using (Grid g = new Grid())
				{
					g.PageName = this.MyPageName;
					g.PrimaryID = this.MyPrimaryID;
					g.ModuleName = this.MyModuleID;
					g.AppsName = this.MyAppID;
					g.DataSoruceUrl = "Services/Shipment/FHLExportService.svc/FHLGridData";
					g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
					g.ServiceModuleName = this.MyModuleID;
					g.UserID = this.MyUserID;
					g.FormCaptionText = "FHL";
					g.DefaultPageSize = 5;
					g.IsDisplayOnly = false;
					g.IsProcessPart = true;
					g.IsActionRequired = false;
					g.IsVirtualScroll = false;
					g.IsShowGridHeader = false;
					// g.IsShowGridHeader = false;
					g.ProcessName = ProcessName;

					g.Column = new List<GridColumn>();
					g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
					//g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
					g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
					//g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
					g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
					g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 60, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
					//  g.Column.Add(new GridColumn { Field = "SLINo", Title = "Lot No", DataType = GridDataType.String.ToString(), Width = 60 });
					g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
					g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
					g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString(), Width = 40 });
					g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 40 });
					g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
					g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), IsHidden = true });
					g.Column.Add(new GridColumn { Field = "EnteredType", Title = "EnteredType", DataType = GridDataType.String.ToString(), IsHidden = true });

					g.ExtraParam = new List<GridExtraParam>();
					g.ExtraParam.Add(new GridExtraParam { Field = "searchAirline", Value = searchAirline });
					g.ExtraParam.Add(new GridExtraParam { Field = "searchFlightNo", Value = searchFlightNo });
					g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
					g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
					g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
					g.ExtraParam.Add(new GridExtraParam { Field = "SearchIncludeTransitAWB", Value = SearchIncludeTransitAWB });
					g.ExtraParam.Add(new GridExtraParam { Field = "SearchExcludeDeliveredAWB", Value = SearchExcludeDeliveredAWB });
					g.InstantiateIn(Container);

				}
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}

		public DataSourceResult FHLGridData(string searchAirline, string searchFlightNo, string searchAWBNo, string searchFromDate, string searchToDate, string SearchIncludeTransitAWB, string SearchExcludeDeliveredAWB, string searchSPHC, string searchConsignee, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
		{
			try
			{
				string sorts = GridSort.ProcessSorting(sort);
				string ProcName = "";
				if (filter == null)
				{
					filter = new GridFilter();
					filter.Logic = "AND";
					filter.Filters = new List<GridFilter>();
				}
				DataSet ds = new DataSet();
				ProcName = "FHLExportGridData";
				string filters = GridFilter.ProcessFilters<FHLExport>(filter);

				//SqlParameter[] Parameters = {
				//                                //Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy")
				//                                new SqlParameter("@PageNo", page),
				//                                new SqlParameter("@PageSize", pageSize),
				//                                new SqlParameter("@WhereCondition", filters + ( Convert.ToDateTime(searchFromDate).ToString("dd-MMM-yy") != "0" ? " FlightDate>='" + Convert.ToDateTime(searchFromDate).ToString("dd-MMM-yy") + "'" : string.Empty) + (Convert.ToDateTime(searchToDate).ToString("dd-MMM-yy") != "0" ? (Convert.ToDateTime(searchFromDate).ToString("dd-MMM-yy") != "0" ? " AND FlightDate<='" + Convert.ToDateTime(searchToDate).ToString("dd-MMM-yy") + "'" : " FlightDate<='" +Convert.ToDateTime(searchToDate).ToString("dd-MMM-yy") + "'") : string.Empty)),
				//                                new SqlParameter("@OrderBy", sorts),
				//                                new SqlParameter("@searchAirline", searchAirline),
				//                                new SqlParameter("@searchFlightNo", searchFlightNo),
				//                                new SqlParameter("@searchAWBNo", searchAWBNo),
				//                                new SqlParameter("@searchFromDate", searchFromDate),
				//                                new SqlParameter("@searchToDate", searchToDate),
				//                                new SqlParameter("@SearchIncludeTransitAWB", SearchIncludeTransitAWB),
				//                                new SqlParameter("@SearchExcludeDeliveredAWB", SearchExcludeDeliveredAWB),
				//                                new SqlParameter("@LoggedInCity", ""),
				//                                new SqlParameter("@searchSPHC", ""),
				//                                new SqlParameter("@searchConsignee", "")
				//                            };
				int accountsno = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AgentSNo.ToString());
				int OfficeSNo = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).OfficeSNo.ToString());

				SqlParameter[] Parameters = {
											new SqlParameter("@PageNo", page),
											new SqlParameter("@PageSize", pageSize),
											new SqlParameter("@WhereCondition", filters),
											new SqlParameter("@OrderBy", sorts),
											new SqlParameter("@searchAirline", searchAirline),
											new SqlParameter("@searchFlightNo", searchFlightNo),
											new SqlParameter("@searchAWBNo", searchAWBNo),
											new SqlParameter("@searchFromDate", searchFromDate),
											new SqlParameter("@searchToDate", searchToDate),
											new SqlParameter("@SearchIncludeTransitAWB", SearchIncludeTransitAWB),
											new SqlParameter("@SearchExcludeDeliveredAWB", SearchExcludeDeliveredAWB),
											new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
											new SqlParameter("@searchSPHC", ""),
											new SqlParameter("@searchConsignee", "0"),
											  new SqlParameter("@AccountSNo", accountsno),
												new SqlParameter("@OfficeSNo", OfficeSNo)


										};

				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

				var DeliveryOrderList = ds.Tables[0].AsEnumerable().Select(e => new FHLExport
				{

					SNo = Convert.ToInt32(e["SNo"]),
					// DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
					//Airline = e["Airline"].ToString(),
					FlightNo = e["FlightNo"].ToString(),


					FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),

					AWBNo = e["AWBNo"].ToString(),
					//SLINo = e["SLINo"].ToString(),
					Origin = e["Origin"].ToString(),
					Destination = e["Destination"].ToString(),
					Pcs = Convert.ToInt16(e["Pcs"]),
					//ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
					//ATA = e["ATA"].ToString(),
					ProcessStatus = e["ProcessStatus"].ToString(),
					//ProcessStatus = e["Status"].ToString(),
					//EnteredType = e["EnteredType"].ToString(),
				});

				ds.Dispose();
				return new DataSourceResult
				{
					Data = DeliveryOrderList.AsQueryable().ToList(),
					Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
					FilterCondition = filters,
					SortCondition = sorts,
					StoredProcedure = ProcName
				};
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}

		public string GetProcessSequence(string ProcessName)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequenceImport", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}

		public string GetDeliveryOrderInformation(Int32 AWBSNO)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryOrderInformation", Parameters);
				ds.Dispose();

				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}

		public string GetHAWBNoDetailsFromSLIDetails(string HAWBNo, string AWBSNo)
		{

			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@HAWBNo", HAWBNo),
											new SqlParameter("@AWBSNo", AWBSNo),
                                            //new SqlParameter("@SLISNo", SLISNo),
                                        };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHAWBNoDetailsFromSLIDetails", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public string BindFHLSectionTable(Int32 AWBSNO)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
				DataSet ds = new DataSet();
				ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBindFHLSectionTable_Export", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}


		public string BindFHLSectionPrintHouse(Int32 AWBSNO)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
				DataSet ds = new DataSet();
				ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBindFHLSectionPrintHouse", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}



		public string GetShipperAndConsigneeInformation(Int32 AWBSNO)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperAndConsigneeInformationImport", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}

		public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipperConsigneeDetailsExport", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//
			{
				throw ex;
			}
		}







		public string ValidateCutoffTime(Int32 DlyFlghtSno, string Origin, string Dest)
		{
			DataSet ds;
			SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DlyFlghtSno), new SqlParameter("@Origin", Origin), new SqlParameter("@Dest", Dest) };
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateCutoffTimeImport", Parameters);
				return ds.Tables[0].Rows[0][0].ToString();
			}
			catch (Exception ex)//
			{
				throw ex;
			}

		}







		public string UpdateShipperAndConsigneeInformation(Int32 AWBSNo, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportNotifyDetails NotifyModel, ImportNominyDetails NominyModel, ImportAgentModelDetail AgentModel, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno)
		{
			List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
			lstShipperInformation.Add(ShipperInformation);
			DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
			BaseBusiness baseBusiness = new BaseBusiness();


			List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
			lstConsigneeInformation.Add(ConsigneeInformation);
			DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

			List<ImportNotifyDetails> lstNotifyInformation = new List<ImportNotifyDetails>();
			lstNotifyInformation.Add(NotifyModel);
			DataTable dtNotifyDetails = CollectionHelper.ConvertTo(lstNotifyInformation, "");

			List<ImportNominyDetails> lstNominyInformation = new List<ImportNominyDetails>();
			lstNominyInformation.Add(NominyModel);
			DataTable dtNominyDetails = CollectionHelper.ConvertTo(lstNominyInformation, "");

			List<ImportAgentModelDetail> lstImportAgentModelDetail = new List<ImportAgentModelDetail>();
			lstImportAgentModelDetail.Add(AgentModel);
			DataTable dtImportAgentModelDetail = CollectionHelper.ConvertTo(lstImportAgentModelDetail, "");

			SqlParameter paramShipperInformation = new SqlParameter();
			paramShipperInformation.ParameterName = "@ShipperInformation";
			paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramShipperInformation.Value = dtShipperInformation;

			SqlParameter paramConsigneeInformation = new SqlParameter();
			paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
			paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramConsigneeInformation.Value = dtConsigneeInformation;

			SqlParameter paramNotifyDetails = new SqlParameter();
			paramNotifyDetails.ParameterName = "@NotifyDetails";
			paramNotifyDetails.SqlDbType = System.Data.SqlDbType.Structured;
			paramNotifyDetails.Value = dtNotifyDetails;

			SqlParameter paramNominyDetails = new SqlParameter();
			paramNominyDetails.ParameterName = "@NominyDetails";
			paramNominyDetails.SqlDbType = System.Data.SqlDbType.Structured;
			paramNominyDetails.Value = dtNominyDetails;

			SqlParameter paramImportAgentModelDetail = new SqlParameter();
			paramImportAgentModelDetail.ParameterName = "@ImportAgentModelDetail";
			paramImportAgentModelDetail.SqlDbType = System.Data.SqlDbType.Structured;
			paramImportAgentModelDetail.Value = dtImportAgentModelDetail;

			DataSet ds = new DataSet();
			SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramShipperInformation, paramConsigneeInformation, paramNotifyDetails, paramNominyDetails, paramImportAgentModelDetail, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
			DataSet ds1 = new DataSet();
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateShipperAndConsigneeInformationImport", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}
		}


		public string UpdateModifyFHL(Int32 AWBSNo, Int32 HAWBNOOfHouse, Int32 HAWBTotalPieces, decimal HAWBTotalGrossWeight, decimal HAWBTotalVolumeWeight)
		{
			DataSet ds = new DataSet();
			SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
					new SqlParameter("@HAWBNOOfHouse", HAWBNOOfHouse),
					new SqlParameter("@HAWBTotalPieces", HAWBTotalPieces),
					new SqlParameter("@HAWBTotalGrossWeight", HAWBTotalGrossWeight),
					new SqlParameter("@HAWBTotalVolumeWeight", HAWBTotalVolumeWeight),
					new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
			};
			DataSet ds1 = new DataSet();
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateModifyFHL", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}
		}



		public string SaveFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
		{
			List<ImportHAWBInformation> lstHAWBInformation = new List<ImportHAWBInformation>();
			lstHAWBInformation.Add(HAWBInformation);
			DataTable dtHAWBInformation = CollectionHelper.ConvertTo(lstHAWBInformation, "");

			List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
			lstShipperInformation.Add(ShipperInformation);
			DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


			List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
			lstConsigneeInformation.Add(ConsigneeInformation);
			DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

			List<ImportChargeDeclarations> lstChargeDeclarationsInformation = new List<ImportChargeDeclarations>();
			lstChargeDeclarationsInformation.Add(ChargeDeclarationsInformation);
			DataTable dtChargeDeclarationsInformation = CollectionHelper.ConvertTo(lstChargeDeclarationsInformation, "");

			DataTable dtOCIInformation = CollectionHelper.ConvertTo(OCIInformation, "");

			BaseBusiness baseBusiness = new BaseBusiness();

			SqlParameter paramHAWBInformation = new SqlParameter();
			paramHAWBInformation.ParameterName = "@HAWBInformation";
			paramHAWBInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramHAWBInformation.Value = dtHAWBInformation;

			SqlParameter paramShipperInformation = new SqlParameter();
			paramShipperInformation.ParameterName = "@ShipperInformation";
			paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramShipperInformation.Value = dtShipperInformation;

			SqlParameter paramConsigneeInformation = new SqlParameter();
			paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
			paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramConsigneeInformation.Value = dtConsigneeInformation;

			SqlParameter paramChargeDeclarationsInformation = new SqlParameter();
			paramChargeDeclarationsInformation.ParameterName = "@ChargeDeclarationsInformation";
			paramChargeDeclarationsInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramChargeDeclarationsInformation.Value = dtChargeDeclarationsInformation;

			SqlParameter paramOCIInformation = new SqlParameter();
			paramOCIInformation.ParameterName = "@OCIInformation";
			paramOCIInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramOCIInformation.Value = dtOCIInformation;

			DataSet ds = new DataSet();
			SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), paramHAWBInformation, paramShipperInformation, paramConsigneeInformation, paramChargeDeclarationsInformation, paramOCIInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno), new SqlParameter("@HSCodeSNo", HSCode),
             new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)};
			//SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramHAWBInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
			DataSet ds1 = new DataSet();
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveFHLinfoExport", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}
		}

		public string UpdateFHLinfoImport(Int32 AWBSNo, Int32 ArrivedShipmentSNo, Int32 HAWBSNo, ImportHAWBInformation HAWBInformation, ImportShipperInformation ShipperInformation, ImportConsigneeInformation ConsigneeInformation, ImportChargeDeclarations ChargeDeclarationsInformation, List<ImportAWBOCIModel> OCIInformation, Int32 UpdatedBy, Int32 ShipperSno, Int32 ConsigneeSno, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneeTaxParticipants, string CreateShipperTaxId, string CreateConsigneeTaxId)
		{
			List<ImportHAWBInformation> lstHAWBInformation = new List<ImportHAWBInformation>();
			lstHAWBInformation.Add(HAWBInformation);
			DataTable dtHAWBInformation = CollectionHelper.ConvertTo(lstHAWBInformation, "");

			List<ImportShipperInformation> lstShipperInformation = new List<ImportShipperInformation>();
			lstShipperInformation.Add(ShipperInformation);
			DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


			List<ImportConsigneeInformation> lstConsigneeInformation = new List<ImportConsigneeInformation>();
			lstConsigneeInformation.Add(ConsigneeInformation);
			DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

			List<ImportChargeDeclarations> lstChargeDeclarationsInformation = new List<ImportChargeDeclarations>();
			lstChargeDeclarationsInformation.Add(ChargeDeclarationsInformation);
			DataTable dtChargeDeclarationsInformation = CollectionHelper.ConvertTo(lstChargeDeclarationsInformation, "");

			DataTable dtOCIInformation = CollectionHelper.ConvertTo(OCIInformation, "");

			BaseBusiness baseBusiness = new BaseBusiness();

			SqlParameter paramHAWBInformation = new SqlParameter();
			paramHAWBInformation.ParameterName = "@HAWBInformation";
			paramHAWBInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramHAWBInformation.Value = dtHAWBInformation;

			SqlParameter paramShipperInformation = new SqlParameter();
			paramShipperInformation.ParameterName = "@ShipperInformation";
			paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramShipperInformation.Value = dtShipperInformation;

			SqlParameter paramConsigneeInformation = new SqlParameter();
			paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
			paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramConsigneeInformation.Value = dtConsigneeInformation;

			SqlParameter paramChargeDeclarationsInformation = new SqlParameter();
			paramChargeDeclarationsInformation.ParameterName = "@ChargeDeclarationsInformation";
			paramChargeDeclarationsInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramChargeDeclarationsInformation.Value = dtChargeDeclarationsInformation;

			SqlParameter paramOCIInformation = new SqlParameter();
			paramOCIInformation.ParameterName = "@OCIInformation";
			paramOCIInformation.SqlDbType = System.Data.SqlDbType.Structured;
			paramOCIInformation.Value = dtOCIInformation;

			DataSet ds = new DataSet();
			SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@HAWBSNo", HAWBSNo), paramHAWBInformation, paramShipperInformation, paramConsigneeInformation, paramChargeDeclarationsInformation, paramOCIInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno), new SqlParameter("@HSCodeSNo", HSCode)
             , new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneeTaxParticipants",CreateConsigneeTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneeTaxId",CreateConsigneeTaxId)};
			//SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramHAWBInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno) };
			DataSet ds1 = new DataSet();
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateFHLinfoExport", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}
		}

		public string DeleteFHL(Int32 HAWBSNo)
		{
			BaseBusiness baseBusiness = new BaseBusiness();
			DataSet ds = new DataSet();
			SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
			DataSet ds1 = new DataSet();
			try
			{
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "DeleteFHLExport", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}
		}

		public string BindHAWBSectionData(Int32 HAWBSNo, int AWBSNo, int ArrivedShipmentSNo, string DestCity)
		{
			SqlParameter[] Parameters = { new SqlParameter("@HAWBSNo", HAWBSNo),
										  new SqlParameter("@AWBSNo", AWBSNo),
										  new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo),
										  new SqlParameter("@DestCity", DestCity),
										  new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo)
										};
			DataSet ds = new DataSet();
			ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordBindHAWBSectionData_Export", Parameters);
			ds.Dispose();
			return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
		}















		public static void DeleteSelectedFiles()
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

		public static byte[] ReadFile(string imageLocation)
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



		public static string CompleteDStoJSONDO(DataSet ds)
		{
			StringBuilder json = new StringBuilder();
			if (ds != null && ds.Tables.Count > 0)
			{
				json.Append("{");
				bool isList = false;
				for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
				{
					if (tblCount > 0)
						json.Append(",");
					json.Append("\"Table" + tblCount.ToString() + "\":");
					int lInteger = 0;
					json.Append("[");
					isList = ds.Tables[tblCount].Columns.Contains("list");
					foreach (DataRow dr in ds.Tables[tblCount].Rows)
					{
						lInteger = lInteger + 1;
						json.Append("{");
						int i = 0;
						int colcount = dr.Table.Columns.Count;
						foreach (DataColumn dc in dr.Table.Columns)
						{
							json.Append("\"");
							json.Append((isList == true ? dc.ColumnName.ToLower() : dc.ColumnName));
							json.Append("\":\"");
							if (dc.DataType.Name.ToUpper() == "DATETIME")
							{
								//json.Append(dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString(CargoFlash.SoftwareFactory.Data.DateFormat.DateFormatString));
								json.Append(dr[dc].ToString() == "" ? "" : Convert.ToDateTime(dr[dc].ToString().Trim()).ToString("dd-MMM-yyyy hh:mm"));
							}
							else
								json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
							json.Append("\"");
							i++;
							if (i < colcount) json.Append(",");
						}

						if (lInteger < ds.Tables[tblCount].Rows.Count)
						{
							json.Append("},");
						}
						else
						{
							json.Append("}");
						}
					}
					json.Append("]");
				}
				json.Append("}");
			}
			else
			{
				json.Append("[");
				json.Append("]");
			}


			return json.ToString();
		}



		public string GatValueOfAutocomplete(int SNo)
		{
			SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
			DataSet ds = new DataSet();
			ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTariffChargeDetails", Parameters);
			ds.Dispose();
			return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
		}







		public string SaveFHLHarmonizedCommodity(List<HarmonizedCommodityCode> HarmonizedCommodityCode, string HAWBNo, Int32 AWBSNo)
		{
			try
			{
				DataTable dtHarmonizedCommodityCode = CollectionHelper.ConvertTo(HarmonizedCommodityCode, "");
				SqlParameter[] param = { new SqlParameter("@dtHarmonizedCommodityCode", dtHarmonizedCommodityCode), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@AWBSNo", AWBSNo) };
				return (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveHarmonizedCommodty", param).Tables[0].Rows[0][0];
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}

		}
		public string SaveFHLHAWBDescription(List<HawbDescription> HawbDescription, string HAWBNo, Int32 AWBSNo)
		{
			try
			{
				DataTable dtHawbDescription = CollectionHelper.ConvertTo(HawbDescription, "");
				SqlParameter[] param = { new SqlParameter("@dtHawbDescription", dtHawbDescription), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@AWBSNo", AWBSNo) };
				return (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDescription", param).Tables[0].Rows[0][0];
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}

		}
		public string updateFHLHarmonizedCommodity(string HarmonizedCommodityCode, string HAWBNo, string HawbDescription, Int32 AWBSNo)
		{
			try
			{
				SqlParameter[] param = { new SqlParameter("@dtHarmonizedCommodityCode", HarmonizedCommodityCode), new SqlParameter("@HawbDescription", HawbDescription), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@AWBSNo", AWBSNo) };
				return (string)SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "updateHarmonizedCommodty", param).Tables[0].Rows[0][0];
			}
			catch (Exception ex)// (Exception ex)
			{
				return ex.Message;
			}






		}
		//public string updateFHLHAWBDescription(string HawbDescription, string HAWBNo)
		//{


		//    try
		//    {
		//        SqlParameter[] param = { new SqlParameter("@dtHawbDescription", HawbDescription), new SqlParameter("@HAWBNo", HAWBNo) };
		//        return (string)SqlHelper.ExecuteNonQuery(DMLConnectionString.WebConfigConnectionString, "updateDescription", param).ToString();
		//    }
		//    catch(Exception ex)// (Exception ex)
		//    {
		//        return ex.Message;
		//    }

		//}


		// Changes by Sushant KUmar Nayak
		//public string ReservationBookingGetAWBPrintData(string AwbNo)
		public string FHLReservationBookingGetAWBPrintData(int? AwbNo, string ProcName, int? HAWBNo)
		// Ends
		{
			try
			{


				SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AwbNo), new SqlParameter("@HAWBNo", HAWBNo) };

				DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}

        public string GetShipperConsigneeDetails_TaxID(string UserType, string Taxid)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@Taxid", Taxid) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetShipperConsigneeDetails_HouseTaxid", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckTaxId(string TaxId, string UserType,int CountrySno)
        {
            try
            {
                SqlParameter[] Parameters = {
                                        new SqlParameter("@TaxId", TaxId),new SqlParameter("@UserType", UserType),new SqlParameter("@CountrySno", CountrySno)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "House_CheckTaxId", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}

