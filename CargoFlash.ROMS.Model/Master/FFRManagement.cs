using System;
using System.Collections.Generic;
using System.Linq;

using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System.Runtime.Serialization;



namespace CargoFlash.Cargo.Model.Master
{
   public class FFRManagement
    {
     //   string str2;


    
       int CitySno;
       int AccountSno;
       int StatusSno;
       decimal GrossWeight = 0;
       int Pieces;
       decimal VolumeAmount = 0;
       string VolumeAmountCode;
       decimal chargeableWeight;
       string natureOfGoods;
       int totalPieces;
       string ErrorMessage;
       public DataTable GetDataTableFromSP_withP(string SP)
        {


            SqlConnection conn = new SqlConnection(DMLConnectionString.WebConfigConnectionString);

            //SqlConnection conn = new SqlConnection(Connection.ConnectionString);
            SqlCommand cmd = new SqlCommand(SP, conn);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            try
            {
                cmd.CommandType = CommandType.StoredProcedure;
               
                cmd.Prepare();
                da.Fill(dt);
                return dt;
            }
            catch (SqlException ex)
            {
                //clsException obj_Exception = new clsException(); obj_Exception.ExceptionEntryTo_Log_Email(ex, ""); 

                return dt;
            }
            finally
            {
                da.Dispose();
                cmd.Connection.Dispose();
                cmd.Dispose();
            }
        }

       public DataSet GetDataSetFromSP(string SP,string FFR_ID)
       {


           SqlConnection conn = new SqlConnection(DMLConnectionString.WebConfigConnectionString);

           //SqlConnection conn = new SqlConnection(Connection.ConnectionString);
           SqlCommand cmd = new SqlCommand(SP, conn);
           SqlDataAdapter da = new SqlDataAdapter(cmd);
           DataTable dt = new DataTable();
           DataSet ds = new DataSet();
           try
           {
               cmd.CommandType = CommandType.StoredProcedure;
               cmd.Parameters.Add("@sno", FFR_ID);
               cmd.Prepare();
               da.Fill(ds);
               
               return ds;
           }
           catch (SqlException ex)
           {
               //clsException obj_Exception = new clsException(); obj_Exception.ExceptionEntryTo_Log_Email(ex, ""); 

               return ds;
           }
           finally
           {
               da.Dispose();
               cmd.Connection.Dispose();
               cmd.Dispose();
           }
       }


       public int GetCity(string table,string condition)
       {
           SqlConnection conn = new SqlConnection(DMLConnectionString.WebConfigConnectionString);

           //SqlConnection conn = new SqlConnection(Connection.ConnectionString);
             SqlCommand cmd = new SqlCommand("spMessage_CheckCondition", conn);

           cmd.CommandType = CommandType.StoredProcedure;
           cmd.Parameters.AddWithValue("@table", table);
           cmd.Parameters.AddWithValue("@condition", condition);
           cmd.Parameters.Add("@count", SqlDbType.Int, 30);
           cmd.Parameters["@count"].Direction = ParameterDirection.Output;
           conn.Open();
           cmd.ExecuteNonQuery();
           conn.Close();
           return Convert.ToInt32(cmd.Parameters["@count"].Value.ToString());
       }

       public DataTable GetStock(string condition)
       {
           SqlConnection conn = new SqlConnection(DMLConnectionString.WebConfigConnectionString);

           //SqlConnection conn = new SqlConnection(Connection.ConnectionString);
           SqlCommand cmd = new SqlCommand("spMessage_CheckStock", conn);
           SqlDataAdapter da = new SqlDataAdapter(cmd);
           DataTable ds = new DataTable();
           try
           {
               cmd.CommandType = CommandType.StoredProcedure;
               cmd.Parameters.Add("@awb",condition);
               cmd.Prepare();
               da.Fill(ds);

               return ds;
           }
           catch (SqlException ex)
           {
               //clsException obj_Exception = new clsException(); obj_Exception.ExceptionEntryTo_Log_Email(ex, ""); 

               return ds;
           }
           finally
           {
               da.Dispose();
               cmd.Connection.Dispose();
               cmd.Dispose();
           }
       }


       public void SaveData(string table1, string table2,string table3,string table4, string table5)
       {
           SqlConnection conn = new SqlConnection(DMLConnectionString.WebConfigConnectionString);

           //SqlConnection conn = new SqlConnection(Connection.ConnectionString);
           SqlCommand cmd = new SqlCommand("spMessage_SaveData", conn);

           cmd.CommandType = CommandType.StoredProcedure;
           cmd.Parameters.AddWithValue("@edimessageffr", table1);
           cmd.Parameters.AddWithValue("@edimessageffr_flight", table2);
           cmd.Parameters.AddWithValue("@edimessageffr_shc", table3);
           cmd.Parameters.AddWithValue("@edimessageffr_dimensions", table4);
           cmd.Parameters.AddWithValue("@edimessageffr_uld", table5);
           cmd.Parameters.Add("@count", SqlDbType.Int, 30);
           cmd.Parameters["@count"].Direction = ParameterDirection.Output;
           conn.Open();
           cmd.ExecuteNonQuery();
           conn.Close();
        //   return Convert.ToInt32(cmd.Parameters["@count"].Value.ToString());
       }

       public DataSet GetMessageReceived()
       {
           int count;
           string awbno;
           int IsValid = 0;
           DataSet  dsresult = new DataSet();
           DataTable dt = GetDataTableFromSP_withP("spMessage_MessageReceivedLog");
           if (dt.Rows.Count > 0)
           {

               for (int i = 0; i < dt.Rows.Count; i++)
               {
                   DataSet data = GetDataSetFromSP("spMessage_MessageReceivedLog1", dt.Rows[i][0].ToString());

                   DataTable dt1 = data.Tables[0];
                   DataTable dt2 = data.Tables[1];
                   DataTable dt3 = data.Tables[2];
                   DataTable dt4 = data.Tables[3];
                   DataTable dt5 = data.Tables[4];
                   // Excel_DS.Tables.Add(data.Tables[0]);
                   //Excel_DS.Tables.Add(dt2);
                   //Excel_DS.Tables.Add(dt3);
                   //Excel_DS.Tables.Add(dt4);
                   //Excel_DS.Tables.Add(dt5);
                   awbno = dt.Rows[i]["AirlinePrefix"].ToString() + "-" + dt.Rows[i]["AWBSerialNumber"].ToString();
                   //if(dt1.Rows[i]["Airport_of_Origin"]==)

                   count = GetCity("City", dt.Rows[i]["Airport_of_Origin"].ToString());

                   if (count == 0)
                   {
                       IsValid = 1;
                       continue;

                       //return "Orign City Doest Not Exist";
                   }

                   count = GetCity("City", dt.Rows[i]["Airport_of_Destination"].ToString());
                   if (count == 0)
                   {
                       IsValid = 1;
                       continue;

                       //  return "Destination City Doest Not Exist";
                   }

                   DataTable dtStock = new DataTable();
                   dtStock = GetStock(awbno);

                   if (dtStock.Rows.Count > 0)
                   {
                       if (dtStock.Rows[0]["StockStatus"].ToString() == "2")
                       {
                           CitySno = int.Parse(dtStock.Rows[0]["CitySNo"].ToString());
                           AccountSno = int.Parse(dtStock.Rows[0]["AccountSNo"].ToString());
                           StatusSno = int.Parse(dtStock.Rows[0]["StockStatus"].ToString());
                           Pieces = int.Parse(dt.Rows[i]["TotalPieces"].ToString());
                           GrossWeight = decimal.Parse(dt.Rows[i]["Weight"].ToString());
                           natureOfGoods = dt.Rows[i]["natureOfGoods"].ToString();
                           totalPieces = int.Parse(dt.Rows[i]["TotalPieces"].ToString());
                           if (GrossWeight == 0)
                           {
                               // return "Weight should be greater than zero.";
                               continue;
                           }
                           if (Pieces == 0)
                           {
                               //   return "Pieces should be greater zero.";
                               continue;
                           }


                           VolumeAmount = decimal.Parse(dt.Rows[i]["Volume_Amount"].ToString() == "" ? "0" : dt.Rows[i]["Volume_Amount"].ToString());
                           VolumeAmountCode = dt.Rows[i]["Volume_Code"].ToString() == "" ? "" : dt.Rows[i]["Volume_Code"].ToString();


                           if (VolumeAmount > 0)
                               switch (VolumeAmountCode)
                               {
                                   case "MC":
                                       VolumeAmount = Math.Round(VolumeAmount * decimal.Parse("166"), 0);
                                       break;
                                   case "CI":
                                       VolumeAmount = Math.Round(((VolumeAmount) * decimal.Parse("35.3147")) / 12, 0);
                                       break;
                                   case "CF":
                                       VolumeAmount = Math.Round((VolumeAmount) * decimal.Parse("35.3147"), 0);
                                       break;
                                   case "CC":
                                       VolumeAmount = Math.Round(((VolumeAmount) * decimal.Parse("166")) / 1000, 0);
                                       break;
                                   default:
                                       break;
                               }
                           else
                               VolumeAmount = decimal.Parse("0.01");


                           chargeableWeight = GrossWeight > VolumeAmount ? GrossWeight : VolumeAmount;


                           SqlParameter[] Parameters = { new SqlParameter ("@ffrid",chargeableWeight)};
                            dsresult = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spMessage_SaveData", Parameters);
                           // return "k" + i;
                       }

                       else if (dtStock.Rows[0]["StockStatus"].ToString() != "3")
                       {
                           switch (dtStock.Rows[0]["StockStatus"].ToString())
                           {
                               case "4":
                                   continue;
                               //return awbno + " already handedover.";
                               case "5":
                                   continue;
                               //return awbno + " already Manifested.";
                               case "1":
                                   continue;
                               //return awbno + " Invalid AWb No.";
                           }
                           //  return "k" + i;

                       }
                   }
                   else
                   {
                       count = GetCity("Airline", dt.Rows[i]["AirlinePrefix"].ToString());

                       Pieces = int.Parse(dt.Rows[i]["TotalPieces"].ToString());
                       GrossWeight = decimal.Parse(dt.Rows[i]["Weight"].ToString());
                       natureOfGoods = dt.Rows[i]["natureOfGoods"].ToString();
                       if (count == 0)
                       {

                           //  return awbno + " is not a valid AWBNo."; ;
                           continue;
                       }
                       else
                       {
                           //isInterAirline = true;


                           if (GrossWeight == 0)
                           {
                               // return "Weight should be greater than zero.";
                               continue;
                           }
                           if (Pieces == 0)
                           {
                               // return "Pieces should be greater than zero.";
                               continue;
                           }
                           VolumeAmount = Convert.ToDecimal(dt.Rows[i]["Volume_Amount"].ToString() == "" ? "0" : dt.Rows[i]["Volume_Amount"].ToString());
                           VolumeAmountCode = dt.Rows[i]["Volume_Code"].ToString() == "" ? "MC" : dt.Rows[i]["Volume_Code"].ToString();


                           if (VolumeAmount > 0)
                               switch (VolumeAmountCode)
                               {
                                   case "MC":
                                       VolumeAmount = Math.Round(VolumeAmount * decimal.Parse("166"), 0);
                                       break;
                                   case "CI":
                                       VolumeAmount = Math.Round(((VolumeAmount) * decimal.Parse("35.3147")) / 12, 0);
                                       break;
                                   case "CF":
                                       VolumeAmount = Math.Round((VolumeAmount) * decimal.Parse("35.3147"), 0);
                                       break;
                                   case "CC":
                                       VolumeAmount = Math.Round(((VolumeAmount) * decimal.Parse("166")) / 1000, 0);
                                       break;
                                   default:
                                       break;
                               }
                           else
                               VolumeAmount = GrossWeight;


                           chargeableWeight = GrossWeight > VolumeAmount ? GrossWeight : VolumeAmount;

                           SqlParameter[] Parameters = { new SqlParameter("@edimessageffr", SqlDbType.Structured) { Value = data.Tables["Table"] },
                                                new SqlParameter("@edimessageffr_flight", SqlDbType.Structured) { Value = data.Tables["Table1"] },
                                                new SqlParameter("@edimessageffr_shc", SqlDbType.Structured) { Value = data.Tables["Table2"] },
                                                new SqlParameter("@edimessageffr_dimensions", SqlDbType.Structured) { Value = data.Tables["Table3"] },
                                                new SqlParameter("@edimessageffr_uld", SqlDbType.Structured) { Value = data.Tables["Table4"] },
                                                new SqlParameter ("@chargeableWeight",chargeableWeight)};
                            dsresult = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spMessage_SaveData", Parameters);
                           
                           //totalPieces = drAWBDetails["TOTALPIECES"].ToString() != ""
                           //                  ? int.Parse(drAWBDetails["TOTALPIECES"].ToString())
                           //                  : int.Parse("0");

                           //natureOfGoods = drAWBDetails["NATUREOFGOODS"].ToString() != ""
                           //                    ? drAWBDetails["NATUREOFGOODS"].ToString()
                           //                    : "";


                       }



                       //if (count == 0)
                       //    return "Stock Doest Not Exist";
                       //return "k";
                   }
                   dt1.Clear();
                   dt2.Clear();
                   dt3.Clear();
                   dt4.Clear();
                   dt5.Clear();
                   dtStock.Clear();
               }

               // return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
           }
           return dsresult;
       }
    }
}
