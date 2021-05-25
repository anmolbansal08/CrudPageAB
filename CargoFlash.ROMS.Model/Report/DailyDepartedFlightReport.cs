using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public  class DailyDepartedFlightReport
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FlightNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
       


    }

    public class DailyDepartedFlightReportResponse
    {
        public string SNo { get; set; } 
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FLIGHT_NO { get; set; }
        public string FLIGHT_DATE { get; set; }
        public string Flight_OD { get; set; }
        public string AWB_OD { get; set; }
        public string BOARD_POINT { get; set; }
        public string OFF_POINT { get; set; }
        public string AC_TYPE { get; set; }
        public string ULD_NO { get; set; }
        public string AWB_NO { get; set; }
        public string awb_pieces { get; set; }
        public string GRS_WT { get; set; }
        public string VOL { get; set; }
        public string no_of_ship { get; set; }
        public string ULD_Count { get; set; }
        public string Total_AWB { get; set; }

        public string Total_Awb_Pieces { get; set; }
        public string Total_Awb_Weight { get; set; }
        public string awb_weight { get; set; }
        public string DATETIME_UPDATED { get; set; }
        public string NUM_OF_PCS { get; set; }
       public string SHC { get; set; }
       public string UserID { get; set; }
       




    }
}
