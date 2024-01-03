using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

//[Authorize]
public class UsersController : BaseApiController
{
    private readonly IImageService _imageService;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IImageService imageService, IUserRepository userRepository, IMapper mapper)
    {
        _imageService = imageService;
        _userRepository = userRepository;
        _mapper = mapper;
    }
    private async Task<AppUser?> _GetUser()
    {
        var username = User.GetUsername();
        if (username is null) return null;
        return await _userRepository.GetUserByUserNameAsync(username);
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // 
        return Ok(await _userRepository.GetMembersAsync());

    }
    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto?>> GetUsers(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        return _mapper.Map<MemberDto>(user);
    }
    [HttpGet("username/{username}")]
    public async Task<ActionResult<MemberDto?>> GetUserByUserName(string username)
    {
        // var user = await _userRepository.GetUserByUserNameAsync(username);
        // return _mapper.Map<MemberDto>(user);
        return await _userRepository.GetMemberByUserNameAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUserProfile(MemberUpdateDto memberUpdateDto)
    {

        //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; //มาจาก TokenService.cs -> CreateToken
        //if (username is null) return Unauthorized();

        var appUser = await this._GetUser();
        if (appUser is null)
        {
            return NotFound();
        }
        //if (appUser is null) return NotFound();

        _mapper.Map(memberUpdateDto, appUser);
        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user profile!");
    }

    [HttpPost("add-image")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await _GetUser();
        if (user is null) return NotFound();

        var result = await _imageService.AddImageAsync(file);
        if (result.Error is not null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        if (user.Photos.Count == 0) photo.IsMain = true;

        user.Photos.Add(photo);
        if (await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDto>(photo);
        return BadRequest("Something has gone wrong!");
    }
}