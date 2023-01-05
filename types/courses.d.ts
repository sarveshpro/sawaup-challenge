declare namespace Sawaup {
  export interface Skill {
    id: number;
    name: string;
    courses: Course[];
  }

  export interface Course {
    id: number;
    name: string;
    url: string;
    skills: Skill[];
  }
}
