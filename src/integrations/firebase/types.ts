// Firebase Type Definitions for Portfolio

export interface Profile {
  id: string;
  userId?: string;
  full_name?: string;
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  resume_url?: string;
  avatar_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  userId?: string;
  title: string;
  description: string;
  long_description?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_featured?: boolean;
  display_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Education {
  id: string;
  userId?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year: number;
  end_year?: number;
  is_current?: boolean;
  grade?: string;
  description?: string;
  display_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Experience {
  id: string;
  userId?: string;
  title: string;
  organization: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  type?: 'work' | 'leadership';
  display_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  id: string;
  userId?: string;
  name: string;
  category: string;
  proficiency?: number;
  icon?: string;
  display_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Achievement {
  id: string;
  userId?: string;
  title: string;
  description: string;
  date: string;
  certificate_url?: string;
  image_url?: string;
  display_order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}
