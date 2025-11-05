using System.Data;

namespace TetroONE.Models
{
	public class Myprofile
	{
		public int LoginUserId { get; set; }
	}

	public class ChangePassword
	{
		public int LoginUserId { get; set; }
		public string OldPassword { get; set; }
		public string NewPassword { get; set; }
		public string ConfirmPassword { get; set; }
	}

	public class UpdateProfile
	{
		public string UserImageFileName { get; set; }
		public string UserImageFilePath { get; set; }
		public string ExistingImage { get; set; }
		public string ContactNumber { get; set; }

	}
	public class ManageUser
	{
		public int LoginUserId { get; set; }
		public int? UserId { get; set; }
		public string? ModuleName { get; set; }
	}


    public class InsertUser
    {
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string UserImageFileName { get; set; }
        public string UserImageFilePath { get; set; }
        public string ExistingImage { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int UserTypeId { get; set; }
        public int UserGroupId { get; set; }
        public int? ContactId { get; set; }
        public List<UserPlantMappingDetails> UserPlantMappingDetails { get; set; }
        public DataTable TVP_UserPlantMappingDetails { get; set; }
        public List<UserDepartmentMappingDetails> userDepartmentMappingDetails { get; set; }
        public DataTable TVP_UserDepartmentMappingDetails { get; set; }
    }

	public class UserPlantMappingDetails
    {
        public int? UserPlantMappingId { get; set; }
        public int? UserId { get; set; }
        public int? PlantId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UserDepartmentMappingDetails { 

        public int? UserDepartmentMappingId { get; set; }
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public bool? IsSelected { get; set; }
    }

    public class UpdateUser
    {
        public int UserId { get; set; }
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string? UserImageFileName { get; set; }
        public string? UserImageFilePath { get; set; }
        public string? ExistingImage { get; set; }
        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int UserTypeId { get; set; }
        public int UserGroupId { get; set; }
        public int? ContactId { get; set; }
        public List<UserPlantMappingDetails> UserPlantMappingDetails { get; set; }
        public DataTable TVP_UserPlantMappingDetails { get; set; }
        public List<UserDepartmentMappingDetails> userDepartmentMappingDetails { get; set; }
        public DataTable TVP_UserDepartmentMappingDetails { get; set; }
    }

	public class GetPlant { 
		public int LoginUserId { get; set; }
	}
}
