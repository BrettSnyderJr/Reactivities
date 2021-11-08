using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        // If null then assign default mediatr request service
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();  
    }
}