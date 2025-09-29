export interface CreateProjectInput {
  title: string;
  description: string;
  features: string[];
  thumbnail?: string;
  liveLink?: string;
  repoLink?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  features?: string[];
  thumbnail?: string;
  liveLink?: string;
  repoLink?: string;
}
