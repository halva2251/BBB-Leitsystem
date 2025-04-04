using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace leitsystem_api.Models
{
    public class AccessPoint
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string MAC { get; set; }
        public string IPAddress { get; set; }
        public string Description { get; set; }
        public int ConnectedDevices { get; set; }
        public string Group { get; set; }
        public string Status { get; set; }
        public string Model { get; set; }
        public string SWVersion { get; set; }
        public string Channel { get; set; }
        public string Band { get; set; }
        public string Uptime { get; set; }

        // Many-to-many: an AccessPoint can be connected to multiple Rooms.
        public virtual ICollection<RoomAccesspoint> RoomAccesspoints { get; set; } = new List<RoomAccesspoint>();
    }
}

