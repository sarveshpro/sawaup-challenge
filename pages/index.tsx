import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { GetStaticProps } from 'next';
import React from 'react';
import NextHead from '../Components/Head';
import prisma from '../lib/prisma';
import MenuIcon from '@mui/icons-material/Menu';
import Carousel from '../Components/Carousel';

const drawerWidth = 280;

// TODO: Get video thumbnail from youtube url

interface Props {
  courses: Sawaup.Course[];
  skills: Sawaup.Skill[];
}

export default function Home({ courses, skills }: Props) {

  // container ref for drawer
  const containerRef = React.useRef(null);

  // states for mobile drawer, selected skills, filtered courses, favourite courses
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedSkills, setSelectedSkills] = React.useState<number[]>([]);
  const [filteredCourses, setFilteredCourses] = React.useState<Sawaup.Course[]>([]);
  const [favouriteCourseIds, setFavouriteCourseIds] = React.useState<number[]>([]);

  // filter courses based on selected skills
  // each course has a list of skills
  // min 2 skills to be selected
  // max 4 courses to be displayed
  React.useEffect(() => {
    // min 2 skills to be selected
    if (selectedSkills.length > 1) {
      let coursesMatched: { course: Sawaup.Course, skillsMatched: number }[] = [];
      courses.map((course) => {
        // get list of skills for each course
        const courseSkills = course.skills.map((skill) => skill.id);
        // get no of skills that match
        const skillsMatched = courseSkills.filter((skill) => selectedSkills.includes(skill));
        // add course and no of skills matched to array
        coursesMatched.push({ course, skillsMatched: skillsMatched.length });
      });
      // sort courses by no of skills matched
      coursesMatched.sort((a, b) => b.skillsMatched - a.skillsMatched);
      // get top 4 courses
      const topCourses = coursesMatched.map((course) => course.course).slice(0, 4);
      setFilteredCourses(topCourses);
    } else {
      setFilteredCourses([]);
    }
  }, [selectedSkills, courses]);

  // allow max 10 skills to be selected
  const handleSkillClick = (skillId: number) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      if (selectedSkills.length < 10) {
        setSelectedSkills([...selectedSkills, skillId]);
      }
    }
  };

  // check if skill is selected
  const isSkillSelected = (skillId: number) => {
    return selectedSkills.includes(skillId);
  };

  // toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // drawer content
  const drawer = (
    <Box sx={{ mt: 12, ml: 2 }}>
      <Typography variant="h6" gutterBottom component="div">
        Skills
      </Typography>
      <Box>
        {skills.map((skill) => (
          <Button key={skill.id} variant={isSkillSelected(skill.id) ? 'contained' : 'outlined'} sx={{ mb: 1, mr: 1, pt: 1, pb: 1 }} onClick={() => handleSkillClick(skill.id)}>
            <Typography key={skill.id} variant="body2" component="div">
              {skill.name}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box ref={containerRef} sx={{ display: 'flex' }}>
      <NextHead />
      <AppBar position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ margin: 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Sawaup Challenge
            </Typography>
          </Toolbar>
        </Box>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="topnav"
      >
        <Drawer
          container={containerRef.current}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 12, width: { width: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}
      >

        <Typography variant="h4" gutterBottom component="div">
          Courses based on your skills
        </Typography>
        {filteredCourses.length === 0 ? <Typography variant="body1" gutterBottom component="div">Select minimum 2 skills to see customized courses</Typography>
          :
          <Carousel courses={filteredCourses} favouriteCourseIds={favouriteCourseIds} setFavoriteCourseIds={setFavouriteCourseIds} />}
        {/* <Toolbar />
        <Typography variant="h4" gutterBottom component="div">
          Favourite Courses
        </Typography>
        {favouriteCourseIds.length === 0 ? <Typography variant="body1" gutterBottom component="div">Add courses to favourite to see here</Typography> :
          <Carousel courses={courses.filter((course) => favouriteCourseIds.includes(course.id))} favouriteCourseIds={favouriteCourseIds} setFavoriteCourseIds={setFavouriteCourseIds} />} */}
        <Toolbar />
        <Typography variant="h4" gutterBottom component="div">
          Courses Available
        </Typography>
        <Carousel courses={courses} favouriteCourseIds={favouriteCourseIds} setFavoriteCourseIds={setFavouriteCourseIds} />

      </Box>
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get courses and skills from db
  const courses = await prisma.course.findMany(
    {
      include: {
        skills: true,
      },
    }
  );
  const skills = await prisma.skill.findMany();
  return {
    props: { courses, skills },
    revalidate: 10, // In seconds
  };
};