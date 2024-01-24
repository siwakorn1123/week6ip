﻿using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IlikesRepository _likeRepository;

    public LikesController(IUserRepository userRepository, IlikesRepository likeRepository)
    {
        _userRepository = userRepository;
        _likeRepository = likeRepository;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var string_user_id = User.GetUserId();
        if (string_user_id is null) return NotFound();

        var sourceUserId = (int)string_user_id;
        // var likedUser = await _userRepository.GetUserByUserNameAsync(username);
        var likedUser = await _userRepository.GetUserByUserNameWithOutPhotoAsync(username);
        if (likedUser is null) return NotFound();

        var sourceUser = await _likeRepository.GetUser(sourceUserId);
        if (sourceUser.UserName == username) return BadRequest("can't like yourself");

        var userLike = await _likeRepository.GetUserLike(sourceUserId, likedUser.Id);
        if (userLike is not null) return BadRequest($"already like this user {likedUser.UserName}");

        userLike = new UserLike
        {
            SourceUserId = sourceUserId,
            LikedUserId = likedUser.Id
        };

        sourceUser.LikedUsers!.Add(userLike);
        if (await _userRepository.SaveAllAsync()) return Ok(); //not good, but work

        return BadRequest("Something has gone wrong!");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes(string predicate)
    {
        var string_user_id = User.GetUserId();
        if (string_user_id is null) return NotFound();

        var users = await _likeRepository.GetUserLikes(predicate, (int)string_user_id);
        return Ok(users);
    }
}
