namespace API.DTOs
{
    public class PasswordValidator : AbstractValidator<RegisterDto>
    {
        public PasswordValidator()
        {
            RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8).WithMessage("Password must be a minimum of 8 characters.")
            .Matches(@"\d").WithMessage("Password must include at least 1 number.")
            .Matches(@"[a-z]").WithMessage("Password must include at least 1 lower case character.")
            .Matches(@"[A-Z]").WithMessage("Password must include at least 1 upper case character.")
            .Matches(@"[!@#$%^&*]").WithMessage("Password must include at least 1 special character.");
        }
    }
}