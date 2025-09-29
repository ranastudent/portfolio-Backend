export interface CreateBlogInput {
  title: string;
  description: string;
  content: string; // rich text
  tags?: string[];
  image?: string;
}

export interface UpdateBlogInput {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  image?: string;
}
