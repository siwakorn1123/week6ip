﻿using System;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Company.ClassLibrary1;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly DataContext _dataContext;

    private readonly ITokenservice _tokenService;
    public AccountController(DataContext dataContext, ITokenservice tokenService)
    {
        _dataContext = dataContext;
        _tokenService = tokenService;
    }
    private async Task<bool> isUserExists(string username)
    {
        return await _dataContext.Users.AnyAsync(user => user.UserName == username.ToLower());
    }
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _dataContext.Users.SingleOrDefaultAsync(user =>
                            user.UserName == loginDto.Username);

        if (user is null) return Unauthorized("invalid username");

        using var hmacSHA256 = new HMACSHA256(user.PasswordSalt!);

        var computedHash = hmacSHA256.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password!.Trim()));
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash?[i]) return Unauthorized("invalid password");
        }
        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
    {
        if (await isUserExists(registerDto.Username!))
            return BadRequest("username is already exists");
        using var hmacSHA256 = new HMACSHA256();
        var user = new AppUser
        {
            UserName = registerDto.Username.Trim().ToLower(),
            PasswordHash = hmacSHA256.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password.Trim())),
            PasswordSalt = hmacSHA256.Key
        };
        _dataContext.Users.Add(user);
        await _dataContext.SaveChangesAsync();
        return user;
    }

    private Task<bool> isUserExists(object v)
    {
        throw new NotImplementedException();
    }
}