import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { GetStaticProps } from 'next';
import React from 'react';
import NextHead from '../Components/Head';
import prisma from '../lib/prisma';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;

interface Props {
  courses: {
    id: number;
    name: string;
    url: string;
    skills: {
      id: number;
      name: string;
    }[];
  }[];
  skills: {
    id: number;
    name: string;
  }[];
}

export default function Home({ courses, skills }: Props) {
  console.log('courses', courses)
  const containerRef = React.useRef(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ mt: 12, ml: 2 }}>
      <Typography variant="h6" gutterBottom component="div">
        Skills
      </Typography>
      <Box sx={{ ml: 2 }}>
        {skills.map((skill) => (
          <Typography key={skill.id} variant="body2" gutterBottom component="div">
            {skill.name}
          </Typography>
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
        sx={{ flexGrow: 1, p: 3, mt: 12, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Box sx={{ mt: 12 }}>
          {courses.map((course) => (
            <Box key={course.id} sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                {course.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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
    revalidate: 10,
  };
};