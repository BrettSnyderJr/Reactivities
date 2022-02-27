using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        // Commands do not return data
        public class Command : IRequest<Result<Unit>> { 
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> { 
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                // Attempt to fetch logged in user
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) { 
                    return Result<Unit>.Failure("Could not get profile");
                }

                user.Bio = request.Bio ?? user.Bio;
                user.DisplayName = request.DisplayName ?? user.DisplayName;

                // Mark entity as modified regardless of if there were any changes
                // Allows a 200 to be returned
                _context.Entry(user).State = EntityState.Modified;

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);
                
                return Result<Unit>.Failure("Problem updating profile");
            }
        }
    }
}