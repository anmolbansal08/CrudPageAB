using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.Model.Rate;

namespace CargoFlash.Cargo.DataService.Shipment
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IShortBookingService" in both code and config file together.
	[ServiceContract]
	public interface IShortBookingService
	{
		[OperationContract]
		[WebInvoke(UriTemplate = "/GetWebForm", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		Stream GetWebForm(ShortBookingGetWebForm model);


		[OperationContract]
		[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		KeyValuePair<string, List<ShortBooking>> GetShortBookingTabRecord(string recid, int pageNo, int pageSize, AWBSNoRequest model, string sort);

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "/createUpdateShortBookingTab", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		List<string> createUpdateShortBookingTab(string strData);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckValidAWBNumber(int BookingType, string AWBPrefix, string AWBNumber, Int64 OriginCitySNo, Int64 AccountSNo);


    }
}
