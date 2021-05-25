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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Security.Cryptography;
using System.IO;
using CargoFlash.Cargo.DataService.Common;
namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class ChangePasswordService : SignatureAuthenticate, IChangePasswordService
    {
        CommonService c = new CommonService();
        public int SaveChangePassword(int SNo, string OldPassword, string NewPassword)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo",SNo),
                                            new SqlParameter("@OldPassword",c.GenerateSHA512String(OldPassword)),
                                            new SqlParameter("@NewPassword", c.GenerateSHA512String(NewPassword))};
                
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "ChangePassword", Parameters);
                return ret;
        }

        public int UpdateChangePassword(string UserEmail, string OldPassword, string NewPassword)
                {
                    SqlParameter[] Parameters = { new SqlParameter("@UserEmail",UserEmail),
                                                    new SqlParameter("@OldPassword", c.GenerateSHA512String(OldPassword)),
                                                    new SqlParameter("@NewPassword", c.GenerateSHA512String(NewPassword))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUpdateChangePassword", Parameters);
                        return ret;
        }

        public string ResetPassword(string GUID, string NewPassword)
        {
            SqlParameter[] Parameters = { new SqlParameter("@GUID",GUID){Size=250},
                                            new SqlParameter("@NewPassword",c.GenerateSHA512String(NewPassword))
                                        };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveResetPassword", Parameters);

            CargoFlash.Cargo.DataService.Common.CommonService CS = new CargoFlash.Cargo.DataService.Common.CommonService();          

            string result = "{\"Status\":"+ret+",\"Url\":\""+ CS.GetSystemSetting("LoginPage") + "\"}";                    

            return result;
        }

        public int ForgetPassword(string UserName, string EmailID, string Path)
        {
            SqlParameter[] Parameters = { new SqlParameter("@GUID",UserName),
                                            new SqlParameter("@NewPassword",EmailID),
                                        new SqlParameter("@Path",System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/").ToString())};
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "ForgetPassword", Parameters);
            return ret;
        }

        public string ResetUserPassword(string SNo, string UserSNo, string Path)
        {
            String guid = Guid.NewGuid().ToString();
            string NewPwd = guid.ToString().Substring(0, 8);//"cargo";
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo), new SqlParameter("@UserSNo", UserSNo), new SqlParameter("@NewPwd", NewPwd), new SqlParameter("@EnycPwd", c.GenerateSHA512String(NewPwd)), new SqlParameter("@Path", System.Web.HttpContext.Current.Request.Url.AbsoluteUri.Replace(System.Web.HttpContext.Current.Request.Url.PathAndQuery, "/").ToString()) };
            string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "ResetPassword", Parameters);
            return ret;
        }
        
        //public static string Decrypt(string encryptedText)
        //{
        //    byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
        //    byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
        //    var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

        //    var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
        //    var memoryStream = new MemoryStream(cipherTextBytes);
        //    var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
        //    byte[] plainTextBytes = new byte[cipherTextBytes.Length];

        //    int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
        //    memoryStream.Close();
        //    cryptoStream.Close();
        //    return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        //}


        //public static string Encrypt(string plainText)
        //{
        //    byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

        //    byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
        //    var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
        //    var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

        //    byte[] cipherTextBytes;

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
        //        {
        //            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
        //            cryptoStream.FlushFinalBlock();
        //            cipherTextBytes = memoryStream.ToArray();
        //            cryptoStream.Close();
        //        }
        //        memoryStream.Close();
        //    }
        //    return Convert.ToBase64String(cipherTextBytes);
        //}
    }
}
