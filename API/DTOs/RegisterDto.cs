using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        // [RegularExpression("(?=.*\\d)", ErrorMessage = "Password must include at least 1 number.")]
        // [RegularExpression("(?=.*[a-z])", ErrorMessage = "Password must include at least 1 lower case character.")]
        // [RegularExpression("(?=.*[A-Z])", ErrorMessage = "Password must include at least 1 upper case character.")]
        // [RegularExpression("(?=.*[!@#$%^&*])", ErrorMessage = "Password must include at least 1 special character.")]
        //[MinLength(8, ErrorMessage = "Password must be a minimum of 8 characters.")]
        //[RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$", ErrorMessage = "Password stinks like farts!!!")]
        public string Password { get; set; }

        [Required]
        public string Username { get; set; }
    }
}