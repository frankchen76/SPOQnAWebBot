using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BotBiz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;
using BotBiz;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BotAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IWebBotService _webBotService;

        public TokenController(IWebBotService webBotSerivce)
        {
            _webBotService = webBotSerivce;
        }

        // GET: api/<TokenController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            
            return new string[] { "value1", "value2" };
        }

        // GET api/<TokenController>/{guid}
        [HttpGet("{botId}")]
        public async Task<ActionResult<BotTokenItem>> Get(string botId)
        {
            var upn = HttpContext.User.Identity.Name;

            var result = await _webBotService.GetToken(botId, upn);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }

    }
}
