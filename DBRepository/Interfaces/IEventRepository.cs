using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace DBRepository.Interfaces
{
    public interface IEventRepository
    {
        //points
        Task<Event<GeoPoint>> GetPoints(int eventId);
        Task<List<int>> GetAllPoints(int eventId);
        Task AddPoint(GeoPoint _point);
        Task DeletePoint(int pointId);
        Task CleanEventFromGeoPoints(int eventId);

        //events
        Task<Event<GeoPoint>> GetEvent(int eventId);
        Task<List<Event<GeoPoint>>> GetEventsWhereAdminHasId(int userId);
        Task<List<Event<GeoPoint>>> GetEventsWhereMemberHasId(int userId);
        Task<List<Event<GeoPoint>>> GetEventsJoinRequestsWhereMemberHasId(int userId);
        Task<int> AddEvent(Event<GeoPoint> _event);

        //users join requests
        Task AcceptJoinRequest(EventMember eventMember);
        Task DeclineJoinRequest(EventMember eventMember);
        Task<List<User>> GetUsers(int eventId);
        Task<int> AddMember(string login, int eventId);    
    }
}
