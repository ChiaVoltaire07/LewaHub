/** Filter options aligned to the backend 3-category model */

export const filterOptions = {
  region: [
    { value: 'Centre', label: 'Centre' },
    { value: 'Littoral', label: 'Littoral' },
    { value: 'Southwest', label: 'Southwest' },
    { value: 'Northwest', label: 'Northwest' },
    { value: 'West', label: 'West' },
    { value: 'Far North', label: 'Far North' },
    { value: 'North', label: 'North' },
    { value: 'Adamawa', label: 'Adamawa' },
    { value: 'East', label: 'East' },
    { value: 'South', label: 'South' },
  ],
  /** Replaces the old separate type + level filters */
  category: [
    { value: 'PrimaryNursery', label: 'Primary / Nursery' },
    { value: 'Secondary', label: 'Secondary' },
    { value: 'University', label: 'University' },
  ],
  language: [
    { value: 'Anglophone', label: 'Anglophone' },
    { value: 'Francophone', label: 'Francophone' },
    { value: 'Bilingual', label: 'Bilingual' }
  ],
  ownership: [
    { value: 'Public', label: 'Public' },
    { value: 'Private', label: 'Private' },
    { value: 'Mission', label: 'Mission' }
  ],
  boarding: [
    { value: 'Day', label: 'Day' },
    { value: 'Boarding', label: 'Boarding' },
    { value: 'Both', label: 'Both' }
  ],
  /** Fallback options used only while /schools/filters is loading or unreachable */
  program: [
    { value: 'GCE Ordinary Level', label: 'GCE Ordinary Level' },
    { value: 'GCE Advanced Level', label: 'GCE Advanced Level' },
    { value: 'Higher National Diploma in Computer Science', label: 'HND in Computer Science' },
    { value: 'Bachelor of Science in Computer Science', label: 'BSc in Computer Science' },
    { value: 'Bachelor of Laws', label: 'Bachelor of Laws' },
    { value: 'State Registered Nurse (Diploma)', label: 'State Registered Nurse (Diploma)' }
  ],
  speciality: [
    { value: 'Accounting', label: 'Accounting' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering' },
    { value: 'Law', label: 'Law' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Nursing', label: 'Nursing' }
  ]
};

export const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' }
];
