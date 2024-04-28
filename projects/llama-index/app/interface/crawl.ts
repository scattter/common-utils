export interface ICrawlOption {
  excludes: (`${string}/`)[];
  includes: (`${string}/`)[]; // leave empty for all pages
  limit: number;
}