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
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Rate;
using System.Net;
using System.Web.UI;

namespace CargoFlash.Cargo.DataService.Shipment
{
	[GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
	[ServiceBehavior(IncludeExceptionDetailInFaults = true)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
	public class ShortBookingService : BaseWebUISecureObject, IShortBookingService

	{
		public Stream GetWebForm(ShortBookingGetWebForm model)
		{
			return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
		}

		private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "", string ReferenceNo = "")
		{
			LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
			this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
			StringBuilder myCurrentForm = new StringBuilder();
			switch (this.DisplayMode)
			{
				case DisplayModeNew:
					switch (processName)
					{
						case "SHORTBOOKING":

							if (appName.ToUpper().Trim() == "DIMENSION")
							{
								using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
								{
									htmlFormAdapter.DisplayMode = DisplayModeType.New;
									myCurrentForm.Append(htmlFormAdapter.TransInstantiateWithHeader(moduleName, "Dimensions", ValidateOnSubmit: true));
									myCurrentForm.Append(htmlFormAdapter.TransInstantiateWithHeader(moduleName, "ULDDimensions", ValidateOnSubmit: true));
								}
							}
							else
								using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
								{
									htmlFormAdapter.DisplayMode = DisplayModeType.New;
									myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
								}
							break;

							//using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
							//{
							//    htmlFormAdapter.DisplayMode = DisplayModeType.New;
							//    myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
							//}
							//break;
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
					//switch (processName)
					//{
					//	case "SHORTBOOKING":
					//		if (appName.ToUpper().Trim() == "BOOKING")
					//			CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, ReferenceNo, isV2: true);
					//		break;
					//	default:
					//		break;
					//}
					if (processName == "HOUSE" && appName.ToUpper().Trim() == "BOOKING")
					{

					}
					break;
				case DisplayModeReadView:

					break;
				default:
					break;
			}
			byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
			WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
			return new MemoryStream(resultMyForm);
		}


		#region Due Agent Other Charges Information
		public KeyValuePair<string, List<ShortBooking>> GetShortBookingTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
		{
			try
			{
				ShortBooking ShortBooking = new ShortBooking();
				SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
				DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordShortBooking", Parameters);
				// return resultData.Tables[0].AsEnumerable().ToList();
				var ShortBookingList = ds.Tables[0].AsEnumerable().Select(e => new ShortBooking
				{
					SNo = Convert.ToInt32(e["SNo"]),
					BookingRefNo = e["BookingRefNo"].ToString(),
					Prefix = e["Prefix"].ToString(),
					HdnPrefix = e["HdnPrefix"].ToString(),
					AWBNo = e["AWBNo"].ToString(),
					Origin = e["Origin"].ToString(),
					HdnOrigin = e["HdnOrigin"].ToString(),
					Destination = e["Destination"].ToString(),
					HdnDestination = e["HdnDestination"].ToString(),
					Agent = e["Agent"].ToString(),
					HdnAgent = e["HdnAgent"].ToString(),
					Pieces = e["Pieces"].ToString(),
					GrossWeight = e["GrossWeight"].ToString(),
					Volume = e["Volume"].ToString(),
					Product = e["Product"].ToString(),
					HdnProduct = e["HdnProduct"].ToString(),
					Commodity = e["Commodity"].ToString(),
					FlightDate = e["FlightDate"].ToString(),
					FlightNo = e["FlightNo"].ToString(),
					HdnFlightNo = e["HdnFlightNo"].ToString(),
					CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
					UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
				});
				return new KeyValuePair<string, List<ShortBooking>>(ds.Tables[1].Rows[0][0].ToString(), ShortBookingList.AsQueryable().ToList());
			}
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}

		public List<string> createUpdateShortBookingTab(string strData)
		{
			try
			{
				int ret = 0;
				List<string> ErrorMessage = new List<string>();
				BaseBusiness baseBussiness = new BaseBusiness();
				// convert JSON string ito datatable
				var dtShortBookingTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
				//dtShortBookingTab.Columns.Remove("BookingSNo");
				var dtCreateShortBookingTab = (new DataView(dtShortBookingTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
				var dtUpdateShortBookingTab = (new DataView(dtShortBookingTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
				SqlParameter param = new SqlParameter();





				param.ParameterName = "@ShortBookingTabTable";
				param.SqlDbType = System.Data.SqlDbType.Structured;
				// for create new record
				if (dtCreateShortBookingTab.Rows.Count > 0)
				{
					param.Value = dtCreateShortBookingTab;
					SqlParameter[] Parameters = {
						param ,
						new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
					};
					ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateShortBookingTab", Parameters);
				}
				//for update existing record
				if (dtUpdateShortBookingTab.Rows.Count > 0)
				{
					param.Value = dtUpdateShortBookingTab;
					SqlParameter[] Parameters = {
						param ,
						new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
					};
					ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateShortBookingTab", Parameters);
				}
				if (ret > 0)
				{
					if (ret > 1000)
					{
						string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ShortBooking");
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
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}
        #endregion



        public string CheckValidAWBNumber(int BookingType, string AWBPrefix, string AWBNumber, Int64 OriginCitySNo, Int64 AccountSNo)
         {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingType", BookingType),
                                            new SqlParameter("@AWBPrefix", AWBPrefix),
                                            new SqlParameter("@AWBNumber", AWBNumber),
                                            new SqlParameter("@OriginCitySNo", OriginCitySNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Quickbooking_CheckValidAWBNumber", Parameters);
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
