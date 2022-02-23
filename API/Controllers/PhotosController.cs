using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command) {

            var result = await Mediator.Send(command);

            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) {

            var result = await Mediator.Send(new Delete.Command { Id = id });

            return HandleResult(result);
        }

        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMain(string id) {

            var result = await Mediator.Send(new SetMain.Command{Id = id});

            return HandleResult(result);
        }
    }
}