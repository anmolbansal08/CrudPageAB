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
using System.Collections;
using CargoFlash.Cargo.Model;

using System.Web;
using CargoFlash.Cargo.DataService;
using System.IO;
using System.Net;


namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PermissionService : SignatureAuthenticate, IPermissionService
    {
        //By Akash Update Session
        public UserLogin UpdateSession(string AirportSNo, string AirportCode, string UserSNo)
        {
            CargoFlash.Cargo.Model.UserLogin userLogin = (CargoFlash.Cargo.Model.UserLogin)HttpContext.Current.Session["UserDetail"];
            if (HttpContext.Current.Session["UserDetail"] != null)
            {


                if (AirportSNo != "" && AirportCode != null)
                {
                    System.Data.DataSet ds = new System.Data.DataSet();
                    CargoFlash.Cargo.DataService.LoginService l = new CargoFlash.Cargo.DataService.LoginService();
                    ds = l.GetCitySNo(Convert.ToInt32(AirportSNo), Convert.ToInt32(UserSNo));
                    userLogin.AirportSNo = Convert.ToInt32(AirportSNo);
                    userLogin.AirportCode = AirportCode.Substring(0, 3);
                    userLogin.AirportName = ds.Tables[0].Rows[0]["AirportName"].ToString();
                    userLogin.CitySNo = Convert.ToInt32(ds.Tables[0].Rows[0]["CitySNo"]);
                    userLogin.CityCode = ds.Tables[0].Rows[0]["CityCode"].ToString();
                    userLogin.CityName = ds.Tables[0].Rows[0]["CityName"].ToString();
                    userLogin.TerminalSNo = ds.Tables[0].Rows[0]["TerminalSNo"].ToString() == "" ? 0 : Convert.ToInt32(ds.Tables[0].Rows[0]["TerminalSNo"].ToString());
                    userLogin.AirlineCarrierCode = Convert.ToString(ds.Tables[0].Rows[0]["AirlineCarrierCode"]);

                    try
                    {
                        int result = l.UpdateUserInfoOnAirportChanges(Convert.ToInt32(HttpContext.Current.Request.QueryString["UserSNo"]), userLogin.TerminalSNo, userLogin.CitySNo, userLogin.AirportSNo);
                    }
                    catch (Exception ex)// (Exception Ex)
                    {

                    }
                }
            }
            else
            {
                CargoFlash.Cargo.DataService.Common.CommonService CS = new CargoFlash.Cargo.DataService.Common.CommonService();
                string LoginPage = CS.GetSystemSetting("LoginPage");
                System.Web.HttpContext.Current.Response.Redirect("~/Account/" + LoginPage);

            }
            return userLogin;
        }


        //public void UpdateRateDownload(string FilePath,int UserSNo) 
        //{
        //    //CargoFlash.Cargo.DataService.LoginService l = new CargoFlash.Cargo.DataService.LoginService();

        //    //l.updateRateDownload(FilePath, UserSNo);
        //    SqlParameter param = new SqlParameter();
        //    var stream = new MemoryStream();
        //    if (FilePath != null || FilePath != string.Empty)
        //    {

        //        //FilePath=FilePath.Replace(@"\\",@"\");
        //        //FilePath =FilePath;
        //        if ((System.IO.File.Exists(FilePath)))
        //        {
        //            using (var file = File.OpenRead(FilePath))
        //            {
        //                // write something to the stream:
        //                file.CopyTo(stream);
        //                // here, the MemoryStream is positioned at its end
        //            }
        //            // This is the crucial part:
        //            //stream.Position = 0L;
        //            //System.IO.File.Delete(FilePath);
        //        }

        //    }

        //    byte[] bytesInStream = stream.ToArray();
        //    HttpResponse response = HttpContext.Current.Response;
        //    try
        //    {
        //        string date = DateTime.Now.ToString();
        //        response.Clear();
        //        //response.ClearContent();
        //        response.ContentType = "application/octet-stream";
        //        response.ClearHeaders();
        //        response.Buffer = true;
        //        response.BufferOutput = true;
        //        response.AddHeader("Content-Disposition", "attachment;filename=Rate_" + date + ".xls");
        //        response.BinaryWrite(bytesInStream);
        //        response.Flush();
        //        // HttpContext.Current.Response.Flush(); // Sends all currently buffered output to the client.
        //        response.SuppressContent = true;  // Gets or sets a value indicating whether to send HTTP content to the client.
        //        HttpContext.Current.ApplicationInstance.CompleteRequest();
        //        //response.End();
        //        stream.Close();
        //        //System.Web.HttpContext.Current.Response.Clear();
        //        //System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=Rate_"+ date + ".xls");
        //        //System.Web.HttpContext.Current.Response.BinaryWrite(bytesInStream);
        //        //System.Web.HttpContext.Current.Response.Flush();
        //        System.IO.File.Delete(FilePath);

        //        //HttpContext.Current.Response.Clear();
        //        //HttpContext.Current.Response.Buffer = true;
        //        //HttpContext.Current.Response.Charset = "";
        //        //HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //        //HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=name_you_file.xls");
        //        ////using (MemoryStream MyMemoryStream = new MemoryStream())
        //        ////{
        //        //    //wb.SaveAs(MyMemoryStream);
        //        //    stream.WriteTo(Response.OutputStream);
        //        //    HttpContext.Current.Response.Flush();
        //        //   HttpContext.Current.Response.End();
        //        ////}
        //        //----------------------------------------Other Code--------------------------------------------------------------\
        //        //HttpResponse Response = HttpContext.Current.Response;
        //        //FileInfo file = new FileInfo(FilePath);
        //        //if (file.Exists)
        //        //{
        //        //    Response.Clear();
        //        //    Response.ClearHeaders();
        //        //    Response.ClearContent();
        //        //    Response.AddHeader("content-disposition", "attachment; filename=" + Path.GetFileName(FilePath));
        //        //    Response.AddHeader("Content-Type", "application/Excel");
        //        //    Response.ContentType = "application/vnd.xls";
        //        //    Response.AddHeader("Content-Length", file.Length.ToString());
        //        //    Response.OutputStream
        //        //    Response.WriteFile(file.FullName);
        //        //    Response.End();
        //        //}
        //        //else
        //        //{
        //        //    Response.Write("This file does not exist.");
        //        //}
        //        //---------------------------------------------------------------------------------------------------------------

        //        SqlParameter[] Parameters = {
        //                                    new SqlParameter("@FilePath",  FilePath), new SqlParameter("@UserSNo",  UserSNo),
        //   };
        //        int result = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRateDownloadData", Parameters);
        //    }
        //    catch (Exception ex)
        //    {
        //        CargoFlash.Cargo.Business.Common.insertAppException(ex);
        //        //ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        //applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    finally
        //    {
        //        response.End();
        //    }



        //}

        public void UpdateRateDownload(string FilePath, int UserSNo)
        {


            if (!string.IsNullOrEmpty(FilePath))
            {
                try
                {
                    //if (WebOperationContext.Current != null)
                    //{
                    //    string date = DateTime.Now.ToString();
                    //    WebOperationContext.Current.OutgoingResponse.Headers["Content-Disposition"] =
                    //"attachment; filename=Rate'" + date + "'.xls";

                    //    WebOperationContext.Current.OutgoingResponse.ContentType = "application/octet-stream";
                    //}

                    //var ms = new MemoryStream();

                    //FileStream files = File.OpenRead(FilePath);

                    //files.CopyTo(ms);
                    //files.Close();
                    //System.IO.File.Delete(FilePath);

                    SqlParameter[] Parameters = { new SqlParameter("@FilePath", FilePath), new SqlParameter("@UserSNo", UserSNo) };
                    int result = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRateDownloadData", Parameters);
                    //HttpContext.Current.StatusCode = 302;
                    //HttpContext.Current.Response.Redirect("/BLOBUploadAndDownload/DownloadFromBlob?filenameOrUrl=" + FilePath,false);
                    WebOperationContext.Current.OutgoingResponse.StatusCode = System.Net.HttpStatusCode.Redirect;
                    WebOperationContext.Current.OutgoingResponse.Headers.Add("Location", "/BLOBUploadAndDownload/DownloadFromBlob?filenameOrUrl=" + FilePath);

                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                HttpContext.Current.Response.Write("Path is not valid");
                //  return null;
            }

            //try
            //{
            //SqlParameter param = new SqlParameter();

            //if (!string.IsNullOrEmpty(FilePath) && File.Exists(FilePath))
            //{


            //    string date = DateTime.Now.ToString();
            //    HttpContext.Current.Response.Clear();
            //    HttpContext.Current.Response.Buffer = true;
            //    HttpContext.Current.Response.Charset = "";
            //    HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //    HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=Rate'" + date + "'.xlsx");
            //    using (MemoryStream MyMemoryStream = new MemoryStream())
            //    {
            //        using (var file = File.OpenRead(FilePath))
            //        {
            //            // write something to the stream:
            //            file.CopyTo(MyMemoryStream);
            //        }

            //        MyMemoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
            //        HttpContext.Current.Response.Flush();

            //        //HttpContext.Current.Response.End();
            //        HttpContext.Current.Response.BufferOutput = true;
            //        // System.IO.File.Delete(FilePath);
            //    }

            //}



            //      SqlParameter[] Parameters = {
            //                                 new SqlParameter("@FilePath",  FilePath), new SqlParameter("@UserSNo",  UserSNo),
            //};
            //      int result = SqlHelper.ExecuteNonQuery(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateRateDownloadData", Parameters);
            //  }
            //  catch (Exception ex)
            //  {
            //      throw ex;
            //  }
            //  finally
            //  {
            //      HttpContext.Current.Response.End();
            //  }



        }
        public void GetData(int UserSNo, int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.PagesPermissionCollection> PageAccessibilityList)
        {
            //For Module Permission
            PagesPermission pagesPermission;
            List<PagesPermission> pagesPermissionCollection = new List<PagesPermission>();

            foreach (CargoFlash.Cargo.Model.Permissions.PagesPermissionCollection pageAccessibilityList in PageAccessibilityList)
            {
                if (pageAccessibilityList.IsFound)
                {
                    pagesPermission = new PagesPermission();
                    pagesPermission.SNo = pageAccessibilityList.SNo;
                    pagesPermission.IsActive = pageAccessibilityList.IsActive;

                    pagesPermissionCollection.Add(pagesPermission);

                    pagesPermission = null;
                }
            }

            if (pagesPermissionCollection.Count > 0)
            {
                PagesService pagesService = new PagesService();
                pagesService.UpdatePagesRightsCollection(GroupSNo, UserSNo, pagesPermissionCollection);
            }

            //For Pages Permission

            ChildPagesPermissionCollection childPagesPermission;
            List<ChildPagesPermission> childPagesPermission2 = new List<ChildPagesPermission>();
            List<ChildPagesPermissionCollection> childPagesPermissionTrueCollection = new List<ChildPagesPermissionCollection>();
            List<ChildPagesPermissionCollection> childPagesPermissionFalseCollection = new List<ChildPagesPermissionCollection>();

            ChildPagesUserPermissionCollection childPagesUserPermission;
            List<ChildPagesUserPermissionCollection> childPagesUserPermissionTrueCollection = new List<ChildPagesUserPermissionCollection>();
            List<ChildPagesUserPermissionCollection> childPagesUserPermissionFalseCollection = new List<ChildPagesUserPermissionCollection>();

            if (GroupSNo != 0)
            {
                foreach (CargoFlash.Cargo.Model.Permissions.PagesPermissionCollection pageAccessibilityList in PageAccessibilityList)
                {
                    childPagesPermission2 = pageAccessibilityList.ChildPage;

                    foreach (ChildPagesPermission cp in childPagesPermission2)
                    {
                        if (cp.IsCreate)
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsCreateSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionTrueCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }
                        else
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsCreateSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionFalseCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }

                        if (cp.IsEdit)
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsEditSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionTrueCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }
                        else
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsEditSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionFalseCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }

                        if (cp.IsDelete)
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsDeleteSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionTrueCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }
                        else
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsDeleteSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionFalseCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }

                        if (cp.IsRead)
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsReadSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionTrueCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }
                        else
                        {
                            childPagesPermission = new ChildPagesPermissionCollection();
                            childPagesPermission.GroupSNo = GroupSNo;
                            childPagesPermission.PageRightsSNo = cp.IsReadSNo;
                            childPagesPermission.SNo = 0;
                            childPagesPermission.CreatedBy = 1;
                            childPagesPermissionFalseCollection.Add(childPagesPermission);
                            childPagesPermission = null;
                        }
                    }
                }

                if ((childPagesPermissionTrueCollection.Count > 0) || (childPagesPermissionFalseCollection.Count > 0))
                {
                    GroupPageRightTransService groupPageRightTransServices = new GroupPageRightTransService();
                    groupPageRightTransServices.UpdateGroupPageRightTrans(childPagesPermissionTrueCollection, childPagesPermissionFalseCollection);
                }
            }
            else
            {
                foreach (CargoFlash.Cargo.Model.Permissions.PagesPermissionCollection pageAccessibilityList in PageAccessibilityList)
                {
                    childPagesPermission2 = pageAccessibilityList.ChildPage;

                    foreach (ChildPagesPermission cp in childPagesPermission2)
                    {
                        if (cp.IsCreate)
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsCreateSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionTrueCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }
                        else
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsCreateSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionFalseCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }

                        if (cp.IsEdit)
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsEditSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionTrueCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }
                        else
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsEditSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionFalseCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }

                        if (cp.IsDelete)
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsDeleteSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionTrueCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }
                        else
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsDeleteSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionFalseCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }

                        if (cp.IsRead)
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsReadSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionTrueCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }
                        else
                        {
                            childPagesUserPermission = new ChildPagesUserPermissionCollection();
                            childPagesUserPermission.UserSNo = UserSNo;
                            childPagesUserPermission.PageRightsSNo = cp.IsReadSNo;
                            childPagesUserPermission.SNo = 0;
                            childPagesUserPermission.CreatedBy = 1;
                            childPagesUserPermissionFalseCollection.Add(childPagesUserPermission);
                            childPagesUserPermission = null;
                        }
                    }
                }

                if ((childPagesUserPermissionTrueCollection.Count > 0) || (childPagesUserPermissionFalseCollection.Count > 0))
                {
                    UserPageRightTransService userPageRightTransService = new UserPageRightTransService();
                    userPageRightTransService.UpdateUserPageRightTrans(childPagesUserPermissionTrueCollection, childPagesUserPermissionFalseCollection);
                }
            }
        }

        public void DeletePermission(int PageSNo, List<CargoFlash.Cargo.Model.Permissions.DeletePermission> PageAccessibilityList)
        {
            DeletePermissionGroupCollection deletePermissionGroup;
            DeletePermissionUserCollection deletePermissionUser;

            List<DeletePermissionGroupCollection> deletePermissionGroupCollection = new List<DeletePermissionGroupCollection>();
            List<DeletePermissionUserCollection> deletePermissionUserCollection = new List<DeletePermissionUserCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.DeletePermission dPermission in PageAccessibilityList)
            {
                if (dPermission.GroupSNo > 0)
                {
                    deletePermissionGroup = new DeletePermissionGroupCollection();
                    deletePermissionGroup.GroupSNo = dPermission.GroupSNo;
                    deletePermissionGroup.PageSNo = PageSNo;

                    deletePermissionGroupCollection.Add(deletePermissionGroup);
                    deletePermissionGroup = null;
                }
                else
                {
                    deletePermissionUser = new DeletePermissionUserCollection();
                    deletePermissionUser.UserSNo = dPermission.UserSNo;
                    deletePermissionUser.PageSNo = PageSNo;

                    deletePermissionUserCollection.Add(deletePermissionUser);
                    deletePermissionUser = null;
                }
            }

            if ((deletePermissionGroupCollection.Count > 0) || (deletePermissionUserCollection.Count > 0))
            {
                UsersService usersService = new UsersService();
                usersService.DeletePermission(PageSNo, deletePermissionGroupCollection, deletePermissionUserCollection);
            }
        }

        public void AddUserPermission(int PageSNo, List<CargoFlash.Cargo.Model.Permissions.DeletePermission> PageAccessibilityList)
        {
            DeletePermissionUserCollection deletePermissionUser;
            List<DeletePermissionUserCollection> deletePermissionUserCollection = new List<DeletePermissionUserCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.DeletePermission dPermission in PageAccessibilityList)
            {
                deletePermissionUser = new DeletePermissionUserCollection();
                deletePermissionUser.UserSNo = dPermission.UserSNo;
                deletePermissionUser.PageSNo = PageSNo;

                deletePermissionUserCollection.Add(deletePermissionUser);
                deletePermissionUser = null;
            }

            UsersService usersService = new UsersService();
            usersService.AddUserPermission(PageSNo, deletePermissionUserCollection);
        }

        public void AddGroupUser(int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.GroupUsers> PageAccessibilityList)
        {
            GroupUsersCollection groupUsersCollection;
            List<GroupUsersCollection> GroupUsersCollections = new List<GroupUsersCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.GroupUsers groupUsers in PageAccessibilityList)
            {
                groupUsersCollection = new GroupUsersCollection();
                groupUsersCollection.UserSNo = groupUsers.UserSNo;
                groupUsersCollection.GroupSNo = GroupSNo;

                GroupUsersCollections.Add(groupUsersCollection);
                groupUsersCollection = null;
            }

            UserGroupService userGroupService = new UserGroupService();
            userGroupService.SaveUserGroup(GroupUsersCollections);
        }
        public string GetVersionNo()
        {

            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetVersionNo", null);
            return ds.Tables[0].Rows[0]["VersionNo"].ToString();

        }
        public void DeleteGroupUser(int GroupSNo, List<CargoFlash.Cargo.Model.Permissions.GroupUsers> PageAccessibilityList)
        {
            GroupUsersCollection groupUsersCollection;
            List<GroupUsersCollection> GroupUsersCollections = new List<GroupUsersCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.GroupUsers groupUsers in PageAccessibilityList)
            {
                groupUsersCollection = new GroupUsersCollection();
                groupUsersCollection.UserSNo = groupUsers.UserSNo;
                groupUsersCollection.GroupSNo = GroupSNo;

                GroupUsersCollections.Add(groupUsersCollection);
                groupUsersCollection = null;
            }

            UserGroupService userGroupService = new UserGroupService();
            userGroupService.DeleteUserGroup(GroupUsersCollections);
        }

        public void AddUserGroup(int UserSNo, List<CargoFlash.Cargo.Model.Permissions.UserGroups> PageAccessibilityList)
        {
            GroupUsersCollection groupUsersCollection;
            List<GroupUsersCollection> GroupUsersCollections = new List<GroupUsersCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.UserGroups userGroups in PageAccessibilityList)
            {
                groupUsersCollection = new GroupUsersCollection();
                groupUsersCollection.UserSNo = UserSNo;
                groupUsersCollection.GroupSNo = userGroups.GroupSNo;

                GroupUsersCollections.Add(groupUsersCollection);
                groupUsersCollection = null;
            }

            UserGroupService userGroupService = new UserGroupService();
            userGroupService.SaveUserGroup(GroupUsersCollections);
        }

        public void DeleteUserGroup(int UserSNo, List<CargoFlash.Cargo.Model.Permissions.UserGroups> PageAccessibilityList)
        {
            GroupUsersCollection groupUsersCollection;
            List<GroupUsersCollection> GroupUsersCollections = new List<GroupUsersCollection>();

            foreach (CargoFlash.Cargo.Model.Permissions.UserGroups userGroups in PageAccessibilityList)
            {
                groupUsersCollection = new GroupUsersCollection();
                groupUsersCollection.UserSNo = UserSNo;
                groupUsersCollection.GroupSNo = userGroups.GroupSNo;

                GroupUsersCollections.Add(groupUsersCollection);
                groupUsersCollection = null;
            }

            UserGroupService userGroupService = new UserGroupService();
            userGroupService.DeleteUserGroup(GroupUsersCollections);
        }
    }
}
