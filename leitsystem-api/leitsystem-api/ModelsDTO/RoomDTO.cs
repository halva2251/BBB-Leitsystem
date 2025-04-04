namespace leitsystem_api.ModelsDTO
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int FloorId { get; set; }
        public string FloorName { get; set; }
        public int Capacity { get; set; }
        public string Type { get; set; }
        public bool IsActive { get; set; }
    }
}
