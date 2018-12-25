using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBRepository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace SharEventTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController
    {
        IEventRepository eventRepository;

        public EventController(IEventRepository eventRepository)
        {
            this.eventRepository = eventRepository;
        }

        [Route("page")]
        [HttpGet]
        public async Task<Event<GeoPoint>> GetAllPoints(int eventId)
        {
            return await eventRepository.GetPoints(eventId);
        }

        [Route("eventById")]
        [HttpGet]
        public async Task<Event<GeoPoint>> GetEventById(int eventId)
        {
            return await eventRepository.GetEvent(eventId);
        }

        [Route("usersByEventId")]
        [HttpGet]
        public async Task<List<User>> GetUsersByEventId(int eventId)
        {
            return await eventRepository.GetUsers(eventId);
        }

        [Route("eventsByCreator")]
        [HttpGet]
        public async Task<List<Event<GeoPoint>>> GetEventsListByCreatorId(int userId)
        {
            return await eventRepository.GetEventsWhereAdminHasId(userId);
        }

        [Route("eventsByMember")]
        [HttpGet]
        public async Task<List<Event<GeoPoint>>> GetEventsListByMemberId(int userId)
        {
            return await eventRepository.GetEventsWhereMemberHasId(userId);
        }

        [Route("eventsJoinRequests")]
        [HttpGet]
        public async Task<List<Event<GeoPoint>>> GetEventsLoinRequestsListByMemberId(int userId)
        {
            return await eventRepository.GetEventsJoinRequestsWhereMemberHasId(userId);
        }

        [Route("acceptRequest")]
        [HttpPost]
        public async Task AcceptJoinRequest([FromBody] EventMember eventMember)
        {
            await eventRepository.AcceptJoinRequest(eventMember);
        }

        [Route("declineRequest")]
        [HttpPost]
        public async Task DeclineJoinRequest([FromBody] EventMember eventMember)
        {
            await eventRepository.DeclineJoinRequest(eventMember);
        }

        //[Authorize]
        [Route("new")]
        [HttpPost]
        public Task<int> AddEvent([FromBody]Event<GeoPoint> _event)
        {
            return eventRepository.AddEvent(_event);
        }

        [Route("addpoints")]
        [HttpPost]
        public async Task AddPoints([FromBody]GeoPoint _points)
        {

            await eventRepository.CleanEventFromGeoPoints(_points.EventId);
            for (int i = 0; i < _points.PointLatitiudeList.Count(); i++)
               await eventRepository.AddPoint(new GeoPoint { EventId = _points.EventId, PointLatitiude = _points.PointLatitiudeList[i], PointLongitude = _points.PointLongitudeList[i] });

        }
        
    }
}