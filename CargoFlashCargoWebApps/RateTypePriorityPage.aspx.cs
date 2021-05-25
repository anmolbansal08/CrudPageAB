using CargoFlash.Cargo.Model.Master;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CargoFlashCargoWebApps
{
    public partial class RateTypePriorityPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        [WebMethod]
        public RateTypePriority[] BindDatatable()
        {
          
            DataTable dt = new DataTable();
            List<RateTypePriority> details = new List<RateTypePriority>();
            using (SqlConnection con = new SqlConnection(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.RateTypePriority", con))
                {
                    con.Open();
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                    foreach (DataRow dtrow in dt.Rows)
                    {
                        RateTypePriority user = new RateTypePriority();
                        //user.SNo= Convert.ToInt32(dtrow["SNo"]);
                        user.RatePriority = dtrow["RatePriority"].ToString();
                        user.SNo = dtrow["RateTypeSno"].ToString();
                        details.Add(user);
                    }
                }

                return details.ToArray();
            }
        }
    }
}