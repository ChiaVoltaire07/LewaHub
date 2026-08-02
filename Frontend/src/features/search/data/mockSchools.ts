import { School } from '../types';

export const mockSchools: School[] = [
  {
    id: '1',
    name: 'University of Yaoundé I',
    region: 'Centre',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Anglophone', 'Francophone'],
    degreeLevel: ['Bachelor', 'Master', 'PhD'],
    programs: ['Computer Science', 'Medicine', 'Law', 'Economics'],
    feeRange: '150,000 - 500,000 XAF',
    rating: 4.5,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    location: {
      lat: 3.8480,
      lng: 11.5021,
      address: 'Yaoundé, Cameroon'
    },
    description: 'Premier university in Cameroon offering diverse programs.'
  },
  {
    id: '2',
    name: 'University of Buea',
    region: 'Southwest',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Anglophone'],
    degreeLevel: ['Bachelor', 'Master'],
    programs: ['Engineering', 'Agriculture', 'Business'],
    feeRange: '100,000 - 350,000 XAF',
    rating: 4.3,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3a?w=800',
    location: {
      lat: 4.1534,
      lng: 9.2422,
      address: 'Buea, Cameroon'
    },
    description: 'Leading university in the Southwest region.'
  },
  {
    id: '3',
    name: 'American Institute of Cameroon',
    region: 'Littoral',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Anglophone', 'American'],
    degreeLevel: ['Bachelor', 'Associate'],
    programs: ['Business Administration', 'Computer Science', 'Nursing'],
    feeRange: '200,000 - 600,000 XAF',
    rating: 4.7,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c87f?w=800',
    location: {
      lat: 4.0511,
      lng: 9.7679,
      address: 'Douala, Cameroon'
    },
    description: 'American-style education in Cameroon.'
  },
  {
    id: '4',
    name: 'University of Douala',
    region: 'Littoral',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Francophone'],
    degreeLevel: ['Bachelor', 'Master', 'PhD'],
    programs: ['Sciences', 'Letters', 'Economics', 'Law'],
    feeRange: '120,000 - 400,000 XAF',
    rating: 4.2,
    topRated: false,
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
    location: {
      lat: 4.0511,
      lng: 9.7679,
      address: 'Douala, Cameroon'
    },
    description: 'Major public university in the economic capital.'
  },
  {
    id: '5',
    name: 'Catholic University of Central Africa',
    region: 'Centre',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Francophone', 'Catholic'],
    degreeLevel: ['Bachelor', 'Master', 'PhD'],
    programs: ['Theology', 'Philosophy', 'Law', 'Economics'],
    feeRange: '180,000 - 550,000 XAF',
    rating: 4.6,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    location: {
      lat: 3.8480,
      lng: 11.5021,
      address: 'Yaoundé, Cameroon'
    },
    description: 'Prestigious Catholic university with strong academic tradition.'
  },
  {
    id: '6',
    name: 'University of Dschang',
    region: 'West',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Francophone'],
    degreeLevel: ['Bachelor', 'Master'],
    programs: ['Agriculture', 'Forestry', 'Veterinary Medicine'],
    feeRange: '100,000 - 300,000 XAF',
    rating: 4.1,
    topRated: false,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    location: {
      lat: 5.4467,
      lng: 10.0539,
      address: 'Dschang, Cameroon'
    },
    description: 'Specialized in agricultural and environmental sciences.'
  },
  {
    id: '7',
    name: 'International University of Bamenda',
    region: 'Northwest',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Anglophone'],
    degreeLevel: ['Bachelor', 'Master'],
    programs: ['Business', 'IT', 'Law', 'Education'],
    feeRange: '130,000 - 380,000 XAF',
    rating: 4.0,
    topRated: false,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800',
    location: {
      lat: 5.9631,
      lng: 10.1591,
      address: 'Bamenda, Cameroon'
    },
    description: 'Growing university in the Northwest region.'
  },
  {
    id: '8',
    name: 'University of Maroua',
    region: 'Far North',
    category: 'University',
    offersHighSchool: false,
    curriculum: ['Francophone'],
    degreeLevel: ['Bachelor', 'Master'],
    programs: ['Sciences', 'Letters', 'Economics'],
    feeRange: '80,000 - 250,000 XAF',
    rating: 3.9,
    topRated: false,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    location: {
      lat: 10.5916,
      lng: 14.3159,
      address: 'Maroua, Cameroon'
    },
    description: 'University serving the Far North region.'
  },
  {
    id: '9',
    name: 'Greenfield Academy',
    region: 'Centre',
    category: 'PrimaryNursery',
    offersHighSchool: false,
    curriculum: ['Anglophone', 'Francophone'],
    degreeLevel: ['Primary'],
    programs: ['Mathematics', 'Science', 'English', 'French', 'Art'],
    feeRange: '50,000 - 150,000 XAF',
    rating: 4.8,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    location: {
      lat: 3.8480,
      lng: 11.5021,
      address: 'Yaoundé, Cameroon'
    },
    description: 'Premier primary school with excellent academic record.'
  },
  {
    id: '10',
    name: 'Sunshine Nursery School',
    region: 'Littoral',
    category: 'PrimaryNursery',
    offersHighSchool: false,
    curriculum: ['Anglophone', 'Francophone'],
    degreeLevel: ['Nursery'],
    programs: ['Early Learning', 'Creative Play', 'Basic Numeracy'],
    feeRange: '25,000 - 75,000 XAF',
    rating: 4.9,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
    location: {
      lat: 4.0511,
      lng: 9.7679,
      address: 'Douala, Cameroon'
    },
    description: 'A nurturing environment for early childhood development.'
  },
  {
    id: '11',
    name: "St. Mary's Secondary School",
    region: 'Southwest',
    category: 'Secondary',
    offersHighSchool: false,
    curriculum: ['Anglophone'],
    degreeLevel: ['Secondary'],
    programs: ['Sciences', 'Arts', 'Commercial Studies'],
    feeRange: '80,000 - 200,000 XAF',
    rating: 4.4,
    topRated: false,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c87f?w=800',
    location: {
      lat: 4.1534,
      lng: 9.2422,
      address: 'Buea, Cameroon'
    },
    description: 'Well-established secondary school with strong academic tradition.'
  },
  {
    id: '12',
    name: 'Little Angels Primary School',
    region: 'Northwest',
    category: 'PrimaryNursery',
    offersHighSchool: false,
    curriculum: ['Anglophone'],
    degreeLevel: ['Primary'],
    programs: ['Mathematics', 'English', 'Science', 'Social Studies'],
    feeRange: '40,000 - 120,000 XAF',
    rating: 4.6,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    location: {
      lat: 5.9631,
      lng: 10.1591,
      address: 'Bamenda, Cameroon'
    },
    description: 'Quality primary education focused on foundational skills.'
  },
  {
    id: '13',
    name: 'Lycée Général Leclerc',
    region: 'Centre',
    category: 'Secondary',
    offersHighSchool: true,
    curriculum: ['Francophone'],
    degreeLevel: ['Secondary'],
    programs: ['Sciences', 'Literature', 'Economics'],
    feeRange: '70,000 - 180,000 XAF',
    rating: 4.7,
    topRated: true,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    location: {
      lat: 3.8674,
      lng: 11.5164,
      address: 'Yaoundé, Cameroon'
    },
    description: 'Prestigious secondary school offering both O-Level and A-Level programs.'
  }
];

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
  curriculum: [
    { value: 'Francophone', label: 'Francophone' },
    { value: 'Anglophone', label: 'Anglophone' },
    { value: 'American', label: 'American' },
    { value: 'Catholic', label: 'Catholic' }
  ],
  degreeLevel: [
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Master', label: 'Master' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Associate', label: 'Associate' }
  ],
  feeRange: [
    { value: '0-100000', label: 'Under 100,000 XAF' },
    { value: '100000-300000', label: '100,000 - 300,000 XAF' },
    { value: '300000-500000', label: '300,000 - 500,000 XAF' },
    { value: '500000+', label: 'Above 500,000 XAF' }
  ]
};

export const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' }
];
