using System;

namespace Domain
{
    public class Activity : IEntity
    {
        // Entity framework knows about this specific naming convention
        // Designates it as the PK
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }
    }
}