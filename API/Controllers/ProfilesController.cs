using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username) {

            var result = await Mediator.Send(new Details.Query{Username = username});

            return HandleResult(result);
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate) {

            var result = await Mediator.Send(new ListActivities.Query{Username = username, Predicate = predicate});

            return HandleResult(result);
        }

        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command) {

            var result = await Mediator.Send(command);

            return HandleResult(result);
        }
    }
}