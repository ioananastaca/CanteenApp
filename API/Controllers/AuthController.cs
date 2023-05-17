using System.Net;
using API.Data;
using API.Dtos.User;
using API.Models;
using API.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        // public IRegisterService _service { get; }
        private readonly DataContext _db;
        private ApiResponse _response;
        private string secretKey;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(DataContext db, IConfiguration configuration,
        UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _response = new ApiResponse();
            secretKey = configuration.GetValue<string>("ApiSettings:Secret");
            _userManager = userManager;
            _roleManager = roleManager;

        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto model)
        {
            ApplicationUser userFromDb = _db.ApplicationUsers.FirstOrDefault
                (u => u.UserName.ToLower() == model.UserName.ToLower());

            if (userFromDb != null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages.Add("Username already exists!");
                _response.IsSuccess = false;
                return BadRequest(_response);
            }
            ApplicationUser newUser = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.UserName,
                NormalizedEmail = model.UserName.ToUpper(),
                Name = model.Name
            };
            try
            {
                var result = await _userManager.CreateAsync(newUser, model.Password);
                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
                    {
                        //create roles in db
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }
                    if (model.Role.ToLower() == SD.Role_Admin)
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);
                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                    }
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                    return Ok(_response);
                }
            }catch(Exception e){

            }
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.ErrorMessages.Add("error while registering!");
            _response.IsSuccess = false;
            return BadRequest(_response);





            // var response = await _service.Register
            // (request);
            // if (!response.Success)
            // {
            //     return BadRequest(response);
            // }
            // return Ok(response);
        }

        // [HttpPost("Login")]
        // public async Task<ActionResult<ServiceResponse<int>>> Login(UserRegisterDto request)
        // {
        //     var response = await _authRepo.Login(request.Email, request.Password);
        //     if (!response.Success)
        //     {
        //         return BadRequest(response);
        //     }
        //     return Ok(response);
        // }
    }
}