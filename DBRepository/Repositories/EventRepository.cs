using DBRepository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBRepository.Repositories
{
    public class EventRepository : BaseRepository, IEventRepository
    {

        public EventRepository(string connectionString, IEventContextFactory contextFactory) : base(connectionString, contextFactory)
        {

        }

        public async Task<Event<GeoPoint>> GetPoints(int eventId)
        {
            var result = new Event<GeoPoint>() { EventId = eventId };
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var query = context.GeoPoints.AsQueryable();
                query = query.Where(p => p.EventId == eventId);

                result.Points = await query.ToListAsync();

            }
            return result;
        }

        public async Task<Event<GeoPoint>> GetEvent(int eventId)
        {
            var result = new Event<GeoPoint>();
            var eventPoints =  GetPoints(eventId).Result;
            var list = new List<Event<GeoPoint>>();
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var events = context.Events.AsQueryable();
                events = events.Where(ev => ev.EventId == eventId);
                

                list = await events.ToListAsync();
                result = list.ElementAt(0); //я без понятия как взять один event не из листа
                result.Points = eventPoints.Points;
            }
            return result;
        }

        public async Task<List<User>> GetUsers(int eventId)
        {
            var result = new List<User>();
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                // HERE
                var tmp = (from em in context.EventMembers
                           join u in context.Users
                           on em.UserId equals u.UserId
                           where em.EventId == eventId
                           select u);

                result = await tmp.ToListAsync();

                foreach (var user in result)
                {
                    var status = (from em in context.EventMembers
                                  where em.UserId == user.UserId
                                  select em.Status).ToList()[0];
                    user.Password = status.ToString();
                }
            }
            return result;
        }

        public async Task<List<int>> GetAllPoints(int eventId)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var temp = from p in context.GeoPoints select p;
                return await context.GeoPoints.Select(e => e.EventId).ToListAsync();

            }

        }

        public async Task<List<Event<GeoPoint>>> GetEventsWhereAdminHasId(int userId)
        {
            var result = new List<Event<GeoPoint>>();
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var events = context.Events.AsQueryable();
                events = events.Where(ev => ev.AdminId == userId);

                result = await events.ToListAsync();
            }
            return result;
        }

        public async Task<List<Event<GeoPoint>>> GetEventsWhereMemberHasId(int userId)
        {
            var result = new List<Event<GeoPoint>>();
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                // HERE
                var tmp = (from em in context.EventMembers
                           join e in context.Events
                           on em.EventId equals e.EventId
                           where em.UserId == userId && em.Status == true
                           select e);

                result = await tmp.ToListAsync();
            }
            return result;
        }

        public async Task<List<Event<GeoPoint>>> GetEventsJoinRequestsWhereMemberHasId(int userId)
        {
            var result = new List<Event<GeoPoint>>();
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var tmp = (from em in context.EventMembers
                           join e in context.Events
                           on em.EventId equals e.EventId
                           where em.UserId == userId && em.Status == false
                           select e);

                result = await tmp.ToListAsync();
            }
            return result;
        }

        public async Task AcceptJoinRequest(EventMember eventMember)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var row = context.EventMembers.Where(e => e.EventId == eventMember.EventId && e.UserId == eventMember.UserId).Single();
                row.Status = true;
                context.EventMembers.Update(row);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeclineJoinRequest(EventMember eventMember)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var row = context.EventMembers.Where(e => e.EventId == eventMember.EventId && e.UserId == eventMember.UserId).Single();

                context.EventMembers.Remove(row);
                await context.SaveChangesAsync();

            }
        }


        public async Task AddPoint(GeoPoint _point)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                context.GeoPoints.Add(_point);
                await context.SaveChangesAsync();

            }
        }




        public async Task DeletePoint(int pointId)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var point = new GeoPoint() { PointId = pointId };
                context.GeoPoints.Remove(point);
                await context.SaveChangesAsync();

            }
        }

        public async Task<int> AddEvent(Event<GeoPoint> _event)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                context.Events.Add(_event);
                await context.SaveChangesAsync();
                return _event.EventId;
            }
        }

        public async Task CleanEventFromGeoPoints(int eventId)
        {
            using (var context = ContextFactory.CreateDbContext(ConnectionString))
            {
                var result = context.GeoPoints.Where(b => b.EventId == eventId);
                
                context.GeoPoints.RemoveRange(result);
                await context.SaveChangesAsync();
            }

        }
    }
}
